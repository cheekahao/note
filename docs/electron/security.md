# 安全模型与加固

## 本章目标

- 理解 Electron 与浏览器安全模型的差异：为什么桌面端风险更高。
- 掌握必开的四项配置与它们各自防住什么攻击。
- 建立统一的 WebContents 安全策略，而不是在每个窗口里复制粘贴。
- 会用 Electron Fuses 收紧运行时能力，降低被利用面。

## 为什么 Electron 安全更难

浏览器里的网页运行在严格沙箱中，默认不能读写文件、不能执行本地程序。Electron 应用则拥有这些能力，只是被进程边界隔开。一旦隔离配置被打开（例如 `nodeIntegration: true`），页面里的一个 XSS 就可能升级为：

- 读取任意本地文件（SSH 密钥、浏览器 Cookie）。
- 执行系统命令。
- 窃取用户会话、上传本地数据。
- 持久化驻留。

Electron 官方安全文档的核心观点是：**不要加载不可信内容；如果必须加载，确保它没有 Node 能力，并且被沙箱与 CSP 约束。**

## 安全基线：四项必开配置

```ts
// src/main/windows/secure-window.ts
import { BrowserWindow } from 'electron';
import path from 'node:path';

export function createSecureWindow(): BrowserWindow {
  return new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
    },
  });
}
```

| 配置 | 默认值 | 作用 | 关闭/开启的风险 |
| --- | --- | --- | --- |
| `contextIsolation` | `true` | 隔离页面与 preload 的 JS 上下文 | 关闭后页面可篡改 preload 暴露的对象 |
| `sandbox` | `true` | 渲染进程运行在 OS 沙箱中 | 关闭后渲染进程拥有更多系统能力 |
| `nodeIntegration` | `false` | 页面是否可直接使用 Node | 开启后 XSS 等于任意代码执行 |
| `webSecurity` | `true` | 同源策略等浏览器安全策略 | 关闭后跨域读取、混合内容风险 |

不要为了「方便」关闭这些开关。确实需要 Node 能力时，把逻辑放进主进程或 `utilityProcess`，通过 IPC 暴露最小接口。

## 统一加固入口

所有窗口都应该经过同一套策略。`app.on('web-contents-created')` 是集中处理的最佳位置。

```ts
// src/main/security/harden.ts
import { app, shell, WebContents } from 'electron';

const TRUSTED_ORIGINS = new Set([
  'https://app.example.com',
  'file://',
]);

function isTrusted(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'file:') return true;
    return TRUSTED_ORIGINS.has(parsed.origin);
  } catch {
    return false;
  }
}

function hardenWebContents(contents: WebContents): void {
  // 1. 禁止导航到不可信站点
  contents.on('will-navigate', (event, url) => {
    if (!isTrusted(url)) {
      event.preventDefault();
    }
  });

  // 2. 禁止页面自行开新窗口；外链交给系统浏览器
  contents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // 3. 禁止挂载未配置的 webview
  contents.on('will-attach-webview', (event, webPreferences) => {
    delete webPreferences.preload;
    webPreferences.nodeIntegration = false;
    webPreferences.contextIsolation = true;
    event.preventDefault();
  });

  // 4. 禁止页面使用危险协议
  contents.on('will-frame-navigate', (details) => {
    if (!isTrusted(details.url)) details.preventDefault();
  });
}

app.on('web-contents-created', (_event, contents) => {
  hardenWebContents(contents);
});
```

`will-frame-navigate` 覆盖 iframe 导航，`will-navigate` 主要覆盖主框架。两者结合更稳妥。

## 权限请求处理

摄像头、麦克风、通知、剪贴板、地理位置等权限，默认应拒绝，只对可信来源按需放行。

