<template>
  <div class="date">
    <slot mdc-unwrap="p">{{ useDateFormat(props.date, "DD MMMM YYYY") }}</slot>
  </div>
</template>

<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
const props = defineProps(["date"]);
</script>

<style lang="less" scoped>
.date {
  text-align: center;
  margin-top: -3rem;
  margin-bottom: 4rem;
  font-size: 0.7rem;
  color: var(--fg2);
}
</style>
