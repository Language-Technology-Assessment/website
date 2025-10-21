<template>
  <div
    class="note w-[var(--pwidth)] max-w-[var(--maxwidth)] text-[0.75rem] mx-auto mb-[1em] rounded font-semibold text-fg2"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.note :deep(p) {
  max-width: 100%;
  margin-bottom: 0.5em;
}
</style>
