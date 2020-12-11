## 架构

> 《架构整洁之道》读书笔记

## 编程范式

* 结构化编程，结构化编程对程序控制权的直接转移进行了限制和规范。限制goto语句
* 面向对象编程，面向对象编程对程序控制权的间接转移进行了限制和规范。限制函数指针
* 函数式编程，函数式编程对程序中的赋值进行了限制和规范。限制赋值语句的使用

## 软件架构

* 功能性
* 组件独立性
* 数据管理

* 顺序结构
* 分支结构
* 循环结构

### 面向对象

* 封装
* 继承
* 多态

## 设计原则

`SOLID`原则

* SRP: 单一职责原则。每个软件模块有且只有一个需要被改变的理由
* OCP: 开闭原则。如果软件系统想要更容易被改变，其设计必须允许新增代码来修改系统行为，而非只能靠修改原来的代码。
* LSP: 里氏替换原则。软件系统的组件要遵守同一个约定，以便让这些组件可以相互替换
* ISP: 接口隔离原则。在设计中避免不必要的依赖
* DIP: 依赖反转原则。高层策略性代码不应该依赖实现底层细节的代码，实现底层细节的代码应该依赖高层策略性代码

## 架构关注点

架构是系统设计的一部分，它突出了某些细节，并通过抽象省略掉另一些细节。

架构关注的是组件之间的关系和系统组件外部可见的属性，设计还要关注这些组件的内部结构。

### 架构关注点

* 品质关注点，例如稳定性，技术栈等

## 组件构建基本原则

* REP：复用/发布等同原则。软件复用的最小粒度应等同于其发布的最小粒度
* CCP：共同闭包原则。将会同时修改，且为了相同目的而修改的代码放到同一个组件中。反之亦然。
* CRP：共同复用原则。不应强迫一个组件的用户依赖他们不需要的东西。