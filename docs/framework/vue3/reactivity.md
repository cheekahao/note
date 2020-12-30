# 数据响应式系统

`Vue3`新增了`Composition API`组合式`API`，能够通过较低级别的数据驱动视图和组件生命周期，将与同一个逻辑关注点相关的代码配置在一起。从而实现一种更自由形式的编写组件逻辑的方式。

`Composition API`实现响应式的关键`API`为包装基本类型的`ref`和引用类型的`reactive`。

### reactive

`reactive`方法源码位于`@vue/reactivity/src/reactive.ts`的第63行，其逻辑很简单，先判断是否为`readonly`，如果是，直接返回`target`，否则调用`createReactiveObject`方法：

```ts
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers
  )
}
```

`createReactiveObject`方法位于同文件的第136行：

```ts
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  // 非对象，直接返回
  if (!isObject(target)) return target

  // 已经是一个Reactive Proxy，但不是Reactive Readonly Proxy直接返回
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) return target
  
  // 已经在proxyMap中有对应的Reactive Proxy，直接返回existingProxy
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 不是禁止Reactive的类型
  const targetType = getTargetType(target)

  if (targetType === TargetType.INVALID) {
    return target
  }

  // 创建Reactive Proxy
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )

  // 在proxyMap中设置缓存
  proxyMap.set(target, proxy)

  return proxy
}
```

在`new Proxy`，根据`TargetType`分别使用了`collectionHandlers`和`baseHandlers`，先看下`baseHandlers`其值由`reactive`调用时传入的实参`mutableHandlers`，其定义位于`@vue/reactivity/src/baseHandlers.ts`的第187行：

```ts
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}
```

接下来我们一次看下对应的`ProxyHandler`: 

### get

`mutableHandlers`的`get` `ProxyHandler`定义位于同文件的第35行，调用了同文件的第72行的`createGetter`。

```ts
const get = /*#__PURE__*/ createGetter()

function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (
      key === ReactiveFlags.RAW &&
      receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)
    ) {
      return target
    }

    const targetIsArray = isArray(target)
    if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }

    const res = Reflect.get(target, key, receiver)

    const keyIsSymbol = isSymbol(key)
    if (
      keyIsSymbol
        ? builtInSymbols.has(key as symbol)
        : key === `__proto__` || key === `__v_isRef`
    ) {
      return res
    }

    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    if (shallow) {
      return res
    }

    if (isRef(res)) {
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key)
      return shouldUnwrap ? res.value : res
    }

    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
```

其主要逻辑为调用`@vue/reactivity/src/effect.ts`的第141行的`track`方法，并且根据类型对值进行如下的特殊处理：将`ref`执行`unwrap`，引用类型递归转为`proxy`。

`track`方法主要作用是追踪响应，将需要被追踪的对象作为键更新到全局的`depsMap`里，并与`activeEffect`关联起来，相当于`Vue2`中的`Dep`。

```ts
const targetMap = new WeakMap<any, KeyToDepMap>()
let activeEffect: ReactiveEffect | undefined
let shouldTrack = true

export function track(target: object, type: TrackOpTypes, key: unknown) {
  if (!shouldTrack || activeEffect === undefined) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}
```

### set

`mutableHandlers`的`set` `ProxyHandler`定义位于同文件的第125行，调用了同文件的第128行的`createGetter`。

```ts
const set = /*#__PURE__*/ createSetter()

function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    const oldValue = (target as any)[key]
    if (!shallow) {
      value = toRaw(value)
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value
        return true
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not
    }

    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    const result = Reflect.set(target, key, value, receiver)
    // don't trigger if target is something up in the prototype chain of original
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }
}
```

当`target`为引用类型是`set` `ProxyHandler`会根据是否`hadKey`分别调用`TriggerOpTypes`类型为`SET`/`ADD`类型的`trigger`。

`trigger`代码位于`@vue/reactivity/src/effect.ts`的第167行，是响应的触发器，

