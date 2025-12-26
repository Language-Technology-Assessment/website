<template>
  <section
    class="the-index mx-auto mt-12! mb-12! flex items-start"
    id="the-index"
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
      class="relative mx-auto w-full max-w-full grow items-start gap-16 overflow-visible border border-bc bg-bg px-0 py-0"
      :class="[
        {
          sticky: isvisible,
          '!max-w-[60rem] rounded-lg':
            props.hideFilters && filters?.view === 'grid',
          '!max-w-[50rem] rounded-lg':
            props.hideFilters && filters?.view !== 'grid',
          'rounded-lg xl:rounded-l-none! xl:rounded-r-lg xl:border-l-0':
            !props.hideFilters,
        },
      ]"
      ref="el"
    >
      <!-- parameters descriptions -->
      <ParametersDescriptions :descriptions="descriptions" :params="params" />
      <!-- metadata -->
      <div
        class="left-0 z-10 mb-2 flex w-full items-center gap-4 bg-transparent py-0 text-[0.65rem] text-fg2 sm:mb-6"
      >
        <div class="flex-1"></div>
        <NuxtLink
          target="_blank"
          :to="url"
          class="flex items-center justify-end gap-2 px-2 text-right no-underline hover:opacity-100"
          v-if="!loading"
        >
          <div class="py-1 opacity-50 hover:opacity-100">
            <span
              class="not-latest"
              v-if="props.version && props.version !== latestInfo.hash"
              >⚠️</span
            >Last updated
            {{ date }}
          </div>
          <Icon
            name="iconamoon:link-external-fill"
            class="flex-shrink-0"
          ></Icon>
        </NuxtLink>
      </div>

      <!-- filters button -->
      <button
        class="text-normal relative top-0 right-0 left-0 z-[2] mb-2 ml-4 block w-36 cursor-pointer rounded-full border-bc bg-bg2 px-4 py-1.5 text-fg hover:bg-bg3 hover:text-link sm:mb-8 sm:ml-12 lg:ml-8 xl:hidden"
        @click="filterscreenOpen = true"
        :class="{ hidden: props.hideFilters }"
      >
        Show filters
      </button>

      <!-- content -->
      <div class="flex-1">
        <Icon name="eos-icons:three-dots-loading" v-if="loading"></Icon>
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
        <div
          class="px-12 py-4 pb-12 text-center text-fg2 sm:pt-8"
          v-if="!loading && models && models.length < 1"
        >
          No models or organisations match your filters.
        </div>
      </div>
      <!-- compare -->
      <div
        class="sticky bottom-0 z-9 flex items-center gap-4 overflow-hidden border-t border-bc py-0"
        v-if="store.selected.length > 0"
      >
        <div
          class="sticky bottom-0 z-[99] m-0 flex w-full cursor-pointer items-center gap-4 rounded-none bg-bg px-4 py-4 text-fg hover:opacity-100 sm:px-12 lg:px-8 xl:px-12"
        >
          <div class="grow">
            <ActionButton :link="comparisonLink" class="ml-0 py-2 leading-5!"
              >Compare selected model{{
                store.selected.length > 1 ? "s" : ""
              }}
              ({{ store.selected.length }}) -></ActionButton
            >
          </div>
          <!-- <div
            class="flex-1 cursor-pointer hover:underline"
            @click="openComparison()"
          >
            Compare selected model{{ store.selected.length > 1 ? "s" : "" }} ({{
              store.selected.length
            }}) ->
          </div> -->
          <Icon
            class="clear m-0 cursor-pointer text-xl opacity-50 hover:text-fg hover:opacity-100"
            name="ic:round-close"
            @click.stop="clearSelection()"
          ></Icon>
        </div>
      </div>
    </div>
  </section>
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

const comparisonLink = computed(() => {
  return `/compare?models=${store.selected.join(",")}`;
});

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
p + #the-index {
  margin-top: 4rem !important;
}
</style>
