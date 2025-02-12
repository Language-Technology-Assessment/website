<template>
  <NuxtImg
    class="inline-image"
    :src="props.src"
    sizes="1200px sm:500px md:800px"
  ></NuxtImg>
</template>

<script lang="ts" setup>
const props = defineProps(["src"]);
defineOptions({
  inheritAttrs: false,
});
</script>

<style lang="less" scoped>
.inline-image {
  display: block;
  margin: 1rem auto 2rem;
  max-width: 100%;
}
</style>
