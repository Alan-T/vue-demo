<template>
  <v-label
    :config="{
      x: props.x,
      y: props.y,
      visible: visible,
      rotation: -props.rotation,
      offsetY: props.offsetY,
      offsetX: -props.offsetX,
      scaleY: -1,
    }"
  >
    <v-tag
      :config="{
        fill: '#262626',
        pointerDirection: 'down',
        pointerWidth: 10 * props.scale,
        pointerHeight: 6 * props.scale,
        cornerRadius: 2 * props.scale,
        opacity: 1,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 6 * props.scale,
        shadowOffsetX: 6 * props.scale,
        shadowOffsetY: 6 * props.scale,
        shadowOpacity: 0.5,
      }"
    />
    <v-text
      :config="{
        text: text,
        fontFamily: 'Arial',
        fontSize: 12 * props.scale,
        padding: 8 * props.scale,
        fill: 'white',
      }"
    />
  </v-label>
</template>
<script setup lang="ts">
interface Props {
  x?: number;
  y?: number;
  offsetX?: number;
  offsetY?: number;
  text: string;
  rotation?: number;
  scale?: number;
  placement?: "top" | "bottom";
  visible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  offsetX: 0,
  offsetY: 0,
  text: "",
  rotation: 0,
  scale: 1,
  placement: "top",
  visible: false,
});
</script>
