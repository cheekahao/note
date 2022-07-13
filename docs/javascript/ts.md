# TypeScript

## TypeScript的设计目标

* `TypeScript`是一种在编译期进行静态类型分析的强类型语言。拥有一个语言服务层为开发者提供更好的工具。
* 与`JavaScript`兼容。`TypeScript`是`JavaScript`的超集，任何合法的`JavaScript`程序都是合法的`TypeScript`程序。
* 给大型项目提供一个构建机制，加入了基于类`Class`的对象、接口和模块。
* 对于发行版本代码，没有运行时开销。`TypeScript`程序通常将**设计阶段**和**运行阶段**分开。`TypeScript`的新特性仅对**设计时代码**`design time code`有效，而对于**执行时代码**`excution time code`则通过**代码转换**（转换为`JavaScript`代码）和**类型擦除**将之转换为纯净的`JavaScript`代码。
* 遵循当前以及未来的`ECMAScript`规范。
* 开源。

## TypeScript的类型系统

`TypeScript`为`JavaScript`增加了可选的静态类型说明，用以约束函数、变量、属性等程序实体。以便编译器和相应的开发工具可以在开发过程中提供更好的正确性校验和帮助提示。

**可选的静态类型声明**`optional static type notation`在变量的后面并且以冒号分隔：

```ts
var counter                 // 未知(any)类型
var counter = 0             // number类型，类型推导type inference
var counter : number        // number类型
var counter : number = 0    // number类型
```

### JS基本类型

`JavaScript`的基本类型在`TypeScript`中都有对应的类型：

* `number`
* `string`
* `boolean`
* `symbol`，是`ES6`新增的数据类型，在编译目标是`ES5`及以下时会报错。由于只能通过`Symbol`函数生成，可以通过类型推断确定类型，无需特别声明变量为`symbol`类型。
* `undefined`和`null`，是所有其他类型的子类型，可以赋值给任何其他类型的变量。在`tsconfig`中开启了`strictNullChecks`，那么`undefined`和`null`就只能赋值给`void`或`any`类型变量以及它们自身类型的变量。

### Any类型

`any`类型，表示任何`JavaScript`值。`any`类型即是类型系统的顶级类型（全局超级类型），又是`bottom type`（任何类型的`subtype`），是类型系统的一个逃逸舱。

可以将在编程阶段还不清楚类型的变量指定为`any`类型。另外，`any`类型是与现有代码一起工作时的一种高效的方式。`any`类型也可以用于只知道一部分类型的情况，例如一个混合了各种类型的数据（`Array<any>`）。

### Unknown类型

`TypeScript`3.0引入的另一种顶级类型。与`any`相比，`unknown`是类型安全的。任何值都可以赋给`unknown`类型，但是`unknown`类型在被类型断言或者基于控制流的类型细化之前，不能赋值给除了`any`类型和`unknown`类型本身以外的类型。

### Void类型

`void`类型与`any`类型相反，表示没有任何类型。当一个函数没有返回值时，其返回值类型是`void`。

`void`类型只能被赋值为`undefined`和`null`。

### Never类型

`never`用于表示永远不会存在的值的类型。`never`是任何类型的子类型，但没有类型是`never`的子类型。

`never`类型常用于以下情况：

1. 用于描述从不会有返回值的函数或箭头函数
2. 用于描述总是抛出错误的函数
3. 当变量被永不为真的类型保护所约束时

### Object类型

`object`表示非原始类型，即除`number`，`string`，`boolean`，`symbol`，`null`或`undefined`之外的类型。与`any`类似，可以在编译时可选择地包含或移除类型检查。但是`object`类型只允许被赋值为任意类型，但是不能够调用任意方法，即使它真的有这些方法。

```ts
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

## TypeScript的编译原理

`TypeScript`编译器由以下几个部分组成：

* `Scanner`扫描器
* `Parser`解析器
* `Binder`绑定器
* `Checker`检查器
* `Emitter`发射器