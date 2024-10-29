<template>
  <div class="page loaded finalpath">
    <ModelInfo :models="models" :categories="categories"></ModelInfo>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

const { categories, models } = useModels(String(route.query?.version))
definePageMeta({
  pageTransition: {
    name: "page",
    mode: "out-in",
    onEnter(el, done) {
      const route = useRoute()
      el.setAttribute('path', route.fullPath)
    },
  }
})
</script>

<style lang="less" scoped></style>