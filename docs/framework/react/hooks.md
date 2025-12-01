# React Hooks

## Class Component面临的问题

`Class Component`存在以下两个问题：

1. 业务逻辑分散。业务逻辑分散在不同生命周期中，造成同一个生命周期中包含多种不相关逻辑，也会造成同一个业务逻辑被分割到不同生命周期中。
2. 有状态的逻辑复用困难。由于逻辑被分割到不同生命周期中，导致跨组件复用有状态的逻辑困难。虽然有`HOC`和`Render Props`等模式可以解决这个问题，但也为组件结构引入了新的复杂度。

## Suspense

`Suspense`是React 16.6引入的一个新特性，用于处理异步操作。它允许在子组件完成加载前展示后备方案。

`Suspense`对应的子节点包括`Offscreen`和`Fallback`两个`child`。当处于`suspend`(挂起状态)时，会展示`Fallback`组件。
