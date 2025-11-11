<template>
  <div
    class="row hidden h-0 transition delay-1000 duration-1000 ease-in-out xl:block starting:opacity-0"
  >
    <div
      class="left-side top-32 w-80 text-left 2xl:fixed 2xl:h-80 2xl:overflow-auto"
    >
      <div
        class="mb-8 w-full text-left text-xs leading-5 font-semibold text-fg2"
      >
        Latest Guides:
      </div>
      <NuxtLink
        class="group/card y-top mr-8 mb-2 block w-[16rem] flex-col border-t border-bc px-0 py-2 text-left align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 data-visible:opacity-100"
        :to="'/guides' + item.path"
        v-for="item in data"
        :key="item.path"
        v-visible
      >
        <div class="text-tiny font-semibold tracking-wide text-fg2 uppercase">
          {{ useToDate(item.date) }}
        </div>
        <div class="title mb-2 text-sm leading-5">{{ item.title }}</div>
      </NuxtLink>
    </div>
    <div class="content"></div>
  </div>
</template>

<script lang="ts" setup>
const { data, status, error } = await useAsyncData("guides", () =>
  queryCollection("guides")
    .where("status", "=", "published")
    .order("date", "DESC")
    .all(),
);
</script>
