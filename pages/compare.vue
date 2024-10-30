<template>
  <div class="compare loaded finalpath">
    <ClientOnly>
      <div class="frame">
        <div class="names">
          <NuxtLink :to="`/model/${model.filename}`" class="model-name" v-for="(model, k) in modelsList">
            <div class="org" v-if="model?.org">{{ model.org.name || '(undefined)' }}</div>
            <div class="name" v-if="model?.system">{{ model.system.name ||
              '(undefined)' }}</div>
            <div class="count">{{ k + 1 }}/{{ modelsList.length }}</div>
          </NuxtLink>
        </div>
        <div class="category" v-for="cat in categories">
          <category class="model-category" :category="cat" :model="model" v-for="model in modelsList"></category>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const store = useMyComparisonStore()
const route = useRoute()
const { models, categories } = useModels(String(route.query?.version));

const modelsList = computed(() => {
  if (!route.query?.models || typeof route.query.models !== 'string') { return false }
  const filenames = route.query.models.split(',')
  const list = filenames.map(x => {
    return getModel(x)
  }).filter(x => x)
  return list
})

function getModel(filename: string) {
  if (!filename) return false
  return models.value.find(x => x.filename === filename)
}

useHead({
  titleTemplate: () => {
    return 'Compare ' + (route.query?.models ? route.query.models.split(',').join(', ') : '');
  }
})
</script>

<style lang="less" scoped>
.compare {
  max-width: 100%;
  // overflow: auto;
}

.frame {
  .row();
  display: table;
  padding: 2rem;
  border-radius: 0;

  >div {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;

    >a {
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
    float: right;
    color: var(--fg2);
    font-size: 0.75rem;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.25rem 0.75rem;
  }

  &:hover {

    .org {
      text-decoration: underline;
    }
  }

  .name {
    font-size: 0.75rem;
    color: var(--fg2);
  }
}

:deep(.category) {
  .category-bar {
    padding: 1rem;
    margin-bottom: 1rem;
  }
}
</style>