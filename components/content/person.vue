<template>
  <div class="person relative my-8 flex max-w-[var(--maxwidth)] gap-8 text-sm">
    <div
      class="flex shrink-0 cursor-pointer flex-col items-center"
      @click="open = !open"
    >
      <div class="h-16 w-16 shrink-0">
        <NuxtImg
          :src="props.image"
          width="400"
          :alt="props.name"
          v-if="props.image"
          class="h-full w-full rounded-full object-cover"
        ></NuxtImg>
      </div>
      <!-- <div class="text-center font-semibold text-fg">
        {{ props.name }}
      </div> -->
    </div>
    <div class="content">
      <div class="w-[32em]">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["image", "name"]);
const open = ref(false);
</script>
