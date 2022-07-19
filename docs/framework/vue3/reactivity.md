# 数据响应式系统

`Vue3`的数据响应式系统主要由`@vue/reactivity`承担，主要包括副作用函数`effect`，依赖收集`track`和触发更新`trigger`这三部分。




`Composition API`实现响应式的关键`API`为包装基本类型的`ref`和引用类型的`reactive`。

## reactive

仅对简单的对象的`reactive`过程做考虑的话，代码如下：

```ts
const proxyMap = new WeakMap<Target, any>()

export function reactive(target: object) {
    const proxy = new Proxy(target, handlers)

    proxyMap.set(target, proxy)

    return proxy
}
```

逻辑很简单，就是通过`Proxy`返回目标的对象的代理，并将目标的对象和代理的映射关系缓存到一个`proxyMap`中，其代理的`handlers`内容如下：

```ts
const handlers = {
    get(target: Target, key: string | symbol, receiver: object){
        const res = Reflect.get(target, key, receiver)

        track(target, TrackOpTypes.GET, key)

        return res
    },
    set(target: object, key: string | symbol, value: unknown, receiver: object): boolean{
        const oldValue = (target as any)[key]
        const hadKey = hasOwn(target, key)
        const result = Reflect.set(target, key, value, receiver)
        
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, TriggerOpTypes.ADD, key, value)
            } else if (hasChanged(value, oldValue)) {
                trigger(target, TriggerOpTypes.SET, key, value)
            }
        }

        return result
    }
}
```

我们先只关注基本的`get`和`set` `ProxyHandler`，其逻辑也比较简单。其中`get` `ProxyHandler`除了调用默认的`Reflect API`，就是调用了`track`方法。类似的，`set` `ProxyHandler`除了调用默认的`Reflect API`以外，根据目标对象`target`中是否有要`set`的`key`，没有时调用了`TriggerOpTypes.ADD`类型的`trigger`方法，已经有`key`，并且值发生了改变时，调用了`TriggerOpTypes.SET`类型的`trigger`方法。

## 依赖收集与触发

`Vue3`中的依赖以副作用函数`effect`的方式体现。副作用函数就是指会产生副作用的函数，就是该函数的执行会直接或者间接影响其他的函数的执行，例如更新`DOM`，修改作用域以外的变量等。

`track`和`trigger`主要负责依赖的收集(追踪)和触发，类似于`Vue2`中的`Dep`，分别在响应式数据`get`和`set`操作中被执行。用于将响应式数据和`effect`关联起来。

这两个方法位于`@vue/reactivity/src/effect.ts`文件中，在解析这两个方法之前，需要先对这两个方法依赖的几个局部变量做下说明：

```ts
type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<any, Dep>

const targetMap = new WeakMap<any, KeyToDepMap>()
let activeEffect: ReactiveEffect | undefined
let shouldTrack = true
const trackStack: boolean[] = []
```

`targetMap`是一个`WeakMap`，其`key`目标对象`target`，其`value`是一个以目标对象`target`的`key`为`key`、其依赖的集合为`value`的`Map`，所以`targetMap`是一个所有目标对象`target`的依赖集合的映射总集合。

`activeEffect`为当前激活状态的`effect`，具体在[effect](#effect)分析

`shouldTrack`用于表示是否需要开始依赖收集，`trackStack`用于标识当前依赖收集的深度。主要用于`effect`方法中。

### track

精简后代码如下：

```typescript
export function track(target: Target, type: TrackOpTypes, key: unknown) {
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

从上面代码可以知道，`track`的逻辑非常简单，就是向`targetMap`的具体`dep`中加入当前`activeEffect`，并像`activeEffect`的`deps`中加入对于的`dep`。

### trigger

```typescript
export function trigger(
    target: object,
    type: TriggerOpTypes,
    key?: unknown,
    newValue?: unknown
) {
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        // never been tracked
        return
    }

    // 需要触发的effect集合，通过add向其中添加内容
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

    // 不同的情况下，出发depsMap里的不同内容
    if (type === TriggerOpTypes.CLEAR) {
        depsMap.forEach(add)
    } else if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= (newValue as number)) {
                add(dep)
            }
        })
    } else {
        if (key !== void 0) {
            add(depsMap.get(key))
        }

        switch (type) {
            case TriggerOpTypes.ADD:
                if (!isArray(target)) {
                    add(depsMap.get(ITERATE_KEY))
                    if (isMap(target)) {
                        add(depsMap.get(MAP_KEY_ITERATE_KEY))
                    }
                } else if (isIntegerKey(key)) {
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

    // 触发effect
    const run = (effect: ReactiveEffect) => {
        // 异步更新队列
        if (effect.options.scheduler) {
            effect.options.scheduler(effect)
        } else { // 立即更新
            effect()
        }
    }

    effects.forEach(run)
}
```

`trigger`的主要逻辑为在`targetMap`中去除对应的`depsMap`，然后根据不同的数据类型，不同的`TriggerOpTypes`，触发对应的`effect`。更新方式有异步更新队列和立即更新两种。

### effect

`effect`方法返回`ReactiveEffect`函数，作用相当于`vue2`中的观察者`Watcher`。简化后代码如下：

```typescript
export function pauseTracking() {
    trackStack.push(shouldTrack)
    shouldTrack = false
}

export function enableTracking() {
    trackStack.push(shouldTrack)
    shouldTrack = true
}

export function resetTracking() {
    const last = trackStack.pop()
    shouldTrack = last === undefined ? true : last
}

const effectStack: ReactiveEffect[] = []
let uid = 0

function createReactiveEffect<T = any>(
    fn: () => T,
    options: ReactiveEffectOptions
): ReactiveEffect<T> {
    const effect = function reactiveEffect(): unknown {
        if (!effect.active) {
            return options.scheduler ? undefined : fn()
        }
        if (!effectStack.includes(effect)) {
            cleanup(effect)
            try {
                enableTracking()
                effectStack.push(effect)
                activeEffect = effect
                return fn()
            } finally {
                effectStack.pop()
                resetTracking()
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    } as ReactiveEffect
    effect.id = uid++
    effect.allowRecurse = !!options.allowRecurse
    effect._isEffect = true
    effect.active = true
    effect.raw = fn
    effect.deps = [] // 与该副作用函数存在联系的依赖的集合，在该effect执行时，会先将对应的deps清空，即cleanup函数的作用，以便effect执行后，在track过程中重新建立联系，从而避免副作用函数产生遗留
    effect.options = options
    return effect
}

function cleanup(effect: ReactiveEffect) {
    const { deps } = effect
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect)
        }
        deps.length = 0
    }
}

export function isEffect(fn: any): fn is ReactiveEffect {
    return fn && fn._isEffect === true
}

export function effect<T = any>(
    fn: () => T,
    options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
    if (isEffect(fn)) {
        fn = fn.raw
    }
    const effect = createReactiveEffect(fn, options)
    if (!options.lazy) {
        effect()
    }
    return effect
}
```

### 异步更新队列

## 原来的分析

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

`mutableHandlers`的`get``ProxyHandler`定义位于同文件的第35行，调用了同文件的第72行的`createGetter`。

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