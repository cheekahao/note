# 岗位能力对照与面试准备

## 本章目标

- 把 JD 的每条要求映射到可讲述的项目经历与知识点。
- 用 STAR 结构准备启动、内存、崩溃、包体积四类案例。
- 掌握高频面试题的答题框架，避免只背结论。
- 用自检清单找出薄弱环节，制定补齐计划。

## JD 逐条对照

### 职责一：性能体系架构与优化

| JD 要求 | 对应章节 | 自检问题 | 掌握标准 |
| --- | --- | --- | --- |
| 启动速度优化（首屏白屏、冷/热启动） | [启动性能优化](/electron/performance-startup) | 启动链路分几段？每段怎么测？ | 能画出瀑布图并给出预算 |
| 建立启动性能监控看板 | [启动性能优化](/electron/performance-startup) | 看板有哪些字段？如何归因？ | 能设计 P50/P95 与阶段拆解 |
| 内存优化（进程/V8 堆/GPU 缓存） | [内存与 GC 优化](/electron/performance-memory) | 内存由哪些进程组成？ | 能分进程采样与建预算 |
| 解决泄漏与 GC 卡顿 | [内存与 GC 优化](/electron/performance-memory) | 如何证明是泄漏？ | 能用快照对比定位对象 |
| 优化 IPC 效率、减少阻塞 | [IPC 通信体系](/electron/ipc) | 同步 IPC 为什么危险？ | 能设计批量/异步/超时方案 |
| 制定渲染标准、解决掉帧 | [渲染与 IPC 性能](/electron/performance-render) | 16.7ms 怎么分配？ | 能定位长任务与布局抖动 |

### 职责二：代码质量与稳定性

| JD 要求 | 对应章节 | 自检问题 | 掌握标准 |
| --- | --- | --- | --- |
| 崩溃监控（C++ Crash、JS 异常） | [工程化、CI 与稳定性](/electron/engineering) | minidump 怎么符号化？ | 能设计采集-上传-聚合链路 |
| 异步规范、消除死锁 | [工程化、CI 与稳定性](/electron/engineering) | 死锁如何产生？ | 能列出规范并落地检查 |
| CI 静态扫描、性能门禁 | [工程化、CI 与稳定性](/electron/engineering) | 门禁怎么防误报？ | 能设计相对基线门禁 |

### 职责三：构建与包体积

| JD 要求 | 对应章节 | 自检问题 | 掌握标准 |
| --- | --- | --- | --- |
| Asar 解包、依赖裁剪、资源压缩 | [构建、打包与分发](/electron/build) | 什么必须 asarUnpack？ | 能给出体积优化清单 |
| 缩减安装包与增量包 | [构建、打包与分发](/electron/build) | blockmap 原理？ | 能解释差分更新流程 |
| Native Addon 多平台编译 | [原生模块与跨平台编译](/electron/native) | ABI 不匹配怎么排查？ | 能配置 rebuild 与 prebuild |
| Builder/Forge、Squirrel | [构建、打包与分发](/electron/build) | 两者差异？ | 能定制打包与更新脚本 |

### 职责四：工具链与调试

| JD 要求 | 对应章节 | 自检问题 | 掌握标准 |
| --- | --- | --- | --- |
| Profiling 自动化工具链 | [调试与 Profiling 工具链](/electron/debugging) | 如何脚本化采集？ | 能用 CDP/tracing 产出报告 |
| 高 CPU/IO/网络攻坚 | [调试与 Profiling 工具链](/electron/debugging) | 如何分进程定位？ | 能按决策树排查 |

### 任职要求与加分项

