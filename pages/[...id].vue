<template>
  <div
    class="page"
    ref="element"
    :class="{ loaded, finalpath: status !== 'pending' }"
  >
    <ContentRenderer :value="data" v-if="data">
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

const { data, error, status } = await useAsyncData(
  "page" + route.path,
  async () => {
    const all = await queryCollection("pages").all();
    console.log(all);
    const res = await queryCollection("pages").path(markdownPath.value).first();
    if (import.meta.client) {
      document.documentElement.setAttribute("path", route.fullPath);
    }
    if (!res) {
      return await queryCollection("pages").path(route.path).first();
    }
    return res;
  }
);

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
