<template>
  <div class="row split-layout h-0">
    <div class="left-side sticky top-0">
      <NuxtLink
        class="group/card y-top mr-8 mb-2 block w-[16rem] flex-col border-t border-bc px-0 py-2 align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 hover:border-link/30 data-visible:opacity-100"
        :to="'/news' + item.path"
        v-for="item in data"
        :key="item.path"
        v-visible
      >
        <div class="title mb-2 text-sm leading-5">{{ item.title }}</div>
        <!-- <div class="title text-xs leading-5 text-fg2">
          {{ item.description }}
        </div> -->
        <div
          class="date flex items-end text-tiny font-semibold tracking-wide text-fg2 uppercase no-underline"
        >
          <div>{{ useToDate(item.date) }}</div>
          <div class="grow"></div>
        </div>
      </NuxtLink>
    </div>
    <div class="content"></div>
  </div>
</template>

<script lang="ts" setup>
const { data, status } = await useAsyncData("news", () =>
  queryCollection("news")
    .where("status", "=", "published")
    .order("date", "DESC")
    .all(),
);
</script>
