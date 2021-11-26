# 设计模式

## 单例模式

**单例模式**，保证一个类仅有一个实例，并提供一个访问他的全局访问点。

## 策略模式

定义一些列的算法，把它们一个个的封装起来，并且使他们可以相互替换。

## 代理模式

**代理模式**是为一个对象提供一个代用品或者占位符，以便控制对它的访问。

## 迭代器模式

## 发布订阅模式

## 命令模式

命令模式中的命令`command`指的是一个执行某些特定事情的指令。

命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

相对于过程化的请求调用，`command`对象拥有更长的生命周期。对象的生命周期是跟初始请求无关的，因为这个请求已经被封装在了`command`对象的方法中，成为了这个对象的行为，我们可以在程序运行的任意时刻去调用这个方法。此外，命令模式还支持撤销、排队等操作。

命令模式的由来，其实是回调`callback`函数的一个面向对象的替代品。

```js
const setCommand = (button, command) => {
    button.onClick = () => command.execute()
}

const MenuBar = {
    refresh(){
        console.log('刷新菜单')
    },
}

const RefreshMenuCommand = (receiver) => () => ({
    execute(){
        receiver.refresh()
    },
    // 撤销命令
    undo(){

    }
})
const refreshMenuCommand = RefreshMenuCommand(MenuBar)

// 假设html中已经存在id为button1的button
const button1 = document.getElementById('button1')
setCommand(button1, refreshMenuCommand)
```

命令的**撤消**一般是给命令对象增加一个名为`unexecude`或者`undo`的方法，执行`execute`的反向操作。

需要撤销一系列的命令时，可以把所有执行过的命令都储存在一个历史列表中，然后倒序循环来依次执行需要撤销的命令的`undo`操作。

对于某些无法顺利地利用`undo`操作让对象回到`execute`之前状态的情况，可以通过先回退初始状态，再把执行过的命令全部重新执行一遍来实现。