<template>
  <div
    class="mx-auto mb-12 flex items-start"
    id="the-index"
    :class="{
      '!max-w-[50rem]': props.hideFilters,
      'min-h-screen': !props.hideFilters,
    }"
  >
    <!-- filter menu -->
    <FilterMenu
      v-model:open="filterscreenOpen"
      v-model:filters="filters"
      v-model:models="models"
      v-model:searchQuery="searchQuery"
      :originalModels="originalModels"
      :categories="categories"
      v-if="!props.hideFilters"
    />
    <div
      class="the-index grow border border-bc bg-bg"
      ref="el"
      :class="[
        {
          sticky: isvisible,
          'filtershidden rounded-lg': props.hideFilters,
          'rounded-r-lg border-l-0': !props.hideFilters,
        },
        `view-${view}`,
      ]"
    >
      <!-- parameters descriptions -->
      <ParametersDescriptions :descriptions="descriptions" :params="params" />
      <!-- metadata -->
      <div class="meta">
        <div></div>
        <NuxtLink target="_blank" :to="url" class="source" v-if="!loading">
          <div>
            <span
              class="not-latest"
              v-if="props.version && props.version !== latestInfo.hash"
              >⚠️</span
            >Last updated
            {{ date }}
          </div>
          <Icon name="iconamoon:link-external-fill"></Icon>
        </NuxtLink>
      </div>

      <!-- content -->
      <div class="content">
        <Icon name="eos-icons:three-dots-loading" v-if="loading"></Icon>
        <!-- the View -->
        <TheIndexGridModels
          :models="models"
          :version="props.version"
          :filters="filters"
          v-if="!loading && models && models.length > 0 && view === 'grid'"
        />
        <TheIndexBarsModels
          :models="models"
          :version="props.version"
          :filters="filters"
          v-else-if="!loading && models && models.length > 0 && view === 'bars'"
        />
        <div class="no-models" v-if="!loading && models && models.length < 1">
          No models or organisations match your filters.
        </div>
      </div>
      <!-- compare -->
      <div class="filter-by compare-filter" v-if="store.selected.length > 0">
        <div class="stickycompare">
          <div class="txt" @click="openComparison()">
            Compare selected model{{ store.selected.length > 1 ? "s" : "" }} ({{
              store.selected.length
            }})
          </div>
          <Icon
            class="clear"
            name="ic:round-close"
            @click.stop="clearSelection()"
          ></Icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useElementBounding,
  onClickOutside,
  useWindowSize,
} from "@vueuse/core";
const props = defineProps(["filters", "version", "hideFilters"]);

const el = ref(null);
const { y } = useElementBounding(el);
const isvisible = computed(() => y.value < 0);
const route = useRoute();
const router = useRouter();
const clickoutsidetarget = ref(null);
onClickOutside(clickoutsidetarget, (event) => {
  open.value = false;
});

const filters = ref({ type: "text" });
const filterscreenOpen = ref(false);

const {
  loading,
  date,
  url,
  error,
  models: originalModels,
  color,
  params,
  categories,
  latestInfo,
  descriptions,
} = useModels(props.version);

watch(
  filters,
  (val) => {
    if (!props.hideFilters) {
      router.replace({ query: val });
    }
  },
  { deep: true },
);

