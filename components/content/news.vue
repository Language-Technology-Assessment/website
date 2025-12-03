<template>
  <section class="news z-3" id="latest-news">
    <div class="label">Latest news</div>
    <div
      class="mx-auto mb-12 grid w-[70rem] max-w-full justify-start gap-4 overflow-auto sm:grid-cols-2 sm:gap-12 lg:grid-cols-3"
      v-visiblecontainer
      v-if="visibleData && status === 'success'"
    >
      <NuxtLink
        class="group/card y-top w-full flex-col border-t border-bc px-0 py-0 pt-2 align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 hover:border-link/30 data-visible:opacity-100 sm:mb-8"
        :to="'/news' + item.path"
        v-for="item in visibleData"
        :key="item.path"
        v-visible
      >
        <div class="label-date mb-3 group-hover/card:text-link/50!">
          {{ useToDate(item.date) }}
        </div>
        <div class="title mb-2 text-xl leading-6">{{ item.title }}</div>
        <div
          class="title mb-4 text-xs leading-5 text-fg2 group-hover/card:text-link/50"
        >
          {{ item.description }}
        </div>
      </NuxtLink>
    </div>
    <div class="row mx-auto text-center">
      <ActionButton link="/news" class="mr-0!">Read all news -></ActionButton>
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
