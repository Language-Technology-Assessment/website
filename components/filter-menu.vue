<template>
  <div class="filter-menu" :class="{ open }">
    <!--  frame -->
    <div class="frame" @click.stop>
      <button class="close" @click="open = false">
        <Icon icon="ic:round-close"></Icon>
      </button>
      <div class="group">
        <label
          ><span>Model type:</span
          ><button @click="delete filters.type">clear</button></label
        >
        <div class="types multibutton">
          <button
            class="filterbutton"
            :class="{ active: !('type' in filters) || filters.type === '' }"
            @click="delete filters.type"
          >
            All
          </button>
          <button
            class="filterbutton"
            :class="{ active: filters?.type === 'text' }"
            @click="filters.type = 'text'"
          >
            Text
          </button>
          <button
            class="filterbutton"
            :class="{ active: filters?.type === 'image' }"
            @click="filters.type = 'image'"
          >
            Image
          </button>
          <button
            class="filterbutton"
            :class="{ active: filters?.type === 'video' }"
            @click="filters.type = 'video'"
          >
            Video
          </button>
          <button
            class="filterbutton"
            :class="{ active: filters?.type === 'code' }"
            @click="filters.type = 'code'"
          >
            Code
          </button>
        </div>
      </div>
      <!-- params group -->
      <div class="group" v-if="open">
        <div class="categories">
          <div class="category" v-for="cat in props.categories">
            <div class="cat-name">{{ cat.name }}</div>
            <div
              class="param"
              v-for="param in filterActiveParams(cat.params)"
              @click="toggleParam(param.ref)"
              :class="{ active: param.ref in filters }"
            >
              <div class="param-name">{{ param.name }}</div>
              <div class="icons">
                <div
                  class="circle-icon closed-icon"
                  v-html="closedIcon"
                  @click.stop="setParamValue(param.ref, 0)"
                  :class="{
                    active:
                      param.ref in filters && filters[param.ref].includes(0),
                  }"
                ></div>
                <div
                  class="circle-icon partial-icon"
                  v-html="partialIcon"
                  @click.stop="setParamValue(param.ref, 0.5)"
                  :class="{
                    active:
                      param.ref in filters && filters[param.ref].includes(0.5),
                  }"
                ></div>
                <div
                  class="circle-icon open-icon"
                  v-html="openIcon"
                  @click.stop="setParamValue(param.ref, 1)"
                  :class="{
                    active:
                      param.ref in filters && filters[param.ref].includes(1),
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { onKeyStroke } from "@vueuse/core";
import openIcon from "@/assets/icons/open.svg?raw";
import closedIcon from "@/assets/icons/closed.svg?raw";
import partialIcon from "@/assets/icons/partial.svg?raw";
const filteredmodels = defineModel("models");
const props = defineProps(["categories", "originalModels"]);
const open = defineModel("open");

function filterActiveParams(paramslist) {
  if (!filters.value?.type || filters.value?.type === "all") {
    return paramslist;
  }
  return paramslist.filter((x) => x.types.includes(filters.value.type));
}

onKeyStroke("Escape", () => {
  open.value = false;
});

const filters = defineModel("filters");

watch(open, (val) => {
  if (val) {
    document.body.classList.add("scroll-block");
  } else {
    document.body.classList.remove("scroll-block");
  }
});

function toggleParam(paramref: string) {
  if (paramref in filters.value) {
    delete filters.value[paramref];
  } else {
    filters.value[paramref] = [1];
  }
}

function setParamValue(paramref, val) {
  if (paramref in filters.value) {
    if (filters.value[paramref].includes(val)) {
      filters.value[paramref].splice(filters.value[paramref].indexOf(val), 1);
    } else {
      filters.value[paramref].push(val);
    }
  } else {
    filters.value[paramref] = [val];
  }
  if (paramref in filters.value && filters.value[paramref].length === 0) {
    delete filters.value[paramref];
  }
}

function toggleModel(modelfilename: string) {
  if (!("models" in filters.value)) {
    filters.value.models = [];
  }
  if (filters.value.models.includes(modelfilename)) {
    filters.value.models.splice(filters.value.models.indexOf(modelfilename), 1);
  } else {
    filters.value.models.push(modelfilename);
  }
  if (filters.value.models.length < 1) {
    delete filters.value.models;
  }
}
</script>

<style lang="less" scoped>
.filter-menu {
  transition: all 0.5s @easeInOutExpo;

  .close {
    position: fixed;
    top: 0;
    right: 0;
    background: transparent;
    font-size: 1.5rem;
    margin: 1rem;
    z-index: 2;
    color: var(--fg2);

    &:hover {
      color: var(--link);
    }
  }

  .frame {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    width: 24rem;
    z-index: 999;
    margin: 0 auto;
    height: 100vh;
    border-radius: 0 0 0.5rem;
    transform: translateX(4rem);
    transition: all 0.5s @easeInOutExpo;
    overflow: auto;
    opacity: 0;
    background: var(--bg);
    border-left: 1px solid var(--bg3);
    pointer-events: none;
    box-shadow: 0 0 1rem var(--shadow);
    padding: 2rem;
    padding-top: 4rem;
  }

  &.open {
    opacity: 1;

    .frame {
      pointer-events: auto;
      opacity: 1;
      transform: translateX(0);
    }
  }
}

.multibutton {
  gap: 0;
  border: 1px solid var(--bg3);
  border-radius: 0.25rem;
  overflow: hidden;
  font-size: 0.75rem;
  display: flex;
  // flex-direction: column;

  > button.filterbutton {
    border: 0;
    border-left: 1px solid var(--bg3);
    border-radius: 0;
    padding: 0.5rem 0.75rem;
    margin: 0;
    color: var(--fg2);
    text-align: left;
    flex: 1;
    text-align: center;

    &:first-child {
      border-left: 0;
    }

    &:hover {
      color: var(--fg);
      background: transparent;
    }

    &.active {
      background: var(--bg3);
      color: var(--fg);
    }
  }
}

.group {
  flex: 1;
  margin-bottom: 2rem;
  padding-top: 0.5rem;

  label {
    display: flex;
    gap: 1.5rem;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;

    span {
      flex: 1;
    }

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

.categories {
  gap: 1rem;

  .cat-name {
    font-size: 0.75rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    color: var(--fg2);
    // padding-left: 0.75rem;
    text-align: center;
  }

  .category {
    flex: 1;
    margin-bottom: 2rem;
  }
}

.param {
  display: flex;
  background: var(--bg2);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.25rem 0;
  cursor: pointer;
  color: var(--fg2);
  user-select: none;
  opacity: 1;
  font-size: 0.75rem;

  .param-name {
    flex: 1;
  }

  .icons {
    display: flex;
    gap: 0.5rem;
    opacity: 1;
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
    background: var(--bg2);

    .icons {
      opacity: 1;
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
