<template>
  <div class="model-info">
    <div class="frame">
      <div class="top-info">
        <h1 v-if="model?.org">{{ model.org.name || '(undefined)' }}</h1>
        <h2 v-if="model?.system">{{ model.system.name || '(undefined)' }}</h2>
        <scorebar :score="model.score" v-if="model?.score" :style="{ '--fg': color(model.score) }"></scorebar>
      </div>
      <ModelInfoFold :filename="route.params.model" :models="models" :categories="props.categories"></ModelInfoFold>
      <div class="contribute">
        <p>Is this information not up to date?</p>
        <NuxtLink :to="`https://github.com/${info.owner}/${info.repo}`" target="_blank">Contribute here -></NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import info from '@/repos/data/.info.json'
const { color } = useModels()
const props = defineProps(['models', 'categories'])
const models = computed(() => {
  return props.models
})
const route = useRoute()
const model = computed(() => {
  const pad = route.params.model
  return models.value.find(x => x.filename === pad)
})


onMounted(async () => {
})
</script>

<style lang="less" scoped>
.model-info {
  .frame {
    .row();
  }
}

.top-info {
  padding: 0rem 0 2rem;
  color: var(--fg);

  :deep(.scorebar) {
    --bg: var(--bg3);
    --sb-height: .75rem;
    width: 16rem;
    max-width: 80%;
    margin: 0 auto 4rem;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: .5rem;
    text-align: center;
    width: 100%;
  }

  h2 {
    text-align: center;
    width: 100%;
    margin-top: 0;
    margin-bottom: 2rem;
    font-weight: 400;
    color: var(--fg2);
  }

  .score {
    text-align: center;
    color: var(--fg2);
    font-size: 0.75rem;
  }
}

.contribute {
  padding: 4rem 0;
  margin: 0 auto;
  text-align: center;

  a {
    background: var(--bg2);
    padding: 0.5rem 1.5rem;
    text-decoration: none;

    &:hover {
      color: var(--link);
      background: var(--bg3);
    }
  }
}

@media (max-width: 40rem) {

  .top-info {

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1rem;
    }
  }
}
</style>