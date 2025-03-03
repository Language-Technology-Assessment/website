<template>
  <div
    style="width: 100%; height: 100%; background: #fcfaf0; font-family: 'inter'"
  >
    <div
      style="
        width: 100%;
        height: 100%;
        color: #003399;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <img
        src="/osai-index-logo-text-blue.svg"
        style="width: 12rem; height: 12rem; margin-bottom: 4rem"
      />
      <div style="font-size: 2rem">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: "title",
  }
);
</script>

<style lang="less" scoped>
.og-image {
  width: 100%;
  height: 100%;
  background: var(--bg);
  font-size: 3rem;
  display: flex;
  .frame {
    color: #000;
  }
}
</style>
