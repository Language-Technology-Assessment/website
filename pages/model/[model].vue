<template>
  <div class="loaded finalpath mt-[14rem]">
    <ModelInfo :models="models" :categories="categories"></ModelInfo>
  </div>
</template>

<script lang="ts" setup>
import SEORaw from "~/repos/website/SEO.yml";
import { getProperty } from "dot-prop";
const route = useRoute();

const interpolate = (template, data) => {
  return template.replace(
    /\{([^}]+)\}/g,
    (_, path) => getProperty(data, path) ?? "",
  );
};

const SEO = ref(SEORaw);

const { categories, models } = useModels(String(route.query?.version));
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

const title = computed(() => {
  const placeholder = SEO.value?.models?.title;
  if (!placeholder) return "Model information.";
  const pad = route.params.model;
  const model = models.value.find((x) => x.filename === pad);
  if (!model) return "Model information.";
  const m = JSON.parse(JSON.stringify(model));
  return interpolate(placeholder, m);
});

const description = computed(() => {
  const placeholder = SEO.value?.models?.description;
  if (!placeholder) return "Model information.";
  const pad = route.params.model;
  const model = models.value.find((x) => x.filename === pad);
  if (!model) return "Model information.";
  const m = JSON.parse(JSON.stringify(model));
  return interpolate(placeholder, m);
});

useSeoMeta({
  title: () => {
    return title.value;
  },
  ogImage: "/osai-index-logo.png",
  description: () => {
    return description.value;
  },
  ogDescription: () => {
    return description.value;
  },
  icon: "/favicon.svg",
  twitterImage: () => {
    return "/osai-index-logo.png";
  },
  twitterTitle: () => {
    return title.value;
  },
  twitterDescription: () => {
    return description.value;
  },
});
</script>
