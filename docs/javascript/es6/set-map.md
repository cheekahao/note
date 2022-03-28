# `Set`和`Map`

长久以来，数组`Array`一直是`JavaScript`中唯一的集合类型，但是由于是数值型索引而在使用上受限。对于非数值类型索引的集合，就是`Set`和`Map`。

## 基于对象实现的`Set`和`Map`

在`ES6`发布之前，开发者以及基于非数组对象实现了类似的功能：

```js
// set

var set = Object.create(null)

set.foo = true

if(set.foo){
    // do something
}

// map

var map = Object.create(null)

set.foo = 'bar'

var value = map.foo

// do something
```

上述解决方案存在以下一些问题：

* 对象的属性必须是字符串类型，所以`map["5"]`和`map[5]`引用的是同一个属性
* 对象类型会被转换成`"[object Object]"`，会出现错误
* `map`中值为`False`类的值，直接`if`判断会存在`bug`，使用`in`操作符会检索对象的原型，需要保证对象的原型为`null`

## `ES6`中的`Set`和`WeakSet`

`Set`是一种**有序列表**，其中含有一些相互独立的非重复值。通过`Set`集合可以快速访问其中的数据，更加有效的追踪各种离散值

将对象存储在`Set`中，与存储在变量中完全一样，只要改实例存在，垃圾回收机制就不能释放该对象的内存空间，可以被看做是一个强引用的`Set`集合。`WeakSet`则是**弱引用集合**，只存储对象的弱引用，并且不可以存储原始值，集合中的弱引用如果是对象的唯一引用，该对象可以正常被垃圾回收。

**两者的区别**

* 在`WeakSet`中，通过`add()`方法添加非对象参数会报错，`has()`和`delete()`方法会返回`false`
* `WeakSet`不可迭代，不能用于`for-of`循环
* `WeakSet`不暴露任何迭代器方法(`keys()`和`values()`)，无法通过程序本身来检测其中的内容
* `WeakSet`不支持`forEach()`方法
* `WeakSet`不支持`size`属性