# ES6

## 块级作用域

### 全局块作用域绑定

`var`被用于全局作用域时，会创建一个全局变量作为全局对象(浏览器`window`对象)的属性。

`let`或`const`, 会在全局作用域下创建一个新的绑定，但不会添加到全局对象的属性。

## 扩展对象功能

### `Object.is`

`JavaScript`中比较两个值，全等运算符(`===`)要比相等运算符(`==`)更可信。但是`===`也不完全准确，`+0`和`-0`在`JavaScript`引擎中，被表示为两个完全不同的实体，但是`===`返回的是`true`，而`NaN === NaN`返回`false`。

`Object.is`用来弥补全等运算符的不准确运算：

```
+0 == -0             // true
+0 === -0            // true
Object.is(+0, -0)    // false

NaN == NaN           // false
NaN === NaN          // false
Object.is(NaN, NaN)    // true
```

### 自有属性枚举顺序

`Object.getOwnPropertyNames`的枚举顺序：

1. 所有数字键按升序排序
2. 所有字符串建按照被加入对象的顺序排序
3. 所有symbol建按照被加入对象的顺序排序

> `for-in`循环每个厂商的实现方式各不相同、`Object.keys`、`JSON.stringify`与`for-in`循环有相同的枚举顺序

### 对象原型

`ES5`中，对象原型实例化之后是保持不变的，无论是通过构造函数还是`Object.create()`。`ES5`有`Object.getPrototypeOf()`方法获取对象原型，但无法在对象实例化之后修改。

在`ES6`中添加了`Object.setPrototypeOf()`，用以改变任意指定对象的原型。有两个形参`Object.setPrototypeOf(target, newProto)`：

* 被改变原型的对象
* 替代原型的对象

### `super`关键字

`super`总是指向对象的原型。

`ES6`正式将方法定义成一个函数，内部的`[[HomeObject]]`属性指向这个从属对象。这一点，对于`super`而言非常重要，都是通过`[[HomeObject]]`属性来找到其对应的原型。

## 函数

### 箭头函数

与传统的`JavaScript`函数的不同

* 没有this、super、arguments和new.target绑定。这些值由外围最近一层的非箭头函数决定
* 不能通过new关键字调用，箭头函数没有[[Construct]]方法
* 没有prototype原型
* 不可以改变this绑定
* 不支持arguments对象
* 不支持重复的命名参数

## 迭代器和生成器

### 迭代器(`Iterator`)和生成器(`Generator`)

**迭代器**是一种特殊的对象，具有为迭代过程设计的专有接口，都一个`next`方法，每次调用都返回一个结果对象。结果对象有两个属性：一个是`value`，表示下一个将要返回的值；另一个是布尔类型的done，当没有更多数据返回时返回`true`。迭代器会保存一个内部指针，用来指向当前集合中值的位置。

**生成器**是一种返回迭代器的函数，通过`function`关键字后的星号(`*`)来表示，函数中会用到关键字`yield`。

不能用箭头函数创建生成器，但是可以直接将生成器作为方法添加到对象用。

```js
const o = {
    *createIterator(items){
        for(let i = 0; i < items; i++){
            yield items[i]
        }
    }
}
```

可以通过给迭代器的`next()`方法传递参数，这个参数的值会替代生成器内部上一条`yield`语句的返回值。

需要注意的是，第一次调用`next()`方法，无论传什么参数都无效。

```js
function *createIterator(){
    let first = yield 1
    let second = yield first + 2 // 4 + 2
    yield second + 3 // 5 + 3
}

let iterator = createIterator()

console.log(iterator.next()) // {value: 1, done: false}
console.log(iterator.next(4)) // {value: 6, done: false} 
console.log(iterator.next(5)) // {value: 8, done: false} 
console.log(iterator.next()) // {value: undefined, done: true} 

// 抛出错误
console.log(iterator.next()) // {value: 1, done: false}
console.log(iterator.next(4)) // {value: 6, done: false} 
console.log(iterator.throw(new Error('Boom'))) // 抛出错误
```

生成器内部可以通过`try-catch`来捕获错误

```js
function *createIterator(){
    let first = yield 1
    let second = yield first + 2 
    
    try{
        second = yield first + 2 
    }catch(e){
        second = 6
    }
    
    yield second + 3 // 5 + 3
}

let iterator = createIterator()

// 抛出错误
console.log(iterator.next()) // {value: 1, done: false}
console.log(iterator.next(4)) // {value: 6, done: false} 
console.log(iterator.throw(new Error('Boom'))) // {value: 9, done: false}  
console.log(iterator.next()) // {value: undefined, done: true} 
```

### 可迭代对象

