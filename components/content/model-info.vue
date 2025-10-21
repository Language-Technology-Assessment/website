<template>
  <div class="model-info">
    <ParametersDescriptions></ParametersDescriptions>
    <div class="frame mx-auto" style="width: var(--maxwidth)">
      <div class="top-info py-0 pb-8 text-fg">
        <h1 class="mb-2 w-full text-center text-5xl" v-if="model?.system">
          {{ model.system.name || "(undefined)" }}
        </h1>
        <h2
          class="mt-0 mb-8 w-full !text-center font-normal text-fg2"
          v-if="model?.org"
        >
          by {{ model.org.name || "(undefined)" }}
        </h2>
        <scorebar
          :score="model.score"
          v-if="model?.score"
          :style="{ '--fg': color(model.score) }"
          class="scorebar-custom"
        ></scorebar>
      </div>
      <ModelInfoFold
        :filename="route.params.model"
        :models="models"
        :categories="props.categories"
      ></ModelInfoFold>
      <contribute></contribute>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { color } = useModels();
const props = defineProps(["models", "categories"]);
const models = computed(() => {
  return props.models;
});
const route = useRoute();
const model = computed(() => {
  const pad = route.params.model;
  return models.value.find(
    (x) => x.filename.toLowerCase() === pad.toLowerCase(),
  );
});

onMounted(async () => {});
</script>

<style scoped>
.top-info .scorebar-custom {
  --bg: var(--color-bg3);
  --sb-height: 0.75rem;
  width: 16rem;
  max-width: 80%;
  margin: 0 auto 4rem;
}
.top-info .score {
  text-align: center;
  color: var(--color-fg2);
  font-size: 0.75rem;
}
@media (max-width: 40rem) {
  .top-info h1 {
    font-size: 2rem;
  }
  .top-info h2 {
    font-size: 1rem;
  }
}
</style>
