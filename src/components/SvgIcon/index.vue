<template>
  <svg
    :class="iconClass"
    aria-hidden="true"
    :width="size"
    :height="size"
    :style="{ color: color }"
  >
    <use :xlink:href="iconName" fill="currentColor"></use>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  // 图标名,必填
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 24,
  },
  // 图标class
  iconClass: {
    type: String,
    default: "icon-", //默认值
  },
  // 图标颜色
  color: {
    type: String,
    default: "#262626",
  },
});
// 图标拼接 #
const iconName = computed(() => {
  return `#icon-${props.icon}`;
});
</script>
