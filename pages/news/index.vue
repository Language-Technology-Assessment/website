<template name="/news">
  <section class="mt-[14rem]">
    <div class="label">News overview:</div>
    <div class="content mb-24">
      <NuxtLink
        class="group/card y-top mx-auto mb-8 block w-[32rem] max-w-container-max flex-col border-t border-bc py-3 align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 data-visible:opacity-100"
        :to="'/news' + item.path"
        v-for="item in data"
        :key="item.path"
        v-visible
      >
        <div class="label-date mb-2">
          {{ useToDate(item.date) }}
        </div>
        <div class="title mb-2 text-2xl leading-7">{{ item.title }}</div>
        <div class="title mb-2 w-[32em] max-w-full leading-5 text-fg2">
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
