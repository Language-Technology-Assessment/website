<template>
  <div class="">
    <ParametersDescriptions></ParametersDescriptions>
    <div class="row">
      <div class="py-0 pb-8 text-fg">
        <h1 class="mb-12 w-full text-center text-5xl" v-if="model?.system">
          {{ model.system.name || "(undefined)" }}
        </h1>
        <h2
          class="mt-0 mb-8 w-full text-center font-normal text-fg2 sm:text-base"
          v-if="model?.org"
        >
          by {{ model.org.name || "(undefined)" }}
        </h2>
        <scorebar
          :score="model.score"
          v-if="model?.score"
          :style="{
            '--fg': color(model.score),
            '--bg': 'var(--color-bg3)',
            '--sb-height': '0.75rem',
            '--sb-width': '16rem',
          }"
          class="mx-auto mb-16"
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
  const pad = route.params.model as string;
  if (!pad) return null;
  return models.value.find(
    (x: any) => x.filename.toLowerCase() === pad.toLowerCase(),
  );
});

onMounted(async () => {});
</script>
