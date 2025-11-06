<template>
  <div
    class="main-element mt-[30vh] pt-0 md:mt-[14rem]"
    ref="element"
    :class="{ loaded, finalpath: status !== 'pending' }"
  >
    <div class="row split-layout mb-24">
      <div class="left-side"></div>
      <div class="right-side grow">
        <h1
          class="mb-8 w-prose max-w-container-max font-display text-4xl font-light xl:text-5xl"
        >
          {{ data.title }}
        </h1>
        <div class="mb-1 text-sm text-fg2" v-if="data.author">
          by {{ data.author }}
        </div>
        <div class="text-sm text-fg2" v-if="data.date">
          {{ useToDate(data.date) }}
        </div>
      </div>
    </div>
    <GuidesSidebar v-if="$route.path.startsWith('/guides')" />
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
