<template>
  <NuxtImg
    class="block my-8 mx-auto max-w-full"
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