const models = computed(() => {
  const llms = unref(toRaw(originalModels));
  const ffs = unref(toRaw(filters));
  if (
    (searchQuery.value.length > 0 ||
      (filters.value && Object.keys(filters.value).length > 0)) &&
    Array.isArray(llms)
  ) {
    return llms.filter((x) => {
      // filter with searchquery
      if (searchQuery.value.length > 0) {
        const regex = new RegExp(searchQuery.value, "i");
        if (!x.system?.name || !x.org?.name) return false;
        if (
          !(
            x.system.name.match(regex) ||
            x.org?.name?.match(regex) ||
            x.system.basemodelname?.match(regex)
          )
        ) {
          return false;
        }
      }
      // filter with filters
      if (ffs && Object.keys(ffs).length > 0) {
        // filter by basemodel
        if (ffs.basemodel) {
          const regex = new RegExp(ffs.basemodel, "i");
          if (!x.system?.basemodelname?.match(regex)) {
            return false;
          }
        }
        // check if model is in models list
        if (
          ffs.models &&
          ffs.models.length > 0 &&
          searchQuery.value.length < 1
        ) {
          if (!ffs.models.includes(x.filename)) {
            return false;
          }
        }
        if (ffs?.type) {
          if (!x.system?.type) return false;
          const filterTypeArray = ffs.type.split(",").map((x) => x.trim());
          const modelTypeArray = x.system.type.split(",").map((x) => x.trim());
          if (
            !modelTypeArray.some((type: string) =>
              filterTypeArray.includes(type),
            )
          ) {
            return false;
          }
        }
        if (ffs?.release_start) {
          if (!x.system?.releasedate) {
            return false;
          }
          if (
            new Date(x.system.releasedate).getTime() <
            new Date(ffs.release_start).getTime()
          ) {
            return false;
          }
        }
        if (ffs?.release_end) {
          if (!x.system?.releasedate) {
            return false;
          }
          if (
            new Date(x.system.releasedate).getTime() >
            new Date(ffs.release_end).getTime()
          ) {
            return false;
          }
        }
        if (ffs?.performanceclass) {
          if (!x.system?.performanceclass) return false;
          const pcsplit = ffs.performanceclass.split(",");
          if (
            x.system?.performanceclass &&
            !pcsplit.includes(x.system.performanceclass)
          ) {
            return false;
          }
        }
        // check if param value is value
        for (let paramname in ffs) {
          if (
            paramname in x &&
            "class" in x[paramname] &&
            paramname !== "models"
          ) {
            if (x[paramname]?.class === "closed" && !ffs[paramname].includes(0))
              return false;
            if (x[paramname]?.class === "open" && !ffs[paramname].includes(1))
              return false;
            if (
              x[paramname]?.class === "partial" &&
              !ffs[paramname].includes(0.5)
            )
              return false;
          }
        }
      }
      return true;
    });
  }
  return llms;
});

const searchQuery = computed(() => {
  return filters.value.q || "";
});
const store = useMyComparisonStore();

function openComparison() {
  router.push(`/compare?models=${store.selected.join(",")}`);
}
function clearSelection() {
  const sure = confirm(
    "Are you sure you want to deselect all selected models?",
  );
  if (sure) {
    store.selected = [];
  }
}

const { width } = useWindowSize();
const small = computed(() => width.value < 800);
const view = computed(() => {
  return !small.value ? filters.value?.view || "bars" : "bars";
});

onMounted(() => {
  if (props.filters) {
    filters.value = props.filters;
  }
  if (
    !props.hideFilters &&
    route.query &&
    Object.keys(route.query).length > 0
  ) {
    filters.value = JSON.parse(JSON.stringify(route.query));
  }
});
</script>
<style>
@reference "@/assets/css/tailwind.css";

p + .the-index {
  margin-top: 4rem !important;
}
</style>
<style scoped>
@reference "@/assets/css/tailwind.css";

.the-index {
  padding-left: 2rem;
  padding-right: 2rem;
  padding: 0rem;
  position: relative;
  align-items: flex-start;
  gap: 4rem;
  width: 50rem;
}

.the-index.view-grid {
  max-width: 100%;
}

.the-index.filtershidden {
  width: 50rem;
}

.the-index > .context {
  flex: 1;
  padding: 0;
  position: sticky;
  top: 0;
  transition: all 0.3s ease;
  padding: 1rem 3rem 1rem;
  background: var(--bg);
  z-index: 9;
  margin-bottom: 2rem;
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  gap: 1rem;
}

.nottop .the-index > .context {
  border-bottom: 1px solid var(--bg3);
}

.the-index > .context > div {
  flex: 1;
}

.the-index > .context .search {
  width: 100%;
}

.nottop.scroll-up .the-index > .context {
  top: 3.2rem;
}

@media (max-width: 60rem) {
  .nottop.scroll-up .the-index > .context {
    top: 0;
  }
}

.the-index > .content {
  flex: 1;
}

.meta {
  left: 0;
  width: 100%;
  padding: 0 0;
  color: var(--fg2);
  gap: 1em;
  font-size: 0.65rem;
  z-index: 9;
  align-items: center;
  display: flex;
  border-radius: 0.5rem 0.5rem 0 0;
  z-index: 10;
  margin-bottom: 0.5rem;
  background: transparent;
}

