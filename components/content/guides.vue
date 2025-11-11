<template>
  <section class="relative z-3" id="latest-guides">
    <div class="label">Latest Guides</div>
    <div
      class="content"
      v-visiblecontainer
      v-if="visibleData && status === 'success'"
    >
      <div
        class="mb-12 grid grid-cols-1 gap-12 overflow-auto sm:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          :to="`/guides${item.path}`"
          v-for="(item, k) in visibleData"
          :key="item.path"
          class="mb-8 flex w-100 flex-col py-0 text-center align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 hover:text-link data-visible:opacity-100"
          v-visible
        >
          <div class="title mb-3 text-2xl">{{ item.title }}</div>
          <div class="label-date mb-2">
            {{ useToDate(item.date) }} | by {{ item.author }}
          </div>
          <div
            class="description text-normal mx-auto mb-2 max-w-[20em] leading-5 text-fg2"
          >
            {{ item.description }}
          </div>
        </NuxtLink>
      </div>
      <div class="text-center">
        <ActionButton link="/guides">Read all guides -></ActionButton>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const limit = ref(10);

const { data, status } = await useAsyncData("guides-landing", () =>
  queryCollectionNavigation("guides", ["date", "description", "author"])
    .where("status", "=", "published")
    .order("date", "DESC"),
);

const visibleData = computed(() => {
  return data.value?.slice(0, limit.value);
});
</script>
