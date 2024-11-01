<template>
  <div class="model-info" @click.stop>
    <div class="frame" v-if="model">
      <div class="info">
        <div class="sub">
          <label>About the model:</label>
          <div class="notes" v-if="model?.system?.notes">{{ model.system.notes }}</div>
          <div class="notes" v-else>(Not available)</div>
          <label>Model type:</label>
          <div class="notes">{{ model.system.type }}</div>
          <label>Link to the model:</label>
          <NuxtLink :to="model.system.link">
            <Icon icon="iconamoon:link-external-fill"></Icon> {{ model.system.link }}
          </NuxtLink>
        </div>
        <div class="sub">
          <label>Base model:</label>
          <div class="notes">{{ model.system.basemodelname || '(undefined)' }}</div>
          <label>End model:</label>
          <div class="notes">{{ model.system.endmodelname || '(undefined)' }}</div>
          <label>End model license:</label>
          <div class="notes">{{ model.system.endmodellicense || '(undefined)' }}</div>
        </div>
        <div class="sub">
          <label>About the organisation:</label>
          <div class="notes" v-if="model?.org?.notes">{{ model.org.notes }}</div>
          <div class="notes" v-else>(Not available)</div>
          <label>Link to the organisation:</label>
          <NuxtLink :to="model?.org?.link">
            <Icon icon="iconamoon:link-external-fill"></Icon> {{ model.org.link }}
          </NuxtLink>
        </div>
      </div>
      <div class="categories">
        <category v-for="category in categories" :model="model" :category="category" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const { filename, models, categories } = defineProps(['filename', 'models', 'categories'])

const model = computed(() => {
  if (!filename) return false
  return models.find(x => x.filename === filename)
})
</script>

<style lang="less" scoped>
.model-info {
  .frame {}
}

.info {
  text-align: left;
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  // background: var(--bc);
  margin-bottom: 2rem;

  .sub {
    padding: 1.5rem 2rem 1.5rem 2rem;
    flex: 1;
    border: 1px solid var(--bc);
    border-radius: 0.25rem;
    color: var(--fg2);

    label {
      color: var(--fg);
      text-transform: none;
      letter-spacing: 0;
    }

    a {
      text-decoration: none;

      &:hover {
        color: var(--link);
      }

      :deep(svg) {
        margin-right: .25rem;
      }
    }
  }

  h1,
  h2 {
    text-align: left;
    margin: 0 0 .5rem;
    max-width: 100%;
    line-height: 1.1;
  }

  .notes {
    margin-bottom: 1rem;
    line-height: 1.4;
    max-width: 32em;
  }

  .score {
    font-size: 2rem;
    font-weight: 600;
    text-align: right;
  }
}

.categories {
  display: flex;
  // border-top: 1px solid var(--bc);
  // border-bottom: 1px solid var(--bc);
  gap: 1rem;

}



@media (max-width: 50rem) {

  .info {
    display: block;
    margin-bottom: 1rem;

    >.sub {
      padding: 1rem;
      margin-bottom: .5rem;
    }
  }

  .categories {
    display: block;
  }

}
</style>