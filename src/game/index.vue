<script setup lang="ts"> 
import Preload from '@/components/Preload/index.vue';
</script>

<template>
  <div>
    <canvas class="webgl"></canvas>
    <video 
      id="video"
      src="../assets/video.mp4"
      playsinline
      webkit-playsinline
      autoplay
      loop
      style="display:none"
      ></video>
  </div>
  <Preload></Preload>
</template>

<style scoped lang="scss"> 
</style>
