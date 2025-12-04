<template>
  <div
    class="person relative mx-auto my-8 flex w-prose max-w-container-max min-w-0 gap-8 text-sm"
  >
    <div
      class="flex min-w-0 shrink-0 cursor-pointer flex-col items-center"
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
    </div>
    <div class="">
      <div
        class="mb-2 max-w-full [&>p]:mx-0!"
        :class="{ 'line-clamp-3': !open }"
      >
        <slot></slot>
      </div>
      <button
        @click="open = !open"
        class="label flex cursor-pointer items-center gap-1 font-semibold hover:text-link"
      >
        Read {{ open ? "less" : "more" }}
        <Icon :name="open ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["image", "name"]);
const open = ref(false);
</script>
