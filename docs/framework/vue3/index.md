# 概述

## 关于本文

本文通过对`Vue3`源码删繁就简，深入了解`Vue3`内部实现逻辑。并结合与`Vue2`的对比，分析两者之间的异同。

`Vue3`新增了`Composition API`组合式`API`，能够通过较低级别的数据驱动视图和组件生命周期，将与同一个逻辑关注点相关的代码配置在一起。从而实现一种更自由形式的编写组件逻辑的方式。

`Vue3`的核心逻辑是基于`Composition API`的，对于`Options API`采用兼容处理。

## Vue3与Vue2的对比

* 对于数据变动的监听，`Vue2`基于`Object.defineProperty`实现，而`Vue3`基于`Proxy`实现
* `Vue2`使用`JavaScript` + `Flow`开发，而`Vue3`使用`TypeScript`开发
* `Vue2`采用面向对象的编程范式，而`Vue3`采用的是函数式编程
* `Vue3`新增了组合式`API`(`Composition API`)，兼容了原来的`Option API`，而`Vue2`是基于`Option API`的

## Vue3的整体结构

`Vue3`主要由数据响应系统`reactivity`、渲染器`renderer`、编译器`compiler`这三部分组成。