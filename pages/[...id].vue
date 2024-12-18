<template>
  <div
    class="page"
    ref="element"
    :class="{ loaded, finalpath: status !== 'pending' }"
  >
    <ContentRenderer :value="data" v-if="data && status !== 'pending'">
      <template #not-found>
        <div class="not-found">Page not found.</div>
      </template>
      <template #empty>
        <div class="empty"></div>
      </template>
    </ContentRenderer>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const loaded = ref(false);
const pageKey = computed(() => {
  return Array.isArray(route.params) ? route.params.join("") : route.params;
});

const { markdownPath } = useLanguage();

const { data, error, status } = await useAsyncData(route.path, async () => {
  const res = await queryContent(markdownPath.value).findOne();
  if (!res) {
    if (import.meta.client) {
      document.documentElement.setAttribute("path", route.fullPath);
    }
    return await queryContent(route.path).findOne();
  }
  if (import.meta.client) {
    document.documentElement.setAttribute("path", route.fullPath);
  }
  return res;
});

onMounted(() => {
  document.documentElement.setAttribute("path", route.path);
  loaded.value = true;
});

definePageMeta({
  pageTransition: {
    name: "page",
    mode: "out-in",
    onEnter(el, done) {
      const route = useRoute();
      el.setAttribute("path", route.fullPath);
    },
  },
});
</script>

<style lang="less">
.page {
  // opacity: 0;

  // &.loaded.finalpath {
  //   opacity: 1;
  // }

  :root:not([path="/"]) & {
    margin-top: 14rem !important;

    @media (max-width: 60rem) {
      margin-top: 14rem !important;
    }
  }
}
</style>
