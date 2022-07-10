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

## 打包流程

`Rollup`的打包流程主要可以分为输入(input)、构建(build)和输出(output)三个阶段。

### 输入(input)阶段

输入(input)阶段，主要是指在命令行运行`rollup`后，解析命令行输入参数，到调用`Rollup.rollup(inputOptions)`的过程。

其整个流程比较简单，主要代码都`cli`目录下。

```mermaid
flowchart LR
    rollup -c
```

以下三个大的阶段：

* 输入(input)阶段，运行`cli`命令后，解析命令行参数，调用`run(command)`
* 构建(build)阶段，在`cli/build.js`中调用`Rollup.rollup(inputOptions)`得到一个`bundle`
* 输出(output)阶段，调用`bundle.generate(output)`，将返回的`outputs`


* 调用