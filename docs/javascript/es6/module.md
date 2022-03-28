# 模块

模块(`Module`)是自动运行在严格模式下并且没有办法退出运行的`JavaScript`代码。

* 模块的代码自动运行在严格模式下
* 模块的顶部，`this`的值是`undefined`

## 导出语法

可以用`export`关键字将任意变量、函数或类声明从模块中导出。除非用`default`关键字，否则不能用`export`导出匿名函数或类

```js
export const color = 'red'

function multiply(factor, faciend){
    return factor * faciend
}

export multiply
```

## 导入语法

模块的导出可以通过`import`关键字在另一个模块中访问。

```js
import {color, multiply} from './example.js'
```

`import`后面的大括号表示从给定模块导入的绑定(binding)。

> 导入绑定的列表看起来和解构对象很像，但它不是

关键字`from`表示从哪个模块导入。由表示模块路径的字符串指定。

* 浏览器使用的路径格式与传给`<script>`元素的相同，必须加上扩展名
* `Node.js`则遵循基于文件系统前缀区分本地文件和包的习惯

从模块中导入的绑定，和常量`const`类似，不能存在同名变量，也无法在`import`语句前使用标识符或改变绑定的值

可以使用`as`关键字将整个模块作为一个单一对象导入。该模块的所有导出都可以作为对象的属性使用。

```js
import * as example from './example.js'

console.log(example.multiply(1, 2)) // 2
```

一个模块不管被`import`了几次，都只执行一次。

`export`和`import`的一个重要限制是**必须在其他语句和函数之外使用**

## 导出和导入时重命名

当导入或者导出变量、函数或者类时，可以用`as`关键字改变名称。

```js
import {color as copiedColor} from './example.js' // 不能用解构赋值语法 import {color: copiedColor} from './example.js'

function sum(a, b){
    return a + b
}

export {
    sum as add
}
```

## 模块的默认值

模块的默认值是指通过`default`关键字指定的单个变量、函数或类。只能为每个模块设置一个默认导出值。

```js
export const name = 'Mike'
export default function (a, b){
    return a + b
}

// 另一个模块
import add, {name} from './add.js'
```

另外还可以通过重命名来导出默认值，上例可以改成：

```js
const name = 'Mike'
function add (a, b){
    return a + b
}
export {
    add as default,
    name
}

// 另一个模块
import {
    default as add,
    name
} from './add.js'
```

## 重新导出一个绑定

```js
export * from './example.js'
export {
    default as add,
    name
} from './add.js'
```

## 加载模块

`ES6`定义了模块语法，但是并没有定义如何加载这些模块。加载机制由一个未定义的内部抽象方法`HostResolveImportedModule`决定，浏览器和`Node.js`可以自己实现。

在`<script>`中将`type`设置为`module`时，支持加载模块。为了保证模块的加载顺序，`<script type="module">`在执行时，自动应用`defer`属性。因此，所以的模块组件在文档被解析完才会执行。

由于每个模块都可以从其他模块导入，因此在加载阶段，该模块加载完之后会识别所有导入语句，然后每个导入语句都出发一次获取过程，并且在所有导入资源都被加载之后，执行当前模块。

以如下代码为例：

```html
<!-- 先执行这个标签 -->
<script type="module" src="module1.js"></script>
<!-- 再执行这个标签 -->
<script type="module">
import {multiply} from './example.js'

const result = multiply(1, 3)
</script>
<!-- 最后执行这个标签 -->
<script type="module" src="module2.js"></script>
```

完整的加载顺序如下：

1. 下载并解析`module1.js`
2. 递归下载并解析`module1.js`中导入的模块
3. 解析内联模块
4. 递归下载并解析内联模块中导入的模块
5. 下载并解析`module2.js`
6. 递归下载并解析`module2.js`中导入的模块

加载完成之后，只有当文档完全被解析之后才会执行以下操作：

1. 递归执行`module1.js`中导入的模块
2. 执行`module1.js`
3. 递归执行内联模块中导入的模块
4. 执行内联模块
5. 递归执行`module2.js`中导入的模块
6. 执行`module2.js`

## 异步模块加载

与通用脚本加载一样，模块也支持`async`属性，设置之后，会以异步方式加载。异步加载的模块不必等待文档解析完成，但是需要模块中所有导入文件都加载完成，才会执行模块。但是无法保证模块的先后执行顺序，而是哪个模块及其依赖模块先加载完就先执行哪个模块。

## 将模块作为`Worker`加载

通过配置`Worker`的第二个参数，可以支持以模块方式加载。

```js
const worker = new Worker('script.js') // 创建的Worker以脚本方式加载

const moduleWorker = new Worker('module.js', {type: 'module'}) // 创建的Worker以模块方式加载
```

以脚本方式加载的`Worker`与以模块方式加载的`Worker`存在以下两点不同：

1. `Worker`脚本只能引用与网页同源的`JavaScript`，而`Worker`模块不会完全受限，可以加载并访问具有适当的跨域资源共享(CORS)头的文件。
2. `Worker`脚本可以使用`self.importScripts()`加载其他脚本，但`Worker`模块不能，而是应该使用`import`来导入。

## 浏览器模块说明符解析

在浏览器中，模块说明符(`module specifier`)只支持以下四种格式：

* 以`/`开头，从根目录开始解析
* 以`./`开头，从当前目录开始解析
* 以`../`开头，从父级目录开始解析
* URL格式，不同源时，需要正确配置跨域(CORS)
  
以下的格式，是无效的，并且会导致错误

```js
import {multiply} from 'example.js'
```

## ES Modules进阶

* [精读《snowpack和vite》-ESM](https://www.yuque.com/xixiaobai/xomql8/ironhk#eSVOy)
* [图说 ES Modules](https://segmentfault.com/a/1190000014318751)