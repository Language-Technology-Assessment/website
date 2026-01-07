<template>
  <NuxtLink
    :to="`/guides${item.path}`"
    :key="item.path"
    class="group/card mb-8 flex aspect-5/6 w-80 max-w-[calc(100vw-2rem)] shrink-0 grow-0 flex-col rounded-xl border border-bc bg-bg p-8 pb-4 text-left align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 hover:text-link data-visible:opacity-100 [@media(max-width:25rem)]:p-6"
    :class="{ 'text-fg2': route.path === `/guides${item.path}` }"
    v-visible
  >
    <div class="title mb-3 text-2xl">{{ item.title }}</div>
    <div
      class="description text-normal mx-auto mb-2 max-w-[20em] grow leading-5 opacity-50"
    >
      {{ item.description }}
    </div>
    <div class="label-date mb-2 group-hover/card:text-link/50!">
      {{ useToDate(item.date) }} | by {{ item.author }}
    </div>
  </NuxtLink>
</template>
<script lang="ts" setup>
const route = useRoute();
const { item } = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