```ts
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    return
  }

  const effects = new Set<ReactiveEffect>()
  const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        if (effect !== activeEffect || effect.allowRecurse) {
          effects.add(effect)
        }
      })
    }
  }

  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    depsMap.forEach(add)
  } else if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= (newValue as number)) {
        add(dep)
      }
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      add(depsMap.get(key))
    }

    // also run for iteration key on ADD | DELETE | Map.SET
    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          add(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        } else if (isIntegerKey(key)) {
          // new index added to array -> length changes
          add(depsMap.get('length'))
        }
        break
      case TriggerOpTypes.DELETE:
        if (!isArray(target)) {
          add(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        }
        break
      case TriggerOpTypes.SET:
        if (isMap(target)) {
          add(depsMap.get(ITERATE_KEY))
        }
        break
    }
  }

  const run = (effect: ReactiveEffect) => {
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }

  effects.forEach(run)
}
```

`Vue3`的核心逻辑是基于`Composition API`的，对于`Options API`采用兼容处理。

## Vue3入口-createApp

相比较于`Vue 2`通过构造函数`new Vue()`的方式创建根`Vue`实例，`Vue 3`改为了通过调用 `createApp`返回一个应用实例：

```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

`createApp`源码位于`@vue/runtime-dom/src/index.ts`：

```typescript
export const createApp = ((...args) => {
  // 调用render.createApp生成app
  const app = ensureRenderer().createApp(...args)

  // 重新包装app的mount方法
  const { mount } = app
  app.mount = (containerOrSelector: Element | string): any => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
    }
    // clear content before mounting
    container.innerHTML = ''
    const proxy = mount(container)
    container.removeAttribute('v-cloak')
    container.setAttribute('data-v-app', '')
    return proxy
  }

  return app
}) as CreateAppFunction<Element>
```

`ensureRenderer`

```ts
// lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Vue.
let renderer: Renderer<Element> | HydrationRenderer

let enabledHydration = false

function ensureRenderer() {
  return renderer || (renderer = createRenderer<Node, Element>(rendererOptions))
}
```

`createRenderer`位于`@vue/runtime-core/renderer.ts`，调用了同文件的`baseCreateRenderer`，其代码如下：

```typescript
function baseCreateRenderer(
  options: RendererOptions,
  createHydrationFns?: typeof createHydrationFunctions
): any {
  //... 无关代码省略

  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
```

因为在`createApp`中只使用到了`render.createApp`，所以我们把无关代码省略，可以看到`render.createApp`是由`createAppAPI`生成的，代码位于`@vue/runtime-core/apiCreateApp.ts`第114行，其作用是返回一个`createApp`方法，用于生成一个`AppContext`和一个`App`，其作用相当于`Vue2`的`new Vue()`，代码如下：

```typescript
export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    // 确保rootProps只能是null或者Object
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null
    }

    const context = createAppContext()
    const installedPlugins = new Set()

    let isMounted = false

    const app: App = (context.app = {
      // ... app对象内容省略
    })

    return app
  }
}
```

## App的mount过程

由于在`@vue/runtime-dom/src/index.ts`的`createApp`函数中重写了`app.mount`方法，所以`App`的`mount`入口在这里：

```ts
// @vue/runtime-dom/src/index.ts 61行
app.mount = (containerOrSelector: Element | string): any => {
  // 如果是选择器，则返回对应的dom
  const container = normalizeContainer(containerOrSelector)
  if (!container) return
  
  // clear content before mounting
  container.innerHTML = ''

  const proxy = mount(container)
  
  container.removeAttribute('v-cloak')
  container.setAttribute('data-v-app', '')
  return proxy
}
```

主要做了以下的操作，将选择器转行成`DOM`，将`container`清空，调用`app`原来的`mount`方法，并对`DOM`的属性做了一些操作

`app`原来的`mount`方法位于`@vue/runtime-core/apiCreateApp.ts`的`createAppAPI`中，其主要内容为，将`App`组件内容生成`VNode`，将`vnode.appContext`设置上，调用`render(vnode, rootContainer)`渲染组件，将闭包里的`isMounted`设置成`true`，将`rootContainer`设置给`app._container`，将`vnode.component!.proxy`返回。

```ts
function createApp(rootComponent, rootProps = null) {
  // 其他内容省略
  const context = createAppContext()
  let isMounted = false

  const app: App = (context.app = {
    // ... 其他app对象内容省略
    mount(rootContainer: HostElement, isHydrate?: boolean): any {
      if (!isMounted) {
        const vnode = createVNode(
          rootComponent as ConcreteComponent,
          rootProps
        )
        // store app context on the root VNode.
        // this will be set on the root instance on initial mount.
        vnode.appContext = context

        render(vnode, rootContainer)

        isMounted = true
        app._container = rootContainer
        
        return vnode.component!.proxy
      }
      // else if 内容为开发环境报警
    },
  })
}
```

## VNode

### VNode的类型

常规的`VNode`包括`Text`、`Comment`、`Static`、`Fragment`这几种类型。

```typescript
// 所有VNode类型
export type VNodeTypes =
  | string
  | VNode
  | Component
  | typeof Text
  | typeof Static
  | typeof Comment
  | typeof Fragment
  | typeof TeleportImpl
  | typeof SuspenseImpl

