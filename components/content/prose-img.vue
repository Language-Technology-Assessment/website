<template>
  <NuxtImg class="inline-image" :src="src" sizes="1200px sm:500px md:800px"></NuxtImg>
</template>

<script lang="ts" setup>
const props = defineProps(['src'])
const src = computed(() => {
  return `https://raw.githubusercontent.com/Language-Technology-Assessment/European-open-AI-index/main${props.src}`
})
</script>

<style lang="less" scoped>
.inline-image {
  display: block;
  margin: 1rem auto 2rem;
}
</style>