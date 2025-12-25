# Three.js

## 场景（Scene）

一个三维场景想要显示任何东西都需要三类基础组件：

* **相机**（Camera）：决定那些东西将要在屏幕上渲染
* **光源**（Light）：会对材质如何显示，从而影响场景中物体的颜色和亮度。
* **物体**（Object）：场景中可见的 3D 模型、几何体、材质等。

场景就是这些对象的容器。可以包含多个对象，例如模型、几何体、材质等。用于组织和管理场景中的对象，例如添加、删除、遍历等操作。

```javascript
import * as THREE from 'three';
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
scene.add(camera);
// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 添加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);
// 添加正方形
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```
## 光源（Light）

光源可以分为基础光源和特殊光源，具体如下：

| 类型     | 名称                       | 描述                                                               |
| -------- | -------------------------- | ------------------------------------------------------------------ |
| 基础光源 | 环境光（AmbientLight）     | 环境光源会均匀照亮场景中的所有物体，没有特定的方向。               |
|          | 点光源（PointLight）       | 从一个点发射的光源，例如灯泡。                                     |
|          | 聚光灯（SpotLight）        | 从一个点发射的光源，只有在特定角度内的物体才会被照亮，例如手电筒。 |
| 特殊光源 | 方向光（DirectionalLight） | 也称作无限光，光线可以看作平行的，例如太阳光。                     |
|          | 半球光（HemisphereLight）  | 用来创建更加自然的室外光线，模拟反光面和光线微弱的天空             |
|          | 面光源（AreaLight）        | 用来模拟矩形区域光源，例如LED灯。                                  |
|          | 镜头炫光（LensFlare）      | 用来模拟镜头炫光效果，为场景中的光源提供炫光效果                   |

## 网格（Mesh）

**网格**`Mesh`由几何体和材质组成，用于表示场景中的物体。

其中**材质**`Material`是物体的皮肤，定义了物体的外观，例如颜色、纹理、透明度等，决定了物体的外观。

**几何体**`Geometry`是物体的形状，定义了物体的顶点、边和面等，决定了物体的大小和形状。

### 材质

Three.js 提供的材质如下表：

| 材质                               | 描述                                                           |
| ---------------------------------- | -------------------------------------------------------------- |
| 基础材质（MeshBasicMaterial）      | 最简单的材质，没有光照效果，仅根据颜色显示。                   |
| 网格深度材质（MeshDepthMaterial）  | 根据网格到相机的距离决定如何给网格染色                         |
| 网格法向材质（MeshNormalMaterial） | 一种简单材质，根据网格法向量计算颜色                           |
| 网格面材质（MeshFaceMaterial）     | 一种容器材质，支持为物体的各个表面配置不同材质                 |
| 朗伯材质（MeshLambertMaterial）    | 一种基于光照的材质，可以用来创建颜色暗淡，不光亮的物体         |
| Phone式材质（MeshPhoneMaterial）   | 一种基于光照的材质，可以创建光亮的物体                         |
| 物理材质（MeshPhysicalMaterial）   | 一种基于物理的材质，模拟真实的物理效果，例如反射、折射、透明等 |

### 联合材质

联合材质`MeshFaceMaterial`是一种容器材质，支持为物体的各个表面配置不同材质。例如，一个立方体可以有不同的材质应用在不同的面上。

## 几何体

### 基础几何体

Three.js 提供的几何体有：

* 二维几何体
* 三维几何体
* 高级几何体

| 几何体                            | 描述                                       |
| --------------------------------- | ------------------------------------------ |
| 平面（PlaneGeometry）             | 一个矩形平面，由 4 个顶点和 2 个三角形组成 |
| 圆形（CircleGeometry）            | 一个圆形，由多个面组成                     |
| 形状几何体（ShapeGeometry）       | 一个自定义形状的几何体                     |
| 框体几何体（BoxGeometry）         | 一个立方体，由 6 个面组成                  |
| 球体几何体（SphereGeometry）      | 一个球体，由多个面组成                     |
| 圆柱体几何体（CylinderGeometry）  | 一个圆柱体，由 2 个面和 1 个侧面组成       |
| 平面几何体（PlaneGeometry）       | 一个矩形平面，由 4 个顶点和 2 个三角形组成 |
| 圆环几何体（TorusGeometry）       | 一个圆环，由多个面组成                     |
| 圆环面几何体（TorusKnotGeometry） | 一个圆环面，由多个面组成                   |

## 粒子（Particle）

## 相机（Camera）

相机是 Three.js 中用于定义场景中可见区域的对象。相机可以是透视相机或正交相机，用于模拟人眼或相机的视角。相机的位置和方向决定了场景中可见的区域。


## 对象（Object）

对象是 Three.js 中用于表示 3D 模型、几何体、材质等的对象。对象可以是静态的，也可以是动态的，例如动画模型、交互对象等。对象的属性和方法可以用于操作和管理对象，例如位置、旋转、缩放、材质等。

