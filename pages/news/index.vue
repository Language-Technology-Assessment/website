<template name="/news">
  <div class="mt-[14rem]">
    <div class="row split-layout">
      <div class="left-side">
        <div class="label">News</div>
      </div>
      <div class="content">
        <NuxtLink
          class="group/card y-top mb-8 block w-[38rem] max-w-container-max flex-col border-t border-bc py-3 align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 hover:border-link/30 data-visible:opacity-100"
          :to="'/news' + item.path"
          v-for="item in data"
          :key="item.path"
          v-visible
        >
          <div class="title mb-2 text-2xl leading-7">{{ item.title }}</div>
          <div class="title mb-2 w-[32em] max-w-full leading-5 text-fg2">
            {{ item.description }}
          </div>
          <div class="label-date mb-2">
            {{ useToDate(item.date) }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
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
