<template>
  <div class="model-info-fold" @click.stop>
    <div class="frame" v-if="model">
      <div class="mb-8 gap-0 rounded text-left text-xs lg:flex">
        <div class="model-info-fold-column">
          <label>About the model:</label>
          <div v-if="model?.system?.notes">
            {{ model.system.notes }}
          </div>
          <div v-else>(Not available)</div>
          <label>Model type:</label>
          <div>
            {{ capitalizeFirstLetter(model.system.type) || "(undefined)" }}
          </div>
          <label>Model performance class:</label>
          <div>
            {{
              capitalizeFirstLetter(model.system.performanceclass) ||
              "(undefined)"
            }}
          </div>
          <label>Link to the model:</label>
          <div>
            <NuxtLink
              :to="model.system.link"
              class="no-underline hover:text-link"
            >
              <Icon
                name="iconamoon:link-external-fill"
                alt="icon"
                aria-hidden="true"
                class="mr-1"
              ></Icon>
              {{ model.system.link }}
            </NuxtLink>
          </div>
        </div>
        <div class="model-info-fold-column">
          <label>Base models: </label>
          <div>
            {{ model.system.basemodelname || "(undefined)" }}
          </div>
          <label>End model:</label>
          <div>
            {{ model.system.endmodelname || "(undefined)" }}
          </div>
          <label>End model license:</label>
          <div>
            {{ model.system.endmodellicense || "(undefined)" }}
          </div>
        </div>
        <div class="model-info-fold-column">
          <label>About the organisation:</label>
          <div v-if="model?.org?.notes">
            {{ model.org.notes }}
          </div>
          <div v-else>(Not available)</div>
          <label>Link to the organisation:</label>
          <div>
            <NuxtLink
              :to="model?.org?.link"
              class="no-underline hover:text-link"
            >
              <Icon
                name="iconamoon:link-external-fill"
                alt="icon"
                aria-hidden="true"
                class="mr-1"
              ></Icon>
              {{ model.org.link }}
            </NuxtLink>
          </div>
          <label>Model release date:</label>
          <div>
            {{ formatReleaseDate(model.system?.releasedate) || "(undefined)" }}
          </div>
        </div>
      </div>
      <div class="gap-4 lg:flex">
        <category
          v-for="category in categories"
          :model="model"
          :category="category"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { filename, models, categories } = defineProps([
  "filename",
  "models",
  "categories",
]);

const model = computed(() => {
  if (!filename) return false;
  return models.find(
    (x: any) => x.filename.toLowerCase() === filename.toLowerCase(),
  );
});
</script>

<style scoped>
@reference "@/assets/css/tailwind.css";
.model-info-fold-column {
  @apply flex-1 border-t border-bc py-2 leading-relaxed text-fg lg:border-t-0 lg:border-l lg:px-6;
  label {
    @apply text-tiny font-semibold tracking-wider text-fg2 uppercase;
    + div {
      @apply mb-2;
    }
  }
}
</style>
