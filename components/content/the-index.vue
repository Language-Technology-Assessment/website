<template>
  <div
    class="the-index"
    ref="el"
    :class="[
      { sticky: isvisible, filtershidden: props.hideFilters },
      `view-${view}`,
    ]"
  >
    <!-- filter menu -->
    <FilterMenu
      v-model:open="filterscreenOpen"
      v-model:filters="filters"
      v-model:models="models"
      :originalModels="originalModels"
      :categories="categories"
    />
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
        <Icon icon="iconamoon:link-external-fill"></Icon>
      </NuxtLink>
    </div>
    <!-- context -->
    <div class="context" v-if="!props.hideFilters">
      <!-- search box -->
      <div class="search">
        <div class="searchbox" :class="{ searchFocus }">
          <button class="icon searchicon">
            <Icon icon="iconamoon:search-bold"></Icon>
          </button>
          <input
            type="text"
            v-model="searchQuery"
            @focus="searchFocus = true"
            @blur="searchFocus = false"
            placeholder="Search..."
          />
          <button
            class="icon filtericon"
            @click="filterscreenOpen = !filterscreenOpen"
          >
            <Icon icon="mage:filter-fill"></Icon>
          </button>
        </div>
      </div>

      <!-- view buttons -->
      <div class="types">
        <button
          :class="{ active: isActiveType(type.toLowerCase(), filters?.type) }"
          @click="filters.type = toggleType(type.toLowerCase(), filters.type)"
          v-for="type in modelTypes"
        >
          {{ type }}
        </button>
      </div>

      <!-- toggle view -->
      <div class="view-buttons" v-if="!small">
        <button @click="setView('bars')" :class="{ active: view === 'bars' }">
          <Icon icon="solar:list-outline"></Icon>
        </button>
        <button @click="setView('grid')" :class="{ active: view === 'grid' }">
          <Icon icon="mingcute:dot-grid-fill"></Icon>
        </button>
      </div>
    </div>

    <!-- content -->
    <div class="content">
      <Icon icon="eos-icons:three-dots-loading" v-if="loading"></Icon>
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
          icon="ic:round-close"
          @click.stop="clearSelection()"
        ></Icon>
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
import { Icon } from "@iconify/vue";
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

function setView(view: string) {
  filters.value.view = view;
}

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
  { deep: true }
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
              filterTypeArray.includes(type)
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

const searchQuery = ref("");
const searchFocus = ref(false);
const store = useMyComparisonStore();

