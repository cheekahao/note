# 构建、打包与分发

## 本章目标

- 理解 Electron 应用的打包产物结构，知道 `app.asar` 里到底装了什么。
- 会在 Electron Forge 与 electron-builder 之间做选型，并完成可发布构建。
- 掌握包体积优化的完整清单：依赖裁剪、资源压缩、按平台拆分。
- 理解代码签名、公证、增量更新的原理与流程。

## 打包到底做了什么

Electron 应用发布时不是「一个 exe」，而是一个包含 Chromium、Node.js、你的代码与资源的完整运行时。

```text
MyApp.app / MyApp/
├── Electron Framework / electron.dll   # Chromium + Node 运行时
├── Resources/
│   ├── app.asar                        # 你的代码与资源
│   └── app.asar.unpacked/              # 需要真实文件路径的内容
├── Info.plist / MyApp.exe.manifest
└── locales/                            # Chromium 语言包
```

打包工具做四件事：

1. 复制 Electron 运行时到产物目录。
2. 把你的应用代码与生产依赖打进 `app.asar`。
3. 生成安装器（dmg/exe/msi/deb 等）。
4. 可选：签名、公证、生成更新元数据。

## Forge 与 electron-builder 选型

| 维度 | Electron Forge | electron-builder |
| --- | --- | --- |
| 维护方 | Electron 官方 | 社区（生态成熟） |
| 开发集成 | 内置 Webpack/Vite 模板、`start`/`package`/`make` | 主要专注打包，开发需自行配置 |
| 配置方式 | `forge.config.ts` + makers | `package.json#build` 或 `electron-builder.yml` |
| 安装器 | Squirrel.Windows、DMG、ZIP、DEB、RPM | NSIS、NSIS Web、Portable、DMG、ZIP、AppImage、Snap |
| 自动更新 | 配合 `update-electron-app` / Squirrel | 内置 `electron-updater`，provider 丰富 |
| 差量更新 | 依赖 Squirrel 机制 | blockmap 增量下载 |
| 适合 | 官方推荐、从零起步、模板化项目 | 复杂分发、多平台、灰度与私有源 |

经验建议：

- 新项目、团队希望「少配置」：Forge + Vite 模板。
- 需要 NSIS 安装器、差分更新、私有更新源、多平台矩阵：electron-builder。
- 两者都能做出合格产物，关键是把签名、更新、体积治理纳入流水线。

## Electron Forge 配置

```ts
// forge.config.ts
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerDeb } from '@electron-forge/maker-deb';
import { VitePlugin } from '@electron-forge/plugin-vite';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'MyApp',
    appBundleId: 'com.example.myapp',
    icon: './resources/icon',
    ignore: [
      /^\/src/,
      /^\/\.git/,
      /^\/release/,
      /^\/docs/,
    ],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({ name: 'my_app' }, ['win32']),
    new MakerDMG({ format: 'ULFO' }, ['darwin']),
    new MakerZIP({}, ['darwin', 'linux']),
    new MakerDeb({}, ['linux']),
  ],
  plugins: [
    new VitePlugin({
      build: [
        { entry: 'src/main.ts', config: 'vite.main.config.ts' },
        { entry: 'src/preload.ts', config: 'vite.preload.config.ts' },
      ],
      renderer: [{ name: 'main_window', config: 'vite.renderer.config.ts' }],
    }),
  ],
};

export default config;
```

常用命令：

```bash
npm start          # 开发
npm run package    # 生成未压缩的应用目录，便于调试
npm run make       # 生成安装器
```

产物在 `out/`：`out/MyApp-darwin-arm64/MyApp.app`、`out/make/...`。

## electron-builder 配置