## 视锥体剔除

视锥体剔除`Frustum Culling`是三维图形渲染中将完全处于视锥外的物体移出渲染流程的技术，通过减少不可见物体的渲染计算，提升图形处理效率。

视锥体是相机`Camera`定义的一个空间区域，只有位于这个区域内的对象才会被渲染。透视相机`PerspectiveCamera`定义了一个金字塔形状的视锥体，而正交相机`OrthographicCamera`则定义了一个长方体形状的视锥体。

`Three.js`中`THREE.Frustum`的类表示视锥体。通过相机的`projectionMatrix`和`viewMatrix`可以创建一个`THREE.Frustum`对象，然后使用其`intersectsObject`方法检测对象是否在视锥体内。

```ts
// 创建一个透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 创建一个视锥体
const frustum = new THREE.Frustum();

const projScreenMatrix = new THREE.Matrix4();
projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.viewMatrix);

frustum.setFromProjectionMatrix(projScreenMatrix);

// 检测对象是否在视锥体内
// 遍历场景中的所有对象，检测是否在视锥体内，并更新渲染状态
scene.traverse( object => {
  if (object.isMesh) {
    const visible = frustum.intersectsObject(object);
  }
});
```

`Three.js`中默认开启视锥体剔除。对于每个物体（如Mesh, Light等），你可以设置`frustumCulled`属性来控制是否对该物体开启视锥体剔除。默认值为`true`。

## 实例化渲染

实例化渲染`Instanced Rendering`是一种优化技术，用于渲染大量相似的几何体的场景。通过单次绘制调用渲染多个相似对象，将渲染性能提升数倍甚至数十倍，使在网页中渲染数万甚至数十万个对象成为可能。

实例化渲染的核心思想是单次绘制调用，多个实例。通过将每个实例的差异化数据（如位置、旋转、颜色等）存储在特定的缓冲区属性中，让GPU在单次绘制过程中处理所有这些实例。

GPU顶点着色器可以通过内置变量（如gl_InstanceID）识别当前正在处理的实例，并提取对应的实例数据应用变换。这种方式将大量工作从CPU转移到了GPU，极大提高了效率。

WebGL 1.0中需通过`ANGLE_instanced_arrays`扩展启用实例化渲染。WebGL 2.0原生支持的实例化相关API。可以通过`gl.vertexAttribDivisor`配置实例化属性。

`Three.js`提供`InstancedMesh`类来实现实例化渲染。

```ts
const count = 1000;
// 创建一个实例化网格
const instancedMesh = new THREE.InstancedMesh( geometry, material, count );

// 为每个实例设置变换矩阵
const matrix = new THREE.Matrix4();
const position = new THREE.Vector3();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3(1, 1, 1);

for (let i = 0; i < count; i++) {
  position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );
  
  // 随机旋转
  quaternion.setFromEuler(
    new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0)
  );
  
  // 组合变换矩阵
  matrix.compose(position, quaternion, scale);
  instancedMesh.setMatrixAt(i, matrix);
}

scene.add(instancedMesh);
```

## 多细节层次

多细节层次`Levels of Detail(LOD)`技术，是计算机图形学中实时渲染优化的关键技术。通过建立物体多精度几何模型，根据视距动态切换模型层级以降低渲染复杂度，主要应用于虚拟现实、沙盒游戏及大世界地图等实时性场景。

```ts
// 创建LOD对象
const lod = new THREE.LOD();
// 创建不同细节级别的模型
// 高精度模型
const highDetailGeometry = new THREE.SphereGeometry(1, 32, 32);
const highDetailMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const highDetailMesh = new THREE.Mesh(highDetailGeometry, highDetailMaterial);
// 中精度模型
const mediumDetailGeometry = new THREE.SphereGeometry(1, 16, 16);
const mediumDetailMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mediumDetailMesh = new THREE.Mesh(mediumDetailGeometry, mediumDetailMaterial);
// 低精度模型
const lowDetailGeometry = new THREE.SphereGeometry(1, 8, 8);
const lowDetailMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, lowDetailMaterial);
// 将不同细节级别的模型添加到LOD对象中
// 参数1：模型对象
// 参数2：切换距离（当相机到模型的距离超过此值时，切换到下一个级别）
lod.addLevel(highDetailMesh, 0);       // 距离小于100使用高精度
lod.addLevel(mediumDetailMesh, 100);   // 距离在100-200之间使用中精度
lod.addLevel(lowDetailMesh, 200);      // 距离大于200使用低精度
// 将LOD对象添加到场景中
scene.add(lod);

function animate() {
    requestAnimationFrame(animate);
    
    // 更新LOD（根据相机位置切换细节级别）
    lod.update(camera);
    
    renderer.render(scene, camera);
}
animate();
```
