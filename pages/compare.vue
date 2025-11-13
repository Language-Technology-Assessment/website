<template>
  <div class="loaded finalpath mt-32 max-w-full">
    <div
      v-if="!modelsList"
      class="flex h-screen w-full items-center justify-center"
    >
      <div>
        Please visit <NuxtLink to="/the-index">the index</NuxtLink> to select
        models to compare.
      </div>
    </div>
    <ClientOnly>
      <!-- quick comparison -->
      <div class="row">
        <div class="label mb-8 text-center">Quick Comparison</div>
        <div
          class="mx-auto mb-12 w-full max-w-200 rounded-xl border border-bc bg-bg p-6 sm:p-8"
        >
          <div v-for="item in modelsList" class="mb-6">
            <div
              class="mb-2 flex items-center max-sm:items-start"
              @click="router.push(`/model/${item.filename}`)"
            >
              <div class="relative h-16 flex-1 sm:h-12">
                <div class="absolute max-w-full max-sm:top-0">
                  <div
                    class="w-full overflow-hidden leading-[1.3] text-ellipsis whitespace-nowrap max-sm:block"
                  >
                    <span
                      class="ellipsis mr-1 flex-1 cursor-pointer font-semibold group-hover:underline max-sm:block"
                    >
                      {{ item.system.name || "(undefined)" }}
                    </span>
                    <span
                      class="ellipsis mr-2 whitespace-nowrap text-fg2 max-sm:block"
                      v-if="item?.org"
                    >
                      by {{ item.org.name || "(undefined)" }}
                    </span>
                  </div>
                  <div class="mb-2 w-full text-ellipsis whitespace-nowrap">
                    <span
                      class="text-xs text-fg2 before:opacity-50 before:content-['Base_models:_'] max-sm:mt-0.5"
                    >
                      {{ item.system.basemodelname || "unspecified" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="relative flex-1 text-left after:absolute after:top-full after:h-2 after:w-full after:content-['']"
              :class="{
                'opacity-100': !!open && open.filename === item.filename,
              }"
              @touchstart.stop
            >
              <scorebar
                :score="item.score"
                v-if="!isNaN(item?.score)"
                :style="{
                  '--fg': color(item.score),
                  '--bg': 'var(--color-bg3)',
                  '--sb-width': '100%',
                  '--sb-height': '1rem',
                }"
                class="w-full"
              ></scorebar>
            </div>
          </div>
        </div>
      </div>
      <!-- detailed comparison -->
      <div class="label mb-8 text-center">Detailed comparison</div>
      <div class="w-full overflow-auto">
        <div
          class="sticky top-0 z-20 mx-auto table rounded-none px-4 md:p-2 lg:px-8"
        >
          <div class="names transition-all duration-200">
            <NuxtLink
              :to="`/model/${model.filename}`"
              class="model-name relative block w-full max-w-100! min-w-100! rounded border-b-2 border-bg bg-bg p-6 text-center text-xl no-underline"
              v-for="(model, k) in modelsList"
            >
              <div class="name" v-if="model?.system">
                {{ model.system.name || "(undefined)" }}
              </div>
              <div class="org text-sm text-fg2" v-if="model?.org">
                by {{ model.org.name || "(undefined)" }}
              </div>
              <div
                class="count absolute top-0 left-0 rounded-bl px-2 py-1 text-[0.65rem] text-fg2 opacity-50"
              >
                {{ k + 1 }}/{{ modelsList.length }}
              </div>
            </NuxtLink>
          </div>
          <div class="category mb-0!" v-for="cat in categories">
            <category
              class="model-category mb-c! max-w-100! min-w-100!"
              :category="cat"
              :model="model"
              v-for="model in modelsList"
            ></category>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import SEORaw from "~/repos/website/SEO.yml";
import { getProperty } from "dot-prop";
const route = useRoute();
const router = useRouter();

const interpolate = (template, data) => {
  return template.replace(
    /\{([^}]+)\}/g,
    (_, path) => getProperty(data, path) ?? "",
  );
};

const SEO = ref(SEORaw);

const store = useMyComparisonStore();
const { models, categories, color } = useModels(String(route.query?.version));

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
