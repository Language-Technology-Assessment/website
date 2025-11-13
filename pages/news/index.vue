<template name="/news">
  <section class="mt-[14rem]">
    <div class="label">News overview:</div>
    <div
      class="mx-auto mb-24 grid w-[70rem] max-w-full justify-start gap-4 overflow-auto sm:grid-cols-2 sm:gap-12 lg:grid-cols-3"
    >
      <NuxtLink
        class="group/card y-top mx-auto mb-8 block w-full flex-col border-t border-bc py-3 align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 data-visible:opacity-100"
        :to="'/news' + item.path"
        v-for="item in data"
        :key="item.path"
        v-visible
      >
        <div class="label-date mb-2">
          {{ useToDate(item.date) }}
        </div>
        <div class="title mb-2 text-xl leading-7">{{ item.title }}</div>
        <div class="mb-2 w-[32em] max-w-full text-xs leading-5 text-fg2">
          {{ item.description }}
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps(["perpage"]);

const { data } = await useAsyncData("news", () =>
  queryCollection("news")
    .where("status", "=", "published")
    .order("date", "DESC")
    .all(),
);
</script>
