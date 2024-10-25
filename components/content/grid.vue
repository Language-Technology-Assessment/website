<template>
  <div class="grid">
    <div class="models">
      <NuxtLink :to="`/model/${item.filename}`" class="model" v-for="item in models" :style="bg(item.score)">
        <div class="name">{{ item.system.name || '(undefined)' }}</div>
        <div class="org" v-if="item?.org">by <span>{{ item.org.name || '(undefined)' }}</span></div>
        <div class="flex"></div>
        <div class="score">{{ item.score.toFixed(2) }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { models, bg } = useModels()

</script>

<style lang="less" scoped>
.grid {
  display: block;
}

.models {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 3rem;
  .row();

  .model {
    flex: 1;
    aspect-ratio: 3/4;
    padding: 1rem;
    transition: all 0.2s ease;
    // box-shadow: 0 0 0 var(--fg);
    cursor: pointer;
    background: var(--fg);
    color: var(--listfg);
    display: flex;
    flex-direction: column;
    // border: 1px solid var(--fg);
    border-radius: 0.25rem;
    min-width: 0;
    min-height: 0;
    text-decoration: none;

    &:hover {
      // box-shadow: 0 0 .25rem var(--fg);
      transform: scale(1.05)
    }

    .flex {
      flex: 1;
    }

    .name {
      font-weight: 600;
      font-size: 1.5em;
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }

    .org {
      font-size: 1rem;
      line-height: 1.4;
      font-weight: 400;

      span {
        font-weight: 600;
      }
    }

    .score {
      font-size: 2em;
      line-height: 1;
      text-align: right
    }
  }
}
</style>