<template>
  <div class="author">by {{ props.author }}</div>
</template>

<script lang="ts" setup>
const props = defineProps(["author"]);
</script>

<style lang="less" scoped>
.author {
  text-align: center;
  margin-top: -2rem;
  margin-bottom: 4rem;
  font-size: 0.8rem;
  color: var(--fg2);
}
</style>
