<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Preload from './components/Preload.vue';
import { Game } from './index';
import { AudioHowl } from './utils/audio';
import { useRouter } from 'vue-router';

const showGreet = ref(false);
const showPointer = ref(false);
const showAgree = ref(false);
const audio = new AudioHowl(['talk1.m4a']);

const router = useRouter();

onMounted(() => {
  audio.load('talk1.m4a');
});

const handleAgree = () => {
  showAgree.value = false;
};

const onStart = (game: Game) => {
  showPointer.value = true;
  showAgree.value = true;
  game.gameWorld.on('talk', () => {
    router.push({ path: '/carshow' });
    // audio.play('talk1.m4a');
  });
};
</script>

<template>
  <div>
    <canvas class="webgl"></canvas>
    <div class="pointer" v-show="showPointer"></div>
    <div class="greet" v-show="showGreet">
      <img class="avatar" src="@/assets/skull.png" />
      <div class="greet-content"></div>
    </div>
  </div>
  <div class="knowledge" v-show="showAgree">
    <!-- <h2>欢迎来到这里</h2> -->
    <!-- <div class="content">
      <p>在PC端通过w/a/s/d或者↑↓←→来移动，按q切换视角</p>
      <p>屏幕准心对着场景中的模型「左键」点击进行交互</p>
      <p>
        <strong>PointerLockControls不支持移动端o(╥﹏╥)o</strong>
        <span style="font-size: 10px;">练习的demo就不继续捣鼓了</span>
      </p>
    </div> -->
    <div class="btn agree-btn" @click="handleAgree">我知道了</div>
  </div>
  <Preload @start="onStart"></Preload>
</template>

<style scoped lang="scss">
* {
  user-select: none;
}
.pointer {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  border: 1px solid #fff;
  box-shadow: 0 0 5px #fff;
  border-radius: 50%;
  z-index: 10;
}
.greet {
  position: fixed;
  left: 3rem; 
  top: 5rem;
  width: 50%;
  min-width: 300px;
  transform: translate(0, -50%);
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #fff;
  color: #fff;
  font-size: 14px;
  z-index: 3;
  display: flex;
  .avatar {
    width: 64px;
    height: 64px;
    margin-right: 1rem;
  }
}

.knowledge {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 2rem 4rem;
  border: 1px solid #fff;
  border-radius: 0.5rem;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 0 5px #fff;
  z-index: 4;
  h2 {
    margin-bottom: 1rem;
  }
  p {
    margin: 0.5rem 0;
  }
  .btn {
    width: 140px;
    height: 40px;
    background-color: #333;
    padding: 1rem 2rem;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin: 1rem auto 0 auto;
    cursor: pointer;
    &:active {
      box-shadow: 0 0 5px inset #fff;
    }
  }
}
</style>