@media (min-width: 40rem) {
  .filtershidden .meta {
    margin-bottom: 1.5rem;
  }
}

.meta > div {
  flex: 1;
}

.meta > * {
  padding: 0.25rem 0.5rem;
  opacity: 0.5;
}

.meta:hover {
  opacity: 1;
}

.meta:hover > * {
  opacity: 1;
}

.meta .source {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  gap: 1em;
}

.meta .source :deep(svg) {
  flex-shrink: 0;
}

.filter-by {
  padding: 0;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-by label {
  font-size: 0.75rem;
  color: var(--fg2);
  opacity: 0.5;
  padding: 0;
  margin: 0;
}

.filter-by .types {
  gap: 0.5rem;
  display: flex;
  flex-direction: row;
}

.filter-by .types button {
  line-height: 1.4;
}

button.filterbutton {
  flex: 1;
  line-height: 1.4;
  text-align: left;
  padding: 0.5rem 0.75rem;
  margin: 0;
  font-size: 0.75rem;
  color: var(--fg2);
  border-radius: 0.25rem;
  border: 1px solid var(--bg3);
  background: transparent;
  display: block;
  width: 100%;
}

button.filterbutton.editable {
  display: flex;
  align-items: center;
}

button.filterbutton.editable span {
  flex: 1;
  align-items: center;
}

button.filterbutton.editable :deep(svg) {
  line-height: 1;
  margin: 0;
  padding: 0;
  font-size: 1rem;
}

button.filterbutton:hover {
  color: var(--link);
  background: var(--bg2);
}

.no-models {
  padding: 1rem 3rem 3rem;
  color: var(--fg2);
  text-align: center;
}

.compare-filter {
  position: sticky;
  bottom: 0;
  background: var(--bg3);
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 9;
}

div.stickycompare {
  position: sticky;
  bottom: 0;
  margin: 0;
  padding: 1rem 2rem 1rem;
  background: transparent;
  color: var(--bg);
  background: var(--fg);
  display: flex;
  gap: 1rem;
  z-index: 99;
  width: 100%;
  align-items: center;
  border-radius: 0;
  cursor: pointer;
}

div.stickycompare :deep(svg) {
  font-size: 1.25rem;
  margin: 0;
  cursor: pointer;
}

div.stickycompare :deep(svg):hover {
  color: var(--fg);
}

div.stickycompare :deep(svg.checkbox) {
  background: var(--fg);
  color: var(--bg3);
  border-radius: 0.25rem;
}

div.stickycompare div {
  flex: 1;
  cursor: pointer;
}

div.stickycompare div:hover {
  text-decoration: underline;
}

div.stickycompare button {
  background: var(--bg2);
  color: var(--fg2);
  padding: 0.25rem 0.75rem;
  margin: 0;
}

div.stickycompare:hover .clear {
  color: var(--bg3);
}

div.stickycompare:hover .clear:hover {
  color: var(--link);
}

div.stickycompare:hover div {
  text-decoration: underline;
}

@media (max-width: 50rem) {
  .the-index .context {
    flex-direction: column;
  }
}

@media (max-width: 40rem) {
  .the-index {
    width: 100%;
    max-width: 100%;
    border-right: 0;
    border-left: 0;
    border-radius: 0;

    .context {
      margin: 0;
      padding: 1rem 1.5rem 1rem;
      flex-direction: column;

      > * {
        flex: 1;
        width: 100%;
      }

      .search,
      .multibutton {
        width: 100%;
      }
    }
  }

  .no-models {
    padding-top: 2rem;
  }

  .models {
    padding: 1.5rem;

    .model {
      margin-bottom: 1rem;
      padding: 0 0 2rem;

      .info {
        position: relative;
        display: block;

        .title {
          height: auto;

          .titlewrap {
            position: relative;
            display: flex;
            flex-direction: column;

            > * {
              margin-bottom: 0.25rem;
            }
          }

          .name {
            font-size: 0.75rem;
          }
        }

        .checkbox {
          position: absolute;
          top: 0;
          right: 0;
          opacity: 1;
        }
      }
    }
  }

  .compare-filter {
    border-radius: 0;
    bottom: 0;
  }
}

@media (max-width: 30rem) {
  .the-index {
    max-width: 100%;
    border: 0;
  }
}
</style>
