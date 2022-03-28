# 代理和反射

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

## 代理的使用

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
    get(trapTarget, key, receiver){
        if( !(key in receiver) ){
            throw new Error(`属性 ${key} 不存在`)
        }
        
        return Reflect.get(trapTarget, key, receiver)
    }
})

proxy.name = "proxy"
console.log(proxy.name) // "proxy"
console.log(target.name) // "proxy"
```

## 浏览器支持程度

49以上版本Chrome支持`Proxy`。`IE`浏览器不支持。