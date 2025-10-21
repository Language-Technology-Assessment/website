<template>
  <div
    class="person my-8 ml-leftplus w-[var(--pwidth)] max-w-[var(--maxwidth)] rounded-lg bg-bg p-6 md:p-6"
  >
    <div class="mb-6 flex flex-row items-center gap-4">
      <div class="h-16 w-16 shrink-0">
        <NuxtImg
          :src="props.image"
          width="400"
          :alt="props.name"
          v-if="props.image"
          class="h-full w-full rounded-full object-cover"
        ></NuxtImg>
      </div>
      <div class="text-[1.125rem] font-semibold text-fg">
        {{ props.name }}
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["image", "name"]);
</script>

<style scoped>
.person .content :deep(p) {
  width: 100%;
  max-width: 100%;
  margin: 0 auto 1rem;
  font-weight: 400;
  font-size: 0.8rem;
  line-height: 1.6;
}
</style>
