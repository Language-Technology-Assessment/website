<template>
  <div class="page loaded finalpath">
    <ModelInfo :models="models" :categories="categories"></ModelInfo>
  </div>
</template>

<script lang="ts" setup>
import { getProperty } from "dot-prop";
const route = useRoute();

const interpolate = (template, data) => {
  return template.replace(
    /\{([^}]+)\}/g,
    (_, path) => getProperty(data, path) ?? ""
  );
};

const { data: SEO } = useAsyncData("seo", () => {
  return import("@/repos/website/SEO.yml").then((module) => module.default);
});

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

useSeoMeta({
  title: () => {
    const placeholder = SEO.value?.models?.title;
    if (!placeholder) return "Model information.";
    const pad = route.params.model;
    const model = models.value.find((x) => x.filename === pad);
    if (!model) return "Model information.";
    const m = JSON.parse(JSON.stringify(model));
    return interpolate(placeholder, m);
  },
  description: () => {
    const placeholder = SEO.value?.models?.description;
    if (!placeholder) return "Model information.";
    const pad = route.params.model;
    const model = models.value.find((x) => x.filename === pad);
    if (!model) return "Model information.";
    const m = JSON.parse(JSON.stringify(model));
    return interpolate(placeholder, m);
  },
});
</script>

<style lang="less" scoped></style>