可迭代对象具有`Symbol.inerator`属性，`Symbol.inerator`通过指定的函数，可以返回一个作用于附属对象的迭代器。在`ES6`中，所有的集合对象(`Array/Set/Map`)和字符串都是可迭代对象。`for-of`循环需要用到可迭代对象的这些功能。

普通对象不是可迭代对象，不能用于`for-of`循环。

迭代器默认会为`Symbol.inerator`属性赋值，所用通过生成器创建的迭代器都是可迭代队形。

`for-of`循环没执行一次都会调用可迭代对象的`next()`方法，并将迭代器返回的结果对象的`value`属性储存在一个变量中，循环将持续执行这个过程直到返回队形的`done`属性为`true`

### 内置迭代器

#### 集合对象迭代器

`ES6`中有3种集合对象：数组，`Map`和`Set`。都有以下三种迭代器：

* `entries()`，返回一个所拥有的键值对的迭代器。数组的第一个元素为数字类型索引，`Set`的键和值都为值。
* `values()`，返回一个包含集合中的所有值的迭代器
* `keys()`, 返回一个包含集合中所有键的迭代器

在`for-of`循环中，没有显示指定，则使用集合的默认迭代器。数组和`Set`集合的默认迭代器是`values()`方法，`Map`集合的默认迭代器是`entries()`方法

#### 字符串迭代器（问题未复现）

`ES5`中是可以通过方括号访问字符串中的字符的，但是由于方括号操作的是编码单元而不是字符，无法正确访问双字节字符。而在`ES6`中通过字符串的默认迭代器解决了这个问题。

#### `NodeList`迭代器

`DOM`标准中的`NodeList`是一个类数组对象。`ES6`添加了默认迭代器后，`DOM`标准(定义在HTML标准中)也拥有了与数组行为一致的迭代器。因此在`for-of`循环中，与数组表现一致。

### 展开运算符

展开运算符`...`可以操作所有可迭代对象，从默认迭代器中读取所有值，然后按照返回顺序依次插入到数组中。

### 委托生成器

需要将多个迭代器合为一个时，可以创建一个生成器，给`yield`语句添加一个星号，就可以将生成数据的过程委托给其他迭代器。

生成器委托可以进一步利用返回值来处理复杂任务

## 类

`ES6`的类是基于已有自定义类型声明的语法糖。但是类和自定义类型仍存在以下区别：

* 类声明与`let`声明类似不能被提升，正在执行声明语句之前，存在于临时死区中
* 类声明中所有代码都自动运行在严格模式下
* 类声明中，所有方法都是不可枚举的。而自定义类型中是可枚举的
* 类有一个名为`[[Construct]]`的内部方法，通过`new`关键字调用不含`[[Construct]]`的方法，会抛错
* 不使用`new`关键字调用类的构造函数会抛错
* 在类中修改类名会抛错

```js
class Foo{
    constructor(name){
        this.name = name
        
        Foo = "bar" //报错，类型内部不能修改类名
    }
    sayName(){
        console.log(this.name)
    }
}

Foo('Mike') // 报错，没有通过new关键字调用构造函数
const person = new Foo('Mike')
new person.sayName() //报错，不能用new关键字调用类的方法
```

同函数一样，类也是一等公民。可以传入函数也可以从函数返回。

类可以通过立即调用类构造函数创建单例：

```js
let person = new class {
    constructor(name){
        this.name = name
        
        Foo = "bar" //报错，类型内部不能修改类名
    }
    sayName(){
        console.log(this.name)
    }
}('Mike')

person.sayName() // Mike
```

### 访问器属性

类支持在构造函数`constructor`中创建属性，也支持直接在**原型**上定义访问器属性

```js
class Foo{
    constructor(firstName, lastName){
        this.firstName = firstName
        this.lastName = lastName
    }

    /*
     * 相当于Object.defineProperty(Foo.prototype, "fullName", {
         enumerable: false,
         configurable: true,
         get(){
             return this.firstName + this.lastName
         }
     })
     */
    get fullName(){
        return this.firstName + this.lastName
    }
}
```

### 可计算成员名称及生产器方法

与对象字面量类似，类的方法和访问器属性支持变量。也支持用生成器定义方法。

```js
const methodName = 'sayName'
class Foo{
    constructor(name){
        this.name = name
        
        Foo = "bar" //报错，类型内部不能修改类名
    }
    [methodName](){
        console.log(this.name)
    }
    /*
     * 该方法为Foo类定义一个默认迭代器方法，可以用于for...of循环
     */
    *[Symbol.iterator](){
        yield 1
        yield 2
        yield 3
    }
}
```

### 静态成员

可以使用`static`关键字为类添加静态成员：

