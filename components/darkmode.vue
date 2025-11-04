<template>
  <button
    class="darkmode group/button mb-1 flex cursor-pointer items-center gap-0.5 rounded-full border border-bg bg-fg px-1.5 py-1 text-sm leading-0 text-bg hover:bg-link"
    @click.stop="isDark = !isDark"
    aria-label="Toggle dark mode"
  >
    <Icon
      class="light-icon text-fg3 dark:text-bg3 dark:opacity-0"
      name="ic:baseline-light-mode"
      aria-hidden="true"
    ></Icon>
    <Icon
      class="dark-icon text-bg opacity-0 dark:opacity-100"
      name="ic:round-dark-mode"
      aria-hidden="true"
    ></Icon>
  </button>
</template>

<script lang="ts" setup>
const { isDark } = useDark();
</script>
