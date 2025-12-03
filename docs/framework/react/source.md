# React原理

## 前端框架原理概览

现代前端框架的实现原理：`UI=f(state)`，框架内部运行机制根据当前状态渲染视图。

其中：
* `state`代表当前视图状态
* `f`代表框架内部运行机制
* `UI`代表宿主环境的视图

为了实现`UI`与逻辑的关注点分离，需要一种存放 `UI`与逻辑的松散耦合单元，这就是组件。
组件通过是那种方式组织逻辑与 `UI`：

* 逻辑中的自变量变化，导致`UI`变化
* 逻辑中的自变量变化，导致“无副作用因变量”变化，导致 `UI`变化，例如`useMemo`，`computed`等
* 逻辑中的自变量变化，导致“有副作用因变量”变化，导致副作用，例如`useEffect`，`watchEffect`，`autorun`等

在前端框架中，组件内部定义的自变量被称为`state`(状态)，其他组件传递而来的自变量成为`props`(属性)。当自变量需要跨层级传递时，可以通过`store`实现。React 主要通过`Context`实现。

前端框架可以根据与自变量建立对应关系的抽象层级分为以下三类：

* 应用级框架，如`React`
* 组件级框架，如`Vue`
* 元素级框架，如`Svelte`

## React16 架构

相较于 React15，React16 中新增了Scheduler（调度器），分为以下三层：
* Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
* Reconciler（协调器）—— 负责找出变化的组件
* Renderer（渲染器）—— 负责将变化的组件渲染到页面上

在 React 工作流程中：

* Reconciler工作的阶段被称为render阶段。因为在该阶段会调用组件的render方法
* Renderer工作的阶段被称为commit阶段。就像你完成一个需求的编码后执行git commit提交代码。commit阶段会把render阶段提交的信息渲染在页面上
* render与commit阶段统称为work，即React在工作中。相对应的，如果任务正在Scheduler内调度，就不属于work

## React理念

React使用JavaScript构建快速响应的大型 Web应用程序的首选方式。

* CPU瓶颈，当执行大计算量的操作或者设备性能不足时，页面掉帧，导致卡顿
* I/O 瓶颈，进行I/O操作后需要等待数据返回才能继续操作，等待的过程导致不能快速响应

React的发展阶段：

* Sync同步模式
* Async Mode异步模式
* Concurrent Mode并发模式
* Concurrent Feature并发特性

React各版本重要更新点

* React 16将同步的不可中断的递归渲染重构为异步的、可中断的链表遍历，为后续的并发特性打下基础
* Reat 17通过重构事件系统等底层，为React 18的并发更新以及大型应用的渐进式升级铺平道路，确保生态的平稳过渡
* React 18引入并发渲染（Concurrent Rendering），允许React同时准备多个版本的UI，并能根据优先级中断或继续渲染。新增了startTransition（保持UI响应）和Suspense SSR（流式页面加载）等强大功能
* React 19专注于提升开发体验。通过Actions等特性，将数据变更、表单处理、乐观更新等常见场景进行抽象和简化，支持更声明式、更少的代码来完成更多工作

## React Reconciler的 render阶段

Reconciler的工作流程主要是采用 DFS(深度优先遍历)的顺序构建 Wip Fiber Tree，主要分为“递”beginWork和“归”completeWork 两个阶段：

* beginWork根据当前 fiberNode 创建下一级fiberNode，在 update时标记 Placement(新增、移动)、ChildDeletion(删除)。
* completeWork在 mount时构建 DOM Tree, 初始化属性，在 update时标记 Update(属性更新)，最终执行 flags冒泡。
  
最终 HostRootFiber完成completeWork后，Reconciler的工作流程结束，可以得到：

* 代表本次更新的Wip Fiber Tree
* 被标记的 flags

HostRootFiber对应的 FiberRootNode传递给 Renderer进行 commit阶段的工作

## React  Renderer的commit阶段

