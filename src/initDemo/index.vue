<template>
    <div ref="mount"></div>
  </template>
  
<script setup >
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  
const mount = ref(null);
  
onMounted(() => {
  // 创建一个场景
  const scene = new THREE.Scene();
  
  // 创建一个立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 创建材质
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 创建一个相机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // 设置环境光源
  const ambientLight = new THREE.AmbientLight('#fff', 0.5);
  scene.add(ambientLight);

  // 创建一个渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  mount.value.appendChild(renderer.domElement);
  
  
  // 创建控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  
  // 创建坐标轴帮助器
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  
  // 渲染循环
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
});
</script>
  
  <style scoped>
  div {
    width: 100vw;
    height: 100vh;
  }
  </style>
