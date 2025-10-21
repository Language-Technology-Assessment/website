<template>
  <div
    class="main-element mt-[14rem]"
    ref="element"
    :class="{ loaded, finalpath: status !== 'pending' }"
  >
    <NewsSidebar v-if="$route.path.startsWith('/news')" />
    <ContentRenderer :value="data" v-if="data" class="page">
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
    const res = await queryCollection("pages").path(markdownPath.value).first();
    if (import.meta.client) {
      document.documentElement.setAttribute("path", route.fullPath);
    }
    if (!res) {
      return await queryCollection("pages").path(route.path).first();
    }
    return res;
  },
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

const defaultMeta = await queryCollection("pages")
  .path("/")
  .first()
  .catch((err) => {
    console.log("error");
  });

useHead(
  data.value?.head || {
    titleTemplate: (titleChunk) => {
      if (titleChunk === "European Open Source AI Index") {
        return titleChunk;
      }
      return titleChunk
        ? `${titleChunk} | European Open Source AI Index`
        : "European Open Source AI Index";
    },
  },
);

const seo = computed(() => {
  const defaults = {
    title: data.value?.title || defaultMeta?.seo?.title,
    description: data.value.description || defaultMeta?.seo?.description,
    ogImage: "/osai-index-logo.png",
    ogDescription: data.value?.description || defaultMeta?.seo?.description,
    twitterCard: "summary_large_image",
    twitterTitle: data.value?.title || defaultMeta?.title,
    twitterDescription:
      data.value?.description || defaultMeta?.seo?.description,
    twitterImage: "/osai-index-logo.png",
  };
  return { ...defaults, ...data.value?.seo };
});

useSeoMeta(seo.value);
</script>

<style>
.main-element {
  /* retain page-specific margin behavior from Less */
  padding-top: 0;
}
</style>
