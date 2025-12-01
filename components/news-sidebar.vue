<template>
  <div class="row h-0">
    <div
      class="fixed top-18 z-100 w-80 text-left transition-[opacity,top] duration-500 ease-in-out md:fixed lg:top-28 2xl:h-180 2xl:overflow-auto down:top-4 down:lg:top-12"
    >
      <div class="w-full text-left text-fg2 hover:text-link">
        <button
          class="flex cursor-pointer items-center gap-2 rounded-full border border-bc bg-bg px-3 text-xs leading-6 font-semibold"
          @click="open = !open"
        >
          <div class="">Latest News</div>
          <Icon :name="open ? 'fe:drop-up' : 'fe:drop-down'" class="h-4 w-4" />
        </button>
      </div>
      <div v-if="open" class="bg-bg2 pt-8">
        <NuxtLink
          class="group/card y-top mr-8 mb-2 block w-[16rem] cursor-pointer flex-col border-t border-bc px-0 py-2 text-left align-top whitespace-normal no-underline opacity-0 transition-opacity duration-1000 data-visible:opacity-100"
          :to="'/news' + item.path"
          v-for="item in data"
          :key="item.path"
          v-visible
        >
          <div :class="{ 'opacity-50!': $route.path === '/news' + item.path }">
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
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data, status } = await useAsyncData("news", () =>
  queryCollection("news")
    .where("status", "=", "published")
    .order("date", "DESC")
    .all(),
);
const open = ref(false);
</script>
