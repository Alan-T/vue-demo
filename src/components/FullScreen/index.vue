<template>
  <SvgIcon
    class="fullscreen-button"
    @click="toggleFullscreen"
    :title="isFullscreen ? '退出全屏' : '进入全屏'"
    :icon="isFullscreen ? 'cancel-full-screen' : 'full-screen'"
    :size="iconSize"
    :color="iconColor"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Props {
  /** 按钮尺寸 */
  size?: number | "small" | "medium" | "large";
  /** 图标颜色 */
  iconColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  iconColor: "#262626",
});

const emit = defineEmits<{
  (e: "fullscreen-change", isFullscreen: boolean): void;
  (e: "fullscreen-enter"): void;
  (e: "fullscreen-exit"): void;
  (e: "fullscreen-error", error: Error): void;
}>();

const isFullscreen = ref(false);

// 计算图标尺寸
const iconSize = computed(() => {
  if (typeof props.size === "number") {
    return props.size;
  }
  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24,
  };
  return sizeMap[props.size];
});

// 检查浏览器是否支持全屏
const isSupported = computed(() => {
  return !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
});

// 获取全屏元素
const getFullscreenElement = () => {
  return (
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};

// 进入全屏
const enterFullscreen = async () => {
  try {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      await (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      await (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      await (element as any).msRequestFullscreen();
    }
  } catch (error) {
    emit("fullscreen-error", error as Error);
  }
};

// 退出全屏
const exitFullscreen = async () => {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      await (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      await (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      await (document as any).msExitFullscreen();
    }
  } catch (error) {
    emit("fullscreen-error", error as Error);
  }
};

// 切换全屏
const toggleFullscreen = () => {
  if (!isSupported.value) return;

  if (isFullscreen.value) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
};

// 更新全屏状态
const updateFullscreenStatus = () => {
  const newIsFullscreen = !!getFullscreenElement();
  if (isFullscreen.value !== newIsFullscreen) {
    isFullscreen.value = newIsFullscreen;
    emit("fullscreen-change", newIsFullscreen);

    if (newIsFullscreen) {
      emit("fullscreen-enter");
    } else {
      emit("fullscreen-exit");
    }
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  updateFullscreenStatus();
};

onMounted(() => {
  // 初始化状态
  updateFullscreenStatus();

  // 监听各种全屏事件
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);
});

onUnmounted(() => {
  // 移除事件监听
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener(
    "webkitfullscreenchange",
    handleFullscreenChange
  );
  document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
  document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
});

// 暴露方法给父组件
defineExpose({
  toggleFullscreen,
  enterFullscreen,
  exitFullscreen,
  isFullscreen: () => isFullscreen.value,
  isSupported: () => isSupported.value,
});
</script>

<style scoped lang="scss">
.fullscreen-button {
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #409eff;
  }
}
</style>
