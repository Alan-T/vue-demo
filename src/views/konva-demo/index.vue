<template>
  <div class="konva-demo" ref="konvaViewRef" v-resize="handleResize">
    <!-- 舞台 -->
    <v-stage :config="stageConfig" @mousemove="handleMouseMove">
      <v-layer>
        <!-- 鼠标坐标显示 -->
        <v-text :config="mouseInfoConfig"></v-text>
        <!-- 原点信息 -->
        <v-circle :config="originDotConfig" />
        <!-- 坐标标注 -->
        <v-text :config="labelConfig" />
      </v-layer>
      <v-layer>
        <v-rect :config="rectConfig"></v-rect>
        <DimLine
          :startX="100"
          :startY="300"
          :length="200"
          :rotation="0"
          :textRotation="0"
          :offsetY="0"
          :scale="scale"
          :editable="true"
        />
        <DimAngle
          :x="300"
          :y="200"
          :scale="scale"
          :startAngle="0"
          :angle="30"
        />
      </v-layer>
    </v-stage>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import type { ResizeData } from "@/directives/types";

import DimAngle from "./components/DimAngle.vue";
import DimLine from "./components/DimLine.vue";

const konvaViewRef = ref<HTMLElement | null>(null);
const stageSize = reactive({
  width: 1000,
  height: 600,
});
const scale = ref(0.8);
const origin = reactive({
  x: 40,
  y: 40,
});
const mouseText = ref("X:--.Y:--");
const stageConfig = computed(() => ({
  width: stageSize.width,
  height: stageSize.height,
  scaleX: scale.value, // X轴缩放
  scaleY: -scale.value, // Y轴缩放
  y: stageSize.height,
  offsetX: -origin.x,
  offsetY: -origin.y,
}));
const originDotConfig = computed(() => ({
  x: 0,
  y: 0,
  radius: 2 / scale.value,
  fill: "#002766",
  stroke: "#002766",
  strokeWidth: 2,
}));
const labelConfig = computed(() => ({
  x: 0,
  y: -6 / scale.value,
  text: `(0,0)`,
  fontSize: 12 / scale.value,
  fill: "#8c8c8c",
  fontFamily: "Arial",
  scaleY: -1,
}));
const mouseInfoConfig = computed(() => ({
  x: 0,
  y: stageSize.height / scale.value - origin.y,
  offsetX: origin.x,
  text: mouseText.value,
  fontSize: 12 / scale.value,
  scaleY: -1,
  fill: "black",
}));

const rectConfig = computed(() => ({
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  fill: "red",
  stroke: "black",
  strokeWidth: 1,
}));

onMounted(() => {
  if (konvaViewRef.value) {
    stageSize.width = konvaViewRef.value.getBoundingClientRect().width || 1000;
    stageSize.height = konvaViewRef.value.getBoundingClientRect().height || 600;
  }
});
const handleResize = (data: ResizeData) => {
  stageSize.width = data.width || 1000;
  stageSize.height = data.height || 800;
};
const handleMouseMove = (e: any) => {
  const stageNode = e.target.getStage();
  const pos = stageNode.getPointerPosition();
  mouseText.value = `X: ${pos.x / scale.value - origin.x}, Y: ${
    -pos.y / scale.value - origin.y + stageSize.height / scale.value
  }`;
};
</script>
<style scoped>
.konva-demo {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  overflow: hidden;
}
</style>
