<template>
  <section
    class="transition-opacity delay-500 duration-1000 starting:opacity-0"
    id="spotlight"
  >
    <div class="split-layout">
      <div class="left-side">
        <div class="label">Explore open source AI</div>
      </div>
      <div class="content grow">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/css/tailwind.css";
.context :deep(p) {
  @apply text-sm;
  margin: 0 0 1rem;
}
</style>
