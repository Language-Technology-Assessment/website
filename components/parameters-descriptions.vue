<template>
  <div class="parameters-descriptions" :class="{ open }">
    <div class="bg" @click="open = false"></div>
    <div class="frame" ref="frame">
      <div class="topframe">
        <h3>Parameter descriptions:</h3>
        <button class="close" @click="open = false">
          <Icon name="ic:round-close"></Icon>
        </button>
      </div>
      <div class="inframe">
        <div
          v-for="(item, param) in descriptions"
          class="item"
          :id="`param-${param}`"
          :class="{
            active: focus === String(param),
            inactive: focus !== String(param) && focus !== '',
          }"
        >
          <div class="name">{{ params.find((x) => x.ref == param).name }}</div>
          <div class="description">{{ item.en }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEventBus, onKeyStroke } from "@vueuse/core";
const props = defineProps(["params", "descriptions"]);
const { descriptions: current_descriptions, params: current_params } =
  useModels();
const open = ref(false);
const focus = ref("");
const bus = useEventBus<string>("description");
const frame = ref(null);

onKeyStroke("Escape", () => {
  open.value = false;
});

bus.on((val) => {
  open.value = true;
  focus.value = val;
  setTimeout(() => {
    if (!frame.value) {
      return false;
    }
    const param_el = frame.value.querySelector(`#param-${val}`);
    param_el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 10);
  setTimeout(() => {
    focus.value = "";
  }, 2000);
});

const params = computed(() => {
  if (props.params) return props.params;
  return current_params.value;
});
const descriptions = computed(() => {
  if (props.descriptions) return props.descriptions;
  return current_descriptions.value;
});
</script>

<style scoped>
.parameters-descriptions {
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
  background: var(--bg2);
  opacity: 0;
  pointer-events: none;
}
.parameters-descriptions.open .bg {
  opacity: 0.9;
  pointer-events: auto;
}

.frame {
  position: fixed;
  top: 0;
  left: 0;
  width: 24rem;
  max-width: 100%;
  height: 100%;
  background: var(--bg);
  z-index: 999;
  box-shadow: 0 0 1rem var(--shadow);
  overflow: auto;
  pointer-events: none;
  opacity: 0;
}
.parameters-descriptions.open .frame {
  opacity: 1;
  pointer-events: auto;
}

.topframe {
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 2;
  display: flex;
  padding: 1rem 1.5rem 1rem 3rem;
  gap: 1rem;
  margin-bottom: 2rem;
  color: var(--fg2);
  border-bottom: 1px solid var(--bg3);
  align-items: center;
}
.topframe h3 {
  flex: 1;
  font-size: 0.75rem;
  margin: 0;
}
.close {
  margin: 0;
  padding: 0;
  line-height: 1;
  font-size: 0;
}
.close :deep(svg) {
  font-size: 1.25rem;
}
.close:hover {
  color: var(--fg);
  background: transparent;
}

.inframe {
  position: relative;
  padding: 1rem 3rem;
  width: 100%;
  height: auto;
}

.item {
  margin-bottom: 2rem;
  font-size: 0.75rem;
  scroll-margin-top: 5rem;
}
.item .name {
  color: var(--fg);
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
  position: relative;
}
.item .description {
  color: var(--fg2);
}
.item.active .name {
  color: var(--link);
}
.item.active .name:before {
  content: "->";
  opacity: 1;
  position: absolute;
  top: 0;
  left: -1rem;
}

@media (max-width: 40rem) {
  .topframe {
    padding: 1rem 1rem 1rem 2rem;
  }
  .inframe {
    padding: 0 2rem;
  }
}
</style>
