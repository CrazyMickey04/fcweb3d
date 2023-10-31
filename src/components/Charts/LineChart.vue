<template>
  <div class="chart" ref="chartRef"></div>
</template>

<script setup lang="ts" name="LineCharts">
import * as echarts from 'echarts';
import { ref, type Ref, onMounted } from 'vue';
import { useChart } from '@/hooks/useChart';

type EChartsOption = echarts.EChartsOption;

const chartRef: Ref = ref(null);
const { setOptions } = useChart(chartRef);
let option: EChartsOption;

onMounted(() => {
  init();
});

const init = () => {
  // const myChart = echarts.init(chartRef.value);
  option = {
    color: ['#80FFA5', '#00DDFF', '#37A2FF'],
    title: {
      text: '',
      textStyle: {
        color: '#fff',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['大保养', '小保养', '配件'],
      textStyle: {
        color: '#fff',
      },
    },
    textStyle: {
      color: '#fff',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        name: '保养时间',
        type: 'category',
        boundaryGap: false,
        data: ['20年', '21年', '22年', '23年'],
      },
    ],
    yAxis: [
      {
        name: '保养次数',
        type: 'value',
      },
    ],
    series: [
      {
        name: '大保养',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)',
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: ['1', '3', '8', '10'],
      },
      {
        name: '小保养',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(0, 221, 255)',
            },
            {
              offset: 1,
              color: 'rgb(77, 119, 255)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: ['1', '5', '10', '20'],
      },
      {
        name: '配件',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(55, 162, 255)',
            },
            {
              offset: 1,
              color: 'rgb(116, 21, 219)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: ['4', '8', '10', '40'],
      },
    ],
  };
  setOptions(option);

  // option && myChart.setOption(option);
};


</script>

<style scope>
.chart {
  width: 100%;
  height: 40vh;
}
</style>
