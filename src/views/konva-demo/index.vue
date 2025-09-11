<template>
  <div class="konva-demo-container">
    <div class="instructions">
      <p>使用鼠标中键拖拽画布</p>
      <p>按住 Ctrl 键 + 滚轮缩放画布</p>
      <p>滚轮或触控板滚动移动画布</p>
      <p>按住 Shift 键 + 垂直滚轮水平移动画布</p>
    </div>
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
            :scale="1 / scale"
            :editable="true"
          />
          <DimAngle
            :x="400"
            :y="0"
            :startAngle="0"
            :angle="30"
            :scale="1 / scale"
          />
          <DimLine
            :startX="800"
            :startY="0"
            :modelValue="100"
            :rotation="0"
            :offsetY="0"
            :scale="1 / scale"
          />
          <Tooltip
            :x="0"
            :y="530"
            :offsetX="dimLength / 2 + 100"
            :offsetY="30"
            :text="`长度: ${dimLength}`"
            placement="bottom"
            :rotation="0"
            :scale="1 / scale"
            :visible="true"
          />
          <DimLine
            :startX="800"
            :startY="400"
            v-model="circleRadius"
            :rotation="0"
            :offsetY="0"
            :scale="1 / scale"
            :editable="true"
          />
        </v-layer>
      </v-stage>
    </div>
    <div class="footer">
      <p>Konva Demo</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import type { ResizeData } from "../../directives/types";

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

const dimLength = ref(200);
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

// 处理滚轮事件
const handleWheel = (e: any) => {
  e.evt.preventDefault();

  const stageNode = e.target.getStage();
  const pointer = stageNode.getPointerPosition();

  // 按住 Ctrl 键时进行缩放
  if (e.evt.ctrlKey) {
    // 计算当前鼠标在世界坐标系中的位置（考虑Y轴翻转）
    const worldMousePos = {
      x: pointer.x / scale.value - origin.x,
      y: (-pointer.y + stageSize.height) / scale.value - origin.y,
    };

    // 计算新的缩放值 - 支持垂直和水平滚动进行缩放
    let direction = 0;

    // 优先使用垂直滚动，如果没有垂直滚动则使用水平滚动
    if (e.evt.deltaY !== 0) {
      direction = e.evt.deltaY > 0 ? -1 : 1;
    } else if (e.evt.deltaX !== 0) {
      direction = e.evt.deltaX > 0 ? -1 : 1;
    }

    if (direction === 0) return;

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
  } else {
    // 普通滚轮：移动画布
    const baseMoveSpeed = 20; // 基础移动速度（像素）

    // 获取滚轮增量
    const deltaX = e.evt.deltaX; // 水平滚动值
    const deltaY = e.evt.deltaY; // 垂直滚动值

    // 处理水平滚动（支持触控板水平滑动或鼠标水平滚轮）
    if (deltaX !== 0) {
      // 标准化水平滚动速度，限制最大移动距离
      const normalizedDeltaX = Math.max(
        -baseMoveSpeed,
        Math.min(baseMoveSpeed, deltaX)
      );
      origin.x += normalizedDeltaX / scale.value;
    }

    // 处理垂直滚动
    if (deltaY !== 0) {
      // 标准化垂直滚动速度
      const normalizedDeltaY = Math.max(
        -baseMoveSpeed,
        Math.min(baseMoveSpeed, deltaY)
      );

      if (e.evt.shiftKey) {
        // Shift + 垂直滚轮：水平移动
        origin.x += normalizedDeltaY / scale.value;
      } else {
        // 普通垂直滚轮：垂直移动
        origin.y += normalizedDeltaY / scale.value;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.konva-demo-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 24px; /* 主体部分和底部留白 */
  .instructions {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.8);
    padding: 5px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    pointer-events: auto; /* 确保可以交互 */
  }
}

.konva-demo {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  overflow: hidden;
}
</style>
