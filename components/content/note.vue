<template>
  <div
    class="note mb-[1em] ml-leftplus w-[30em] max-w-container-max text-[0.75rem] font-semibold text-fg2"
  >
    <slot mdc-unwrap="p"></slot>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.note :deep(p) {
  max-width: 100%;
  margin-bottom: 0.5em;
}
</style>