export const Text = Symbol(__DEV__ ? 'Text' : undefined)  // 纯文本
export const Comment = Symbol(__DEV__ ? 'Comment' : undefined) // 注释类
export const Static = Symbol(__DEV__ ? 'Static' : undefined) // 静态html
export const Fragment = (Symbol(__DEV__ ? 'Fragment' : undefined) as any) as {
  __isFragment: true
  new (): {
    $props: VNodeProps
  }
}  // fragment html片段，根节点是多个节点
```

`VNode`的内容：

```typescript
const vnode: VNode = {
  __v_isVNode: true,
  [ReactiveFlags.SKIP]: true,
  type,
  props,
  key: props && normalizeKey(props),
  ref: props && normalizeRef(props),
  scopeId: currentScopeId,
  children: null,
  component: null,
  suspense: null,
  ssContent: null,
  ssFallback: null,
  dirs: null,
  transition: null,
  el: null,
  anchor: null,
  target: null,
  targetAnchor: null,
  staticCount: 0,
  shapeFlag,  // 用于
  patchFlag,
  dynamicProps,
  dynamicChildren: null,
  appContext: null
}
```

`createVNode`位于`@vue/runtime-core/vnode.ts`，在生产环境调用了第317行的`_createVNode`，其代码如下：

```typescript
function _createVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag: number = 0,
  dynamicProps: string[] | null = null,
  isBlockNode = false
): VNode {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment
  }

  if (isVNode(type)) {
    // createVNode receiving an existing vnode. This happens in cases like
    // <component :is="vnode"/>
    // #2078 make sure to merge refs during the clone instead of overwriting it
    const cloned = cloneVNode(type, props, true /* mergeRef: true */)
    if (children) {
      normalizeChildren(cloned, children)
    }
    return cloned
  }

  // class component normalization.
  if (isClassComponent(type)) {
    type = type.__vccOpts
  }

  // class & style normalization.
  if (props) {
    // for reactive or proxy objects, we need to clone it to enable mutation.
    if (isProxy(props) || InternalObjectKey in props) {
      props = extend({}, props)
    }
    let { class: klass, style } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
    if (isObject(style)) {
      // reactive state objects need to be cloned since they are likely to be
      // mutated
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style)
      }
      props.style = normalizeStyle(style)
    }
  }

  // encode the vnode type information into a bitmap
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : __FEATURE_SUSPENSE__ && isSuspense(type)
      ? ShapeFlags.SUSPENSE
      : isTeleport(type)
        ? ShapeFlags.TELEPORT
        : isObject(type)
          ? ShapeFlags.STATEFUL_COMPONENT
          : isFunction(type)
            ? ShapeFlags.FUNCTIONAL_COMPONENT
            : 0

  const vnode: VNode = {
    // ... 省略VNode内容
  }

  normalizeChildren(vnode, children)

  // normalize suspense children
  if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
    const { content, fallback } = normalizeSuspenseChildren(vnode)
    vnode.ssContent = content
    vnode.ssFallback = fallback
  }

  if (
    shouldTrack > 0 &&
    // avoid a block node from tracking itself
    !isBlockNode &&
    // has current parent block
    currentBlock &&
    // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (patchFlag > 0 || shapeFlag & ShapeFlags.COMPONENT) &&
    // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    patchFlag !== PatchFlags.HYDRATE_EVENTS
  ) {
    currentBlock.push(vnode)
  }

  return vnode
}
```

## Render

`app`的`mount`方法中的`render`由`createAppAPI`作为参数传入，来源于`@vue/runtime-core/renderer.ts`中的`baseCreateRenderer`方法定义：

```ts
const render: RootRenderFunction = (vnode, container) => {
  if (vnode == null) {
    if (container._vnode) {
      unmount(container._vnode, null, null, true)
    }
  } else {
    patch(container._vnode || null, vnode, container)
  }
  flushPostFlushCbs()  // TODO 待解析
  container._vnode = vnode
}
```

`render`方法主要有两个逻辑分支，如果`vnode`不为`null`时，为新建或者更新逻辑，调用`patch`方法；如果`vnode`为`null`，，并且`container._vnode`不为`null`，即`vnode`从有值变为`null`，调用`unmount`方法。

### patch

#### patch的类型

不同类型的元素或组件，有不同的patch策略

```typescript
export const enum PatchFlags {
  // 表明元素具有动态文本
  TEXT = 1,
  // 表明元素具有动态class绑定
  CLASS = 1 << 1, // 2
  // 表明元素具有动态样式style，编译器会将静态对象字符串编译为静态对象，并做变量提升优化
  // 例如：
  // style="color: red" 或 :style="{ color: 'red' }"
  // 将被编译为：
  // const style = { color: 'red' }
  // render() { return e('div', { style }) }
  STYLE = 1 << 2, // 4
  // 表明元素或者组件具有class/style以外的动态属性props
  // Can also be on a component that has any dynamic props (includes
  // class/style). when this flag is present, the vnode also has a dynamicProps
  // array that contains the keys of the props that may change so the runtime
  // can diff them faster (without having to worry about removed props)
  PROPS = 1 << 3, // 8
  // Indicates an element with props with dynamic keys. When keys change, a full
  // diff is always needed to remove the old key. This flag is mutually
  // exclusive with CLASS, STYLE and PROPS.
  FULL_PROPS = 1 << 4,

  // Indicates an element with event listeners (which need to be attached
  // during hydration)
  HYDRATE_EVENTS = 1 << 5,

  // Indicates a fragment whose children order doesn't change.
  STABLE_FRAGMENT = 1 << 6,

  // Indicates a fragment with keyed or partially keyed children
  KEYED_FRAGMENT = 1 << 7,

  // Indicates a fragment with unkeyed children.
  UNKEYED_FRAGMENT = 1 << 8,

  // Indicates an element that only needs non-props patching, e.g. ref or
  // directives (onVnodeXXX hooks). since every patched vnode checks for refs
  // and onVnodeXXX hooks, it simply marks the vnode so that a parent block
  // will track it.
  NEED_PATCH = 1 << 9,

  // Indicates a component with dynamic slots (e.g. slot that references a v-for
  // iterated value, or dynamic slot names).
  // Components with this flag are always force updated.
  DYNAMIC_SLOTS = 1 << 10,

  // SPECIAL FLAGS -------------------------------------------------------------

  // Special flags are negative integers. They are never matched against using
  // bitwise operators (bitwise matching should only happen in branches where
  // patchFlag > 0), and are mutually exclusive. When checking for a special
  // flag, simply check patchFlag === FLAG.

  // Indicates a hoisted static vnode. This is a hint for hydration to skip
  // the entire sub tree since static content never needs to be updated.
  HOISTED = -1,

  // A special flag that indicates that the diffing algorithm should bail out
  // of optimized mode. For example, on block fragments created by renderSlot()
  // when encountering non-compiler generated slots (i.e. manually written
  // render functions, which should always be fully diffed)
  // OR manually cloneVNodes
  BAIL = -2
}
```

`patch`方法位于同文件的452行：

```typescript
const patch: PatchFn = (
  n1, // prev vnode 
  n2, // current vnode 
  container,
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  isSVG = false,
  optimized = false
) => {
  // patching & not same type, unmount old tree
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1)
    unmount(n1, parentComponent, parentSuspense, true)
    n1 = null
  }

  if (n2.patchFlag === PatchFlags.BAIL) {
    optimized = false
    n2.dynamicChildren = null
  }

  const { type, ref, shapeFlag } = n2
  switch (type) {
    case Text:
      processText(n1, n2, container, anchor) // 纯文本
      break
    case Comment:
      processCommentNode(n1, n2, container, anchor)
      break
    case Static:
      if (n1 == null) {
        mountStaticNode(n2, container, anchor, isSVG)
      } else if (__DEV__) {
        patchStaticNode(n1, n2, container, isSVG)
      }
      break
    case Fragment:
      processFragment(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        optimized
      )
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) { // VNode 是普通标签
        processElement(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        )
      } else if (shapeFlag & ShapeFlags.COMPONENT) { // VNode 是组件
        processComponent(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        )
      } else if (shapeFlag & ShapeFlags.TELEPORT) {   
        ;(type as typeof TeleportImpl).process(
          n1 as TeleportVNode,
          n2 as TeleportVNode,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized,
          internals
        )
      } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
        ;(type as typeof SuspenseImpl).process(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized,
          internals
        )
      }
  }

  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentComponent, parentSuspense, n2)
  }
}
```

`patch`方法经过`swtich`语句调用了`processComponent`方法，其代码位于同文件的第1201行：

```typescript
const processComponent = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  optimized: boolean
) => {
  if (n1 == null) {
    if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
      (parentComponent!.ctx as KeepAliveContext).activate(
        n2,
        container,
        anchor,
        isSVG,
        optimized
      )
    } else {
      mountComponent(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        optimized
      )
    }
  } else {
    updateComponent(n1, n2, optimized)
  }
}
```

其主要有两个逻辑分支：旧的`VNode``n1`不为`null`时，调用更新组件的`updateComponent`方法；当`n1`为`null`时，又有两个子分支：新的`VNode``n1`为`keep-alive`的组件时，调用其`ctx`的`activate`方法，否则调用挂载组件的`mountComponent`方法。

我们先看挂载组件的`mountComponent`方法，其位于`processComponent`的下方：

```typescript
const mountComponent: MountComponentFn = (
  initialVNode, // 初始的VNode
  container,  // 挂载的容器
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  const instance: ComponentInternalInstance = (initialVNode.component = createComponentInstance(
    initialVNode,
    parentComponent,
    parentSuspense
  ))

  // inject renderer internals for keepAlive
  if (isKeepAlive(initialVNode)) {
    (instance.ctx as KeepAliveContext).renderer = internals
  }

  setupComponent(instance)

  // setup() is async. This component relies on async logic to be resolved
  // before proceeding
  if (__FEATURE_SUSPENSE__ && instance.asyncDep) {
    parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect)

    // Give it a placeholder if this is not hydration
    // TODO handle self-defined fallback
    if (!initialVNode.el) {
      const placeholder = (instance.subTree = createVNode(Comment))
      processCommentNode(null, placeholder, container!, anchor)
    }
    return
  }

  setupRenderEffect(
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  )
}
```

### create

首先调用`createComponentInstance`方法生成组件的实例，先看下组件实例的构成：

```typescript
const instance: ComponentInternalInstance = {
  uid: uid++,
  vnode,
  type,
  parent,
  appContext,
  root: null!, // to be immediately set
  next: null,
  subTree: null!, // will be set synchronously right after creation
  update: null!, // will be set synchronously right after creation
  render: null,
  proxy: null,
  exposed: null,
  withProxy: null,
  effects: null,
  provides: parent ? parent.provides : Object.create(appContext.provides),
  accessCache: null!,
  renderCache: [],

  // local resovled assets
  components: null,
  directives: null,

  // resolved props and emits options
  propsOptions: normalizePropsOptions(type, appContext),
  emitsOptions: normalizeEmitsOptions(type, appContext),

  // emit
  emit: null as any, // to be set immediately
  emitted: null,

  // state
  ctx: EMPTY_OBJ,
  data: EMPTY_OBJ,
  props: EMPTY_OBJ,
  attrs: EMPTY_OBJ,
  slots: EMPTY_OBJ,
  refs: EMPTY_OBJ,
  setupState: EMPTY_OBJ,
  setupContext: null,

  // suspense related
  suspense,
  suspenseId: suspense ? suspense.pendingId : 0,
  asyncDep: null,
  asyncResolved: false,

  // lifecycle hooks
  // not using enums here because it results in computed properties
  isMounted: false,
  isUnmounted: false,
  isDeactivated: false,
  bc: null,
  c: null,
  bm: null,
  m: null,
  bu: null,
  u: null,
  um: null,
  bum: null,
  da: null,
  a: null,
  rtg: null,
  rtc: null,
  ec: null
}
```

`createComponentInstance`方法的代码位于`@vue/runtime-core/component.ts`的第401行：

```typescript
export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null
) {
  const type = vnode.type as ConcreteComponent
  // inherit parent app context - or - if root, adopt from root vnode
  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext

  const instance: ComponentInternalInstance = {
    // 省略componentInstance内容
  }

  if (__DEV__) { // TODO
    instance.ctx = createRenderContext(instance)
  } else {
    instance.ctx = { _: instance }
  }

  instance.root = parent ? parent.root : instance
  instance.emit = emit.bind(null, instance)

  return instance
}
```

### setup

`setup`主要包括`setupComponent`和`setupRenderEffect`两个过程。

`setupComponent`方法代码位于`@vue/runtime-core/component.ts`的第516行：

```typescript
export let isInSSRComponentSetup = false // 表明组件是否服务端渲染的变量

