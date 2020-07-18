# webpack

## 工作原理

### 基本概念 

* `Entry`: 入口，执行构建的输入
* `Module`: 模块，在`Webpack`里一切皆模块，`Webpack`会从`Entry`开始，递归找出所有依赖的模块
* `Chunk`: 代码块，一个`Chunk`由多个模块合成，用于代码合并和分割
* `Loader`: 模块转换器，用于将模块的源内容按照需求转换成新内容
* `Plugin`: 扩展插件，在构建流程中的特定时机会广播对应的事件，插件可以监听这些事件，做出对应的事情

### 流程

`Webpack`的运行流程是一个串行的过程，从启动开始依次是：

1. 初始化参数：从配置文件和`Shell`语句中读取与合并参数，得出最终参数
2. 开始编译：基于最终的参数初始化`Compiler`对象，加载所有配置的插件，通过执行对象的`run`方法开始编译
3. 确定入口：根据配置中的`Entry`找出所有入口文件
4. 编译模块：从入口文件出发，调用所有配置的`Loader`对模块递归的进行编译
5. 完成模块编译：得到每个模块编译后的内容及之间的依赖关系
6. 输出资源：根据入口及模块之前的依赖关系，组装成一个个包含多个模块的`Chunk`，再将每个`Chunk`转换成一个单独的文件加入输出列表，这是修改输出内容的最后机会
7. 输出完成：根据配置的输出路径和文件名，将文件内容写入文件系统中

在以上过程中，`Webpack`会在特定的时间广播特定的事件，插件在监听到特定事件后可以执行对应的逻辑，并且可以调用`Webpack`提供的`API`改变`Webpack`的运行结果。

整体构建流程可以分为以下三大阶段：

* 初始化，启动构建，处理配置参数，加载`Plugin`，实例化`Compiler`
* 编译，从`Entry`开始，针对每个`Module`串行调用对应`Loader`去编译内容，并依据`Module`之间的依赖关系，递归的进行编译处理
* 输出，将编译后的`Module`组合成`Chunk`，然后转换成文件，输出到文件系统

`build`时，只执行上述阶段一次。监听模式下，将不断的执行编译，输出阶段

## 模块Module

在模块化编程中，开发者将程序分解成离散功能块(discrete chunks of functionality)，并称之为模块。

Webpack模块能够以各种方式表达他们的依赖关系，例如：

* `ES6``import`语句
* `CommonJS``require()`语句
* `AMD``define`和`require`语句
* `css/sass/less`文件中的`@import`语句
* 样式(`url(...)`)或`HTML`文件(`<img src=...>`)中的图片链接(image url)


## Loader

以处理`SCSS`文件为例：

```js
module.exports = {
    module: {
        rules: [{
            test: /\.scss/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        minimize: true,
                    }
                },
                'sass-loader',
            ]
        }]
    },
}
```

一个`Loader`的职责是单一的，只负责一种转换。一个源文件需要多次转换，需要配置多个`Loader`。在调用多个`Loader`时，执行顺序是**从后往前**依次执行

### 基本写法

`Loader`就是一个函数，获取处理前的内容，返回处理后的内容

```js
module.exports = function(source){
    // 转换逻辑省略

    return source
}
```

### 可调用的Webpack API

#### 获取`Loader`的`options`

```js
const loaderUtils = require('loader-utils')

module.exports = function(source){
    const options = loaderUtils.getOptions(this)

    // 转换逻辑省略

    return source
}
```

#### 返回其他结果

直接`return`可以返回原内容转换后的内容，返回其他内容需要用到this.callback函数：

```js
this.callback(
    // 当无法转换原内容时，为Webpack返回一个Error
    error: Error | null,
    // 原内容转换后的内容
    content: String | Buffer,
    // 用于通过转换后的内容得出原内容的Source Map，以方便测试
    sourceMap?: SourceMap,
    // 如果本次转换为原内容生产了AST语法树，则可以将这个AST返回，以方便之后需要AST的Loader复用
    abstractSyntaxTree?: AST
)
```

此外，由于`Source Map`生产很耗时，通常在开发环境下才生成。因此可以通过`this.sourceMap`API来配置是否生成`Source Map`。

#### 同步与异步

异步转换流程如下：

```js
module.exports = function(source){
    const callback = this.async()

    // 转换逻辑省略
    someAsyncOperation(source).then( (err, result, sourceMap, ast) => {
        callback(err, result, sourceMap, ast)
    })

    return source
}
```

### 处理二进制数据

对于二进制数据，需要将`exports.raw = ture`:

