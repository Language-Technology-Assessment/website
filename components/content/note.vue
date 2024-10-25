<template>
  <div class="note">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.note {
  width: var(--pwidth);
  max-width: var(--maxwidth);
  font-size: 0.75rem;
  margin: 0 auto 1em;
  border-radius: 0.25em;
  font-weight: 600;
  color: var(--fg2);
  // position: absolute;
  // bottom: 0;

  :deep(p) {
    max-width: 100%;
    margin-bottom: 0.5em;
  }
}
</style>