| 要求 | 对应章节 | 面试表达要点 |
| --- | --- | --- |
| 5 年客户端、2 年 Electron 核心 | 全专栏 | 强调架构、性能、稳定性，而非「会写页面」 |
| Windows/macOS 进程线程内存 | [进程模型与运行原理](/electron/process-model) | 能对比平台差异与调度模型 |
| Chromium 多进程架构 | [进程模型与运行原理](/electron/process-model) | 能画 Browser/Renderer/GPU/Utility |
| DevTools/F12、Instruments/WPT | [调试与 Profiling 工具链](/electron/debugging) | 能讲一次完整定位过程 |
| JS/TS、数据结构算法 | [工程化、CI 与稳定性](/electron/engineering) | 能写类型安全 IPC、限流、LRU |
| C++/Rust 原生模块 | [原生模块与跨平台编译](/electron/native) | 能讲 Node-API/ABI/构建链路 |
| Builder/Forge、Squirrel | [构建、打包与分发](/electron/build) | 能讲签名、公证、增量更新 |
| 性能目标拆解 | [启动性能优化](/electron/performance-startup) | 能把 <1s/<300MB 拆成预算 |
| 架构级解决顽疾 | [进阶：Chromium、V8 与 WASM](/electron/advanced) | 能讲平台化与门禁 |
| 文档沉淀 | 每章小结 | 能展示规范/组件/SDK 产出 |
| 加分：Chromium/V8 | [进阶：Chromium、V8 与 WASM](/electron/advanced) | 能讲合成层、GC、code cache |
| 加分：开源贡献 | [原生模块与跨平台编译](/electron/native) | 能讲 PR/issue/benchmark |
| 加分：WASM | [进阶：Chromium、V8 与 WASM](/electron/advanced) | 能讲适用边界与线程 |
| 加分：Unity/60fps | [渲染与 IPC 性能](/electron/performance-render) | 能讲帧预算、批处理、对象池 |

## STAR 案例模板

面试中最容易被追问的是「你具体做了什么」。每个案例都要有：背景、目标、动作、结果、复盘。

### 案例一：启动优化

```text
S（背景）：桌面客户端冷启动约 2.4s，用户反馈打开慢，首屏白屏明显。
T（目标）：把 P95 冷启动降到 1.2s 以内，首屏白屏 < 300ms。
A（动作）：
  1. 建立埋点：主进程 module-loaded / app-ready / window-created、
     渲染进程 FCP / LCP / TTI，按版本与平台上报。
  2. 画瀑布图，发现主进程同步读取配置与全量加载 SDK 占 600ms，
     渲染层首屏 bundle 过大占 700ms。
  3. 主进程：配置改异步、SDK 延迟加载、启用编译缓存。
  4. 渲染层：路由懒加载、首屏骨架、移除首屏未使用组件。
  5. 窗口：show:false + ready-to-show + 背景色。
R（结果）：P95 从 2.4s 降到 1.1s，白屏从 800ms 降到 220ms，
  并通过 CI 启动门禁防止反弹。
复盘：首次启动与热启动差异大，后续补齐首次安装场景的基线。
```

讲述要点：

- 一定要有「怎么测」和「怎么归因」，否则会被认为只是执行了优化清单。
- 结果用分位数，不用平均值。
- 说明如何防止回归。

### 案例二：内存治理

```text
S：应用长时间运行后内存从 220MB 涨到 600MB，切换页面越来越卡。
T：定位泄漏并建立内存预算与门禁。
A：
  1. 用 app.getAppMetrics 分进程采样，确认增长来自渲染进程。
  2. DevTools Memory 抓取操作前后的堆快照，对比发现
     Detached HTMLElement 与 EventListener 持续增长。
  3. 定位到某页面组件卸载时未移除 window 监听与定时器。
  4. 统一封装 usePageLifecycle，强制清理监听、定时器、IPC 订阅。
  5. 对缓存加 LRU 上限，图片按显示尺寸加载。
  6. CI 增加 20 次页面切换的内存增量门禁。
R：常驻内存稳定在 280MB 左右，长时运行不再持续上涨。
```

追问准备：

- 如何区分缓存与泄漏？
- 为什么用堆快照而不是只看进程内存？
- GPU 内存怎么观察？

### 案例三：崩溃率治理

```text
S：某版本崩溃率上升到 0.8%，主要集中在 Windows 部分机型。
T：把崩溃率降到 0.1% 以下，并建立可持续的监控体系。
A：
  1. 接入 crashReporter，收集 minidump、版本、平台、操作路径。
  2. 建立符号归档：原生模块 PDB/dSYM + Electron symbols。
  3. 聚合堆栈，发现集中在某个原生模块的 GPU 相关调用。
  4. 与模块维护方定位为驱动兼容问题，增加降级与重试。
  5. 补充 render-process-gone 的恢复策略与重试上限。
  6. 发布灰度，崩溃率超阈值自动停止放量。
R：崩溃率降到 0.08%，并有版本级看板与告警。
```

### 案例四：包体积与增量更新

