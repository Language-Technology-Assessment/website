<template>
  <div class="z-3">
    <section class="split-layout news py-12" id="news">
      <div class="left-side label sticky top-8 mb-8 block px-0">News</div>
      <div
        class="overflow-auto pb-8"
        v-visiblecontainer
        v-if="visibleData && status === 'success'"
      >
        <NuxtLink
          class="group/card y-top mr-8 mb-8 inline-flex w-full flex-col border-t border-bc px-0 py-2 align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 hover:border-link/30 data-visible:opacity-100 sm:aspect-4/3 sm:w-64"
          :to="'/news' + item.path"
          v-for="item in visibleData"
          :key="item.path"
          v-visible
        >
          <div class="title mb-4 text-xl leading-6">{{ item.title }}</div>
          <div class="title text-xs leading-5 text-fg2">
            {{ item.description }}
          </div>
          <div
            class="date mb-2 text-tiny font-semibold tracking-wide text-fg2 uppercase no-underline"
          >
            {{ useToDate(item.date) }}
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
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
