<template>
  <NuxtLink
    to="/the-index"
    class="relative z-5 inline-block rounded border border-bc bg-bg px-5 py-3 text-xl no-underline hover:bg-bg"
  >
    {{ props.text }}
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps(["text"]);
</script>

<style lang="less" scoped></style>
