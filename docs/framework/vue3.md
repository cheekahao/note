# Vue3

## Vue3入口-createApp

相比较于`Vue 2`通过构造函数`new Vue()`的方式创建根`Vue`实例，`Vue 3`改为了通过调用 `createApp`返回一个应用实例：

```js
import { createApp } from 'vue'

const app = createApp({})
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
export const Text = Symbol(__DEV__ ? 'Text' : undefined)
export const Comment = Symbol(__DEV__ ? 'Comment' : undefined)
export const Static = Symbol(__DEV__ ? 'Static' : undefined)
export const Fragment = (Symbol(__DEV__ ? 'Fragment' : undefined) as any) as {
  __isFragment: true
  new (): {
    $props: VNodeProps
  }
}
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
  shapeFlag,
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
      processText(n1, n2, container, anchor)
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
      if (shapeFlag & ShapeFlags.ELEMENT) {
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
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
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