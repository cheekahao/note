# CSS

## `flex`布局

用`flex`布局实现垂直水平居中：

```css
{
    display: flex;
    justify-content: center;
    align-items: center
}
```

`flex`的核心的概念就是**容器**和**轴**。容器包括外层的**父容器**和内层的**子容器**，轴包括**主轴**和**交叉轴**。flex 布局涉及到 12 个 CSS 属性（不含 display: flex）。

### 容器

容器具有这样的特点：父容器可以统一设置子容器的排列方式，子容器也可以单独设置自身的排列方式，如果两者同时设置，以子容器的设置为准。

#### 父容器

```css
.parent{
    display: flex;
    /*
    * justify-content用于定义如何沿着主轴方向排列子容器
    * 可选值：
    * flex-start：起始端对齐
    * flex-end：末尾段对齐
    * center：居中对齐
    * space-around：子容器沿主轴均匀分布，位于首尾两端的子容器到父容器的距离是子容器间距的一半
    * space-between：子容器沿主轴均匀分布，位于首尾两端的子容器与父容器相切
    */
    justify-content: flex-start; 
    /*
    * align-items用于定义如何沿着交叉轴方向分配子容器的间距
    * 可选值：
    * flex-start：起始端对齐
    * flex-end：末尾段对齐
    * center：居中对齐
    * baseline：基线对齐，这里的baseline默认是指首行文字，即first baseline，所有子容器向基线对齐，交叉轴起点到元素基线距离最大的子容器将会与交叉轴起始端相切以确定基线
    * stretch：子容器沿交叉轴方向的尺寸拉伸至与父容器一致。
    */
    align-items: flex-start;
}
```

#### 子容器

```css
.children{
    /*设置为flex之后，将自动填充剩余空间，伸缩比例由 flex 属性确定*/
    display: flex;
    /*
    * flex的值可以是无单位数字（如：1, 2, 3），也可是有单位数字（如：15px，30px，60px），或 none 关键字。
    * flex 是多个属性的缩写，允许 1 - 3 个值连用
    */
    flex: 1;
    /*
    * 单独设置子容器如何沿交叉轴排列
    * 可选值与父容器align-items相同
    */
    align-self：flex-start;
}

```

### 轴

**轴**包括**主轴**和**交叉轴**，`justify-content`属性决定子容器沿主轴的排列方式，`align-items`属性决定子容器沿着交叉轴的排列方式。`flex-direction`属性决定主轴的方向，交叉轴的方向由主轴确定。

```css
.parent{
    display: flex;
    justify-content: flex-start; 
    align-items: flex-start;
    /*
    * 可选值：
    * row：向右
    * column：向下
    * row-reverse：向左
    * column-reverse: 向上
    */
    flex-direction: row;
}
```

### 进阶概念

#### 父容器

```css
.parent{
    display: flex;
    justify-content: flex-start; 
    align-items: flex-start;
    flex-direction: row;
    /*
    * 设置换行方式，决定子容器是否换行排列，不但可以顺序换行而且支持逆序换行。
    * 可选值：
    * nowrap：不换行
    * wrap：换行
    * wrap-reverse：逆序换行
    */
    flex-wrap: nowrap;
    /*
    * 多行沿交叉轴对齐,当子容器多行排列时，设置行与行之间的对齐方式。
    */
    align-content：flex-start;
}
```

轴向与换行组合设置：flex-flow

#### 子容器

设置基准大小：flex-basis

设置扩展比例：flex-grow

设置收缩比例：flex-shrink

设置排列顺序：order

## BFC

**文档流**分为定位流、浮动流和普通流三种。

`FC`是`formatting context`的首字母缩写，即格式化上下文，是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局以及和其他元素之间的关系和作用。

常见的FC有`BFC`、`IFC`（行级格式化上下文），还有`GFC`（网格布局格式化上下文）和`FFC`（自适应格式化上下文）

`BFC`(`Block formatting context`)是块级格式化上下文，是一个独立的渲染区域，只有`Block-level box`参与， 它规定了内部的`Block-level Box`如何布局，并且与这个区域外部毫不相干。

`BFC`可以简单的理解为某个元素的一个`CSS`属性，只不过这个属性不能被开发者显式的修改，拥有这个属性的元素对内部元素和外部元素会表现出一些特性，这就是`BFC`。

### 触发条件：

1. 根元素，即`HTML`元素
2. `float`的值不为`none`
3. `overflow`的值不为`visible`
4. `display`的值为`inline-block`、`table-cell`、`table-caption`
5. `position`的值为`absolute`或`fixed`

### BFC布局规则：
1. 内部的`Box`会在垂直方向，一个接一个地放置。
2. `Box`垂直方向的距离由`margin`决定，**属于同一个BFC的两个相邻Box的margin会发生重叠**，所以要解决`margin`会发生重叠的问题就要把它用不同的`BFC`分隔开
3. 每个元素的`margin box`的左边，与包含块`border box`的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4. `BFC`的区域不会与`float box`重叠。
5. `BFC`就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6. 计算`BFC`的高度时，浮动元素也参与计算

### BFC有哪些作用：
1. 自适应两栏布局
2. 可以阻止元素被浮动元素覆盖
3. 可以包含浮动元素——清除内部浮动
4. 分属于不同的`BFC`时可以阻止`margin`重叠

## 移动端1px问题