```yaml
# electron-builder.yml
appId: com.example.myapp
productName: MyApp
copyright: Copyright © 2026 Example

directories:
  output: release
  buildResources: build

files:
  - dist/**/*
  - package.json
  - "!**/*.map"
  - "!**/node_modules/**/{test,__tests__,docs,example,examples}/**"

asar: true
asarUnpack:
  - "**/*.node"
  - resources/native/**

compression: maximum
removePackageScripts: true
npmRebuild: true

mac:
  category: public.app-category.productivity
  target:
    - target: dmg
      arch: [x64, arm64]
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist

win:
  target:
    - target: nsis
      arch: [x64, arm64]
  icon: build/icon.ico

nsis:
  oneClick: false
  perMachine: false
  allowToChangeInstallationDirectory: true
  deleteAppDataOnUninstall: false

publish:
  provider: github
  releaseType: release
```

```bash
npx electron-builder --mac --win --x64 --arm64
```

## asar：是什么，什么时候要解包

`asar` 是把目录打包成单个归档文件的格式，减少文件数量、加快读取、避免路径过长。

```bash
# 查看 asar 内容
npx asar list release/mac/MyApp.app/Contents/Resources/app.asar

# 解包检查
npx asar extract release/mac/MyApp.app/Contents/Resources/app.asar /tmp/app-asar
```

必须 `asarUnpack` 的内容：

| 内容 | 原因 |
| --- | --- |
| `.node` 原生模块 | 需要真实文件路径才能 `dlopen` |
| 需要被外部程序执行的二进制 | 系统 API 不接受 asar 虚拟路径 |
| 部分需要 `fs.realpath` 的资源 | asar 内路径不是真实路径 |
| 某些子进程脚本 | `child_process` 需要真实路径 |

不需要解包的内容：JS、CSS、图片、字体、JSON。解包越多，安装包越大、文件数越多，启动与更新成本越高。

## 包体积优化清单

### 1. 依赖裁剪

```bash
# 检查生产依赖
npm ls --omit=dev --depth=0
```

- 前端依赖能打进 bundle 的，不要留在 `node_modules`。
- 只在构建时使用的包必须放 `devDependencies`。
- electron-builder 的 `files` 白名单只保留运行必需内容。
- 删除 `.map`、测试、示例、文档、TypeScript 源码。

### 2. 资源压缩

- 图片转 WebP/AVIF，按显示尺寸导出，避免 2x/3x 原图直接打包。
- 字体做子集化，只保留用到的字符。
- 删除未使用的语言包：electron-builder 可用 `electronLanguages` 限制。
- 音视频资源按需下载，不要全部塞进安装包。

### 3. 运行时裁剪

- 关闭不需要的 Chromium 特性（谨慎，需回归测试）。
- 精简 `locales`。
- 不需要的 `node_modules` 依赖通过 `files` 排除。

### 4. 体积分析

```bash
# macOS/Linux 查看应用目录体积
du -sh release/mac/MyApp.app
du -sh release/mac/MyApp.app/Contents/Resources/app.asar
du -sh release/mac/MyApp.app/Contents/Frameworks/Electron\ Framework.framework

# Windows 查看安装包
ls -lh release/*.exe
```

建议在 CI 中记录每次构建的：

| 指标 | 目的 |
| --- | --- |
| 安装包体积 | 防止依赖膨胀 |
| `app.asar` 体积 | 定位业务代码增长 |
| `app.asar.unpacked` 体积 | 原生模块与资源增长 |
| 文件数量 | 影响安装与更新速度 |

## 多平台构建

### macOS 架构

| 架构 | 说明 |
| --- | --- |
| `x64` | Intel Mac |
| `arm64` | Apple Silicon |
| `universal` | 同时包含两种架构，体积约翻倍 |

```yaml
mac:
  target:
    - target: dmg
      arch: [universal]
```

`universal` 构建要求所有原生依赖都提供双架构版本，否则会失败。多数团队选择分别发布 x64 与 arm64，安装包更小。

### Windows 架构

```yaml
win:
  target:
    - target: nsis
      arch: [x64, arm64]
```

ARM64 Windows 设备建议单独验证，尤其是原生模块与安装器行为。

### CI 矩阵

```yaml
# .github/workflows/build.yml
name: build

on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        os: [macos-14, windows-2022]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npx electron-builder --publish never
      - uses: actions/upload-artifact@v4
        with:
          name: dist-${{ matrix.os }}
          path: release/*
```

