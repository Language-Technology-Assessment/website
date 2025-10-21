<template>
  <div class="category !bg-bg">
    <div class="category-bar">
      <div class="category-name">{{ category.name }}</div>
      <scorebar
        :score="model.categories[category.ref]"
        :style="{ '--color-fg': color(model.categories[category.ref]) }"
      >
      </scorebar>
    </div>
    <div class="params">
      <div
        class="param"
        v-for="param in category.params.filter((x) =>
          x.types.some((item: string) =>
            model.system.type
              .split(',')
              .map((x) => x.trim())
              .includes(item.trim()),
          ),
        )"
      >
        <div class="icon-frame">
          <div
            class="circle-icon open-icon"
            v-if="model[param.ref]?.class === 'open'"
            v-html="openIcon"
          ></div>
          <div
            class="circle-icon closed-icon"
            v-if="model[param.ref]?.class === 'closed'"
            v-html="closedIcon"
          ></div>
          <div
            class="circle-icon partial-icon"
            v-if="model[param.ref]?.class === 'partial'"
            v-html="partialIcon"
          ></div>
        </div>
        <div class="param-info">
          <div class="param-name">
            <div class="name">
              {{ param.name }}
            </div>
            <Icon
              @click="bus.emit(param.ref)"
              name="mage:question-mark-circle-fill"
            ></Icon>
          </div>
          <div
            class="notes"
            v-html="model[param.ref].notes"
            v-if="model[param.ref]?.notes"
          ></div>
          <div class="links" @click.stop v-if="model[param.ref]?.link">
            <NuxtLink
              :to="model[param.ref].link"
              target="_blank"
              v-if="typeof model[param.ref].link === 'string'"
              >{{ model[param.ref].link }}</NuxtLink
            >
            <NuxtLink
              :to="link"
              target="_blank"
              v-else
              v-for="link in model[param.ref].link"
              >{{ link }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import openIcon from "@/assets/icons/open.svg?raw";
import closedIcon from "@/assets/icons/closed.svg?raw";
import partialIcon from "@/assets/icons/partial.svg?raw";

const bus = useEventBus("description");
const { color } = useModels();
const { model, category } = defineProps(["model", "category"]);
</script>

<style scoped>
.category {
  flex: 1;
  padding-top: 1rem;
  padding-bottom: 2rem;
  flex-shrink: 0;
  flex-grow: 1;
  width: calc(100% / 3);
  background: var(--color-bg2);
  border-radius: 0.25rem;
}
.category-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  gap: 0.25rem;
  padding: 2rem 1rem 1rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  line-height: 1.4;
  position: relative;
}
.category-name {
  padding: 0;
  flex: 1;
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.category-score {
  text-align: right;
  flex-shrink: 0;
  color: var(--color-bg);
  padding: 0 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  position: absolute;
  top: 0;
  right: 1rem;
}
.category :deep(.scorebar) {
  --color-bg: var(--color-bg3);
  --sb-height: 0.35rem;
}

h2 {
  margin: 0;
}

.param {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0;
  padding: 1rem 1.5rem 1rem 1rem;
}
.param .param-info {
  width: 100%;
}
.param .param-info:hover .param-name :deep(svg) {
  opacity: 1;
}
.param .icon-frame {
  width: 2rem;
  text-align: center;
  padding-left: 0;
  flex-shrink: 0;
  flex-grow: 0;
}
.param .icon-frame .circle-icon {
  flex-shrink: 0;
  display: inline-block;
}
.param .param-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  flex: 1;
  width: 100%;
}
.param .param-name .name {
  flex: 1;
}
.param .param-name :deep(svg) {
  transition: 0.2s ease;
  color: var(--color-fg2);
  opacity: 0.5;
  cursor: pointer;
}
.param .notes {
  color: var(--color-fg2);
  max-width: 100%;
  font-size: 0.75rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}
.param a {
  display: block;
  font-size: 0.65rem;
  line-height: 1.4;
  color: var(--color-fg2);
  word-break: break-all;
}
.param a:hover {
  color: var(--color-link);
}

.circle-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}
.circle-icon :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
.circle-icon.closed-icon {
  color: var(--color-g1);
}
.circle-icon.partial-icon {
  color: var(--color-g2);
}
.circle-icon.open-icon {
  color: var(--color-g3);
}

@media (max-width: 50rem) {
  .category {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
