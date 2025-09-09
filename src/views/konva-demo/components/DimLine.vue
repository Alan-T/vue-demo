<!-- DimensionLine.vue -->
<template>
  <v-group :config="groupConfig">
    <!-- 标注线 (分段绘制，避开文字) -->
    <v-line :config="mainLineLeftConfig" />
    <v-line :config="mainLineRightConfig" />

    <!-- 引线 -->
    <v-line :config="extensionLine1Config" />
    <v-line :config="extensionLine2Config" />

    <!-- 文字 -->
    <v-text
      v-if="!isEditing"
      :config="textConfig"
      @click="handleTextClick"
      @dblclick="handleTextDblClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    />

    <!-- 编辑输入框 (仅在编辑模式下显示) -->
    <v-text
      v-else
      :config="inputConfig"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      ref="inputRef"
    />
  </v-group>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from "vue";

const props = defineProps({
  startX: { type: Number, required: true, default: 0 },
  startY: { type: Number, required: true, default: 0 },
  modelValue: { type: Number, required: true, default: 100 },
  rotation: { type: Number, default: 0 },
  textRotation: { type: Number, default: 0 },
  offsetX: { type: Number, default: 0 },
  offsetY: { type: Number, default: 0 },
  textColor: { type: String, default: "#0958d9" },
  lineColor: { type: String, default: "#389e0d" },
  scale: { type: Number, default: 1 },
  editable: { type: Boolean, default: false },
  minLength: { type: Number, default: 20 },
  maxLength: { type: Number, default: 10000 },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const isEditing = ref(false);
const editText = ref("");
const inputRef = ref<any>(null);
const leaveEdit = ref(false);

const displayText = computed(() => props.modelValue.toString());

// 计算文字宽度 (估算)
const textWidth = computed(() => displayText.value.length * 8 * props.scale);
const textGap = computed(() =>
  Math.max(textWidth.value + 12 * props.scale, 20 * props.scale)
); // 文字区域 + 间隙

const centerX = computed(() => props.modelValue / 2);
const leftLineEnd = computed(() => centerX.value - textGap.value / 2);
const rightLineStart = computed(() => centerX.value + textGap.value / 2);
const groupConfig = computed(() => ({
  x: props.startX,
  y: props.startY,
  rotation: props.rotation,
  offsetY: -2 - props.offsetY,
  offsetX: -props.offsetX,
}));

// 主标注线 - 左段
const mainLineLeftConfig = computed(() => ({
  points: [0, -0, Math.max(leftLineEnd.value, 0), -0],
  stroke: props.lineColor,
  strokeWidth: 1 * props.scale,
}));

// 主标注线 - 右段
const mainLineRightConfig = computed(() => ({
  points: [
    Math.min(rightLineStart.value, props.modelValue),
    -0,
    props.modelValue,
    -0,
  ],
  stroke: props.lineColor,
  strokeWidth: 1 * props.scale,
}));

// 引线
const extensionLine1Config = computed(() => ({
  points: [0, 6 * props.scale, 0, -0 - 6 * props.scale],
  stroke: props.lineColor,
  strokeWidth: 1 * props.scale,
}));

const extensionLine2Config = computed(() => ({
  points: [
    props.modelValue,
    6 * props.scale,
    props.modelValue,
    -6 * props.scale,
  ],
  stroke: props.lineColor,
  strokeWidth: 1 * props.scale,
}));

// 文字
const textConfig = computed(() => ({
  x: centerX.value,
  y: 0,
  width: textWidth.value,
  text: displayText.value,
  offsetX: textWidth.value / 2,
  offsetY: 6 * props.scale,
  lineHeight: 1,
  scaleY: -1,
  fontSize: 12 * props.scale,
  fill: props.editable ? props.textColor : "#434343",
  align: "center",
  verticalAlign: "middle",
  rotation: props.textRotation,
  listening: props.editable,
  cursor: props.editable ? "pointer" : "default",
}));

// 输入框配置
const inputConfig = computed(() => ({
  x: centerX.value,
  y: 0,
  width: textWidth.value,
  text: editText.value,
  offsetX: textWidth.value / 2,
  offsetY: 7 * props.scale,
  lineHeight: 1,
  scaleY: -1,
  fontSize: 14 * props.scale,
  fill: "#ff0000",
  align: "center",
  verticalAlign: "middle",
  rotation: props.textRotation,
  listening: true,
  fontStyle: "bold",
}));

// 鼠标进入
const handleMouseEnter = (e: any) => {
  leaveEdit.value = false;
  // 修改鼠标样式
  if (props.editable) {
    e.target.getStage().container().style.cursor = "pointer";
  }
};

// 鼠标离开
const handleMouseLeave = (e: any) => {
  leaveEdit.value = true;
  // 恢复鼠标样式
  e.target.getStage().container().style.cursor = "default";
};

// 处理文字点击事件
const handleTextClick = (e: any) => {
  if (props.editable) {
    e.cancelBubble = true;
    startEditing();
  }
};

// 处理文字双击事件
const handleTextDblClick = (e: any) => {
  if (props.editable) {
    e.cancelBubble = true;
    startEditing();
  }
};

// 处理编辑区域外点击事件
const handleDocumentClick = (e: MouseEvent) => {
  // 如果鼠标不在输入框上，则完成编辑
  if (leaveEdit.value) {
    leaveEdit.value = false;
    finishEditing();
  }
};
// 开始编辑
const startEditing = () => {
  isEditing.value = true;
  editText.value = displayText.value;

  nextTick(() => {
    document.addEventListener("keydown", handleDocumentKeyDown);
    document.addEventListener("click", handleDocumentClick);
  });
};

// 处理文档键盘事件
const handleDocumentKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    finishEditing();
  } else if (e.key === "Escape") {
    e.preventDefault();
    cancelEditing();
  } else if (e.key === "Tab") {
    e.preventDefault();
    finishEditing();
  } else if (e.key.length === 1) {
    e.preventDefault();
    editText.value += e.key;
  } else if (e.key === "Backspace") {
    e.preventDefault();
    editText.value = editText.value.slice(0, -1);
  }
};

// 完成编辑
const finishEditing = () => {
  document.removeEventListener("keydown", handleDocumentKeyDown);
  document.removeEventListener("click", handleDocumentClick);
  // 最小值限制
  if (Number(editText.value) < props.minLength) {
    editText.value = props.minLength.toString();
  }
  // 最大值限制
  if (Number(editText.value) > props.maxLength) {
    editText.value = props.maxLength.toString();
  }
  if (editText.value !== displayText.value && editText.value.trim() !== "") {
    emit("update:modelValue", Number(editText.value));
  }
  isEditing.value = false;
};

// 取消编辑
const cancelEditing = () => {
  document.removeEventListener("keydown", handleDocumentKeyDown);
  document.removeEventListener("click", handleDocumentClick);
  isEditing.value = false;
};
</script>
