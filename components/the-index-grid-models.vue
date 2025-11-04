<template>
  <div
    class="overflow-visible p-0 pb-4"
    ref="clickoutsidetarget"
    v-if="models && models.length > 0"
  >
    <table
      class="w-full min-w-[30rem] border-r border-l border-bg2"
      @mouseleave="modelKey = null"
    >
      <thead class="sticky top-0 z-[1] transition-all duration-300 ease-in-out">
        <tr class="bg-bg">
          <td class="opacity-75"></td>
          <td
            v-for="(param, pk) in paramsFiltered"
            :key="param.ref"
            class="relative h-[6.5rem] overflow-visible text-fg2"
            :class="[{ '!text-fg': column === pk }, `z-[${100 - pk}]`]"
          >
            <div
              class="absolute bottom-2 left-3 w-32 origin-bottom-left -rotate-45 cursor-pointer text-tiny text-ellipsis whitespace-nowrap hover:text-fg"
              @click="bus.emit(param.ref)"
            >
              {{ param.name }}
            </div>
          </td>
          <td></td>
        </tr>
      </thead>
      <tbody
        class="relative cursor-pointer"
        v-for="(item, k) in models"
        :key="item.filename"
        :class="{
          'opacity-100': row === k,
          'bg-bg2': k % 2 === 1,
          'hover:bg-bg dark:hover:bg-bg3': true,
        }"
        @mouseenter="row = k"
        @mouseleave="
          row = null;
          column = null;
          modelKey = null;
        "
      >
        <tr>
          <td
            class="group/modellink min-w-[10rem] cursor-pointer p-2 pl-4 text-left xl:min-w-[20rem] xl:pl-6"
            @click="router.push(`/model/${item.filename}`)"
          >
            <div class="font-semibold group-hover/modellink:underline">
              {{ item.system.name || "(undefined)" }}
            </div>
            <div class="text-xs text-fg2" v-if="item?.org">
              by {{ item.org.name || "(undefined)" }}
            </div>
            <div
              class="text-xs text-fg2 before:opacity-50 before:content-['Base_models:_']"
              v-if="item?.org"
            >
              {{ item.system?.basemodelname || "(unspecified)" }}
            </div>
          </td>
          <td
            v-for="(param, pk) in paramsFiltered"
            :key="param.ref"
            class="w-8 origin-center text-center transition-transform duration-200 ease-in-out hover:opacity-100"
            @mouseenter="
              column = pk;
              modelKey = k;
            "
            @click="
              column = pk;
              modelKey = k;
            "
            :class="[
              {
                'text-g1': item[param.ref]?.class === 'closed',
                'text-g2': item[param.ref]?.class === 'partial',
                'text-g3': item[param.ref]?.class === 'open',
                'opacity-50': modelKey === k,
              },
              { 'opacity-100': column === pk },
            ]"
          >
            <div
              class="m-0 inline-block h-4 w-4 p-0"
              v-if="item[param.ref]?.class === 'open'"
              v-html="openIcon"
            />
            <div
              class="m-0 inline-block h-4 w-4 p-0"
              v-else-if="item[param.ref]?.class === 'partial'"
              v-html="partialIcon"
            />
            <div
              class="m-0 inline-block h-4 w-4 p-0"
              v-else-if="item[param.ref]?.class === 'closed'"
              v-html="closedIcon"
            />
            <div v-else>-</div>
          </td>
          <td class="pr-8"></td>
        </tr>
        <tr
          class="relative z-[9] h-0 w-full min-w-[40rem] bg-transparent p-0"
          v-if="modelKey === k"
        >
          <td></td>
          <td
            class="relative overflow-visible text-left"
            :colspan="paramsFiltered.length + 1"
          >
            <div
              class="absolute -top-4 -z-[1] w-full animate-[slidedown_0.3s_ease-out] rounded-b bg-bg p-2 px-4 pb-4 text-xs shadow-[0_0.125rem_0.125rem_var(--shadow)] dark:bg-bg3"
              v-if="column !== null && item[paramsFiltered[column].ref]"
            >
              <div
                class="mb-1 cursor-pointer"
                @click="bus.emit(paramsFiltered[column].ref)"
              >
                {{ paramsFiltered[column].name }}
              </div>
              <div
                class="mb-1 text-fg2"
                v-if="item[paramsFiltered[column].ref].notes"
              >
                {{ item[paramsFiltered[column].ref].notes }}
              </div>
              <div
                class="text-tiny text-fg2"
                v-if="item[paramsFiltered[column].ref].link"
              >
                <NuxtLink
                  :to="item[paramsFiltered[column].ref].link"
                  target="_blank"
                  v-if="
                    typeof item[paramsFiltered[column].ref].link === 'string'
                  "
                >
                  {{ item[paramsFiltered[column].ref].link }}
                </NuxtLink>
                <NuxtLink
                  :to="link"
                  target="_blank"
                  v-else
                  v-for="link in item[paramsFiltered[column].ref].link"
                  >{{ link }}
                </NuxtLink>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import openIcon from "@/assets/icons/open.svg?raw";
import closedIcon from "@/assets/icons/closed.svg?raw";
import partialIcon from "@/assets/icons/partial.svg?raw";
import { useEventBus } from "@vueuse/core";
import { intersection } from "lodash-es";
const store = useMyComparisonStore();
const router = useRouter();
const row: Ref<null | number> = ref(null);
const column: Ref<null | number> = ref(null);
const { models, version, filters } = defineProps([
  "models",
  "version",
  "filters",
]);
const open = ref();
const openParam = ref();
const modelKey = ref();
const bus = useEventBus("description");

const { color, params, categories } = useModels(version);
const paramsFiltered = computed(() => {
  const temptype = filters?.type?.split(",") || ["text"];
  return params.value.filter(
    (x) => intersection(x?.types, temptype).length > 0,
  );
});

function setOpenParam(item) {
  open.value = item;
}

function getCatName() {
  const catref = params.value.find((x) => x.ref === openParam.value).category;
  return categories.value.find((x) => x.ref === catref).name;
}
</script>

<style scoped>
@keyframes slidedown {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive overflow for mobile */
@media (max-width: 50rem) {
  .overflow-visible {
    overflow: auto;
  }
}

/* Deep SVG styling for icons */
.inline-block :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
