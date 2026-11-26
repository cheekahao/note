# AGENTS.md

「前端进阶笔记」是一个基于 Rspress 的个人技术笔记站，内容以中文撰写，覆盖 JavaScript、框架、工程化、Electron、WebRTC 以及 Agent 工程等方向。定位是**进阶、实战导向**：默认读者有工程经验，内容侧重机制、取舍、失效模式与真实项目边界。

## 仓库结构

```text
docs/                 站点内容根目录（rspress.config.ts 中 root: docs）
  index.md            首页，使用 pageType: home 的 frontmatter
  _meta.json          顶栏导航
  <分类>/
    _meta.json        该分类的侧边栏顺序
    *.md              页面
public/               静态资源（图片等）
theme/                自定义主题
rspress.config.ts     站点配置、Mermaid 插件、checkDeadLinks
deploy.sh             构建并推送到 gh-pages
.agents/skills/       Agent 工作流（跨 IDE 共享）
```

`dist/` 是构建产物，`node_modules/`、`.screenshots/` 是本地缓存，都不要手改。

## 命令

```sh
npm install        # 安装依赖
npm run dev        # 本地开发预览
npm run build      # 构建静态站；checkDeadLinks 会校验站内链接
npm run preview    # 预览构建产物
npm run publish    # 构建并推送到 gh-pages（deploy.sh）
```

## 文档写作

新增或改写任何页面，先读 [.agents/skills/note-doc-writing/SKILL.md](.agents/skills/note-doc-writing/SKILL.md)，按其中的页面类型骨架和校验清单执行。硬性要求：

- 页面唯一内容源是 `docs/`；不要在 `dist/` 里改内容。
- 新增页面必须在同一改动里补同目录 `_meta.json`，否则侧边栏不可见。
- 站内链接用绝对路径且不带 `.md`：`/ai/harness/02-tool-calling`；目录首页用 `/webrtc/`。
- 图示用 Mermaid，不用 ASCII；布局遵守 [mermaid-图最佳实践](.agents/skills/note-doc-writing/references/mermaid-图最佳实践.md)。
- 不用 `---`、`***`、`___` 作水平分隔线，用标题层级和空行分节（frontmatter 边界与表格分隔行除外）。
- 一页一个 H1，标题层级不跳级；列表统一用 `-`。
- 代码块标注语言；引用仓库内代码写清文件与行号；示意性代码要说明不能直接运行。

## 内容分区

| 目录 | 内容 |
|---|---|
| `docs/javascript/` | JS 基础、ES6、TypeScript |
| `docs/advance/` | 算法、数据结构、设计模式、函数式编程、微前端 |
| `docs/network/` | HTTP 与网络基础 |
| `docs/engineering/` | Webpack 等工程化主题 |
| `docs/fe/` | 前端性能、CSS |
| `docs/framework/` | Vue3、React |
| `docs/electron/` | Electron 客户端开发专栏（编号章节） |
| `docs/webrtc/` | WebRTC 与实时互动课堂专栏 |
| `docs/low-code/`、`docs/node/`、`docs/webgl/` | 低代码、Node、WebGL 主题 |
| `docs/cs/`、`docs/architecture/` | 编译原理等 CS 基础、软件架构 |
| `docs/ai/` | Agent 设计模式、Agent Harness 原理、机器学习、MCP、AI 编码 |

顶栏分组为「前端」「计算机科学」「拥抱AI」，定义在 `docs/_meta.json`；新增一级分类时同时更新顶栏和首页 `features`。

## 写作约定

- 中文为主，术语首次出现可附英文，全站保持同一写法。
- 系列专栏用零填充编号文件名（`01-...`、`02-...`），导读页放 `index.md`，`_meta.json` 顺序与编号一致。
- 系列章节保持统一骨架：本课要回答的问题 → 核心原理 → 代码与实现 → 权衡与失效模式 → 动手实验 → 常见误区 → 本课小结 → 自测 → 延伸阅读与下一课；不适用的小节可删。
- 先结论后展开，删掉「本文将从以下几个方面介绍」这类过渡。
- 事实性内容以实际运行结果为准；跑不通或依赖外部条件时注明验证前提。

## 校验

完成前至少执行：

1. `npm run dev` 打开目标页，确认 Mermaid、表格、代码块正常。
2. `npm run build`，确认没有死链和构建错误。
3. 确认 `_meta.json` 是合法 JSON 且新页面已出现在侧边栏。
4. 自读 `git diff`，只保留必要改动。

## 修改本文件

本文件是仓库指令的唯一来源。`CLAUDE.md` 是指向它的符号链接，不要单独维护另一份。
