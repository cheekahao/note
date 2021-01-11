# React

## Hook

`Hook`是`React`16.8的新增特性。可以在不编写`class`的情况下使用`state`以及其他的`React`特性。

`Hook`为已知的`React`概念提供了更直接的`API`：`props`， `state`，`context`，`refs`以及生命周期。

可以使用`Hook`从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。`Hook`可以在无需修改组件结构的情况下复用状态逻辑。这使得在组件间或社区内共享`Hook`变得更便捷。

* 利于组件预编译，更易于优化
* `class`组件会无意中鼓励开发者使用一些让优化措施无效的方案
* `class`不能很好的压缩，并且会使热重载出现不稳定的情况

`Hook`是一些可以让你在函数组件里“钩入”`React state`及生命周期等特性的函数。

### `State Hook`

`useState`通过在函数组件里调用它来给组件添加一些内部 `state`。`React`会在重复渲染时保留这个`state`。

不同于class组件`state`必须为一个对象，`useState`可以接受一个基本类型，也可以接受引用类型。

返回一对值：当前状态`state`和一个可以更新它的函数`setState`，可以在事件处理函数中或其他一些地方调用这个函数。

`useState`类似于`class`组件的`this.setState`，但是它不会把新的`state`和旧的`state`进行合并。

`state`不一定要是一个对象，且这个初始`state`参数只有在第一次渲染时会被用到

具体示例如下：

```jsx
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

`React`假设当你多次调用`useState`的时候，你能保证每次渲染时它们的调用顺序是不变的

### `Effect Hook`

`Effect Hook`可以让你在函数组件中执行副作用操作，类似于`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`这三个生命周期。

`Effect Hook`会在每次渲染后都执行。但是与`componentDidMount`或`componentDidUpdate`不同，使用`useEffect`调度的`effect`不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。如果需要阻塞视图更新，可以使用`useLayoutEffect` Hook

在`React`组件中有两种常见副作用操作：需要清除的和不需要清除的。需要清除的`effect`可以在`useEffect`中返回一个函数，`React`将会在执行清除操作时调用它。

`React`会在执行当前`effect`之前对上一个`effect`进行清除。

如果某些特定值在两次重渲染之间没有发生变化，可以通过传递数组作为`useEffect`的第二个可选参数，通知 React 跳过对 effect 的调用。

如果想执行只运行一次的`effect`（仅在组件挂载和卸载时执行），可以传递一个空数组`[]`作为第二个参数。

具体见下例：

```js
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // 清除副作用
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  }, [props.friend.id]); // 仅在 props.friend.id 发生变化时，重新订阅

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

### `Hook`规则

Hook 就是`JavaScript`函数，但是要注意两点规则：

* **只能在函数最外层调用`Hook`**，不能在循环、条件判断或者子函数中调用。这样能确保`Hook`在每一次渲染中都按照同样的顺序被调用。让`React`能够在多次的`useState`和`useEffect`调用之间保持`hook`状态的正确
* **只能在`React`的函数组件中调用`Hook`**，不要在其他 `JavaScript`函数中调用。另外自定义的`Hook`中也可以调用

`React`靠的是`Hook`调用的顺序来确定哪个`state`对应哪个`useState`

### 其他`Hook`

`useContext`接收一个`context`对象（`React.createContext`的返回值）并返回该`context`的当前值。

```js
const value = useContext(MyContext);
```

`useReducer`，`useState`的替代方案。接收一个形如`(state, action) => newState`的`reducer`，并返回当前的`state` 以及与其配套的`dispatch`方法。

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

`useLayoutEffect`其函数签名与`useEffect`相同，但它会在所有的`DOM`变更之后同步调用`effect`，会阻塞视图更新

### 自定义`Hook`

自定义`Hook`是一个函数，其名称以`use`开头，函数内部可以调用其他的`Hook`。

## `React`的生命周期

* `componentDidMount`，组件第一次被渲染到`DOM`中的时候
* `componentWillUnmount`，组件被删除的时候

当组件实例被创建并插入`DOM`中时(挂载)，其生命周期调用顺序如下：

* `constructor()`
* `static getDerivedStateFromProps()`
* `render()`
* `componentDidMount()`

当组件的`props`或`state`发生变化时会触发更新。组件更新的生命周期调用顺序如下：

* `static getDerivedStateFromProps()`
* `shouldComponentUpdate()`
* `render()`
* `getSnapshotBeforeUpdate()`
* `componentDidUpdate()`

当组件从`DOM`中移除(卸载)时会调用如下方法：

* `componentWillUnmount()`

错误处理，当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：

* `static getDerivedStateFromError()`
* `componentDidCatch()`

## Fiber