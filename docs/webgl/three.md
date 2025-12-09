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

| 类型 | 名称 | 描述 |
| --- | --- | --- |
| 基础光源  | 环境光（AmbientLight） | 环境光源会均匀照亮场景中的所有物体，没有特定的方向。 |
|  | 点光源（PointLight） | 从一个点发射的光源，例如灯泡。 |
|  | 聚光灯（SpotLight） | 从一个点发射的光源，只有在特定角度内的物体才会被照亮，例如手电筒。 |
| 特殊光源 | 方向光（DirectionalLight） | 也称作无限光，光线可以看作平行的，例如太阳光。 |
|  | 半球光（HemisphereLight） | 用来创建更加自然的室外光线，模拟反光面和光线微弱的天空 |
|  | 面光源（AreaLight） | 用来模拟矩形区域光源，例如LED灯。 |
|  | 镜头炫光（LensFlare） | 用来模拟镜头炫光效果，为场景中的光源提供炫光效果 |

## 网格（Mesh）

**网格**`Mesh`由几何体和材质组成，用于表示场景中的物体。

其中**材质**`Material`是物体的皮肤，定义了物体的外观，例如颜色、纹理、透明度等，决定了物体的外观。

**几何体**`Geometry`是物体的形状，定义了物体的顶点、边和面等，决定了物体的大小和形状。

### 材质

Three.js 提供的材质如下表：

|材质|描述|
| --- | --- |
| 基础材质（MeshBasicMaterial） | 最简单的材质，没有光照效果，仅根据颜色显示。 |
| 网格深度材质（MeshDepthMaterial） | 根据网格到相机的距离决定如何给网格染色 |
| 网格法向材质（MeshNormalMaterial） | 一种简单材质，根据网格法向量计算颜色 |
| 网格面材质（MeshFaceMaterial） | 一种容器材质，支持为物体的各个表面配置不同材质 |
| 朗伯材质（MeshLambertMaterial） | 一种基于光照的材质，可以用来创建颜色暗淡，不光亮的物体 |
| Phone式材质（MeshPhoneMaterial） | 一种基于光照的材质，可以创建光亮的物体 |
| 物理材质（MeshPhysicalMaterial） | 一种基于物理的材质，模拟真实的物理效果，例如反射、折射、透明等 |

### 联合材质

联合材质`MeshFaceMaterial`是一种容器材质，支持为物体的各个表面配置不同材质。例如，一个立方体可以有不同的材质应用在不同的面上。

## 几何体

### 基础几何体

Three.js 提供的几何体有：

* 二维几何体
* 三维几何体
* 高级几何体

|几何体|描述|
| --- | --- |
| 平面（PlaneGeometry） | 一个矩形平面，由 4 个顶点和 2 个三角形组成 |
| 圆形（CircleGeometry） | 一个圆形，由多个面组成 |
| 形状几何体（ShapeGeometry） | 一个自定义形状的几何体 |
| 框体几何体（BoxGeometry） | 一个立方体，由 6 个面组成 |
| 球体几何体（SphereGeometry） | 一个球体，由多个面组成 |
| 圆柱体几何体（CylinderGeometry） | 一个圆柱体，由 2 个面和 1 个侧面组成 |
| 平面几何体（PlaneGeometry） | 一个矩形平面，由 4 个顶点和 2 个三角形组成 |
| 圆环几何体（TorusGeometry） | 一个圆环，由多个面组成 |
| 圆环面几何体（TorusKnotGeometry） | 一个圆环面，由多个面组成 |

## 粒子（Particle）

## 相机（Camera）

相机是 Three.js 中用于定义场景中可见区域的对象。相机可以是透视相机或正交相机，用于模拟人眼或相机的视角。相机的位置和方向决定了场景中可见的区域。


### 对象（Object）

对象是 Three.js 中用于表示 3D 模型、几何体、材质等的对象。对象可以是静态的，也可以是动态的，例如动画模型、交互对象等。对象的属性和方法可以用于操作和管理对象，例如位置、旋转、缩放、材质等。
