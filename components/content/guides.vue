<template>
  <section class="split-layout relative z-3" id="guides">
    <div class="left-side label mb-8">Guides</div>
    <div
      class="content"
      v-visiblecontainer
      v-if="visibleData && status === 'success'"
    >
      <div class="mb-4 grid grid-cols-1 gap-8 overflow-auto sm:grid-cols-2">
        <NuxtLink
          :to="`/guides${item.path}`"
          v-for="(item, k) in visibleData"
          :key="item.path"
          class="mb-8 flex w-100 flex-col border-l border-bc px-4 py-0 align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 hover:text-link data-visible:opacity-100"
          v-visible
        >
          <div class="title mb-2 text-2xl">{{ item.title }}</div>
          <div
            class="description text-normal mb-2 max-w-[20em] leading-5 text-fg2"
          >
            {{ item.description }}
          </div>
          <div class="label-date">
            {{ useToDate(item.date) }} | by {{ item.author }}
          </div>
        </NuxtLink>
      </div>
      <div>
        <ActionButton link="/news">Read all guides -></ActionButton>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { QueryBuilderParams } from "@nuxt/content/dist/runtime/types";
const props = defineProps(["perpage"]);
const limit = ref(10);
// const limit = ref(props.perpage || 3);
const perpage = computed(() => {
  return 10;
});

const { data, status } = await useAsyncData("guides", () =>
  queryCollectionNavigation("guides", ["date", "description", "author"]).order(
    "date",
    "DESC",
  ),
);

const visibleData = computed(() => {
  return data.value?.slice(0, limit.value);
});

function showMore() {
  limit.value = limit.value + perpage.value;
  if (limit.value > data.value.length) {
    limit.value = data.value.length;
  }
}
</script>
