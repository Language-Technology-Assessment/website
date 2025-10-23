<template>
  <div
    class="fixed top-0 hidden transition-all duration-500 ease-[cubic-bezier(0.645,0.045,0.355,1)] xl:sticky xl:block"
    :class="{}"
  >
    <!--  frame -->
    <div
      class="relative top-0 right-0 z-[999] mx-auto h-screen w-96 max-w-full transform overflow-auto border border-bc border-r-bg3 bg-bg p-8 transition-all duration-500 ease-[cubic-bezier(0.645,0.045,0.355,1)]"
      @click.stop
      :class="{
        'opacity-100': open,
        '': !open,
        'rounded-l-lg': !small,
        'rounded-lg': small,
      }"
    >
      <!-- close button -->
      <button
        class="fixed top-0 right-0 z-[2] m-4 bg-transparent text-2xl text-fg2 hover:text-link"
        @click="open = false"
        :class="{ hidden: !open }"
      >
        <Icon name="ic:round-close"></Icon>
      </button>

      <!-- toggle view -->
      <Section>
        <!-- <label class="filter-label">
          <span>Select view:</span>
        </label> -->
        <div class="multibutton" v-if="!small">
          <button @click="setView('bars')" :data-active="view === 'bars'">
            <span>List</span>
            <Icon name="solar:list-outline"></Icon>
          </button>
          <button @click="setView('grid')" :data-active="view === 'grid'">
            <span>Grid </span>
            <Icon name="mingcute:dot-grid-fill"></Icon>
          </button>
        </div>
      </Section>

      <!-- search box -->
      <Section class="mb-8">
        <!-- <label class="filter-label">
          <span>Filter:</span>
        </label> -->
        <div class="input-wrapper" :class="{ searchFocus }">
          <button>
            <Icon name="iconamoon:search-bold"></Icon>
          </button>
          <input
            type="text"
            v-model="searchQuery"
            @focus="searchFocus = true"
            @blur="searchFocus = false"
            placeholder="Search..."
          />
        </div>
      </Section>

      <!-- model type -->
      <Section>
        <label class="filter-label">
          <span>Model type:</span>
          <button
            @click="delete filters.type"
            v-if="filters.type"
            class="clear-button"
          >
            reset
          </button>
        </label>
        <div class="multibutton">
          <button
            :data-active="isActiveType(type.toLowerCase(), filters?.type)"
            @click="filters.type = toggleType(type.toLowerCase(), filters.type)"
            v-for="type in modelTypes"
          >
            {{ type }}
          </button>
        </div>
      </Section>

      <!-- performance class -->
      <Section>
        <label class="filter-label">
          <span>Performance class:</span>
          <button
            @click="delete filters.performanceclass"
            v-if="filters.performanceclass"
            class="clear-button"
          >
            reset
          </button>
        </label>
        <div class="multibutton">
          <button
            :data-active="filters?.performanceclass?.includes('limited')"
            @click="togglePerformanceClass('limited')"
          >
            Limited
          </button>
          <button
            :data-active="filters?.performanceclass?.includes('full')"
            @click="togglePerformanceClass('full')"
          >
            Full
          </button>
          <button
            :data-active="filters?.performanceclass?.includes('latest')"
            @click="togglePerformanceClass('latest')"
          >
            Latest
          </button>
        </div>
      </Section>

      <!-- filter by base model name -->
      <Section>
        <label class="filter-label">
          <span class="flex-1">Filter by base model name:</span>
          <button @click="basemodel = ''" class="clear-button" v-if="basemodel">
            reset
          </button>
        </label>
        <div class="input-wrapper">
          <button>
            <Icon name="iconamoon:search-bold"></Icon>
          </button>
          <input
            type="text"
            v-model="basemodel"
            placeholder="Base model name..."
          />
        </div>
      </Section>

      <!-- filter by year -->
      <Section>
        <label class="filter-label">
          <span class="flex-1">Filter by release date:</span>
          <button
            @click="clearReleaseDate()"
            class="clear-button"
            v-if="filters.release_start || filters.release_end"
          >
            reset
          </button>
        </label>
        <release-date-selector v-model="filters"></release-date-selector>
      </Section>

      <!-- params group -->
      <Section class="mb-8 flex-1" v-for="cat in props.categories">
        <label class="filter-label">
          <span>{{ cat.name }}</span>
        </label>
        <div
          class="param m-0 mb-1 flex cursor-pointer items-center gap-2 rounded border border-bg3 bg-bg2 p-2 px-3 text-xs text-fg2 opacity-100 select-none hover:bg-bg2 hover:text-fg hover:opacity-100"
          v-for="param in filterActiveParams(cat.params)"
          @click="toggleParam(param.ref)"
          :class="{ 'active text-fg opacity-100': param.ref in filters }"
        >
          <div class="param-name flex-1">{{ param.name }}</div>
          <div class="icons flex gap-2 opacity-100">
            <div
              class="circle-icon closed-icon h-4 w-4 text-g1 opacity-[0.125] hover:opacity-50"
              v-html="closedIcon"
              @click.stop="setParamValue(param.ref, 0)"
              :class="{
                'active !opacity-100':
                  param.ref in filters && filters[param.ref].includes(0),
              }"
            ></div>
            <div
              class="circle-icon partial-icon h-4 w-4 text-g2 opacity-[0.125] hover:opacity-50"
              v-html="partialIcon"
              @click.stop="setParamValue(param.ref, 0.5)"
              :class="{
                'active !opacity-100':
                  param.ref in filters && filters[param.ref].includes(0.5),
              }"
            ></div>
            <div
              class="circle-icon open-icon h-4 w-4 text-g3 opacity-[0.125] hover:opacity-50"
              v-html="openIcon"
              @click.stop="setParamValue(param.ref, 1)"
              :class="{
                'active !opacity-100':
                  param.ref in filters && filters[param.ref].includes(1),
              }"
            ></div>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onKeyStroke, useWindowSize } from "@vueuse/core";
