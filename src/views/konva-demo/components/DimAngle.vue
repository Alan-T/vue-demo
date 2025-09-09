<template>
  <v-group :config="groupConfig">
    <!-- 角度线1 -->
    <v-line :config="startLineConfig" />

    <!-- 角度线2 -->
    <v-line :config="endLineConfig" />

    <!-- 角度弧线 -->
    <v-arc :config="arcConfig" />

    <!-- 角度标注 -->
    <v-text :config="angleTextConfig" />
  </v-group>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  x?: number;
  y?: number;
  scale?: number;
  startAngle?: number;
  angle?: number;
  lineLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  scale: 1,
  startAngle: 0,
  angle: 30,
  lineLength: 68,
});

const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  offsetX: 0,
  offsetY: 0,
  rotation: props.startAngle,
  scaleX: props.scale,
  scaleY: props.scale,
}));

// 第一条线配置
const startLineConfig = computed(() => ({
  points: [0, 0, props.lineLength, 0],
  stroke: "#389e0d",
  strokeWidth: 1,
}));

// 第二条线配置
const endLineConfig = computed(() => ({
  points: [
    0,
    0,
    Math.cos((props.angle * Math.PI) / 180) * props.lineLength,
    Math.sin((props.angle * Math.PI) / 180) * props.lineLength,
  ],
  stroke: "#3498db",
  strokeWidth: 1,
}));

const arcConfig = computed(() => ({
  innerRadius: 30, // 内半径（0为扇形）
  outerRadius: 31, // 外半径
  angle: props.angle,
  rotation: -0, // 起始角度
  fill: "#389e0d",
}));

// 角度文字配置
const angleTextConfig = computed(() => {
  return {
    offsetX: -48,
    offsetY: 6,
    rotation: props.angle / 2,
    text: `${props.angle}°`,
    fontSize: 12,
    fill: "#434343",
    align: "center",
    verticalAlign: "middle",
    scaleY: -1,
  };
});
</script>
