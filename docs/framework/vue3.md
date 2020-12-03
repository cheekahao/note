# Vue3入口-createApp

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

# App的mount过程

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

