# JS拾遗

## `Object.create`详解

### `Object.create`是什么

`Object.create`的作用是使用指定的原型和属性来创建一个对象。有两个形参：

 - 指定的原型`proto`
 - 一个可选参数`descriptors`，属性描述符
 
 ```
 Object.create(null) // {}
 Object.create({x: 0}, {
     y: {value: 1, enumerable: true}
 }) // 相当于Object.defineProperties(Object.create(proto), descriptors)
 ```

### `Object.create(null)`与`{}`的区别

`Object.create(null)`不继承任何原型方法，`Object.create`用于创建一个新对象，其中第一个参数为这个对象的原型，而由于`null`没有原型，所以该方法不继承`Object.prototype`。

因此，`{}`等同于`Object.create(Object.prototype)`。

可以用以下代码模拟`Object.create`:

```
Object.prototype.create = function(proto){
    var fn = function(){};
    
    fn.prototype = proto;
    
    return new fn();
}
```

### `Object.setPrototypeOf`

`ES6`新增了`Object.setPrototypeOf`，用于设置一个指定的对象的原型 ( 即内部`[[Prototype]]`属性）到另一个对象或 `null`。

`Object.setPrototypeOf(obj, prototype)`

```
`ployfill`
// 仅适用于Chrome和FireFox，在IE中不工作：
Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
  obj.__proto__ = proto;
  return obj; 
}
```

## `new`操作符模拟实现

### `new`操作符都做了什么：

- 创建了一个全新的对象
- 这个对象会被执行`[[Prototype]]`（也就是`__proto__`）链接
- 生成的新对象会绑定到函数调用的`this`
- 通过new创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上
- 如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象

```
function _new(ctor, ...arguments){
    // ES6 new.target 是指向构造函数
    _new.target = ctor;
    
    const instance = Object.create(ctor.prototype);
    const ctorReturnResult = ctor.apply(instance, arguments);
    
    const isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null
    const isFunction = typeof ctorReturnResult === 'function'
    
    if(isObject || isFunction) return ctorReturnResult
    
    return instance
}
```

### `new`操作符和`Object.create`的区别

`new`操作符将父类的属性和方法全都赋给子类

`Object.create`只修改原型

## `JS`继承

### 原型链继承

**特点：**

- 父类新增原型方法/原型属性，子类都能访问到
- 简单，易于实现

**缺点：**

- 无法实现多继承
- 来自原型对象的所有属性被所有实例共享
- 创建子类实例时，无法向父类构造函数传参
- 要想为子类新增属性和方法，必须要在`inherits`之后执行，不能放到构造器中

```js
function _inherits(Child, Parent){
    Child.prototype = new Parent()
}
```

**问题**

*父类的私有属性中有引用类型的属性，那它被子类继承的时候会作为公有属性，这样子类1操作这个属性的时候，就会影响到子类2。*

### 借用构造函数继承

在子类型构造函数中通用`call()`调用父类型构造函数

```
function Person(name, age) {
    this.name = name,
    this.age = age,
    this.setName = function () {}
}

Person.prototype.setAge = function () {}
function Student(name, age, price) {
    Person.call(this, name, age)  // 相当于: this.Person(name, age)
    /*this.name = name
    this.age = age*/
    this.price = price
}
var s1 = new Student('Tom', 20, 15000)
```

**特点：**

- 解决了原型链继承中子类实例共享父类引用属性的问题
- 创建子类实例时，可以向父类传递参数
- 可以实现多继承(call多个父类对象)

**缺点：**

- 实例并不是父类的实例，只是子类的实例
- 只能继承父类的实例属性和方法，不能继承原型属性和方法
- 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能

### 原型链+借用构造函数的组合继承

通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用。

```
function Person (name, age) {
  this.name = name,
  this.age = age,
  this.setAge = function () { }
}
Person.prototype.setAge = function () {
}
function Student (name, age, price) {
  Person.call(this, name, age)
  this.price = price
  this.setScore = function () { }
}
Student.prototype = new Person()
Student.prototype.constructor = Student//组合继承也是需要修复构造函数指向的
Student.prototype.sayHello = function () { }
```

**优点：**

- 可以继承实例属性/方法，也可以继承原型属性/方法
- 不存在引用属性共享问题
- 可传参
- 函数可复用
**缺点：**
调用了两次父类构造函数，生成了两份实例

### 组合继承优化

```
function Person (name, age) {
  this.name = name,
  this.age = age,
  this.setAge = function () { }
}
Person.prototype.setAge = function () {}
function Student (name, age, price) {
  Person.call(this, name, age)
  this.price = price
  this.setScore = function () { }
}
Student.prototype = Person.prototype
Student.prototype.sayHello = function () { }
var s1 = new Student('Tom', 20, 15000)
```

**优点：**

不会初始化两次实例方法/属性，避免的组合继承的缺点

**缺点：**

没办法辨别是实例是子类还是父类创造的，子类和父类的构造函数指向是同一个。

### 组合继承优化2

```
function Person (name, age) {
  this.name = name,
  this.age = age
}
Person.prototype.setAge = function () {}
function Student (name, age, price) {
  Person.call(this, name, age)
  this.price = price
  this.setScore = function () { }
}
Student.prototype = Object.create(Person.prototype)//核心代码
Student.prototype.constructor = Student//核心代码
var s1 = new Student('Tom', 20, 15000)
```

### `ES6 extends`

**组合式继承**

```
function _inherits(Child, Parent){
    // Object.create
    Child.prototype = Object.create(Parent.prototype);
    // __proto__
    // Child.prototype.__proto__ = Parent.prototype;
    Child.prototype.constructor = Child;
    // ES6
    // Object.setPrototypeOf(Child, Parent);
    // __proto__
    Child.__proto__ = Parent;
}
```

## `null`和`undfined`

`null`是`JavaScript`的关键字，用来描述空值。因为`typeof null == "object"`，可将`null`不严谨的认为成一种特殊的对象，即非对象。这是是一个历史悠久的 `bug`，就是在`JS`的最初版本中`null`的内存存储信息是`000`开头的，而`000`开头的会被判断为`Object`类型。

实际上，`null`是`JavaScript`的基本类型之一，表示数字、字符串、对象等是无值的。

`undefined`用以表示更深层次的空值，即未定义。是变量的一种取值，表明变量未被初始化。若查询对象的属性，数组元素等返回`undefined`，也说明属性或元素不存在。`undefined`是预定义的全局变量，但不是`JavaScript`关键字。在`ECMAScript 3`中是可读写的，可以被赋予任何值，在`ECMAScript 5`中是只读的。

`null == undefined`为真，要严格判断需要用`===`。另外，`null`和`undefined`都不包含任何属性和方法，也没有包装对象。

## 不可变的原始值和可变的对象引用

JavaScript中的原始值（`undefined`、`null`、布尔值、数字和字符串）是不可更改的：任何方法都无法更改（或“突变”）一个原始值。**字符串中所有的方法都会返回一个新的字符串值。**

原始值的比较是值的比较：只有在它们的值相等时它们才相等。比较两个字符串，当且仅当它们的长度相等且每个索引的字符都相等时，`JavaScript`才认为它们相等。

对象的比较并非值的比较：即使两个对象包含同样的属性及相同的值，它们也是不相等的。同样，各个索引元素完全相等的两个数组也不相等。对象值都是引用（reference），对象的比较是引用的比较：**当且仅当引用同一个基对象时才相等**。因此，对象又被称为引用类型（referencetype），以此与基本类型做区分。

## `JavaScript`类型转换

**转为布尔值**

`null`、`undfined`、`""`、`0`、`-0`、`NaN`这6个转为`false`，其他的都会转为`true`。`false`又和这6个值被称为“假值”（falsy value），其他值称做“真值”（truthy value）。

包装对象也会被转换成`true`，所以`new Boolean(false) == true`

**转为数字**

* 以数字表示的字符串可以直接转换为数字，也允许在开始和结尾处带有空格，但有任意非空格字符的字符串都会转为`NaN`。
* 空字符串`""`会被转换为0
* `null`转为0，`undefined`转为`NaN`
* `true`转换为1，`false`也会被转换为0
* 空数组会被转换为0，只有一个数字元素的数组例如[2]或者其他唯一一个可以被会被转成数字的字符串，会被转换成对应的数字。而唯一的布尔值元素数组不会被转换为数字。

通过`Number()`将字符串转为数字时，只能基于十进制数进行转换，并且不能出现非法的尾随字符。`parseInt()`和`parseFloat()`都会跳过任意数量的前导空格，尽可能解析更多数值字符，并忽略后面的内容，如果第一个非空格字符是非法的数字直接量，将返回NaN。另外，`parseInt()`可以接收第二个可选参数，这个参数指定数字转换的基数，合法的取值范围是2～36。

**转为对象**

如果试图把`null`或`undefined`转换为对象会抛出一个类型错误（TypeError）。Object()函数在这种情况下不会抛出异常：仅简单地返回一个新创建的空对象。

**转为字符串**

`Number`类的`toString()`方法可以接收表示转换基数（radix）的可选参数，如果不指定，默认转换成十进制。进制基数范围应该在2～36之间。

数字转字符串需要控制小数点的有效数字位数时，可用以下三个方法。`toFixed()`任何时候都不会使用指数记数法；`toExponential()`则将数字转换为指数形式的字符串，其中小数点前只有一位，小数点后的位数则由参数指定；`toPrecision()`根据指定的有效数字位数将数字转换成字符串。这三个方法都会适当地进行四舍五入或者填充0。

**对象转换为原始值**

对象到字符串（object-to-string）和对象到数字（object-to-number）的转换是通过调用待转换对象的`toString`方法或valueOf方法来完成的。

*`toString`*

* 对象默认的toString方法返回一个反映这个对象的字符串` "[object Object]"`。
* 数组的`toString`方法将每个数组元素转换为一个字符串，其接受一个参数定义分隔符，默认值是逗号`,`。具体实现就是由数组中的每个元素的`toString`返回值经调用`join` 方法连接（由逗号隔开）组成。
* 函数`toString`方法返回函数的`JavaScript`源代码字符串。
* 日期的`toString`方法返回一个可读的（可被`JavaScript`解析的）日期和时间字符串。
* RegExp类的`toString`方法返回表示正则表达式直接量的字符串。

*`valueOf`*

`valueOf`方法主要作用是，如果存在任意原始值，就将其转换为表示它的原始值。对象默认的`valueOf`方法简单地返回对象本身。数组、函数和正则表达式等与之相同。只有日期类不同，`valueOf`方法会返回一个内部表示：1970年1月1日以来的毫秒数。

鉴于日期类的特殊性，运算符`+`、==、!=和比较运算符，需要同类型，所以在需要转化成数字的情况下，会调用日期类的`toString`方法，需要数字的情况下调用`valueOf`方法。其他运算符的类型转换都是决定的

```
1 + new Date() //调用toString
new Date() + 1  //调用toString
+ new Date() //调用valueOf
```

## 作为属性的变量

当声明一个JavaScript全局变量时，实际上是定义了全局对象的一个属性

命名函数的函数名在该函数内部是一个常量，不能被再次赋值，再次赋值时，严格模式下会报错，非严格模式下会静默失败。

## 严格判断数组

`Array.isArray()`是ES5的方法，可以用`Object.prototype.toString.call(arr) === '[object Array]'`来进行polyfill。

## `instanceof`

`instanceof`通过判断对象的原型链中是不是能找到类型的 `prototype`。`instanceof`的右侧必须为一个对象，否则会报错

```js
'' instanceof String; // false 检查原型链会找到 undefined
[]  instanceof Array; // true
[]  instanceof Object; //true

var myString  = new String();
var newStr    = new String("String created with constructor");
var myDate    = new Date();
var myObj     = {};
var myNonObj  = Object.create(null);

myDate instanceof Object;   // 返回 true
myNonObj instanceof Object; // 返回 false, 一种创建非 Object 实例的对象的方法
```

怪异的是：

```js
Function instanceof Object // true
Object instanceof Function // true
```

并且`instanceof`无法跨`iframes`判断数组：

```js
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length-1].Array;
var arr = new xArray(1,2,3); // [1,2,3]

// Correctly checking for Array
Array.isArray(arr);  // true
Object.prototype.toString.call(arr); // true
// Considered harmful, because doesn't work though iframes
arr instanceof Array; // false
```

## 存取器属性

对象的属性有数据属性和存取器属性两种：

**数据属性**，包含的一个数据值的位置，可以对数据值进行读写。包含四个特性：

 - `configurable`: 表示属性是否可配置，即能否通过`delete`删除属性从而重新定义属性，能否修改属性的特性，或能否把属性修改为访问器属性，默认为true
 - `enumerable`: 可枚举性，表示能否通过`for-in`循环返回属性

 - `writable`：可写性，表示能否修改属性的值

 - `value`: 包含该属性的数据值。默认为undefined

**存取器属性**，`accessor property`，又称访问器属性，不同于数据属性，包含的是一对`get`和`set`方法。在读取属性时调用`get`函数，在写入属性时调用`set`函数，因此`get`和`set`方法分别代替了数据属性的`value`和`writable`特性