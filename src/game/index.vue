<script  lang="ts" setup name="Game">
import { onMounted, ref } from 'vue';
import Preload from '@/components/Preload/index.vue';
import { AudioHowl } from '@/game/utils/audio';
const videoElement:any = ref(null);
const musicIsOpen: any = ref(false);
let audio: any = null;
let sound: any = null;
onMounted(() => {
  sound = 'bgm.ogg';
  audio = new AudioHowl([sound]);
  audio.load(sound);
  
});
const music = () => {
  if (musicIsOpen.value) {
    audio.pause(sound);
  } else {
    audio.play(sound);
  }
  musicIsOpen.value = !musicIsOpen.value;
};

const toggleMute = () => {
  if (videoElement.value) {
    videoElement.value.muted = !videoElement.value.muted;
  }
  videoElement.value.play();
};

</script>
<template>
  <div>
    <canvas class="webgl"></canvas>
    <video 
      ref="videoElement"
      id="video"
      src="../assets/video.mp4"
      playsinline
      webkit-playsinline
      muted
      loop
      style="display:none"
      ></video>
      <div class="music_btn" @click="music">🎧</div>
      <div class="music_btn video_btn" @click="toggleMute">🔉</div>
  </div>
  <Preload></Preload>
</template>
<style scoped lang="scss"> 
.music_btn {
  position: fixed;
  z-index: 111;
  right: 5%;
  top: 5%;
  font-size: 18px;
  cursor: pointer;
  &.video_btn {
    right: 1%;
  }
}
</style>
