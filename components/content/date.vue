<template>
  <div
    class="-mt-12 mr-auto mb-16 ml-leftplus w-prose max-w-container-max text-left text-[0.7rem] text-fg2"
  >
    <slot mdc-unwrap="p">{{ useDateFormat(props.date, "DD MMMM YYYY") }}</slot>
  </div>
</template>

<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
const props = defineProps(["date"]);
</script>
