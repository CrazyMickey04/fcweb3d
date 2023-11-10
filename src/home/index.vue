<template>
  <div class="layout">
    <div class="header">
      孚创元宇宙
    </div>
    <div class="layout-content">
      <div class="layout-content-left">
        <Panel>
          <template #title>
            <div>车主信息</div>
          </template> 
          <ul class="info_wrap">
            <li>
              <p>姓名： 周杰伦</p>
              <p>电话： 13911111111</p>
              <p>会员： VIP-8</p>
              <p>钱包： 1000 ETF</p>
            </li>
            <li>
              <p>车牌： 鄂A-E86</p>
              <p>车型： 兰博基尼</p>
              <p>公里： 10000 KM</p>
              <p>属性： 100-600-400</p>
            </li>
          </ul>
        </Panel>
        <Panel>
          <template #title>
            <div>保养记录</div>
          </template> 
          <LineCharts></LineCharts>
        </Panel>
      </div>
      <Sence></Sence>
    </div>
  </div>
</template>

<script setup lang="ts" name="Layout">
import Sence from './Sence.vue';
import Panel from './components/Panel/index.vue';
import LineCharts from './components/Charts/LineChart.vue';
</script>

<style scope>
.layout {
  width: 100vw;
  height: 100vh;
}
.info_wrap {
  display: flex;
  justify-content: space-between;
}
.layout-content {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}
.layout-content-left {
  position: absolute;
  left: 0.3rem;
  top: 70px;
  text-align: left;
  width: 30vw;
}
.layout-content-right {
  position: absolute;
  right: 0.6rem;
  top: 70px;
  width: 30vw;
}
.panel {
  margin-bottom: 0.3rem;
}
.header {
  position: absolute;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 1rem;
  /* padding-bottom: 10px; */
  font-size: 0.4rem;
  font-weight: bold;
  color: #fff;
  background: url('@/assets/images/header_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 1rem;
}
</style>
