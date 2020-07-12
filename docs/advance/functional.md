# 函数式编程

虽然`JavaScript`是一门面向对象的编程语言（确切的说是基于原型)，但是也拥有很多函数式语言的特性，例如`Lambda`表达式、闭包和高阶函数等。

> 函数式编程是一种典型的编程范型（编程范式、程序设计法，programming paradigm）。常见的编程范型有函数式编程、面向对象编程、指令式编程等

## 闭包

## 高阶函数

所谓高阶函数(higher-order function)就是操作函数的函数，它结束一个或者多个函数作为参数，并返回一个新函数。具有以下两个特点：

* 函数作为参数被传递
* 函数作为返回值输出

### 柯里化

在此之前，先补充一些概念：

* 一元函数，只接受一个参数的函数称为一元（unary）函数
* 二元函数，接受两个参数的函数称为二元（binary）函数
* 变参函数，指函数接受的参数数量是可变的
  
函数柯里化（function currying）有称部分求值。函数柯里化就是把一个多参数函数转换为一个嵌套的一元函数的过程。

一个柯里化的函数，首先会接受一些参数，接受了这些参数之后不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中暂存起来。待函数需要求值时，之前传入的参数都会被一次性用于求值。

```js
function currying(fn){
  if(typeof fn !== 'function'){
    throw Error('params of currying expect a function')
  }

  const fullArgs = []

  return function curriedFn(...args){
    if(args.length === 0){
      return fn.apply(this, fullArgs)
    }else{
      fullArgs.push(...args)
      return curriedFn
    }
  }
}
```

### 防抖与节流

### Thunk函数

`Thunk`函数的主要的作用是实现传名调用。

所谓的传名调用（call by name）是编译器一种求值策略，即函数的参数到底应该何时求值，除此之外还有传值调用（call by value）。

```js
var x = 1;

function f(m) {
  return m * 2;
}

f(x + 5)

// 传值调用时，等同于
f(6)

// 传名调用时，等同于
(x + 5) * 2
```
编译器的**传名调用**实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做`Thunk`函数。

其`JavaScript`实现及使用如下：

```js
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  }
}

var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```

`Thunk`函数可以用于`Generator`函数的自动流程管理。

### 装饰器