```text
S：安装包 210MB，增量更新经常接近全量，用户升级成本高。
T：安装包降到 150MB 以内，增量包平均 < 15MB。
A：
  1. 分析 app.asar 与 unpacked 目录，发现重复图片、未使用字体、
     测试依赖被打入生产包。
  2. files 白名单 + 依赖裁剪 + 图片压缩 + 字体子集化。
  3. 原生模块只保留目标架构，移除多余 locales。
  4. 接入 blockmap 差量更新，调整资源打包粒度。
  5. CI 增加体积门禁与差异报告。
R：安装包 148MB，增量包平均 9MB，升级成功率提升。
```

## 高频面试题与答题框架

### 1. Electron 的进程模型是怎样的？

答题结构：

1. 主进程：Node 环境、窗口与生命周期、系统能力。
2. 渲染进程：Chromium、页面、沙箱。
3. GPU 进程：光栅化与合成。
4. Utility 进程：网络服务、Node 子任务。
5. 与 Chrome 的对应关系。
6. 性能含义：主进程单点阻塞、渲染进程隔离、进程间序列化成本。

### 2. 为什么不能开 `nodeIntegration`？

- XSS 会升级为任意代码执行。
- 渲染进程可能加载远程/第三方内容，信任边界不可控。
- 正确做法：`contextIsolation` + `sandbox` + preload 白名单 + IPC 校验。

### 3. IPC 怎么设计才安全又高效？

安全：

- 只暴露具名方法，不暴露 `ipcRenderer`。
- 参数校验、来源校验、路径限制。
- 不加载不可信内容。

高效：

- 请求响应优先 `invoke/handle`。
- 高频事件按帧合并。
- 大对象传 ID/路径，二进制用 `MessagePort`。
- 禁止 `sendSync`，主进程不做重活。

### 4. 启动优化怎么做？

按「测量 → 拆解 → 优化 → 门禁」回答：

1. 定义冷/热启动、首屏、TTI。
2. 主进程、窗口、渲染进程三段埋点。
3. 用 tracing 找最大耗时段。
4. 主进程延迟加载、异步 IO、编译缓存。
5. 渲染层代码分割、骨架屏、资源预加载。
6. 窗口 `ready-to-show`、背景色、复用。
7. CI 门禁与看板。

### 5. 内存泄漏怎么排查？

1. 分进程采样，确认增长源。
2. GC 后仍上涨才判定泄漏。
3. 堆快照对比，按 Delta 排序。
4. 回溯引用链，定位持有者。
5. 常见模式：监听、定时器、全局缓存、Detached DOM、MessagePort。
6. 修复后用同样场景回归并加门禁。

### 6. 主进程阻塞会怎样？如何避免？

- 所有窗口的 IPC、菜单、窗口操作都会被阻塞。
- 渲染进程等待主进程返回，表现为界面卡顿。
- 避免：异步 IO、重任务移到 utilityProcess、限制并发、超时、禁止同步 IPC。

### 7. 崩溃监控怎么落地？

- `crashReporter` 采集 minidump。
- 符号表归档与符号化。
- 聚合、去重、按版本/平台统计。
- 渲染进程 `render-process-gone` 单独上报。
- JS 异常通过 `uncaughtException` / `unhandledRejection` / `window.onerror`。
- 灰度与自动止损。

### 8. 包体积怎么优化？

- 分析 asar 与 unpacked 目录。
- 依赖裁剪、files 白名单。
- 图片/字体/语言包精简。
- 原生模块按架构拆分。
- 压缩与去 sourcemap。
- 增量更新用 blockmap。

### 9. asar 是什么？什么需要解包？

- 单文件归档，减少文件数、加快读取。
- 需要真实路径的内容要解包：`.node`、外部可执行文件、部分资源。
- 解包过多会增加体积与安装成本。

### 10. Native Addon 的 ABI 问题怎么解决？

- Node-API 提供稳定 ABI，但 Electron 场景仍建议 rebuild。
- `@electron/rebuild` / `electron-builder install-app-deps`。
- 预编译二进制要匹配 Electron ABI 与架构。
- 排查 `NODE_MODULE_VERSION`、`dlopen`、DLL 缺失。

### 11. 如何制定渲染性能标准？

- 指标：FPS、长任务、INP、LCP、掉帧率。
- 目标：滚动 ≥ 55fps、关键路径无 > 100ms 长任务。
- 场景：长列表、大图、动画、多窗口。
- 落地：组件规范、评审清单、CI 场景、发布验收。

