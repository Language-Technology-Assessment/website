<template>
  <NuxtLink
    :to="props.link"
    class="relative z-5 mr-4 inline-block rounded-full bg-bg3/50 px-5 py-0.5 text-base leading-8 font-normal no-underline transition-colors duration-200 hover:bg-link hover:text-bg3"
  >
    <slot mdc-unwrap="p"></slot>
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps(["link"]);
</script>
