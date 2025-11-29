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

### 异步任务执行

## async函数

`ES2017`标准引入了`async`函数，使得异步操作变得更加方便。

简而言之，`async`函数就是`Generator`函数的语法糖。将`Generator`函数的星号`*`替换成`async`，将`yield`替换成`await`。

相对于`Generator`函数，`async`函数做了以下的改进

* 内置执行器。`Generator`函数的执行必须靠执行器(例如`co`模块)，而`async`函数自带执行器
* 语义更清晰。与`Generator`函数的星号`*`和`yield`相比，`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果
* 适用性更广。`await`关键字后面，可以是`Promise`对象和原始类型的值，原始类型的值会自动转成立即`resolved`的`Promise`对象
* 返回值是`Promise`。

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

同函数一样，类也是**一等公民**。可以传入函数也可以从函数返回。

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

内建类型的`Symbol.species`属性实现的功能，可以用以下代码模拟：

```js
class MyClass{
    static get [Symbol.species](){
        return this
    }

    constructor(value){
        this.value = value
    }

    clone(){
        return new this.constructor[Symbol.species](this.value)
    }
}
```

由于`clone()`方法通过调用`this.constructor[Symbol.species]`获取`MyClass`，因此派生类可以覆盖这个值。

### 类的构造函数中的new.target

在类的构造函数中可以通过`new.target`确定类是如何被调用的。在一般简单情况下，`new.target`等于类的构造函数。

但是在派生类中调用基类的构造函数时，`new.target`等于派生类的构造函数。

```js
class Parent{
    constructor(name){
        console.log(new.target)
        this.name = name
    }
}
class Child extends Parent {

}

const children = new Child('Mike') // Child
```