commit阶段始于React Reconciler的commitRoot方法，是同步执行，不可打断的。有三个子阶段：

* BeforeMutation 阶段
* Mutation 阶段
* Layout 阶段

### BeforeMutation 阶段
主要处理以下两种类型的 FiberNode:

* ClassComponent，执行 getSnapshowBeforeUpdate方法
* HostRoot，清空挂载内容，方便Mutation阶段渲染

### Mutation 阶段
在 react-dom 中，对于HostComponent，主要进行 DOM 元素的增、删、改操作。其他类型的Component处理与组件相关的副作用和生命周期。

主要包括：
* 副作用处理：
  ○ 处理函数组件的useEffect和useLayoutEffect的清理函数
  ○ 处理类组件的componentWillUnmount 生命周期
* Ref 处理
  ○ 从 DOM 中移除 ref
  ○ 从组件实例中移除 ref
* 子组件遍历
  ○ 递归处理子组件的变更
另外，当Mutation阶段的主要工作完成之后，会进行 Fiber Tree的切换

### Layout 阶段

Layout 阶段在DOM已经被修改之后，在浏览器绘制之前。所有Layout的副作用都是同步调用的，不会被延迟或打断。

目的是为了允许开发者在 DOM 变更后、用户看到更新前、读取 DOM布局信息或执行必须同步完成的操作。

Layout阶段向下遍历过程中，会执行 OffscreenComponent的显隐逻辑。

向上遍历过程中，会根据 fiberNode.tag 不同执行不同操作：

* 对于 ClassComponent，执行 componentDidMount/Update 方法
* 对于 FC，执行 useLayoutEffect callback

## React Scheduler

`Scheduler`预置了五种优先级：

* `ImmediatePriority`立即执行, 优先级最高，同步执行
* `UserBlockingPriority`用户阻塞
* `NormalPriority`正常执行
* `LowPriority`低优先级
* `IdlePriority`空闲时执行

`Scheduler`调度的主要数据结构为`Task`:

```typescript
type Callback = boolean => ?Callback

type Task = {
  id: number;
  callback: Callback;
  priority: PriorityLevel;
  startTime: number;
  expirationTime: number;
};
```

### `Scheduler`的执行流程

`Scheduler`的执行流程如下：

1. 根据是否传递`delay`参数，执行`scheduleCallback`方法后生产的`task`会进入`timerQueue`或`taskQueue`, 其中
  - `timerQueue`中的`task`以`currentTime + delay`为排序依据
  - `taskQueue`中的`task`以`expirationTime`为排序依据
2. 当`timerQueue`中第一个`task`延时时间到期后，执行`advanceTimers`将其移动到`taskQueue`中
3. 执行`requestHostCallback`在新的宏任务中执行`workLoop`方法
4. `workLoop`方法循环消费`taskQueue`中的`task`（即执行`task.callback`）, 直到`taskQueue`为空或`Time Slice`时间用尽且当前`task`未过期(`currentTask.expirationTime > currentTime`)时中断循环
5. 如果`taskQueue`不为空，则进入步骤3，如果`timerQueue`不为空，则进入步骤2

`workLoop`执行的时机选择，在支持`setImmediate`的环境下使用`setImmediate`，在支持`MessageChannel`的环境下使用`MessageChannel`，在不支持以上两种环境下使用`setTimeout`。

### 优先级队列

优先级队列使用的数据结构为小顶堆，其特点是：

* 是一个完全二叉树（除最后一层外，其他层的节点个数都是满的，且最后一层的节点都靠左填充）
* 堆中每个节点的值都小于等于其子树的每一个节点的值

完全二叉树适合用数组保存，用数组下标代替指向左右节点的指针。

堆包含以下三个方法：

* `push`向堆中推入元素
* `pop`从堆顶取出元素
* `peek`获取排序依据最小的对应节点

`push`和`pop`方法都涉及堆化操作，即在插入、取出节点时对堆重新排序。堆化操作的时间复杂度与二叉树的高度正相关，为`O(log n)`。

