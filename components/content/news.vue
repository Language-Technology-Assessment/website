<template>
  <section class="split-layout news z-3" id="news">
    <div class="left-side label">News</div>
    <div
      class="grid grid-cols-1 gap-8 overflow-auto pb-8 sm:grid-cols-2 lg:grid-cols-3"
      v-visiblecontainer
      v-if="visibleData && status === 'success'"
    >
      <NuxtLink
        class="group/card y-top mr-8 mb-8 w-full flex-col border-l border-bc px-4 py-0 align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 hover:border-link/30 data-visible:opacity-100 sm:aspect-4/3 sm:w-64"
        :to="'/news' + item.path"
        v-for="item in visibleData"
        :key="item.path"
        v-visible
      >
        <div class="title mb-2 text-xl leading-6">{{ item.title }}</div>
        <div class="title mb-4 text-xs leading-5 text-fg2">
          {{ item.description }}
        </div>
        <div class="label-date">
          {{ useToDate(item.date) }}
        </div>
      </NuxtLink>
      <div>
        <ActionButton link="/news">Read all news -></ActionButton>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps(["perpage"]);
const limit = ref(20);
const perpage = computed(() => {
  return 20;
});

function showMore() {
  limit.value = limit.value + perpage.value;
  if (limit.value > data.value.length) {
    limit.value = data.value.length;
  }
}

const { data, status } = await useAsyncData("news", () =>
  queryCollection("news")
    .where("status", "=", "published")
    .order("date", "DESC")
    .all(),
);

const visibleData = computed(() => {
  return data.value?.slice(0, limit.value);
});
</script>