### 12. 你如何从架构层面解决性能问题？

- 预算：启动、内存、渲染、体积。
- 平台化：虚拟列表、图片缓存、IPC SDK、监控 SDK。
- 门禁：CI 阻断劣化。
- 观测：看板、告警、复盘。
- 组织：规范、评审、培训。

## 场景/手写题

### 设计一个类型安全的 IPC

要点：

- 共享 `IpcApi` 映射。
- 主进程统一 `handle` 包装。
- preload 暴露具名方法。
- 错误统一转换。
- 参数校验与超时。

参考实现见 [IPC 通信体系](/electron/ipc)。

### 设计启动监控

要点：

- 主进程 `performance.now()` 打点。
- 渲染进程 Navigation/Paint/LCP/LongTask。
- 首屏后延迟上报，避免影响启动。
- 按版本/平台/冷热分组。
- P50/P95 与阶段瀑布。

### 排查白屏

1. DevTools Console 是否有报错。
2. Network 是否资源 404/CSP 拦截。
3. `loadFile`/`loadURL` 路径是否正确。
4. 渲染入口是否构建成功。
5. preload 是否抛错导致页面脚本未执行。
6. GPU/驱动问题（尝试诊断参数，不作为生产方案）。
7. 打包产物中 `app.asar` 是否包含资源。

### 写一个限流/并发控制

```ts
export function createLimiter(max: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  const next = (): void => {
    if (active >= max) return;
    const run = queue.shift();
    if (run) {
      active += 1;
      run();
    }
  };

  return function limit<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      queue.push(() => {
        task()
          .then(resolve, reject)
          .finally(() => {
            active -= 1;
            next();
          });
      });
      next();
    });
  };
}
```

## 反问清单

面试最后可以问：

1. 团队目前最关注的性能指标是什么？如何度量？
2. 客户端的发布节奏与灰度策略是怎样的？
3. 崩溃率与稳定性目前的基线是多少？
4. 是否有自建 Chromium/Electron 构建？维护成本如何？
5. 性能治理是专人负责还是各业务线自担？
6. 团队对技术文档与规范沉淀的要求是什么？

## 30 天准备计划

| 阶段 | 内容 | 产出 |
| --- | --- | --- |
| 第 1 周 | 通读 01–09，跑通最小工程 | 一个可打包的 Demo |
| 第 2 周 | 启动/内存/渲染三章 + 工具链 | 一份性能报告 |
| 第 3 周 | 整理 4 个 STAR 案例 | 每例 1 页讲述稿 |
| 第 4 周 | 模拟面试 + 补弱项 | 自检清单全部通过 |

## 自检清单

- [ ] 能画出 Electron 进程拓扑并解释每个进程职责。
- [ ] 能解释四项安全配置与它们防住的攻击。
- [ ] 能设计类型安全 IPC 并说明性能陷阱。
- [ ] 能画出启动链路并给出预算表。
- [ ] 能用堆快照定位一个泄漏对象。
- [ ] 能解释 16.7ms 帧预算与常见掉帧原因。
- [ ] 能说明 asar、签名、公证、增量更新的流程。
- [ ] 能排查 Node-API ABI 不匹配。
- [ ] 能设计崩溃监控与符号化流程。
- [ ] 有 4 个可量化结果的 STAR 案例。
- [ ] 能说清楚「架构级治理」而不只是「修修补补」。

## 本章小结

- 面试的核心不是背 API，而是证明你能测量、归因、优化、防回归。
- 每个案例都要有基线、动作、结果、复盘，数字用分位数。
- JD 的每条要求都能在本专栏找到对应章节，按图索骥补齐即可。
- 反问与沟通同样重要，它体现你对客户端体系的整体理解。

## 参考资料

- [Electron 官方文档](https://www.electronjs.org/zh/docs/latest/)
- [Electron 性能最佳实践](https://www.electronjs.org/zh/docs/latest/tutorial/performance)
- [Electron 安全最佳实践](https://www.electronjs.org/zh/docs/latest/tutorial/security)
- [Chromium 多进程架构](https://www.chromium.org/developers/design-documents/multi-process-architecture/)
- [web.dev：Web Vitals](https://web.dev/articles/vitals)
