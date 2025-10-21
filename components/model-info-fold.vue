<template>
  <div class="model-info-fold" @click.stop>
    <div class="frame" v-if="model">
      <div class="info">
        <div class="sub">
          <label>About the model:</label>
          <div class="notes" v-if="model?.system?.notes">
            {{ model.system.notes }}
          </div>
          <div class="notes" v-else>(Not available)</div>
          <label>Model type:</label>
          <div class="notes">
            {{ capitalizeFirstLetter(model.system.type) || "(undefined)" }}
          </div>
          <label>Model performance class:</label>
          <div class="notes">
            {{
              capitalizeFirstLetter(model.system.performanceclass) ||
              "(undefined)"
            }}
          </div>
          <label>Link to the model:</label>
          <div class="notes">
            <NuxtLink :to="model.system.link">
              <Icon
                name="iconamoon:link-external-fill"
                alt="icon"
                aria-hidden="true"
              ></Icon>
              {{ model.system.link }}
            </NuxtLink>
          </div>
        </div>
        <div class="sub">
          <label>Base models: </label>
          <div class="notes">
            {{ model.system.basemodelname || "(undefined)" }}
          </div>
          <label>End model:</label>
          <div class="notes">
            {{ model.system.endmodelname || "(undefined)" }}
          </div>
          <label>End model license:</label>
          <div class="notes">
            {{ model.system.endmodellicense || "(undefined)" }}
          </div>
        </div>
        <div class="sub">
          <label>About the organisation:</label>
          <div class="notes" v-if="model?.org?.notes">
            {{ model.org.notes }}
          </div>
          <div class="notes" v-else>(Not available)</div>
          <label>Link to the organisation:</label>
          <div class="notes">
            <NuxtLink :to="model?.org?.link">
              <Icon
                name="iconamoon:link-external-fill"
                alt="icon"
                aria-hidden="true"
              ></Icon>
              {{ model.org.link }}
            </NuxtLink>
          </div>
          <label>Model release date:</label>
          <div class="notes">
            {{ formatReleaseDate(model.system?.releasedate) || "(undefined)" }}
          </div>
        </div>
      </div>
      <div class="categories">
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
    (x) => x.filename.toLowerCase() === filename.toLowerCase(),
  );
});
</script>

<style scoped>
.model-info-fold .frame {
}

.info {
  text-align: left;
  display: flex;
  gap: 0;
  font-size: 0.75rem;
  margin-bottom: 2rem;
  /* border: 1px solid var(--bc); */
  border-radius: 0.25rem;
  padding: 1rem 0;
}

.info .sub {
  padding: 0.5rem 1.5rem 0rem 1.5rem;
  flex: 1;
  color: var(--color-fg2);
  border-left: 1px solid var(--color-bc);
}

.info .sub label {
  color: var(--color-fg);
  text-transform: none;
  letter-spacing: 0;
}

.info .sub a {
  text-decoration: none;
}

.info .sub a:hover {
  color: var(--color-link);
}

.info .sub a :deep(svg) {
  margin-right: 0.25rem;
}

.info h1,
.info h2 {
  text-align: left;
  margin: 0 0 0.5rem;
  max-width: 100%;
  line-height: 1.1;
}

.info .notes {
  margin-bottom: 1rem;
  line-height: 1.4;
  max-width: 32em;
}

.info .score {
  font-size: 2rem;
  font-weight: 600;
  text-align: right;
}

.categories {
  display: flex;
  gap: 1rem;
}

@media (max-width: 50rem) {
  .info {
    display: block;
    margin-bottom: 1rem;
    padding: 0;
  }

  .info > .sub {
    padding: 1rem 1rem 2rem;
    border-left: none;
    border-bottom: 1px solid var(--color-bc);
  }

  .info > .sub:last-child {
    border: none;
  }

  .categories {
    display: block;
  }
}
</style>
