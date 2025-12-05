# WebGL

`WebGL`使用的是右手坐标系。

## 着色器（Shader）

* 顶点着色器`Vertex Shader`: 用于描述顶点特性的程序，例如位置、颜色、纹理坐标等。顶点是指场景中的每一个点
* 片段着色器`Fragment Shader`: 进行逐片元处理过程的程序，如光照。片元是指屏幕上的每一个像素

### 变量

* `attribute`变量，用于传递顶点相关的数据，例如位置、颜色等
* `uniform`变量，用于传输所有顶点都相同的数据，例如相机位置、光源位置等
* `varying` 变化变量，在顶点着色器中计算，在片元着色器中插值，用于实现平滑的效果，例如颜色、纹理坐标等

`gl.drawArrays`用于绘制场景中的对象。其中第一个参数`mode`支持7种基本图形类型：

* `gl.POINTS`：绘制点
* `gl.LINES`：绘制线
* `gl.LINE_STRIP`：绘制折线
* `gl.LINE_LOOP`：绘制闭合折线
* `gl.TRIANGLES`：绘制三角形
* `gl.TRIANGLE_STRIP`：绘制三角形带
* `gl.TRIANGLE_FAN`：绘制三角形扇