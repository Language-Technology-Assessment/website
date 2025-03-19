<template>
  <div>
    <div class="content-frame">
      <div class="context">
        <label>Spotlight</label>
        <slot></slot>
      </div>
      <div class="content">
        <TheIndex v-bind="props" class="the-index"></TheIndex>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["filters", "version", "hideFilters"]);
</script>

<style lang="less" scoped>
.context :deep(p) {
  margin: 0 0 1rem;
  font-size: 0.8rem;
}
.the-index {
  width: 100%;
  max-width: 100%;
  margin-top: 3.5rem;
  margin-bottom: 2rem;
}
</style>
