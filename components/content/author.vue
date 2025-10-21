<template>
  <div
    class="-mt-8 mr-auto mb-12 ml-leftplus w-prose max-w-container-max text-left text-[0.8rem] text-fg2"
  >
    by <slot mdc-unwrap="p">{{ props.author }}</slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["author"]);
</script>