## React Lane模型

`React`的**Lane模型**是并发调度系统`Concurrent Mode`的核心组成部分，借鉴了操作系统中常见的优先级调度思想，通过将更新任务抽象为**车道**`Lane`，实现了对不同优先级任务的灵活调度与中断恢复机制。

### Lane优先级

`Lane`是一个`32bit Integer`，最高位为符号位，总共有31个不同的优先级，越低的位优先级越高。具体如下：

```typescript
export const SyncHydrationLane: Lane = /*               */ 0b0000000000000000000000000000001;
export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000010;
export const InputContinuousHydrationLane: Lane = /*    */ 0b0000000000000000000000000000100;
export const InputContinuousLane: Lane = /*             */ 0b0000000000000000000000000001000;
export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000000010000;
export const DefaultLane: Lane = /*                     */ 0b0000000000000000000000000100000;
export const GestureLane: Lane = /*                     */ 0b0000000000000000000000001000000;
const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000000000010000000;
// 总共 14 个TransitionLane
const TransitionLane1: Lane = /*                        */ 0b0000000000000000000000100000000;
const TransitionLane2: Lane = /*                        */ 0b0000000000000000000001000000000;
const TransitionLane3: Lane = /*                        */ 0b0000000000000000000010000000000;
const TransitionLane4: Lane = /*                        */ 0b0000000000000000000100000000000;
const TransitionLane5: Lane = /*                        */ 0b0000000000000000001000000000000;
const TransitionLane6: Lane = /*                        */ 0b0000000000000000010000000000000;
const TransitionLane7: Lane = /*                        */ 0b0000000000000000100000000000000;
const TransitionLane8: Lane = /*                        */ 0b0000000000000001000000000000000;
const TransitionLane9: Lane = /*                        */ 0b0000000000000010000000000000000;
const TransitionLane10: Lane = /*                       */ 0b0000000000000100000000000000000;
const TransitionLane11: Lane = /*                       */ 0b0000000000001000000000000000000;
const TransitionLane12: Lane = /*                       */ 0b0000000000010000000000000000000;
const TransitionLane13: Lane = /*                       */ 0b0000000000100000000000000000000;
const TransitionLane14: Lane = /*                       */ 0b0000000001000000000000000000000;
// 总共 4 个RetryLane
const RetryLane1: Lane = /*                             */ 0b0000000010000000000000000000000;
const RetryLane2: Lane = /*                             */ 0b0000000100000000000000000000000;
const RetryLane3: Lane = /*                             */ 0b0000001000000000000000000000000;
const RetryLane4: Lane = /*                             */ 0b0000010000000000000000000000000;
export const SelectiveHydrationLane: Lane = /*          */ 0b0000100000000000000000000000000;
export const IdleHydrationLane: Lane = /*               */ 0b0001000000000000000000000000000;
export const IdleLane: Lane = /*                        */ 0b0010000000000000000000000000000;
export const OffscreenLane: Lane = /*                   */ 0b0100000000000000000000000000000;
export const DeferredLane: Lane = /*                    */ 0b1000000000000000000000000000000;
```
`Lanes`代表一个或者多个`Lane`的集合。

```ts
export const SyncUpdateLanes: Lane =
  SyncLane | InputContinuousLane | DefaultLane;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111111111100000000;
const TransitionUpdateLanes =
  TransitionLane1 |
  TransitionLane2 |
  TransitionLane3 |
  TransitionLane4 |
  TransitionLane5 |
  TransitionLane6 |
  TransitionLane7 |
  TransitionLane8 |
  TransitionLane9 |
  TransitionLane10;
const TransitionDeferredLanes =
  TransitionLane11 | TransitionLane12 | TransitionLane13 | TransitionLane14;

const RetryLanes: Lanes = /*                            */ 0b0000011110000000000000000000000;
const NonIdleLanes: Lanes = /*                          */ 0b0000111111111111111111111111111;
```