```js
module.exports = function(source){
    return source
}

// 通过exports.raw属性告诉Webpack该Loader是否需要二进制数据
module.exports.raw = true
```

### 缓存加速

可以通过`this.cacheable()`方法设置是否缓存计算结果，默认是开启的

```js
module.exports = function(source){

    // 关闭缓存
    this.cacheable(false)

    return source
}
```

### 其他Loader API

| `API`     | 简介                                                      |
| ------------ | ------------------------------------------------------- |
| `this.context`     | 当前处理的文件所在目录，以`/src/main.js`为例，为`/src`                    |
| `this.resoure`     | 当前处理的完整请求路径，包括`query string`，例如`/src/main.js?name=1`      |
| `this.resourePath`     | 当前处理文件的路径，例如`/src/main.js`      |
| `this.resoureQuery`     | 当前处理文件的`query string`     |
| `this.target`     | `Webpack`中配置的`Target`     |
| `this.loadModule(request: string, callback: function(err, source, sourceMap, ast))`     | `Loader`在处理一个文件时，需要加入依赖时，用于获取对应文件的处理结果     |
| `this.addDependency(file: string)`     | 为当前处理的文件添加依赖。其依赖文件发生变化时，会重新调用loader处理该文件  |
| `this.addContextDependency(directory: string)`     | 将整个目录加入到正在处理的文件依赖中  |
| `this.clearDependencies()`     | 清除当前处理文件的多有依赖  |
| `this.emitFile(name: string, content: Buffer | string, sourceMap)`     | 清除当前处理文件的多有依赖  |

## Plugin

### Compiler和Compilation

开发`Plugin`最常用的两个对象就是`Compiler`和`Compilation`，他们是`Plugin`和`Webpack`之间的桥梁。

* `Compiler`包含所有配置信息(`options`、`loaders`和`plugins`等)，在`Webpack`启动时被实例化，全局唯一。代表了整个`Webpack`从启动到关闭的生命周期
* `Compilation`包含当前的模块资源、编译生成资源和变化的文件等。在开发模式下，每当有文件变化时，就有一次新的`Compilation`被创建。代表了一次编译过程

### Tapable

`Webpack`通过`Tapable`来组织构建的事件流。`Webpack`中许多对象(包括`Compiler`和`Compilation`)都继承自`Tapable`。

`Tapable`暴露了`tap`, `tapAsync`和`tapPromise`方法。可以使用这些方法，注入自定义的构建步骤，这些步骤将在整个编译过程中不同时机触发。

都自`Tapable`，可以广播和监听事件：

```js
/**
 * eventName 事件名，不要跟现有事件重名
 * params    附带参数
 */
compiler.apply(eventName, params)

// 监听事件
compiler.plugin(eventName, callback)
```

每个插件的`Compiler`和`Compilation`对象都是同一个引用。修改`Compiler`和`Compilation`对象上的属性就会影响后面的插件。有些事件是异步的，插件处理完成时调用回调函数通知`Webpack`，才能进入下一个流程。

```js
compiler.plugin('emit', function handle(compilation, callback) {
    // 处理逻辑省略

    // 调用callback通知Webpack进入下一个流程
    callback()
})
```

### 基本写法

`Plugin`主要通过监听`Webpack`在运行的生命周期中广播的特定事件，在合适的时机通过`Webpack`提供的`API`做出对应的处理，改变输出结果

一个`Plugin`就是一个类，具体写法如下：

```js
class TestPlugin{

    // 在构造函数中可以获取用户对Plugin的配置
    constructor(options){

    }

    // Webpack会调用实例的apply方法，并传入compiler对象
    apply(compiler){
        compiler.plugin('compilation', function handle(compilation) {
            
        })
    }
}

module.exports = TestPlugin

// 配置代码如下：

const TestPlugin = require('./TestPlugin.js')

module.exports = {
    plugins: [
        new TestPlugin(options)
    ]
}
```

`Webpack`启动后，读取配置过程中会初始化插件实例。在初始化`compiler`对象之后，在调用插件的`apply`方法，为实例传入`compiler`对象。插件实例在获取到`compiler`对象后，通过
`compiler.plugin(event: string, callback: function(compilation))`监听`Webpack`广播的事件，通过`compiler`对象去操作`Webpack`



### 常用API

插件可以用来修改输出文件和增加输出文件，甚至提升`Webpack`性能

#### 读取输出资源、代码块、模块及依赖

`emit`事件发生时，代表源文件的转换和组装已经完成，可以读取到最终输出的资源、代码块、模块及其依赖，并修改输出资源的内容

```
```