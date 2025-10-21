<template>
  <div class="max-w-full overflow-auto loaded finalpath">
    <ClientOnly>
      <div class="table p-8 rounded-none md:p-2">
        <div
          class="names sticky top-0 bg-bg z-20 transition-all duration-200 scroll-up:nottop:top-[3.2rem] scroll-up:nottop:delay-250"
        >
          <NuxtLink
            :to="`/model/${model.filename}`"
            class="model-name block relative text-center no-underline bg-bg2 p-6 rounded border-b-2 border-bg text-xl"
            v-for="(model, k) in modelsList"
          >
            <div class="name" v-if="model?.system">
              {{ model.system.name || "(undefined)" }}
            </div>
            <div class="org text-sm text-fg2" v-if="model?.org">
              by {{ model.org.name || "(undefined)" }}
            </div>
            <div
              class="count text-fg2 text-[0.65rem] absolute top-0 left-0 px-2 py-1 opacity-50 rounded-bl"
            >
              {{ k + 1 }}/{{ modelsList.length }}
            </div>
          </NuxtLink>
        </div>
        <div class="category" v-for="cat in categories">
          <category
            class="model-category"
            :category="cat"
            :model="model"
            v-for="model in modelsList"
          ></category>
        </div>
      </div>
    </ClientOnly>
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

const store = useMyComparisonStore();
const { models, categories } = useModels(String(route.query?.version));

const modelsList = computed(() => {
  if (!route.query?.models || typeof route.query.models !== "string") {
    return false;
  }
  const filenames = route.query.models.split(",");
  const list = filenames
    .map((x) => {
      return getModel(x);
    })
    .filter((x) => x);
  return list;
});

function getModel(filename: string) {
  if (!filename) return false;
  return models.value.find((x) => x.filename === filename);
}

useHead({
  titleTemplate: () => {
    if (!route.query.models) {
      return "Compare AI models";
    }
    const namesList = route.query.models.split(",") || [];
    const last = namesList.pop();
    const names = namesList.join(", ") + " and " + last;
    return "Compare " + (route.query?.models ? names : "");
  },
});
const title = computed(() => {
  const placeholder = SEO.value?.compare?.description;
  if (!placeholder) return "Compare AI models.";
  const names = models.value.map((x) => x.system.name).join(", ");
  return interpolate(placeholder, { names });
});

const description = computed(() => {
  const placeholder = SEO.value?.compare?.description;
  if (!placeholder) return "Compare AI models.";
  const names = models.value.map((x) => x.system.name).join(", ");
  return interpolate(placeholder, { names });
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

<style scoped>
/* Additional scoped CSS for specific behaviors not easily covered by Tailwind */
.table > div {
  display: flex;
  gap: 2rem;
  margin-bottom: 0.25rem;
  justify-content: center;
}
@media (max-width: 40rem) {
  .table > div {
    gap: 0.5rem;
  }
}
@media (max-width: 30rem) {
  .table > div > a,
  .table > .category > .category {
    width: calc(100vw - 2rem);
    max-width: calc(100vw - 2rem);
  }
}
.category :deep(.category-bar) {
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
