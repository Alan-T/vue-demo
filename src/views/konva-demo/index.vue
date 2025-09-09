<template>
  <div class="konva-demo" ref="konvaViewRef" v-resize="handleResize">
    <!-- 舞台 -->
    <v-stage
      :config="stageConfig"
      @mousemove="handleMouseMove"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseLeave"
      @wheel="handleWheel"
    >
      <v-layer>
        <!-- 鼠标坐标显示 -->
        <v-text :config="mouseInfoConfig"></v-text>
        <!-- 原点信息 -->
        <v-circle :config="originDotConfig" />
        <!-- 坐标标注 -->
        <v-text :config="labelConfig" />
      </v-layer>
      <v-layer>
        <!-- 其他图形元素可以放在这里 -->
        <v-rect
          :config="{
            x: 100,
            y: 300,
            width: dimLength,
            height: 200,
            fill: '#d48806',
          }"
        ></v-rect>
        <v-circle
          :config="{
            x: 800,
            y: 400,
            radius: circleRadius,
            fill: '#ff7a45',
          }"
        ></v-circle>
      </v-layer>
      <v-layer>
        <DimLine
          :startX="100"
          :startY="530"
          v-model="dimLength"
          :rotation="0"
          :offsetY="0"
          :scale="scale"
          :editable="true"
        />
        <DimAngle :x="400" :y="0" :scale="scale" :startAngle="0" :angle="30" />
        <Tooltip
          :x="0"
          :y="530"
          :offsetX="dimLength / 2 + 100"
          :offsetY="30"
          :text="`长度: ${dimLength}`"
          placement="bottom"
          :rotation="0"
          :scale="scale"
          :visible="true"
        />
        <DimLine
          :startX="800"
          :startY="400"
          v-model="circleRadius"
          :rotation="0"
          :offsetY="0"
          :scale="scale"
          :editable="true"
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
import Tooltip from "./components/Tooltip·.vue";

const konvaViewRef = ref<HTMLElement | null>(null);
const stageSize = reactive({
  width: 1000,
  height: 600,
});
const scale = ref(0.5);
const origin = reactive({
  x: 400,
  y: 400,
});
// 添加拖拽相关状态
const isDragging = ref(false);
const lastPointerPosition = ref({ x: 0, y: 0 });

// 缩放相关配置
const minScale = 0.1;
const maxScale = 5;
const scaleStep = 0.1;

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

const dimLength = ref(400);
const circleRadius = ref(100);

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

  // 更新鼠标坐标显示
  mouseText.value = `X: ${
    Math.round((pos.x / scale.value - origin.x) * 100) / 100
  }, Y: ${
    Math.round(
      (-pos.y / scale.value - origin.y + stageSize.height / scale.value) * 100
    ) / 100
  }`;

  // 处理中键拖拽
  if (isDragging.value) {
    const dx = pos.x - lastPointerPosition.value.x;
    const dy = pos.y - lastPointerPosition.value.y;

    // 更新原点位置（注意Y轴方向）
    origin.x += dx / scale.value;
    origin.y -= dy / scale.value;

    lastPointerPosition.value = pos;
  }
};

const handleMouseDown = (e: any) => {
  // 检查是否为中键点击
  if (e.evt.button === 1) {
    e.evt.preventDefault();
    isDragging.value = true;
    const stageNode = e.target.getStage();
    const pos = stageNode.getPointerPosition();
    lastPointerPosition.value = pos;

    // 改变鼠标样式
    if (konvaViewRef.value) {
      e.target.getStage().container().style.cursor = "grabbing";
    }
  }
};

const handleMouseUp = (e: any) => {
  // 检查是否为中键释放
  if (e.evt.button === 1) {
    isDragging.value = false;

    // 恢复鼠标样式
    if (konvaViewRef.value) {
      e.target.getStage().container().style.cursor = "default";
    }
  }
};

const handleMouseLeave = (e: any) => {
  // 鼠标离开画布时停止拖拽
  isDragging.value = false;
  if (konvaViewRef.value) {
    e.target.getStage().container().style.cursor = "default";
  }
};

// 处理滚轮缩放
const handleWheel = (e: any) => {
  e.evt.preventDefault();

  const stageNode = e.target.getStage();
  const pointer = stageNode.getPointerPosition();

  // 计算当前鼠标在世界坐标系中的位置（考虑Y轴翻转）
  const worldMousePos = {
    x: pointer.x / scale.value - origin.x,
    y: (-pointer.y + stageSize.height) / scale.value - origin.y,
  };

  // 计算新的缩放值
  const direction = e.evt.deltaY > 0 ? -1 : 1;
  const oldScale = scale.value;
  const newScale = Math.max(
    minScale,
    Math.min(maxScale, scale.value + direction * scaleStep)
  );

  if (newScale === oldScale) return;

  // 更新缩放值
  scale.value = newScale;

  // 计算缩放后鼠标应该在屏幕上的新位置
  const newScreenMousePos = {
    x: (worldMousePos.x + origin.x) * newScale,
    y: stageSize.height - (worldMousePos.y + origin.y) * newScale,
  };

  // 计算原点需要调整的偏移量
  const deltaX = (pointer.x - newScreenMousePos.x) / newScale;
  const deltaY = -(pointer.y - newScreenMousePos.y) / newScale;

  // 更新原点位置
  origin.x += deltaX;
  origin.y += deltaY;
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
