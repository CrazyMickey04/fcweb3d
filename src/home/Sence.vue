<template>
  <div id="three"></div>
</template>

<script lang="ts" setup name="Sence">
import * as THREE from 'three';
import {  onMounted } from 'vue';
import Viewer, { type Animate } from '@/modules/Viewer';
import ModelLoader from '@/modules/ModelLoder';

let viewer: Viewer;
let modelLoader: ModelLoader;

onMounted(() => {
  init();
});

const init = () => {
  // 初始化场景
  viewer = new Viewer('three');
  // 显示坐标轴
  // viewer.addAxis(); 
  // 显示FPS 性能
  // viewer.addStats();
  // 模型loader
  modelLoader = new ModelLoader(viewer);
  initModel();
};

const initModel = () => {
  //  汽车模型
  modelLoader.loadModelToScene('/models/Lamborghini.glb', carModel => {
    carModel.setScalc(0.2);
    const model = carModel.gltf.scene;
    model.position.set(0.4, 0, 0.8);
    model.name = '汽车';
  });
  modelLoader.loadModelToScene('/models/jay_animate_walk.glb', baseModel => {
    const model = baseModel.gltf.scene;
    model.position.set(0, 0, 1);
    model.name = 'jay';
    baseModel.setScalc(0.2);
    baseModel.openCastShadow();
    baseModel.startAnima();
    console.log('动画片断', baseModel.gltf.animations);
    var moveDistance = 0.005; // 模型每次移动的距离

    document.addEventListener('keydown', function (event) {
      var keyCode = event.keyCode;
      // W键：向前移动
      if (keyCode === 87) {
        baseModel.position.z -= moveDistance;
        baseModel.startAnima(1);
      }

      // S键：向后移动
      if (keyCode === 83) {
        baseModel.position.z += moveDistance;
        baseModel.startAnima(1);
      }

      // A键：向左移动
      if (keyCode === 65) {
        baseModel.position.x -= moveDistance;
        baseModel.startAnima(1);
      }

      // D键：向右移动
      if (keyCode === 68) {
        baseModel.position.x += moveDistance;
        baseModel.startAnima(1);
      }
      console.log(baseModel.position);
    });
    document.addEventListener('keyup', function () {
      baseModel.startAnima(0);
    });
    const fnOnj = animateMove(model, baseModel.position);
    viewer.addAnimate(fnOnj);

  });
  const animateMove = (model: THREE.Group, modelPosition: THREE.Vector3)=> {

    const animateFn = {
      fun: () => {
        model.position.copy(modelPosition);
      },
      content: viewer,
    };
    return animateFn;

  };
  // 地面模型
  modelLoader.loadModelToScene('/models/plane.glb', baseModel => {
    const model = baseModel.gltf.scene;
    model.scale.set(0.0001 * 3, 0.0001 * 3, 0.0001 * 3);
    model.position.set(0, 0, 0);
    model.name = 'plane';
    baseModel.openCastShadow();
    console.log('模型根对象:', baseModel.object);
    const texture = (baseModel.object.children[0] as any).material.map;
    console.log(texture, 'texture-------');
    // 地面模型贴图动画
    const fnOnj = planeAnimate(texture);
    viewer.addAnimate(fnOnj);
  });
};
const planeAnimate = (texture: any): Animate => {
  console.log(texture, 'texture');
  texture.wrapS = THREE.RepeatWrapping; // 贴图重复方式，水平方向重复
  texture.wrapT = THREE.RepeatWrapping; // 贴图重复方式，垂直方向重复
  const animateFn = {
    fun: () => {
      const count = texture.repeat.y; // 贴图重复次数
      if (count <= 10) {
        texture.repeat.x += 0.01;
        texture.repeat.y += 0.02;
      } else {
        texture.repeat.x = 0;
        texture.repeat.y = 0;
      }
    },
    content: viewer,
  };
  return animateFn;
};

</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
