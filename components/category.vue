<template>
  <div class="category">
    <div class="category-bar">
      <div class="category-name">{{ category.name }}</div>
      <scorebar :score="model.categories[category.ref]" :style="{ '--fg': color(model.categories[category.ref]) }">
      </scorebar>
    </div>
    <div class="params">
      <div class="param" v-for="param in category.params.filter(x => x.types.includes(model.system.type))">
        <div class="icon-frame">
          <div class='circle-icon open-icon' v-if="model[param.ref]?.class === 'open'" v-html="openIcon"></div>
          <div class='circle-icon closed-icon' v-if="model[param.ref]?.class === 'closed'" v-html="closedIcon">
          </div>
          <div class='circle-icon partial-icon' v-if="model[param.ref]?.class === 'partial'" v-html="partialIcon">
          </div>
        </div>
        <div class="param-info">
          <div class="param-name">
            <div class="name">
              {{ param.name }}
            </div>
            <Icon @click="bus.emit(param.ref)" icon="mage:question-mark-circle-fill"></Icon>
          </div>
          <div class='notes' v-html="model[param.ref].notes" v-if="model[param.ref]?.notes">
          </div>
          <div class="links" @click.stop v-if="model[param.ref]?.link">
            <NuxtLink :to="model[param.ref].link" target="_blank" v-if="typeof model[param.ref].link === 'string'">{{
              model[param.ref].link }}</NuxtLink>
            <NuxtLink :to="link" target="_blank" v-else v-for="link in model[param.ref].link">{{ link }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEventBus } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import openIcon from '@/assets/icons/open.svg?raw'
import closedIcon from '@/assets/icons/closed.svg?raw'
import partialIcon from '@/assets/icons/partial.svg?raw'

const bus = useEventBus('description')
const { color } = useModels()
const { model, category } = defineProps(['model', 'category'])
</script>

<style lang="less" scoped>
.category {
  flex: 1;
  padding-top: 1rem;
  padding-bottom: 2rem;
  flex-shrink: 0;
  flex-grow: 1;
  width: calc(100%/3);
  background: var(--bg2);
  border-radius: 0.25rem;

  .category-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    gap: .25rem;
    padding: 2rem 1rem 1rem;
    border-radius: 0.25rem;
    font-size: 1rem;
    line-height: 1.4;
    position: relative;

    .category-name {
      padding: 0;
      flex: 1;
      text-align: center;
      margin-bottom: .5rem;
      font-weight: 600;
    }

    .category-score {
      text-align: right;
      flex-shrink: 0;
      color: var(--bg);
      padding: 0 0.25rem;
      border-radius: 0.25rem;
      font-size: .75rem;
      position: absolute;
      top: 0;
      right: 1rem;
    }

    :deep(.scorebar) {
      --bg: var(--bg3);
      --sb-height: 0.35rem;
    }
  }
}

h2 {
  margin: 0;
}


.param {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-right: 2rem;
  padding-left: 1.5rem;

  padding: 1rem 1.5rem 1rem 1rem;
  gap: 0.75rem;
  margin-bottom: 0rem;

  .param-info {
    width: 100%;

    &:hover {
      .param-name {
        :deep(svg) {
          opacity: 1;
        }
      }
    }
  }

  .icon-frame {
    width: 2rem;
    text-align: center;
    padding-left: 1rem;
    flex-shrink: 0;
    flex-grow: 0;
    padding-left: 0;

    .circle-icon {
      flex-shrink: 0;
      display: inline-block;
    }
  }

  .param-name {
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: flex;
    flex: 1;
    width: 100%;

    .name {
      flex: 1;
    }

    :deep(svg) {
      transition: 0.2s ease;
      color: var(--fg2);
      opacity: 0.5;
      cursor: pointer;
    }
  }

  .notes {
    color: var(--fg2);
    max-width: 100%;
    font-size: 0.75rem;
    line-height: 1.4;
    margin-bottom: .5rem;
  }

  a {
    display: block;
    font-size: 0.65rem;
    line-height: 1.4;
    color: var(--fg2);
    word-break: break-all;

    &:hover {
      color: var(--link);
    }
  }
}

.circle-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;

  :deep(svg) {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }

  &.closed-icon {
    color: var(--g1);
  }

  &.partial-icon {
    color: var(--g2);
  }

  &.open-icon {
    color: var(--g3);
  }
}

@media (max-width: 50rem) {

  .category {
    width: 100%;
    margin-bottom: .5rem;
  }

  .params {
    .param {}
  }
}
</style>