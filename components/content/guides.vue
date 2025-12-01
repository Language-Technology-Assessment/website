<template>
  <section class="relative z-3" id="latest-guides">
    <div class="label">Latest Guides</div>
    <div
      class="content"
      v-visiblecontainer
      v-if="visibleData && status === 'success'"
    >
      <div class="mb-12 overflow-auto">
        <div
          class="mx-auto flex w-[70rem] max-w-full justify-center gap-12 overflow-auto"
        >
          <GuideCard
            v-for="guide in visibleData"
            :key="guide.id"
            :item="guide"
          />
        </div>
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
