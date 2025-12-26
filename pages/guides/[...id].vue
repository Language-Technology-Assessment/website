<template>
  <div
    class="main-element mt-[30vh] mb-32 pt-0 md:mt-[14rem]"
    ref="element"
    :class="{ loaded, finalpath: status !== 'pending' }"
  >
    <div class="mx-auto mb-24 text-center">
      <Appear class="mb-8!" :text="data?.title" :key="data?.title" />
      <div class="mb-4 text-center">
        <NuxtLink
          to="/guides"
          class="mx-auto inline-flex items-center gap-2 rounded-full border border-bc bg-bg px-3 py-1.5 text-xs leading-0 text-fg2 no-underline hover:text-link"
        >
          <Icon name="f7:doc-fill" />
          <span>Guide</span>
        </NuxtLink>
      </div>
      <div class="mb-1 text-xs text-fg2">by {{ data?.author }}</div>
      <div class="text-xs text-fg2">{{ useToDate(data?.date) }}</div>
    </div>
    <Sidebar type="guides" label="Latest guides" />
    <ContentRenderer
      :value="data"
      v-if="data"
      class="page transition-opacity duration-1000 starting:opacity-0"
    >
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
  "guide" + route.path,
  async () => {
    const res = await queryCollection("guides")
      .path("/" + route.path.split("guides/")[1])
      .first();
    if (import.meta.client) {
      document.documentElement.setAttribute("path", route.fullPath);
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

const defaultMeta = await queryCollection("guides")
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
    description: data.value?.description || defaultMeta?.seo?.description,
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
