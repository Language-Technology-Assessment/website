<template>
  <section class="guides" id="guides">
    <div class="content-frame">
      <div class="context">
        <label>Guides</label>
      </div>
      <div
        class="content"
        v-visiblecontainer
        v-if="visibleData && status === 'success'"
      >
        <NuxtLink
          :to="`/guides${item.path}`"
          v-for="(item, k) in visibleData"
          :key="item.path"
        >
          <div class="title">{{ item.title }}</div>
          <div class="description">{{ item.description }}</div>
        </NuxtLink>
        <button class="showmore" @click="showMore()" v-if="limit < data.length">
          Show more
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { QueryBuilderParams } from "@nuxt/content/dist/runtime/types";
const props = defineProps(["perpage"]);
const limit = ref(props.perpage || 3);
const perpage = computed(() => {
  return props.perpage || 3;
});

const { data, status } = await useAsyncData("guides", () =>
  queryCollectionNavigation("guides", ["date", "description"]).order(
    "date",
    "DESC"
  )
);

const visibleData = computed(() => {
  return data.value?.slice(0, limit.value);
});

function showMore() {
  limit.value = limit.value + perpage.value;
  if (limit.value > data.value.length) {
    limit.value = data.value.length;
  }
}
</script>

<style lang="less" scoped>
.guides {
}
</style>