import openIcon from "@/assets/icons/open.svg?raw";
import closedIcon from "@/assets/icons/closed.svg?raw";
import partialIcon from "@/assets/icons/partial.svg?raw";
const props = defineProps(["categories", "originalModels"]);
const open = defineModel("open");

const searchFocus = ref(false);

function clearReleaseDate() {
  delete filters.value.release_start;
  delete filters.value.release_end;
}

const { width } = useWindowSize();
const small = computed(() => width.value < 800);
const view = computed(() => {
  return !small.value ? filters.value?.view || "bars" : "bars";
});

function setView(view: string) {
  filters.value.view = view;
}

function filterActiveParams(paramslist) {
  if (!filters.value?.type || filters.value?.type === "all") {
    return paramslist;
  }
  return paramslist.filter((x) =>
    x.types.some((item: string) =>
      filters.value.type
        .split(",")
        .map((x) => x.trim())
        .includes(item.trim()),
    ),
  );
}

onKeyStroke("Escape", () => {
  open.value = false;
});

const filters = defineModel("filters");

const basemodel = computed({
  get() {
    return filters.value?.basemodel || "";
  },
  set(val) {
    filters.value.basemodel = val;
  },
});

const searchQuery = computed({
  get() {
    return filters.value?.q || "";
  },
  set(val) {
    filters.value.q = val;
  },
});

watch(open, (val) => {
  if (val) {
    document.body.classList.add("scroll-block");
  } else {
    document.body.classList.remove("scroll-block");
  }
});

function togglePerformanceClass(pclass: string) {
  let pclasses = filters.value.performanceclass
    ? filters.value.performanceclass.split(",")
    : [];
  if (pclasses.includes(pclass)) {
    pclasses = pclasses.filter((x) => x !== pclass);
  } else {
    pclasses.push(pclass);
  }
  filters.value.performanceclass = pclasses.join(",");
  if (filters.value.performanceclass.length < 1) {
    delete filters.value.performanceclass;
  }
}

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

// function toggleModel(modelfilename: string) {
//   if (!("models" in filters.value)) {
//     filters.value.models = [];
//   }
//   if (filters.value.models.includes(modelfilename)) {
//     filters.value.models.splice(filters.value.models.indexOf(modelfilename), 1);
//   } else {
//     filters.value.models.push(modelfilename);
//   }
//   if (filters.value.models.length < 1) {
//     delete filters.value.models;
//   }
// }
</script>

<style scoped>
@reference "@/assets/css/tailwind.css";
/* Custom styles for responsive multibutton layout */
@media (max-width: 25rem) {
  .multibutton {
    flex-direction: column;
  }
  .multibutton {
    button {
      border: 0 !important;
      border-bottom: 1px solid var(--bg3) !important;
    }
  }
  .multibutton button:last-child {
    border: 0 !important;
    border-bottom: 0 !important;
  }
}

Section {
  @apply mb-4 py-1;
}

.filter-label {
  /* @apply mb-3 flex gap-6 text-xs text-fg2/50; */
  @apply mb-3 flex gap-3 text-left text-xs text-tiny font-semibold text-fg2 uppercase;
  span {
    @apply grow;
  }
}

.clear-button {
  @apply m-0 cursor-pointer bg-transparent text-tiny font-semibold text-fg2/50 uppercase hover:text-link;
}

.multibutton {
  @apply mb-0 flex h-7 gap-0 overflow-hidden rounded border border-bg3 text-tiny font-semibold;
  button {
    @apply m-0 flex flex-1 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-none border-0 border-l border-bg3 bg-bg2 p-1 px-3 text-center text-ellipsis text-fg2/50 uppercase first:border-l-0 hover:!text-link data-[active=true]:bg-bg data-[active=true]:text-fg;
    span {
      @apply grow text-left;
    }
    span.iconify {
      @apply shrink-0 grow-0 text-xl leading-none;
    }
  }
}

.input-wrapper {
  @apply flex items-center gap-2 rounded border border-bg3 bg-bg2 px-2 py-1 hover:bg-bg3;
  button {
    @apply leading-none text-fg2/50;
  }
  input {
    @apply grow rounded bg-transparent text-sm leading-6 outline-none placeholder:text-fg2/50 focus:text-link;
  }
}
.param .circle-icon :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
