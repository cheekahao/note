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

## 迭代器(Iterator)和生成器(Generator)

### 迭代器和生成器

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

## 内置迭代器

### 集合对象迭代器

`ES6`中有3种集合对象：数组，`Map`和`Set`。都有以下三种迭代器：

* `entries()`，返回一个所拥有的键值对的迭代器。数组的第一个元素为数字类型索引，`Set`的键和值都为值。
* `values()`，返回一个包含集合中的所有值的迭代器
* `keys()`, 返回一个包含集合中所有键的迭代器

在`for-of`循环中，没有显示指定，则使用集合的默认迭代器。数组和`Set`集合的默认迭代器是`values()`方法，`Map`集合的默认迭代器是`entries()`方法

### 字符串迭代器（问题未复现）

`ES5`中是可以通过方括号访问字符串中的字符的，但是由于方括号操作的是编码单元而不是字符，无法正确访问双字节字符。而在`ES6`中通过字符串的默认迭代器解决了这个问题。

### `NodeList`迭代器

`DOM`标准中的`NodeList`是一个类数组对象。`ES6`添加了默认迭代器后，`DOM`标准(定义在HTML标准中)也拥有了与数组行为一致的迭代器。因此在`for-of`循环中，与数组表现一致。

### 展开运算符

展开运算符`...`可以操作所有可迭代对象，从默认迭代器中读取所有值，然后按照返回顺序依次插入到数组中。

### 委托生成器

需要将多个迭代器合为一个时，可以创建一个生成器，给`yield`语句添加一个星号，就可以将生成数据的过程委托给其他迭代器。

生成器委托可以进一步利用返回值来处理复杂任务

### 类

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