function openComparison() {
  router.push(`/compare?models=${store.selected.join(",")}`);
}
function clearSelection() {
  const sure = confirm(
    "Are you sure you want to deselect all selected models?"
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
<style lang="less">
p + .the-index {
  margin-top: 4rem !important;
}
</style>
<style lang="less" scoped>
.the-index {
  .row();
  border-radius: 0.5rem;
  padding: 0rem;
  position: relative;
  margin-bottom: 4rem;
  background: var(--bg2);
  align-items: flex-start;
  gap: 4rem;
  width: 50rem;
  &.view-grid {
    max-width: 100%;
  }

  &.filtershidden {
    width: 50rem;
  }

  > .context {
    flex: 1;
    padding: 0;
    position: sticky;
    top: 0;
    transition: all 0.3s ease;
    padding: 1rem 3rem 1rem;
    background: var(--bg2);
    z-index: 9;
    margin-bottom: 2rem;
    border-radius: 0.5rem 0.5rem 0 0;
    display: flex;
    gap: 1rem;

    .nottop & {
      border-bottom: 1px solid var(--bg3);
    }

    > div {
      flex: 1;
    }

    .search {
      width: 100%;
    }

    .nottop.scroll-up & {
      top: 3.2rem;

      @media (max-width: 60rem) {
        top: 0;
      }
    }
  }

  > .content {
    flex: 1;
  }
}

.view-buttons {
  display: flex;
  flex: 0 !important;
  flex-shrink: 0;
  border: 1px solid var(--bg3);
  border-radius: 0.25rem;
  min-width: 5rem;
  overflow: hidden;
  gap: 1px;
  button {
    background: var(--bg2);
    padding: 0.25rem 0.5rem;
    font-size: 0rem;
    color: var(--fg2);
    :deep(svg) {
      font-size: 1.5rem;
    }
    &:hover {
      color: var(--f);
    }
    &.active {
      background: var(--bg3);
      color: var(--fg);
    }
  }
}

.meta {
  // background: color-mix(in srgb, var(--bg3) 50%, transparent);
  // border-bottom: 1px solid var(--bg);
  left: 0;
  width: 100%;
  padding: 0 0;
  color: var(--fg2);
  gap: 1em;
  font-size: 0.65rem;
  z-index: 9;
  align-items: center;
  // position: absolute;
  // top: 0;
  display: flex;
  border-radius: 0.5rem 0.5rem 0 0;
  z-index: 10;
  margin-bottom: 0.5rem;
  background: transparent;

  > div {
    flex: 1;
  }

  > * {
    padding: 0.25rem 0.5rem;
    opacity: 0.5;
  }

  &:hover {
    opacity: 1;

    > * {
      opacity: 1;
    }
  }

  .source {
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    gap: 1em;

    :deep(svg) {
      flex-shrink: 0;
    }
  }
}

.types {
  display: flex;
  gap: 0;
  border: 1px solid var(--bg3);
  border-radius: 0.25rem;
  min-height: 2rem;

  button {
    background: transparent;
    color: var(--fg2);
    flex: 1;
    margin: 0;
    font-size: 0.75rem;
    border-left: 1px solid var(--bg3);
    border-radius: 0;

    &:first-child {
      border: 0;
    }

    &.active {
      background: var(--bg3);
      color: var(--fg);
    }

    &:hover {
      color: var(--fg);
    }
  }
}

.search {
  padding: 0;

  .searchbox {
    width: 100%;
    display: flex;
    border: 1px solid var(--bg3);
    border-radius: 0.25rem;
    overflow: hidden;
    background: var(--bg2);
    padding: 0 0.75rem 0 0.5rem;
    align-items: center;
    gap: 0.25rem;

    &.searchFocus {
      background: var(--bg);
      border: 1px solid var(--bg3);

      .dark & {
        background: var(--bg3);
        border: 1px solid var(--bg3);
      }
    }

    input {
      flex: 1;
      font-weight: inherit;
      border-radius: 0;
      background: transparent;
      padding: 0.5rem 0.5rem 0.5rem 0.5rem;
      font-size: 0.75rem;
      line-height: 1.4;
    }

    > .icon {
      font-size: 1rem;
      display: flex;
      align-items: center;
      padding: 0;
      line-height: 0;
      padding: 0;
      margin: 0;
      border-radius: 0;
      // border-left: 1px solid var(--bc);
      color: var(--fg2);
      background: transparent;

      &:hover {
        background: transparent;
        color: var(--fg);
      }
    }

    &:hover {
      background: var(--bg);
      border: 1px solid var(--bg3);

      .dark & {
        background: var(--bg3);
        border: 1px solid var(--bg3);
      }

      &.searchFocus {
        background: var(--bg);

        .dark & {
          background: var(--bg3);
        }
      }
    }
  }
}

.filter-by {
  padding: 0;
  display: flex;
  gap: 1rem;
  align-items: center;

  label {
    font-size: 0.75rem;
    color: var(--fg2);
    opacity: 0.5;
    padding: 0;
    margin: 0;
  }

  .types {
    gap: 0.5rem;
    display: flex;
    flex-direction: row;

    button {
      line-height: 1.4;
    }
  }
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

  &.editable {
    display: flex;
    align-items: center;

    span {
      flex: 1;
      align-items: center;
    }

    :deep(svg) {
      line-height: 1;
      margin: 0;
      padding: 0;
      font-size: 1rem;
    }
  }

  // background: var(--bg);
  &:hover {
    color: var(--link);
    background: var(--bg2);
  }
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
  // left: 0;
  margin: 0;
  padding: 1rem 2rem 1rem;
  // font-size: 0.75rem;
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

  :deep(svg) {
    font-size: 1.25rem;
    margin: 0;
    cursor: pointer;

    &:hover {
      color: var(--fg);
    }

    &.checkbox {
      background: var(--fg);
      color: var(--bg3);
      border-radius: 0.25rem;
    }
  }

  div {
    flex: 1;
    cursor: pointer;

    &:hover {
      // color: var(--link);
      text-decoration: underline;
    }
  }

  button {
    background: var(--bg2);
    color: var(--fg2);
    padding: 0.25rem 0.75rem;
    margin: 0;
  }

  &:hover {
    // color: var(--link);

    .clear {
      color: var(--bg3);

      &:hover {
        color: var(--link);
      }
    }

    div {
      text-decoration: underline;
    }
  }
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
    // border-top: 1px solid var(--bg3) !important;

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

    .stickycompare {
    }
  }
}

@media (max-width: 30rem) {
  .the-index {
    max-width: 100%;
    border: 0;
  }
}
</style>
