<template>
  <div class="w-full h-full bg-[#fcfaf0] font-inter">
    <div class="w-full h-full text-[#003399] flex items-center justify-center">
      <img src="/osai-index-logo-text-blue.svg" class="w-48 h-48 mb-16" />
      <div class="text-3xl">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: "title",
  }
);
</script>
