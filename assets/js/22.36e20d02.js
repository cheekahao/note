(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{290:function(t,s,a){"use strict";a.r(s);var n=a(10),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"react"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#react"}},[t._v("#")]),t._v(" React")]),t._v(" "),s("h2",{attrs:{id:"hook"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hook"}},[t._v("#")]),t._v(" Hook")]),t._v(" "),s("p",[s("code",[t._v("Hook")]),t._v("是"),s("code",[t._v("React")]),t._v("16.8的新增特性。可以在不编写"),s("code",[t._v("class")]),t._v("的情况下使用"),s("code",[t._v("state")]),t._v("以及其他的"),s("code",[t._v("React")]),t._v("特性。")]),t._v(" "),s("p",[s("code",[t._v("Hook")]),t._v("为已知的"),s("code",[t._v("React")]),t._v("概念提供了更直接的"),s("code",[t._v("API")]),t._v("："),s("code",[t._v("props")]),t._v("， "),s("code",[t._v("state")]),t._v("，"),s("code",[t._v("context")]),t._v("，"),s("code",[t._v("refs")]),t._v("以及生命周期。")]),t._v(" "),s("p",[t._v("可以使用"),s("code",[t._v("Hook")]),t._v("从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。"),s("code",[t._v("Hook")]),t._v("可以在无需修改组件结构的情况下复用状态逻辑。这使得在组件间或社区内共享"),s("code",[t._v("Hook")]),t._v("变得更便捷。")]),t._v(" "),s("ul",[s("li",[t._v("利于组件预编译，更易于优化")]),t._v(" "),s("li",[s("code",[t._v("class")]),t._v("组件会无意中鼓励开发者使用一些让优化措施无效的方案")]),t._v(" "),s("li",[s("code",[t._v("class")]),t._v("不能很好的压缩，并且会使热重载出现不稳定的情况")])]),t._v(" "),s("p",[s("code",[t._v("Hook")]),t._v("是一些可以让你在函数组件里“钩入”"),s("code",[t._v("React state")]),t._v("及生命周期等特性的函数。")]),t._v(" "),s("h3",{attrs:{id:"state-hook"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#state-hook"}},[t._v("#")]),t._v(" "),s("code",[t._v("State Hook")])]),t._v(" "),s("p",[s("code",[t._v("useState")]),t._v("通过在函数组件里调用它来给组件添加一些内部 "),s("code",[t._v("state")]),t._v("。"),s("code",[t._v("React")]),t._v("会在重复渲染时保留这个"),s("code",[t._v("state")]),t._v("。")]),t._v(" "),s("p",[t._v("不同于class组件"),s("code",[t._v("state")]),t._v("必须为一个对象，"),s("code",[t._v("useState")]),t._v("可以接受一个基本类型，也可以接受引用类型。")]),t._v(" "),s("p",[t._v("返回一对值：当前状态"),s("code",[t._v("state")]),t._v("和一个可以更新它的函数"),s("code",[t._v("setState")]),t._v("，可以在事件处理函数中或其他一些地方调用这个函数。")]),t._v(" "),s("p",[s("code",[t._v("useState")]),t._v("类似于"),s("code",[t._v("class")]),t._v("组件的"),s("code",[t._v("this.setState")]),t._v("，但是它不会把新的"),s("code",[t._v("state")]),t._v("和旧的"),s("code",[t._v("state")]),t._v("进行合并。")]),t._v(" "),s("p",[s("code",[t._v("state")]),t._v("不一定要是一个对象，且这个初始"),s("code",[t._v("state")]),t._v("参数只有在第一次渲染时会被用到")]),t._v(" "),s("p",[t._v("具体示例如下：")]),t._v(" "),s("div",{staticClass:"language-jsx line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-jsx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" React"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" useState "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'react'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("Example")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 声明一个叫 “count” 的 state 变量。")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("count"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" setCount"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("useState")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("div")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("\n      ")]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("p")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("You clicked ")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("count"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v(" times")]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("p")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("\n      ")]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("button")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("onClick")]),s("span",{pre:!0,attrs:{class:"token script language-javascript"}},[s("span",{pre:!0,attrs:{class:"token script-punctuation punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setCount")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("count "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("\n        Click me\n      ")]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("button")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("\n    ")]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("div")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br"),s("span",{staticClass:"line-number"},[t._v("10")]),s("br"),s("span",{staticClass:"line-number"},[t._v("11")]),s("br"),s("span",{staticClass:"line-number"},[t._v("12")]),s("br"),s("span",{staticClass:"line-number"},[t._v("13")]),s("br"),s("span",{staticClass:"line-number"},[t._v("14")]),s("br"),s("span",{staticClass:"line-number"},[t._v("15")]),s("br")])]),s("p",[s("code",[t._v("React")]),t._v("假设当你多次调用"),s("code",[t._v("useState")]),t._v("的时候，你能保证每次渲染时它们的调用顺序是不变的")]),t._v(" "),s("h3",{attrs:{id:"effect-hook"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#effect-hook"}},[t._v("#")]),t._v(" "),s("code",[t._v("Effect Hook")])]),t._v(" "),s("p",[s("code",[t._v("Effect Hook")]),t._v("可以让你在函数组件中执行副作用操作，类似于"),s("code",[t._v("componentDidMount")]),t._v("、"),s("code",[t._v("componentDidUpdate")]),t._v("、"),s("code",[t._v("componentWillUnmount")]),t._v("这三个生命周期。")]),t._v(" "),s("p",[s("code",[t._v("Effect Hook")]),t._v("会在每次渲染后都执行。但是与"),s("code",[t._v("componentDidMount")]),t._v("或"),s("code",[t._v("componentDidUpdate")]),t._v("不同，使用"),s("code",[t._v("useEffect")]),t._v("调度的"),s("code",[t._v("effect")]),t._v("不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。如果需要阻塞视图更新，可以使用"),s("code",[t._v("useLayoutEffect")]),t._v(" Hook")]),t._v(" "),s("p",[t._v("在"),s("code",[t._v("React")]),t._v("组件中有两种常见副作用操作：需要清除的和不需要清除的。需要清除的"),s("code",[t._v("effect")]),t._v("可以在"),s("code",[t._v("useEffect")]),t._v("中返回一个函数，"),s("code",[t._v("React")]),t._v("将会在执行清除操作时调用它。")]),t._v(" "),s("p",[s("code",[t._v("React")]),t._v("会在执行当前"),s("code",[t._v("effect")]),t._v("之前对上一个"),s("code",[t._v("effect")]),t._v("进行清除。")]),t._v(" "),s("p",[t._v("如果某些特定值在两次重渲染之间没有发生变化，可以通过传递数组作为"),s("code",[t._v("useEffect")]),t._v("的第二个可选参数，通知 React 跳过对 effect 的调用。")]),t._v(" "),s("p",[t._v("如果想执行只运行一次的"),s("code",[t._v("effect")]),t._v("（仅在组件挂载和卸载时执行），可以传递一个空数组"),s("code",[t._v("[]")]),t._v("作为第二个参数。")]),t._v(" "),s("p",[t._v("具体见下例：")]),t._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" React"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" useState"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" useEffect "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'react'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("FriendStatus")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("props")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("count"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" setCount"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("useState")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("useEffect")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    document"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("title "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token template-string"}},[s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("You clicked ")]),s("span",{pre:!0,attrs:{class:"token interpolation"}},[s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("count"),s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v(" times")]),s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("count"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("isOnline"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" setIsOnline"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("useState")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("useEffect")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("handleStatusChange")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("status")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setIsOnline")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("status"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("isOnline"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    ChatAPI"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("subscribeToFriendStatus")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("props"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("friend"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" handleStatusChange"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 清除副作用")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("cleanup")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      ChatAPI"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("unsubscribeFromFriendStatus")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("props"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("friend"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" handleStatusChange"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("props"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("friend"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 仅在 props.friend.id 发生变化时，重新订阅")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("isOnline "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Loading...'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" isOnline "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Online'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Offline'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br"),s("span",{staticClass:"line-number"},[t._v("10")]),s("br"),s("span",{staticClass:"line-number"},[t._v("11")]),s("br"),s("span",{staticClass:"line-number"},[t._v("12")]),s("br"),s("span",{staticClass:"line-number"},[t._v("13")]),s("br"),s("span",{staticClass:"line-number"},[t._v("14")]),s("br"),s("span",{staticClass:"line-number"},[t._v("15")]),s("br"),s("span",{staticClass:"line-number"},[t._v("16")]),s("br"),s("span",{staticClass:"line-number"},[t._v("17")]),s("br"),s("span",{staticClass:"line-number"},[t._v("18")]),s("br"),s("span",{staticClass:"line-number"},[t._v("19")]),s("br"),s("span",{staticClass:"line-number"},[t._v("20")]),s("br"),s("span",{staticClass:"line-number"},[t._v("21")]),s("br"),s("span",{staticClass:"line-number"},[t._v("22")]),s("br"),s("span",{staticClass:"line-number"},[t._v("23")]),s("br"),s("span",{staticClass:"line-number"},[t._v("24")]),s("br"),s("span",{staticClass:"line-number"},[t._v("25")]),s("br")])]),s("h3",{attrs:{id:"hook规则"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hook规则"}},[t._v("#")]),t._v(" "),s("code",[t._v("Hook")]),t._v("规则")]),t._v(" "),s("p",[t._v("Hook 就是"),s("code",[t._v("JavaScript")]),t._v("函数，但是要注意两点规则：")]),t._v(" "),s("ul",[s("li",[s("strong",[t._v("只能在函数最外层调用"),s("code",[t._v("Hook")])]),t._v("，不能在循环、条件判断或者子函数中调用。这样能确保"),s("code",[t._v("Hook")]),t._v("在每一次渲染中都按照同样的顺序被调用。让"),s("code",[t._v("React")]),t._v("能够在多次的"),s("code",[t._v("useState")]),t._v("和"),s("code",[t._v("useEffect")]),t._v("调用之间保持"),s("code",[t._v("hook")]),t._v("状态的正确")]),t._v(" "),s("li",[s("strong",[t._v("只能在"),s("code",[t._v("React")]),t._v("的函数组件中调用"),s("code",[t._v("Hook")])]),t._v("，不要在其他 "),s("code",[t._v("JavaScript")]),t._v("函数中调用。另外自定义的"),s("code",[t._v("Hook")]),t._v("中也可以调用")])]),t._v(" "),s("p",[s("code",[t._v("React")]),t._v("靠的是"),s("code",[t._v("Hook")]),t._v("调用的顺序来确定哪个"),s("code",[t._v("state")]),t._v("对应哪个"),s("code",[t._v("useState")])]),t._v(" "),s("h3",{attrs:{id:"其他hook"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#其他hook"}},[t._v("#")]),t._v(" 其他"),s("code",[t._v("Hook")])]),t._v(" "),s("p",[s("code",[t._v("useContext")]),t._v("接收一个"),s("code",[t._v("context")]),t._v("对象（"),s("code",[t._v("React.createContext")]),t._v("的返回值）并返回该"),s("code",[t._v("context")]),t._v("的当前值。")]),t._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" value "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("useContext")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("MyContext"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("p",[s("code",[t._v("useReducer")]),t._v("，"),s("code",[t._v("useState")]),t._v("的替代方案。接收一个形如"),s("code",[t._v("(state, action) => newState")]),t._v("的"),s("code",[t._v("reducer")]),t._v("，并返回当前的"),s("code",[t._v("state")]),t._v(" 以及与其配套的"),s("code",[t._v("dispatch")]),t._v("方法。")]),t._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("state"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" dispatch"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("useReducer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("reducer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" initialArg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" init"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("p",[s("code",[t._v("useLayoutEffect")]),t._v("其函数签名与"),s("code",[t._v("useEffect")]),t._v("相同，但它会在所有的"),s("code",[t._v("DOM")]),t._v("变更之后同步调用"),s("code",[t._v("effect")]),t._v("，会阻塞视图更新")]),t._v(" "),s("h3",{attrs:{id:"自定义hook"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#自定义hook"}},[t._v("#")]),t._v(" 自定义"),s("code",[t._v("Hook")])]),t._v(" "),s("p",[t._v("自定义"),s("code",[t._v("Hook")]),t._v("是一个函数，其名称以"),s("code",[t._v("use")]),t._v("开头，函数内部可以调用其他的"),s("code",[t._v("Hook")]),t._v("。")]),t._v(" "),s("h2",{attrs:{id:"react的生命周期"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#react的生命周期"}},[t._v("#")]),t._v(" "),s("code",[t._v("React")]),t._v("的生命周期")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("componentDidMount")]),t._v("，组件第一次被渲染到"),s("code",[t._v("DOM")]),t._v("中的时候")]),t._v(" "),s("li",[s("code",[t._v("componentWillUnmount")]),t._v("，组件被删除的时候")])]),t._v(" "),s("p",[t._v("当组件实例被创建并插入"),s("code",[t._v("DOM")]),t._v("中时(挂载)，其生命周期调用顺序如下：")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("constructor()")])]),t._v(" "),s("li",[s("code",[t._v("static getDerivedStateFromProps()")])]),t._v(" "),s("li",[s("code",[t._v("render()")])]),t._v(" "),s("li",[s("code",[t._v("componentDidMount()")])])]),t._v(" "),s("p",[t._v("当组件的"),s("code",[t._v("props")]),t._v("或"),s("code",[t._v("state")]),t._v("发生变化时会触发更新。组件更新的生命周期调用顺序如下：")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("static getDerivedStateFromProps()")])]),t._v(" "),s("li",[s("code",[t._v("shouldComponentUpdate()")])]),t._v(" "),s("li",[s("code",[t._v("render()")])]),t._v(" "),s("li",[s("code",[t._v("getSnapshotBeforeUpdate()")])]),t._v(" "),s("li",[s("code",[t._v("componentDidUpdate()")])])]),t._v(" "),s("p",[t._v("当组件从"),s("code",[t._v("DOM")]),t._v("中移除(卸载)时会调用如下方法：")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("componentWillUnmount()")])])]),t._v(" "),s("p",[t._v("错误处理，当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("static getDerivedStateFromError()")])]),t._v(" "),s("li",[s("code",[t._v("componentDidCatch()")])])]),t._v(" "),s("h2",{attrs:{id:"fiber"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#fiber"}},[t._v("#")]),t._v(" Fiber")])])}),[],!1,null,null,null);s.default=e.exports}}]);