```ts
import { session } from 'electron';

const ALLOWED_PERMISSIONS = new Set(['notifications', 'clipboard-read']);

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback, details) => {
      const url = details.requestingUrl;
      const trusted = url.startsWith('https://app.example.com/');
      callback(trusted && ALLOWED_PERMISSIONS.has(permission));
    },
  );

  session.defaultSession.setPermissionCheckHandler(
    (_webContents, permission, requestingOrigin) => {
      return (
        requestingOrigin === 'https://app.example.com' &&
        ALLOWED_PERMISSIONS.has(permission)
      );
    },
  );
});
```

`setPermissionRequestHandler` 处理运行时请求，`setPermissionCheckHandler` 处理同步检查（例如 `navigator.permissions.query`）。两者要一致，否则会出现「检查通过但请求被拒」的诡异行为。

## 内容安全策略（CSP）

CSP 是防 XSS 的最后一道防线。推荐通过响应头设置，而不是只在 HTML 里写 meta。

```ts
import { session } from 'electron';

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "connect-src 'self' https://api.example.com",
            "object-src 'none'",
            "base-uri 'none'",
            "frame-ancestors 'none'",
          ].join('; '),
        ],
      },
    });
  });
});
```

本地页面也可以在 `index.html` 中声明：

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'"
/>
```

注意：

- 开发模式下 Vite/Webpack 的 HMR 需要 `'unsafe-eval'` 或额外连接源，生产环境必须收紧。
- 不要把 `script-src` 配成 `*` 或 `'unsafe-inline'`，那等于没有 CSP。
- 远程内容与本地内容应使用不同的 `session` 与 CSP。

## 外部链接与文件

### `shell.openExternal` 白名单

`shell.openExternal` 会把 URL 交给系统处理。如果 URL 是 `file://`、`smb://` 或自定义协议，可能触发本地程序执行。

```ts
import { shell } from 'electron';

const EXTERNAL_PROTOCOLS = new Set(['https:', 'mailto:']);

export async function openExternalSafely(url: string): Promise<void> {
  const parsed = new URL(url);
  if (!EXTERNAL_PROTOCOLS.has(parsed.protocol)) {
    throw new Error(`blocked protocol: ${parsed.protocol}`);
  }
  await shell.openExternal(url);
}
```

### 拖拽文件的真实路径

渲染进程拿到的 `File` 对象不再直接暴露本地路径。需要路径时使用 `webUtils.getPathForFile`：

```ts
// preload.ts
import { contextBridge, webUtils } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
});
```

拿到路径后仍需在主进程按工作目录校验，不能直接信任。

## 远程内容隔离

如果应用必须加载第三方页面（登录页、帮助中心、插件页面），不要让它和主界面共享 `session`。

```ts
import { BrowserWindow, session } from 'electron';

const remoteSession = session.fromPartition('persist:remote', { cache: true });

const win = new BrowserWindow({
  webPreferences: {
    session: remoteSession,
    contextIsolation: true,
    sandbox: true,
    nodeIntegration: false,
    preload: undefined,
  },
});

win.loadURL('https://third-party.example.com/login');
```

原则：

1. 远程内容不挂 preload。
2. 使用独立分区，隔离 Cookie 与缓存。
3. 远程内容不能直接调用主进程 IPC；需要通信时由主进程做中转与校验。
4. 登录完成后只回传必要的结果，不回传整个页面上下文。

## Electron Fuses

Fuses 是打包时写入二进制的开关，用来关闭一些「运行时可选但生产不需要」的能力。即使用户拿到安装包，也无法通过命令行重新打开。

```bash
npm install --save-dev @electron/fuses
```

```ts
// forge.config.ts 或打包脚本中
import { flipFuses, FuseVersion, FuseV1Options } from '@electron/fuses';

await flipFuses(electronPath, {
  version: FuseVersion.V1,
  [FuseV1Options.RunAsNode]: false,
  [FuseV1Options.EnableCookieEncryption]: true,
  [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
  [FuseV1Options.EnableNodeCliInspectArguments]: false,
  [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
  [FuseV1Options.OnlyLoadAppFromAsar]: true,
});
```

