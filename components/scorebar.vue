<template>
  <div
    class="scorebar"
    ref="el"
    :class="{ isVisible, isNotVisible: !isVisible }"
  >
    <div
      class="score"
      :style="{
        width: `${(score.toFixed(2) == 0 ? 0.01 : score.toFixed(2)) * 100}%`,
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

<style scoped>
.scorebar {
  height: var(--sb-height, 0.5rem);
  width: var(--sb-width, 5rem);
  border-radius: calc(var(--sb-height, 0.5rem) / 2);
  position: relative;
  background: var(--bg);
  overflow: hidden;
  transition: all 1s ease;
}
.scorebar .score {
  position: absolute;
  background: var(--fg);
  top: 0;
  left: 0;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.scorebar.isNotVisible {
  opacity: 0;
}
.scorebar.isNotVisible .score {
  width: 0 !important;
}
</style>
