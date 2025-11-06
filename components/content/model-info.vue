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
        <div
          v-if="
            Object.keys(modelsToGuide).includes(String(route?.params?.model))
          "
          class="mx-auto mb-8 max-w-full rounded-xl py-0 text-center"
        >
          <div class="mb-6 text-xs font-semibold text-fg2">
            Find this model in our guide{{
              modelsToGuide[String(route?.params?.model)].length > 1 ? "s" : ""
            }}:
          </div>
          <div class="flex flex-wrap items-start justify-center gap-4">
            <NuxtLink
              :to="'/guides/' + model.slug"
              class="inline-block w-80 max-w-full rounded-lg border border-bc px-5 py-8 no-underline hover:bg-bg hover:text-link"
              v-for="model in modelsToGuide[String(route?.params?.model)]"
            >
              <div class="mb-1 text-lg leading-6">{{ model.title }}</div>
              <div class="mb-1 text-xs text-fg2" v-if="model.author">
                by {{ model.author }}
              </div>
              <div class="text-xs text-fg2">{{ useToDate(model.date) }}</div>
            </NuxtLink>
          </div>
        </div>
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
const { modelsToGuide } = useModelsToGuide();
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