export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  isInSSRComponentSetup = isSSR

  const { props, children, shapeFlag } = instance.vnode
  const isStateful = shapeFlag & ShapeFlags.STATEFUL_COMPONENT
  initProps(instance, props, isStateful, isSSR)
  initSlots(instance, children)

  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
  isInSSRComponentSetup = false
  return setupResult
}
```

内部主要做了初始化属性`initProps`和初始化插槽`initSlots`这两件事儿，并且带状态`isStateful`的组件，会执行`setupStatefulComponent`方法获取`setupResult`。最后将标识组件是否在`SSR`环境下执行`setup`的标识置为`false`，并返回`setupResult`。

`initProps`方法位于`@vue/runtime-core/componentProps.ts`的第114行：

```ts
export function initProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  isStateful: number, // result of bitwise flag comparison
  isSSR = false
) {
  const props: Data = {}
  const attrs: Data = {}
  def(attrs, InternalObjectKey, 1)
  setFullProps(instance, rawProps, props, attrs)
  // validation
  if (__DEV__) {
    validateProps(props, instance)
  }

  if (isStateful) {
    // stateful
    instance.props = isSSR ? props : shallowReactive(props)
  } else {
    if (!instance.type.props) {
      // functional w/ optional props, props === attrs
      instance.props = attrs
    } else {
      // functional w/ declared props
      instance.props = props
    }
  }
  instance.attrs = attrs
}
```

`setFullProps`位于同文件：

```ts
function setFullProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  props: Data,
  attrs: Data
) {
  const [options, needCastKeys] = instance.propsOptions
  if (rawProps) {
    for (const key in rawProps) {
      const value = rawProps[key]
      // key, ref are reserved and never passed down
      if (isReservedProp(key)) {
        continue
      }
      // prop option names are camelized during normalization, so to support
      // kebab -> camel conversion here we need to camelize the key.
      let camelKey
      if (options && hasOwn(options, (camelKey = camelize(key)))) {
        props[camelKey] = value
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        // Any non-declared (either as a prop or an emitted event) props are put
        // into a separate `attrs` object for spreading. Make sure to preserve
        // original key casing
        attrs[key] = value
      }
    }
  }

  if (needCastKeys) {
    const rawCurrentProps = toRaw(props)
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i]
      props[key] = resolvePropValue(
        options!,
        rawCurrentProps,
        key,
        rawCurrentProps[key],
        instance
      )
    }
  }
}
```

`shallowReactive`为`Vue3`暴露的响应式核心`API`之一，用于创建一个不会深度嵌套的响应式`proxy`。调用了`Reactivity`部分的核心代码`createReactiveObject`，通过`new Proxy`的方式来响应`data`的变化。

### update

`setupRenderEffect`主要设置了实例的`update`方法：

```ts
const setupRenderEffect: SetupRenderEffectFn = (
  instance,
  initialVNode,
  container,
  anchor,
  parentSuspense,
  isSVG,
  optimized
) => {
  // create reactive effect for rendering
  instance.update = effect(function componentEffect() {
    if (!instance.isMounted) {
      let vnodeHook: VNodeHook | null | undefined
      const { el, props } = initialVNode
      const { bm, m, parent } = instance

      // beforeMount hook
      if (bm) {
        invokeArrayFns(bm)
      }
      // onVnodeBeforeMount
      if ((vnodeHook = props && props.onVnodeBeforeMount)) {
        invokeVNodeHook(vnodeHook, parent, initialVNode)
      }

      
      const subTree = (instance.subTree = renderComponentRoot(instance))
      if (__DEV__) {
        endMeasure(instance, `render`)
      }

      if (el && hydrateNode) {
        if (__DEV__) {
          startMeasure(instance, `hydrate`)
        }
        // vnode has adopted host node - perform hydration instead of mount.
        hydrateNode(
          initialVNode.el as Node,
          subTree,
          instance,
          parentSuspense
        )
        if (__DEV__) {
          endMeasure(instance, `hydrate`)
        }
      } else {
        if (__DEV__) {
          startMeasure(instance, `patch`)
        }
        patch(
          null,
          subTree,
          container,
          anchor,
          instance,
          parentSuspense,
          isSVG
        )
        if (__DEV__) {
          endMeasure(instance, `patch`)
        }
        initialVNode.el = subTree.el
      }
      // mounted hook
      if (m) {
        queuePostRenderEffect(m, parentSuspense)
      }
      // onVnodeMounted
      if ((vnodeHook = props && props.onVnodeMounted)) {
        queuePostRenderEffect(() => {
          invokeVNodeHook(vnodeHook!, parent, initialVNode)
        }, parentSuspense)
      }
      // activated hook for keep-alive roots.
      // #1742 activated hook must be accessed after first render
      // since the hook may be injected by a child keep-alive
      const { a } = instance
      if (
        a &&
        initialVNode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
      ) {
        queuePostRenderEffect(a, parentSuspense)
      }
      instance.isMounted = true
    } else {
      // updateComponent
      // This is triggered by mutation of component's own state (next: null)
      // OR parent calling processComponent (next: VNode)
      let { next, bu, u, parent, vnode } = instance
      let originNext = next
      let vnodeHook: VNodeHook | null | undefined
      if (__DEV__) {
        pushWarningContext(next || instance.vnode)
      }

      if (next) {
        updateComponentPreRender(instance, next, optimized)
      } else {
        next = vnode
      }
      next.el = vnode.el

      // beforeUpdate hook
      if (bu) {
        invokeArrayFns(bu)
      }
      // onVnodeBeforeUpdate
      if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
        invokeVNodeHook(vnodeHook, parent, next, vnode)
      }

      
      const nextTree = renderComponentRoot(instance)
      if (__DEV__) {
        endMeasure(instance, `render`)
      }
      const prevTree = instance.subTree
      instance.subTree = nextTree

      // reset refs
      // only needed if previous patch had refs
      if (instance.refs !== EMPTY_OBJ) {
        instance.refs = {}
      }
      if (__DEV__) {
        startMeasure(instance, `patch`)
      }
      patch(
        prevTree,
        nextTree,
        // parent may have changed if it's in a teleport
        hostParentNode(prevTree.el!)!,
        // anchor may have changed if it's in a fragment
        getNextHostNode(prevTree),
        instance,
        parentSuspense,
        isSVG
      )
      
      next.el = nextTree.el
      if (originNext === null) {
        // self-triggered update. In case of HOC, update parent component
        // vnode el. HOC is indicated by parent instance's subTree pointing
        // to child component's vnode
        updateHOCHostEl(instance, nextTree.el)
      }
      // updated hook
      if (u) {
        queuePostRenderEffect(u, parentSuspense)
      }
      // onVnodeUpdated
      if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
        queuePostRenderEffect(() => {
          invokeVNodeHook(vnodeHook!, parent, next!, vnode)
        }, parentSuspense)
      }
    }
  }, prodEffectOptions)
}
```

