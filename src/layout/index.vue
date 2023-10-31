<template>
  <div class="layout">
    <Header>孚创元宇宙</Header>
    <div class="layout-content">
      <div class="layout-content-left">
        <Panel>
          <template #title>
            <div>车主信息</div>
          </template> 
          <ul class="info_wrap">
            <li>
              <p>姓名： xxx</p>
              <p>电话： 13911111111</p>
              <p>会员： VIP-8</p>
            </li>
            <li>
              <p>车牌： 鄂A-888888</p>
              <p>车型： 兰博基尼</p>
              <p>公里数： 10000KM</p>
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
import Header from './Header.vue';
import Sence from '@/components/Sence.vue';
import Panel from '@/components/Panel/index.vue';
import LineCharts from '@/components/Charts/LineChart.vue';
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
</style>
