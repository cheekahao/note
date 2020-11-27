# Vue3入口

相比较于`Vue 2`通过构造函数`new Vue()`的方式创建根`Vue`实例，`Vue 3`改为了通过调用 `createApp`返回一个应用实例：

```js
import { createApp } from 'vue'

const app = createApp({})
```

`createApp`源码位于`@vue/runtime-dom/src/index.ts`：

```typescript
export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)

  if (__DEV__) {
    injectNativeTagCheck(app)
  }

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

`createRenderer`位于`@vue/runtime-core/renderer.ts`

```typescript

```