```js
class Foo.{
    constructor(name){
        this.name = name
        
        Foo = "bar" //报错，类型内部不能修改类名
    }
    /*
     * 相当于Foo.create
     */
    static create(){
        console.log(this.name)
    }
}
```

> 静态成员挂在类上面，不能在静态成员中访问

### 类的继承与派生

`ES6`可以使用`extends`关键字实现类的继承。可以调用`super()`方法访问基类的构造函数。

```js
class Child extends Parent{
    constructor(options){
        // 等价于Parent.call(this, options)
        super(options)
    }
}
```

继承自其他类的类被称为**派生类**。如果派生类有构造函数，必须调用`super()`，否则会报错。如果派生类不实用构造函数，则创建新的实例时会自动调用`super()`并传入所有参数。

`super()`的使用有以下几个关键点：

* 只能在派生类的构造函数中使用，在非派生类或者函数中使用会报错
* 要在构造函数访问`this`之前调用`super()`，他负责初始化`this`，在`super()`之前使用`this`会报错
* 在类的构造函数中返回一个对象，可以不调用`super()`

**类的方法的遮蔽**

派生类中的方法会覆盖基类中的同名方法。可以使用`super.method()`调用基类被覆盖的方法。

**静态成员的继承**

如果基类有静态成员，派生类中冶可以使用。

**extend高级用法**

`extend`可以从表达式导出类。只有表达式可以被解析成一个函数并且有`[[Construct]]`属性和原型，就可以用`extend`进行派生。

```js
// 基类可以是`ES5`的构造函数
function Rectangle{
    }(length, width){
    this.length = length
    this.width = width
}

Rectangle.prototype.getArea() = function(){
    return this.length * this.width
}

class Suqare extends Rectangle{
    constructor(length){
        super(length, length)
    }
}

// 可以通过函数动态的确定类的继承目标
function getBase(){
    return Rectangle
}

class Suqare extends getBase(){
    constructor(length){
        super(length, length)
    }
}

// 可以创建不同的继承方法
const SerializableMixin = {
    serialize(){
        return JSON.stringify(this)
    }
}
const AreaMixin = {
    getArea(){
        return this.length * this.width
    }   
}

function mixin(...mixins){
    const base = function(){}

    Object.assign(base.prototype, ...mixins)

    return base
}

class Suqare extends mixin(SerializableMixin, AreaMixin){
    constructor(length){
        this.length = length
        this.width = length
    }
}
```

> `extends`后面的表达式不能是null或者生成器函数会导致错误

**内建对象的继承**

在`ES5`中无法实现对内建对象(如`Array`)的继承：

```js
function MyArray(){
    Array.apply(this, arguments)
}

MyArray.prototype = Object.create(Array.prototype, {
    constructor: {
        value: Array,
        writable: true,
        configurable: true,
        enumerable: true
    }
})

let colors = new MyArray()

colors[0] = "red"

console.log(colors.length) // 0

colors.length = 0

console.log(colors[0]) // "red"

colors.push('blue') 

console.log(colors.length) // 1
```

`ES6`的`extends`与`ES5`实现的继承不同的是：

* `ES5`先由派生类型创建`this`值，然后调用基类的构造函数(`apply`)。`this`开始指向派生类的实例，随后被基类的属性修饰
* `ES6`的`extends`先由基类创建`this`值，然后派生类的构造函数再修改这个值，然后在正确的接受所有与之相关的功能

```js
class MyArray extends Array {
}

let colors = new MyArray()

colors[0] = "red"

console.log(colors.length) // 1

colors.length = 0

console.log(colors[0]) // undefined
```

### Symbol.species属性

内建对象继承，会使原本在内建对象中返回自身实例的方法将自动返回派生类的实例。这主要是通过`Symbol.species`属性实现的。

```js
class MyArray extends Array {
}

const items = new MyArray(1, 2, 3, 4)
const subItems = items.slice(1, 3)

console.log(items instanceof MyArray) // true
console.log(subItems instanceof MyArray) // true， ES5继承时，为false
```

`Symbol.species`属性主要用于定义返回函数的静态访问器属性。被返回的函数是一个构造函数，实例的方法中创建的类的实例时必须用这个构造函数。以下内建类型均已定义`Symbol.species`属性

* `Array`
* `ArrayBuffer`
* `Map`
* `Promise`
* `RegExp`
* `Set`
* `Typed arrays`

## 代理和反射

代理(Proxy)是一种可以拦截并改变底层`JavaScript`引擎操作的包装器。

> 在`ES6`中数组被认为是奇异对象(exotic object)

调用`new Proxy`可创建目标(target)对象的代理，他虚拟化了目标，二者看起来功能一致。

