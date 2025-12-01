<template>
  <div class="row h-0">
    <div
      class="fixed top-18 z-100 h-[80vh] max-w-[calc(100%-2rem)] overflow-auto text-left transition-[opacity,top] duration-500 ease-in-out md:w-80 lg:top-28 down:top-4 down:lg:top-4"
    >
      <div class="rounded-xl border border-bc bg-bg px-3">
        <div class="w-full text-left text-fg2 hover:text-link">
          <button
            class="flex w-full cursor-pointer items-center gap-2 text-left text-xs leading-8 font-semibold"
            @click="open = !open"
          >
            <div class="grow">{{ props.label }}</div>
            <Icon
              :name="open ? 'fe:drop-up' : 'fe:drop-down'"
              class="h-4 w-4"
            />
          </button>
        </div>
        <div v-if="open" class="pt-4 transition-opacity duration-300">
          <NuxtLink
            class="group/card y-top mb-2 block cursor-pointer flex-col border-t border-bc px-0 py-2 text-left align-top whitespace-normal no-underline"
            :to="'/' + props.type + item.path"
            v-for="item in data"
            :key="item.path"
          >
            <div
              :class="{
                'text-link': route.path === '/' + props.type + item.path,
              }"
            >
              <div class="title mb-2 text-sm leading-5">{{ item.title }}</div>
              <div
                class="date flex items-end text-tiny font-semibold tracking-wide uppercase no-underline opacity-50"
              >
                <div>{{ useToDate(item.date) }}</div>
                <div class="grow"></div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: String,
  label: String,
});
const route = useRoute();
const { data, status } = await useAsyncData("sidebar_all_" + props.type, () =>
  queryCollection(props.type)
    .where("status", "=", "published")
    .order("date", "DESC")
    .all(),
);
const open = ref(false);
</script>