| Fuse | 建议 | 作用 |
| --- | --- | --- |
| `RunAsNode` | `false` | 禁止把 Electron 当 Node 执行任意脚本 |
| `EnableNodeOptionsEnvironmentVariable` | `false` | 禁止通过 `NODE_OPTIONS` 注入参数 |
| `EnableNodeCliInspectArguments` | `false` | 禁止用 `--inspect` 附加调试器 |
| `EnableCookieEncryption` | `true` | 加密 Cookie 存储 |
| `EnableEmbeddedAsarIntegrityValidation` | `true` | 校验 asar 完整性 |
| `OnlyLoadAppFromAsar` | `true` | 只从 asar 加载应用代码 |

开启 `OnlyLoadAppFromAsar` 后，`asar: false` 或解包目录的加载方式会失效，需要确认构建配置一致。开发阶段通常不启用 Fuses，生产构建时再打开。

## WebView 与自定义协议

`webviewTag` 默认关闭，建议保持关闭。它等于在页面里开了一个新的渲染上下文，配置不当会绕过主窗口的安全策略。

如果必须使用自定义协议：

```ts
import { protocol, net } from 'electron';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

protocol.handle('app', (request) => {
  const url = new URL(request.url);
  const filePath = path.join(__dirname, '../renderer', url.pathname);
  return net.fetch(pathToFileURL(filePath).toString());
});
```

必须做路径归一化与白名单校验，防止 `app://../../etc/passwd` 这类穿越。

## 依赖与版本安全

Electron 的安全依赖三部分：

1. **Electron 本身**：Chromium 漏洞由 Electron 版本更新修复，关注 [Electron 发布时间线](https://www.electronjs.org/zh/docs/latest/tutorial/electron-timelines)，尽量使用受支持的稳定版本。
2. **npm 依赖**：使用 `npm audit`/`pnpm audit`，锁定版本，审查 postinstall 脚本。
3. **原生模块与二进制**：只从可信源下载，校验签名与哈希。

建议在 CI 中加入：

```bash
npm audit --omit=dev
npx @electron/fuses read --app ./release/mac/MyApp.app
```

## 安全检查清单

| 检查项 | 通过标准 |
| --- | --- |
| 渲染进程 Node 能力 | `nodeIntegration: false` |
| 上下文隔离 | `contextIsolation: true` |
| 沙箱 | `sandbox: true`，不要为 preload 关闭 |
| 导航管控 | `will-navigate`、`will-frame-navigate` 均拦截 |
| 新窗口 | `setWindowOpenHandler` 返回 `deny` |
| 权限 | 默认拒绝，白名单放行 |
| CSP | 生产环境无 `unsafe-eval`、无通配符 |
| 外链 | 协议白名单，禁止 `file:`/自定义协议 |
| 远程内容 | 独立 session、无 preload、无 IPC |
| webview | `webviewTag: false` |
| Fuses | 生产包关闭调试与 RunAsNode |
| 依赖 | 无高危漏洞，Electron 版本受支持 |

## 本章小结

- Electron 的安全风险来自「Web 内容 + 系统能力」的组合，隔离配置是第一道防线。
- 四项必开配置：`contextIsolation`、`sandbox`、`nodeIntegration: false`、`webSecurity`。
- 用 `web-contents-created` 统一加固所有页面，避免遗漏。
- CSP、权限处理、导航拦截、外链白名单要一起使用。
- Fuses 把生产环境不需要的能力从二进制层面关掉，是最后一道保险。

## 参考资料

- [Electron 最佳实践：安全](https://www.electronjs.org/zh/docs/latest/tutorial/security)
- [Electron 教程：上下文隔离](https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation)
- [Electron 教程：沙箱](https://www.electronjs.org/zh/docs/latest/tutorial/sandbox)
- [Electron Fuses](https://www.electronjs.org/zh/docs/latest/tutorial/fuses)
- [Electron API：session](https://www.electronjs.org/zh/docs/latest/api/session)
