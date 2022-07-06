# Rollup

`Rollup`是一个`JavaScript`模块打包器，与`webpack`相比，更适用于类库的打包，最先支持`Tree Shaking`。

## 整体结构

* `Graph`: 全局唯一的图，包含入口以及各种依赖的相互关系，操作方法，缓存等。是`rollup`的核心
* `PathTracker`: 引用(调用)追踪器
* `PluginDriver`: 插件驱动器，调用插件和提供插件环境上下文等
* `FileEmitter`: 资源操作器
* `GlobalScope`: 全局作用域，相对的还有局部的
* `ModuleLoader`: 模块加载器
* `NodeBase`: `AST`各语法(ArrayExpression、AwaitExpression等)的构造基类