签名密钥放在 CI Secret 中，不要写进仓库。

## 代码签名与公证

### Windows

- 使用 Authenticode 证书对 `.exe` 与安装器签名。
- 证书可以是 PFX 文件，也可以放在硬件令牌/云签名服务中。
- 未签名的应用会触发 SmartScreen 警告，下载转化率明显下降。

```yaml
win:
  certificateFile: build/cert.pfx
  certificatePassword: ${env.WIN_CERT_PASSWORD}
  signingHashAlgorithms: [sha256]
  rfc3161TimeStampServer: http://timestamp.digicert.com
```

### macOS

macOS 要求两层：

1. **代码签名**：使用 Developer ID 证书签名。
2. **公证（Notarization）**：把产物提交给 Apple 扫描，通过后分发。

```yaml
mac:
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist
  notarize: true
```

CI 中提供：

```bash
export APPLE_ID="dev@example.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="ABCDE12345"
```

`entitlements.mac.plist` 示例：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
  </dict>
</plist>
```

`disable-library-validation` 会放宽动态库加载限制，只在确实需要加载未签名原生模块时使用。

## 增量更新与 Squirrel

### Squirrel 机制

Squirrel.Windows / Squirrel.Mac 的基本流程：

1. 应用启动后检查更新源。
2. 下载新版本包到本地缓存。
3. 校验签名与版本。
4. 退出时由 Squirrel 替换应用目录。
5. 下次启动运行新版本。

Electron 内置的 `autoUpdater` 就是基于 Squirrel 的封装，Windows 与 macOS 支持较好，Linux 不支持。

### blockmap 增量下载

electron-builder + electron-updater 会为每个安装包生成 `.blockmap` 文件，记录文件分块哈希。更新时只下载变化的块，再在本地重组。

```text
release/
├── MyApp-1.2.0.exe
├── MyApp-1.2.0.exe.blockmap
├── latest.yml
└── MyApp-1.2.0.dmg
```

增量效果取决于变化内容：JS bundle 变化通常只影响少量块；替换整个资源包则可能接近全量。

### 发布渠道

```yaml
publish:
  provider: generic
  url: https://updates.example.com/myapp/${channel}
  channel: stable
```

常见策略：

- `stable` / `beta` / `internal` 三个渠道。
- 服务端按用户分桶返回不同 `latest.yml`。
- 保留最近 2–3 个版本，支持回滚。

## 常见打包问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 打包后白屏 | `loadFile` 路径基于源码目录 | 用 `app.getAppPath()` 或 `__dirname` 计算 |
| `Cannot find module` | 依赖被 `files` 排除或放在 devDependencies | 检查白名单与依赖分类 |
| 原生模块加载失败 | ABI 不匹配或未解包 | `electron-rebuild` + `asarUnpack` |
| macOS 无法打开 | 未签名/未公证 | 签名 + notarytool |
| Windows SmartScreen 警告 | 未签名或证书信誉不足 | 使用 EV/云签名，积累信誉 |
| 安装后更新失败 | 更新源地址/签名/版本号错误 | 检查 `latest.yml` 与 channel |
| 包体积突然变大 | 新增依赖或资源未压缩 | CI 体积门禁 + 差异分析 |

## 本章小结

- 打包产物 = Electron 运行时 + `app.asar` + 安装器，体积主要来自 Chromium 与业务依赖。
- Forge 适合官方一体化流程，electron-builder 适合复杂分发与差分更新。
- 体积优化从依赖裁剪、资源压缩、`files` 白名单、`asarUnpack` 边界四方面入手。
- 签名与公证是分发的硬门槛，必须纳入 CI。
- 增量更新依赖 Squirrel 或 blockmap，发布流程要支持灰度与回滚。

## 参考资料

- [Electron 教程：分发应用](https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-packaging)
- [Electron Forge 文档](https://www.electronforge.io/)
- [electron-builder 文档](https://www.electron.build/)
- [Electron API：autoUpdater](https://www.electronjs.org/zh/docs/latest/api/auto-updater)
- [Apple：公证流程](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
