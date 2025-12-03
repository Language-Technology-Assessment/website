<template name="/news">
  <section class="mt-[14rem] min-h-[80vh]">
    <div class="label">All guides:</div>
    <div
      class="content mx-auto flex max-w-full flex-wrap items-start justify-center gap-12"
    >
      <GuideCard v-for="item in data" :key="item.path" :item="item" />
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps(["perpage"]);

const { data } = await useAsyncData("guides", () =>
  queryCollection("guides")
    .where("status", "=", "published")
    .order("date", "DESC")
    .all(),
);
</script>
