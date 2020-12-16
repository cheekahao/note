# TypeScript

## TypeScript的设计目标

* `TypeScript`是一种在编译期进行静态类型分析的强类型语言。拥有一个语言服务层为开发者提供更好的工具。
* 与`JavaScript`兼容。`TypeScript`是`JavaScript`的超集，任何合法的`JavaScript`程序都是合法的`TypeScript`程序。
* 给大型项目提供一个构建机制，加入了基于类`Class`的对象、接口和模块。
* 对于发行版本代码，没有运行时开销。`TypeScript`程序通常将**设计阶段**和**运行阶段**分开。`TypeScript`的新特性仅对**设计时代码**`design time code`有效，而对于**执行时代码**`excution time code`则通过**代码转换**（转换为`JavaScript`代码）和**类型擦除**将之转换为纯净的`JavaScript`代码。
* 遵循当前以及未来的`ECMAScript`规范。
* 开源。

## 类型

`TypeScript`为`JavaScript`增加了可选的静态类型说明，用以约束函数、变量、属性等程序实体。以便编译器和相应的开发工具可以在开发过程中提供更好的正确性校验和帮助提示。

**可选的静态类型声明**`optional static type notation`在变量的后面并且以冒号分隔：

```ts
var counter                 // 未知(any)类型
var counter = 0             // number类型，类型推导type inference
var counter : number        // number类型
var counter : number = 0    // number类型
```

### 原始数据类型

* `number`
* `string`
* `boolean`
* `symbol`，是`ES6`新增的数据类型，在编译目标是`ES5`及以下时会报错。由于只能通过`Symbol`函数生成，可以通过类型推断确定类型，无需特别声明变量为`symbol`类型。
* `undefined`和`null`，是所有其他类型的子类型，可以赋值给任何其他类型的变量。在`tsconfig`中开启了`strictNullChecks`，那么`undefined`和`null`就只能赋值给`void`或`any`类型变量以及它们自身类型的变量。

### 高级类型

* `void`，表明函数没有返回值
* `any`，任何`JavaScript`值，即是类型系统的顶级类型（全局超级类型），又是`bottom type`（任何类型的`subtype`），是类型系统的一个逃逸舱
* `unknown`，`TypeScript`3.0引入。类型系统的另一种顶级类型。`unknown`可以赋值为任意类型，但是只能被赋值给`any`类型和`unknown`类型本身。
* `never`，永远不会存在的值的类型。`never`是任何类型的子类型，但没有类型是`never`的子类型。

`never`类型常用于两种情况：

1. 用于描述从不会有返回值的函数
2. 用于描述总是抛出错误的函数