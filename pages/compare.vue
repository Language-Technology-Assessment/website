<template>
  <div class="compare loaded finalpath">
    <ClientOnly>
      <div class="frame">
        <div class="names">
          <NuxtLink
            :to="`/model/${model.filename}`"
            class="model-name"
            v-for="(model, k) in modelsList"
          >
            <div class="name" v-if="model?.system">
              {{ model.system.name || "(undefined)" }}
            </div>
            <div class="org" v-if="model?.org">
              by {{ model.org.name || "(undefined)" }}
            </div>
            <div class="count">{{ k + 1 }}/{{ modelsList.length }}</div>
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
const store = useMyComparisonStore();
const route = useRoute();
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
    return (
      "Compare " +
      (route.query?.models ? route.query.models.split(",").join(", ") : "")
    );
  },
});
</script>

<style lang="less" scoped>
.compare {
  max-width: 100%;
  overflow: auto;
}

.frame {
  .row();
  display: table;
  padding: 2rem;
  border-radius: 0;

  > div {
    display: flex;
    gap: 2rem;
    margin-bottom: 0.25rem;
    justify-content: center;

    > a {
      width: 20rem;
      flex: 1;
    }
  }

  .names {
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 20;
    transition: all 0.2s ease;

    .scroll-up.nottop & {
      top: 3.2rem;
      transition-delay: 0.25s;
    }
  }
  @media (max-width: 40rem) {
    padding: 0.5rem;
    > div {
      gap: 0.5rem;
    }
  }
}

.model-name {
  background: var(--bg2);
  padding: 1.5rem;
  border-radius: 0.25rem;
  border-bottom: 2px solid var(--bg);
  font-size: 1.25rem;
  position: relative;
  text-align: center;
  display: block;
  text-decoration: none;

  .count {
    color: var(--fg2);
    font-size: 0.65rem;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.25rem 0.5rem;
    opacity: 0.5;
    border-radius: 0 0 0 0.25rem;
  }

  &:hover {
    .org {
      text-decoration: underline;
    }
  }

  .org {
    font-size: 0.75rem;
    color: var(--fg2);
  }
}

.frame > div > a,
.frame > .category > .category {
  width: 20rem;
  max-width: 20rem;
  @media (max-width: 30rem) {
    width: calc(100vw - 2rem);
    max-width: calc(100vw - 2rem);
  }
}

:deep(.category) {
  .category-bar {
    padding: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
