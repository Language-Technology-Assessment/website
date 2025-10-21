<template>
  <div
    class="border-t border-bc py-4 transition-opacity delay-500 duration-1000 starting:opacity-0"
  >
    <div class="split-layout">
      <div class="left-side">
        <div class="mb-4 block px-0 text-xs font-semibold uppercase">
          Explore open source AI
        </div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/css/tailwind.css";
.context :deep(p) {
  @apply text-sm;
  margin: 0 0 1rem;
}
</style>