代理可以拦截`JavaScript`引擎内部目标的底层对象操作，会触发对应的陷阱函数

反射`API`以`Reflect`对象的形式出现，对象中方法的默认特性与相同的底层操作一直，代理可以覆写这些操作，每个代理陷阱都对应一个命名和参数相同的`Reflect`方法

| 代理陷阱 | 覆写的特性     | 默认特性        |
| -------- | -------------- | --------------- |
| `get`    | 读取一个属性值 | `Reflect.get()` |
| `set`    | 写入一个属性值 | `Reflect.set()` |
| `has`    | `in`操作符 | `Reflect.has()` |
| `deleteProperty`    | `delete`操作符 | `Reflect.deleteProperty()` |
| `getPrototypeOf`    | `Object.getPrototypeOf()` | `Reflect.getPrototypeOf()` |
| `setPrototypeOf`    | `Object.setPrototypeOf()` | `Reflect.setPrototypeOf()` |
| `isExtensible`    | `Object.isExtensible()` | `Reflect.isExtensible()` |
| `preventExtensions`    | `Object.preventExtensions()` | `Reflect.preventExtensions()` |
| `getOwnPropertyDescriptor`    | `Object.getOwnPropertyDescriptor()` | `Reflect.getOwnPropertyDescriptor()` |
| `defineProperty`    | `Object.defineProperty()` | `Reflect.defineProperty()` |
| `ownKeys`    | `Object.keys()`、`Object.getOwnPropertyNames()`和、`Object.getOwnPropertySymbols()` | `Reflect.ownKeys()` |
| `apply`    | 调用一个函数 | `Reflect.apply()` |
| `construct`    | 用`new`调用一个函数 | `Reflect.construct()` |

### 代理的使用

```js
let target = {}
let proxy = new Proxy(target, {
    /**
     * 
     * @param {Object}          trapTarget  接受属性的被代理的目标对象，本例中的target
     * @param {String, Symbol}  key         要写入的属性键值
     * @param {*}               value       要写入的属性键值
     * @param {Object}          receiver    代理对象，本例中的proxy
     */
    set(trapTarget, key, value, receiver) {
        console.log(trapTarget === target, key, value, receiver === proxy); // true 'name' 'proxy' true
        
        return Reflect.set(trapTarget, key, value, receiver)
    },
    get
})

proxy.name = "proxy"
console.log(proxy.name) // "proxy"
console.log(target.name) // "proxy"
```

## 模块

模块(`Module`)是自动运行在严格模式下并且没有办法退出运行的`JavaScript`代码。

* 模块的代码自动运行在严格模式下
* 模块的顶部，`this`的值是`undefined`

### 导出语法

可以用`export`关键字将任意变量、函数或类声明从模块中导出。除非用`default`关键字，否则不能用`export`导出匿名函数或类

```js
export const color = 'red'

function multiply(factor, faciend){
    return factor * faciend
}

export multiply
```

### 导入语法

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

### 导出和导入时重命名

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

### 模块的默认值

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

### 重新导出一个绑定

```js
export * from './example.js'
export {
    default as add,
    name
} from './add.js'
```

### 加载模块

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

### 异步模块加载

与通用脚本加载一样，模块也支持`async`属性，设置之后，会以异步方式加载。异步加载的模块不必等待文档解析完成，但是需要模块中所有导入文件都加载完成，才会执行模块。但是无法保证模块的先后执行顺序，而是哪个模块及其依赖模块先加载完就先执行哪个模块。

### 将模块作为`Worker`加载

通过配置`Worker`的第二个参数，可以支持以模块方式加载。

```js
const worker = new Worker('script.js') // 创建的Worker以脚本方式加载

const moduleWorker = new Worker('module.js', {type: 'module'}) // 创建的Worker以模块方式加载
```

以脚本方式加载的`Worker`与以模块方式加载的`Worker`存在以下两点不同：

1. `Worker`脚本只能引用与网页同源的`JavaScript`，而`Worker`模块不会完全受限，可以加载并访问具有适当的跨域资源共享(CORS)头的文件。
2. `Worker`脚本可以使用`self.importScripts()`加载其他脚本，但`Worker`模块不能，而是应该使用`import`来导入。

### 浏览器模块说明符解析

在浏览器中，模块说明符(`module specifier`)只支持以下四种格式：

* 以`/`开头，从根目录开始解析
* 以`./`开头，从当前目录开始解析
* 以`../`开头，从父级目录开始解析
* URL格式，不同源时，需要正确配置跨域(CORS)
  
以下的格式，是无效的，并且会导致错误

```js
import {multiply} from 'example.js'
```