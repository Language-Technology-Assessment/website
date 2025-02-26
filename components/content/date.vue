<template>
  <div class="date">
    <slot mdc-unwrap="p">{{ props.date }}</slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["date"]);
</script>

<style lang="less" scoped>
.date {
  text-align: center;
  margin-top: -2rem;
  margin-bottom: 4rem;
  font-size: 0.8rem;
  color: var(--fg2);
}
</style>
