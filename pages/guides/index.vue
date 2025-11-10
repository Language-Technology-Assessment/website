<template name="/news">
  <section class="mt-[14rem]">
    <div class="label">All guides:</div>
    <div class="content min-h-[80vh]">
      <NuxtLink
        class="group/card y-top mx-auto mb-8 block w-prose max-w-container-max flex-col py-3 align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 data-visible:opacity-100"
        :to="'/guides' + item.path"
        v-for="item in data"
        :key="item.path"
        v-visible
      >
        <div class="label-date mb-2">
          {{ useToDate(item.date) }} | by {{ item.author }}
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

const { data } = await useAsyncData("guides", () =>
  queryCollection("guides")
    .where("status", "=", "published")
    .order("date", "DESC")
    .all(),
);
</script>
