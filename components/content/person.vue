<template>
  <div
    class="person my-8 inline-block w-1/3 max-w-[var(--maxwidth)] rounded-lg border border-bc p-6"
  >
    <div
      class="flex cursor-pointer flex-col items-center gap-4"
      @click="open = !open"
    >
      <div class="h-32 w-32 shrink-0">
        <NuxtImg
          :src="props.image"
          width="800"
          :alt="props.name"
          v-if="props.image"
          class="h-full w-full rounded-full object-cover"
        ></NuxtImg>
      </div>
      <div class="text-center text-[1.125rem] text-fg">
        {{ props.name }}
      </div>
    </div>
    <div class="content" v-if="open">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["image", "name"]);
const open = ref(false);
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
