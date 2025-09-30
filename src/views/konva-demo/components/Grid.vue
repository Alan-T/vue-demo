<template>
  <v-group :config="{ x: -configKonva.width / 2, y: -configKonva.height / 2 }">
    <!-- 绘制网格线 -->
    <template v-if="scale >= 0.5">
      <v-line
        v-for="(line, index) in dottedLine"
        :key="`grid-${index}`"
        :config="line"
      />
    </template>
    <v-line
      v-for="(line, index) in solidLine"
      :key="`grid-${index}`"
      :config="line"
    />
  </v-group>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  scale: number; // 当前缩放比例
}>();

// 画布配置
const configKonva = ref({
  width: 8000,
  height: 6000,
});
// 网格配置
const dottedConfig = ref({
  size: 20, // 网格大小
  color: "#dedede", // 网格颜色
  strokeWidth: 0.5, // 线宽
  dash: [3 * props.scale, 3 * props.scale],
  lineJoin: "round",
});

const solidConfig = ref({
  size: 100, // 网格大小
  color: "#dedede", // 网格颜色
  strokeWidth: 0.5, // 线宽
});

// 计算网格线
const dottedLine = computed(() => {
  const lines = [];
  const { width, height } = configKonva.value;
  const { size, color, strokeWidth, dash, lineJoin } = dottedConfig.value;

  // 垂直线
  for (let x = 0; x <= width; x += size) {
    lines.push({
      points: [x, 0, x, height],
      stroke: color,
      strokeWidth: strokeWidth / props.scale, // 根据缩放调整线宽
      dash: dash,
      lineJoin: lineJoin,
      listening: false, // 不响应事件
    });
  }

  // 水平线
  for (let y = 0; y <= height; y += size) {
    lines.push({
      points: [0, y, width, y],
      stroke: color,
      strokeWidth: strokeWidth / props.scale, // 根据缩放调整线宽
      dash: dash,
      lineJoin: lineJoin,
      listening: false,
    });
  }

  return lines;
});

const solidLine = computed(() => {
  const lines = [];
  const { width, height } = configKonva.value;
  const { size, color, strokeWidth } = solidConfig.value;

  // 垂直线
  for (let x = 0; x <= width; x += size) {
    lines.push({
      points: [x, 0, x, height],
      stroke: color,
      strokeWidth: strokeWidth / props.scale, // 根据缩放调整线宽
      listening: false, // 不响应事件
    });
  }

  // 水平线
  for (let y = 0; y <= height; y += size) {
    lines.push({
      points: [0, y, width, y],
      stroke: color,
      strokeWidth: strokeWidth / props.scale, // 根据缩放调整线宽
      listening: false,
    });
  }

  return lines;
});
</script>
