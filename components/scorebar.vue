<template>
  <div
    class="relative overflow-hidden rounded-full transition-all duration-1000 ease-in-out"
    :class="{ 'opacity-0': !isVisible }"
    ref="el"
    :style="{
      height: 'var(--sb-height, 0.5rem)',
      width: 'var(--sb-width, 5rem)',
      background: 'var(--bg)',
    }"
  >
    <div
      class="absolute top-0 left-0 h-full transition-all duration-300 ease-out"
      :class="{ '!w-0': !isVisible }"
      :style="{
        width: `${(score.toFixed(2) == 0 ? 0.01 : score.toFixed(2)) * 100}%`,
        background: 'var(--fg)',
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { useElementVisibility } from "@vueuse/core";
const el = ref();
const props = defineProps(["score"]);
const isVisible = useElementVisibility(el);
const score = computed(() => {
  return isVisible ? props.score : 0;
});
</script>
