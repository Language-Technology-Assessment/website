<template>
  <section class="news" id="news">
    <div class="content-frame">
      <div class="context">
        <label>News</label>
      </div>
      <div
        class="content"
        v-visiblecontainer
        v-if="visibleData && status === 'success'"
      >
        <NuxtLink
          :to="'/news' + item.path"
          v-for="item in visibleData"
          :key="item.path"
        >
          <div class="date">{{ toDate(item.date) }}</div>
          <div class="title">{{ item.title }}</div>
        </NuxtLink>
        <button class="showmore" @click="showMore()" v-if="limit < data.length">
          Show more
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";

const props = defineProps(["perpage"]);
const limit = ref(props.perpage || 3);
const perpage = computed(() => {
  return props.perpage || 3;
});

function showMore() {
  limit.value = limit.value + perpage.value;
  if (limit.value > data.value.length) {
    limit.value = data.value.length;
  }
}

const { data, status } = await useAsyncData("news", () =>
  queryCollection("news")
    .where("status", "=", "published")
    .order("date", "DESC")
    .all()
);

const visibleData = computed(() => {
  return data.value?.slice(0, limit.value);
});

function toDate(time: string) {
  // return time
  if (!time) return "";
  const rep = time.split("-").reverse().join("-");
  return useDateFormat(rep, "DD MMMM YYYY");
}
</script>

<style lang="less" scoped>
.news {
}
</style>
