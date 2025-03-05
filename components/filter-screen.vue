<template>
  <div class="filter-screen" :class="{ open }">
    <div class="bg" @click="open = false"></div>
    <button class="close" @click="open = false">
      <Icon icon="ic:round-close"></Icon>
    </button>
    <div class="frame" @click.stop>
      <div class="split">
        <!-- params group -->
        <div class=" group" v-if="open">
          <label>Filter by parameter score:</label>
          <div class="categories">
            <div class="category" v-for="cat in props.categories">
              <div class="cat-name">{{ cat.name }}</div>
              <div class="param" v-for="param in cat.params" @click="toggleParam(param.ref)"
                :class="{ active: param.ref in filters }">
                <div class="param-name">{{ param.name }}</div>
                <div class="icons">
                  <div class='circle-icon closed-icon' v-html="closedIcon" @click.stop="setParamValue(param.ref, 0)"
                    :class="{ active: param.ref in filters && filters[param.ref].includes(0) }">
                  </div>
                  <div class='circle-icon partial-icon' v-html="partialIcon" @click.stop="setParamValue(param.ref, 0.5)"
                    :class="{ active: param.ref in filters && filters[param.ref].includes(0.5) }">
                  </div>
                  <div class='circle-icon open-icon' v-html="openIcon" @click.stop="setParamValue(param.ref, 1)"
                    :class="{ active: param.ref in filters && filters[param.ref].includes(1) }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- models group -->
        <div class="group" v-if="open">
          <label>
            <div>Select models:</div>
            <button @click="filters.models = props.originalModels.map(x => x.filename)">Select all</button>
            <button @click="delete filters.models">Clear</button>
          </label>
          <div class="models">
            <div class="model" v-for="model in props.originalModels" @click="toggleModel(model.filename)"
              :class="{ active: 'models' in filters && filters.models.includes(model.filename) }">
              {{ model.system.name || '(undefined)' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { onKeyStroke } from '@vueuse/core'
import openIcon from '@/assets/icons/open.svg?raw'
import closedIcon from '@/assets/icons/closed.svg?raw'
import partialIcon from '@/assets/icons/partial.svg?raw'
const filteredmodels = defineModel('models')
const props = defineProps(['categories', 'originalModels'])
const open = defineModel('open')

onKeyStroke('Escape', () => {
  open.value = false
})

const filters = defineModel('filters')

watch(open, (val) => {
  if (val) {
    document.body.classList.add('scroll-block')
  } else {
    document.body.classList.remove('scroll-block')
  }
})

function toggleParam(paramref: string) {
  if (paramref in filters.value) {
    delete filters.value[paramref]
  } else {
    filters.value[paramref] = [1]
  }
}

function setParamValue(paramref, val) {
  if (paramref in filters.value) {
    if (filters.value[paramref].includes(val)) {
      filters.value[paramref].splice(filters.value[paramref].indexOf(val), 1)
    } else {
      filters.value[paramref].push(val)
    }
  } else {
    filters.value[paramref] = [val]
  }
  if (paramref in filters.value && filters.value[paramref].length === 0) {
    delete filters.value[paramref]
  }
}

function toggleModel(modelfilename: string) {
  if (!('models' in filters.value)) {
    filters.value.models = []
  }
  if (filters.value.models.includes(modelfilename)) {
    filters.value.models.splice(filters.value.models.indexOf(modelfilename), 1)
  } else {
    filters.value.models.push(modelfilename);
  }
  if (filters.value.models.length < 1) {
    delete filters.value.models
  }
}

</script>

<style lang="less" scoped>
.filter-screen {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: all 0.5s @easeInOutExpo;
  overflow: auto;

  .close {
    position: fixed;
    top: 0;
    right: 0;
    background: transparent;
    font-size: 1.5rem;
    margin: 1.75rem 2rem;
    z-index: 2;

    &:hover {
      color: var(--link);
    }
  }

  .bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--bg3);
    opacity: 0.95;
    z-index: 1;
  }

  .frame {
    position: relative;
    z-index: 2;
    margin: 4rem auto;
    width: 50rem;
    max-width: var(--maxwidth);
    background: var(--bg);
    min-height: 40vh;
    border-radius: 0.5rem;
    padding: 3rem;
    transform: scale(0.95);
    transition: all .5s @easeInOutExpo;
  }

  &.open {
    pointer-events: auto;
    opacity: 1;

    .frame {
      transform: scale(1);
    }
  }
}

.split {
  display: flex;
  gap: 2rem;
}

.active-models {
  margin: 0 auto 2rem;
  text-align: center;
  font-size: 1.5rem;
  position: sticky;
  top: 0;
  background: var(--bg);
  padding: 1rem;
  border-bottom: 1px solid var(--bg3);

  span {
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
  }
}

.group {
  flex: 1;
  margin-bottom: 2rem;
  padding-top: .5rem;

  label {
    display: flex;
    gap: 1.5rem;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;

    div {
      flex: 1;
    }

    button {
      font-size: 0.75rem;
      margin: 0;
      background: transparent;

      &:hover {
        color: var(--fg);
      }
    }
  }

}

.models {
  user-select: none;

  .model {
    display: block;
    margin: 0 0.25rem 0.25rem 0;
    padding: 0.5rem 0.75rem;
    background: var(--bg3);
    border-radius: 0.25rem;
    opacity: 0.5;
    color: var(--fg2);
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    &.active {
      opacity: 1;
      color: var(--fg);
    }
  }
}

.categories {
  gap: 1rem;

  .cat-name {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
    color: var(--fg2);
    padding-left: 0.75rem;
  }

  .category {
    flex: 1;
  }
}

.param {
  display: flex;
  background: var(--bg3);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.25rem 0;
  cursor: pointer;
  color: var(--fg2);
  user-select: none;
  opacity: 0.5;

  .param-name {
    flex: 1;
  }

  .icons {
    display: flex;
    gap: 0.5rem;
    opacity: 0.5;
  }

  .circle-icon {
    width: 1rem !important;
    height: 1rem !important;
    color: inherit;
    opacity: 0.125;

    &:hover {
      opacity: 0.5;
    }

    &.active {
      opacity: 1;
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

    :deep(svg) {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
  }


  &:hover {
    color: var(--fg);
    opacity: 1;

    .icons {
      opacity: 0.5;
    }
  }

  &.active {
    color: var(--fg);
    opacity: 1;

    .icons {
      opacity: 1;
    }

  }
}
</style>