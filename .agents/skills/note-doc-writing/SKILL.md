---
name: note-doc-writing
description: Write and restructure Markdown notes for this Rspress doc site, including page structure, _meta.json nav, lesson series, and Mermaid diagrams. Use when adding or revising docs pages or 写笔记/整理文档. Do not use for app code.
---

# 前端进阶笔记 · 文档写作

本仓库是「前端进阶笔记」：一个 Rspress 文档站，收录从 JavaScript 基础到 Electron、WebRTC、Agent 工程的进阶笔记。本 skill 规定新增、改写、重组笔记页面的做法，目标是让内容可检索、可读，并与现有专栏的骨架和语气一致。

## 先读现有内容，再动笔

1. 读 `docs/_meta.json` 和目标目录下的 `_meta.json`，确认页面在导航中的位置、命名和同级风格。
2. 读同类页面各一篇（例如 `docs/ai/harness/02-tool-calling.md`、`docs/electron/process-model.md`），沿用其章节骨架、术语和详略程度。
3. 搜索目标页面的入站链接（导读页章节地图、相邻章节的上一课/下一课、正文交叉引用），确认改动不会破坏它们。

## 内容地图与事实来源

| 关注点 | 真相来源 |
|---|---|
| 站点配置 | `rspress.config.ts`（`root: docs`、mermaid 插件、`checkDeadLinks: true`） |
| 顶栏导航 | `docs/_meta.json` |
| 侧边栏导航 | 各目录的 `_meta.json` |
| 页面内容 | `docs/**/*.md` |
| 构建产物 | `dist/`，生成物，禁止手改 |

- 页面 URL 等于文件路径去掉 `.md`：`docs/ai/harness/02-tool-calling.md` → `/ai/harness/02-tool-calling`；目录首页用 `/webrtc/`。
- 站内链接一律用绝对路径（`/ai/harness/03-react-and-termination`），不写 `.md`、不写域名、不写相对路径。
- `docs/index.md` 是主页（`pageType: home` 加 hero/features），不套普通内容页模板。
- `README.md` 的目录已滞后于 `docs/`，只作概览，不作为导航或校验依据。

### 导航条目

每个目录的 `_meta.json` 是侧边栏顺序的唯一来源，条目有三种：

```json
[
  { "type": "section-header", "label": "第一部分 · 原理与连接" },
  { "type": "file", "name": "index", "label": "专栏导读" },
  { "type": "dir", "name": "agent", "label": "Agent设计模式" }
]
```

新增页面必须在同一改动里补 `_meta.json`，否则侧边栏不可见；顺序与课程编号一致，`index` 放最前。

## 判断页面类型

先确定这一页的主要职责，再套对应骨架（完整骨架见 [references/page-patterns.md](references/page-patterns.md)）：

| 类型 | 典型文件 | 骨架要点 |
|---|---|---|
| 导读页 | `docs/<专栏>/index.md` | 解决什么问题 → 是什么 → 边界与选型 → 学习路径（Mermaid）→ 章节地图 |
| 系列课程章节 | `docs/ai/harness/01-*.md` | 本课要回答的问题 → 核心原理 → 代码与实现 → 权衡与失效模式 →（四层定位）→ 动手实验 → 常见误区 → 本课小结 → 自测 → 延伸阅读与下一课 |
| 单篇主题笔记 | `docs/network/http.md` | 直接进入主题，按概念递进分节，开头可用一句话定调 |
| 排障手册/清单 | `docs/webrtc/troubleshooting.md` | 症状 → 判定指标 → 排查顺序 → 修复清单 |
| 附录 | `docs/ai/harness/agnes-harness.md` | 速读版，压缩正文，保留关键结论与链接 |

## 写作规则

- **先结论后展开**：每节开头 1 到 3 句给出该节结论，再给依据。
- **进阶定位**：默认读者是有工程经验的开发者。跳过基础语法科普，直接讲机制、取舍、失效模式和实战边界。
- **一页一主题**：页面超过约 400 行，或出现两个互不依赖的大主题时拆分，并同步 `_meta.json` 与入站链接。
- **表格承载对比**：概念对照、方案选型、指标分级优先用表格，而不是长段文字。
- **术语一致**：同一概念全站用一个写法（如「主进程」「渲染进程」），首次出现可附英文。
- **代码可运行或可定位**：示例标注语言；引用仓库内代码时写明文件与行号范围；示意性代码要说明它不能直接运行。
- **自测可折叠**：系列章节的问答用 `<details><summary>参考答案</summary>` 包裹答案。
- **不写空话**：删掉「本文将从以下几个方面介绍」这类过渡；标题用读者会搜索的词。
- **事实核对**：命令、配置、默认值以实际运行结果为准；跑不通或依赖外部条件时，注明验证前提，不要照搬记忆。

## Mermaid

本站已接入 `rspress-plugin-mermaid`（Mermaid v11，默认 ELK 布局）。图示优先用 Mermaid，不使用 ASCII 字符画。

写图前先读 [Mermaid 图布局最佳实践](references/mermaid-图最佳实践.md)。必须遵守的要点：

- 控制宽高比：正文宽度约 700 到 900px 内不缩放即可读，宽高比大于 2 基本就是横向爆宽。
- 减少同层兄弟节点：一对多扇出改成链式（`A --> B --> C`）。
- 用 `subgraph` 分组，组内显式 `direction TB`；跨组连线连 subgraph 本体，不要连组内节点（否则 `direction` 失效）。
- 长 label 用 `<br/>` 换行并精简，每行保留约 3 个信息项。
- 节点文案含中文标点、括号、冒号时用引号包裹（如 `A["渲染进程（Renderer）"]`）。
- 用 `~~~` 隐形边微调位置，不用它承载语义。

## 排版

- 不用 `---`、`***`、`___` 作水平分隔线；用 `##`/`###` 和空行分节（表格分隔行除外）。
- 一页只有一个 H1，标题层级不跳级。
- 列表统一用 `-`；表格必须有表头分隔行。
- 中文与英文、数字之间的空格跟随所在文件的既有习惯，不整篇重排。
- 路径、命令、标识符用行内代码。

## 新增、移动、删除

- **新增**：新建 `docs/<分类>/<kebab-case>.md` → 写内容 → 更新同目录 `_meta.json` → 补入站链接（导读页章节地图、相邻章节的上一课/下一课）→ 若开新的一级分类，补 `docs/_meta.json` 顶栏项，并考虑在 `docs/index.md` 的 features 中加卡片。
- **移动或删除**：同一改动内修好 `_meta.json`、所有入站链接和导读页章节地图，不留 404。
- 不改 `dist/`、`.screenshots/`、`node_modules/`。

## 校验

完成前依次执行：

1. `npm run dev` 打开目标页，确认 Mermaid 渲染、表格与代码块正常。
2. `npm run build`：配置开启了 `checkDeadLinks`，死链会在这里暴露。
3. 确认 `_meta.json` 是合法 JSON，且新页面已在侧边栏出现。
4. 逐条复核新增的事实性声明和代码示例。
5. 自读 `git diff`：只留必要改动，没有无关格式化。

## 反模式

- 页面写好了却没加 `_meta.json`，侧边栏看不到。
- 站内链接带 `.md` 或写成相对路径，构建期报死链。
- 用 `---` 当分隔线，用 ASCII 画流程图。
- 新页复制旧页的大段背景介绍，造成多个事实来源。
- 章节编号、文件名、`_meta.json` label 三处不一致。

## 参考

- [页面骨架与示例](references/page-patterns.md)
- [Mermaid 图布局最佳实践](references/mermaid-图最佳实践.md)：布局手法与渲染验证方法。
