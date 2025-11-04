<template>
  <div
    class="mx-auto flex-1 px-4 py-4 pb-8 sm:px-12 lg:px-8 lg:py-0 xl:px-12 xl:py-4"
    ref="clickoutsidetarget"
    @touchstart="openParam = false"
    :class="{
      'transition-all duration-1000 ease-in-out': !!open,
    }"
    v-if="models && models.length > 0"
  >
    <div
      class="group/model mb-8 flex items-start gap-4 py-0 no-underline transition duration-300 select-none"
      v-for="(item, k) in models"
      :key="item.filename"
      :class="{
        'opacity-100':
          store.selected.includes(item.filename) ||
          (!!open && item.filename === open.filename),
      }"
    >
      <div
        class="group flex-1 cursor-pointer"
        @mouseenter="setOpenParam(item)"
        @mouseleave="
          open = false;
          openParam = false;
        "
      >
        <div
          class="mb-2 flex items-center max-sm:items-start"
          @click="router.push(`/model/${item.filename}`)"
        >
          <div class="relative h-16 flex-1 sm:h-12">
            <div class="absolute max-w-full max-sm:top-0">
              <div
                class="w-full overflow-hidden leading-[1.3] text-ellipsis whitespace-nowrap max-sm:block"
              >
                <span
                  class="ellipsis mr-1 flex-1 cursor-pointer font-semibold group-hover:underline max-sm:block"
                >
                  {{ item.system.name || "(undefined)" }}
                </span>
                <span
                  class="ellipsis mr-2 whitespace-nowrap text-fg2 max-sm:block"
                  v-if="item?.org"
                >
                  by {{ item.org.name || "(undefined)" }}
                </span>
              </div>
              <div class="mb-2 w-full text-ellipsis whitespace-nowrap">
                <span
                  class="text-xs text-fg2 before:opacity-50 before:content-['Base_models:_'] max-sm:mt-0.5"
                >
                  {{ item.system.basemodelname || "unspecified" }}
                </span>
              </div>
            </div>
          </div>
          <button
            class="group/button relative cursor-pointer text-xl leading-none opacity-0 group-hover/model:opacity-100 hover:text-link"
            @click.stop="store.toggle(item.filename)"
            :class="{
              'text-fg2 opacity-100': store.selected.includes(item.filename),
            }"
          >
            <div
              class="absolute top-1 right-full translate-x-4 bg-bg px-2 text-xs text-tiny leading-none font-semibold uppercase opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-hover/button:text-link"
            >
              Compare
            </div>
            <Icon
              name="mdi:checkbox-marked-circle"
              v-if="store.selected.includes(item.filename)"
              class="h-5 w-5 rounded text-link"
            ></Icon>
            <Icon
              name="mdi:plus-box-multiple"
              v-else
              class="h-5 w-5 rounded"
            ></Icon>
          </button>
        </div>
        <div
          class="relative flex-1 text-left after:absolute after:top-full after:h-2 after:w-full after:content-['']"
          :class="{ 'opacity-100': !!open && open.filename === item.filename }"
          @touchstart.stop
        >
          <scorebar
            :score="item.score"
            v-if="!isNaN(item?.score)"
            :style="{
              '--fg': color(item.score),
              '--bg': 'var(--color-bg3)',
              '--sb-width': '100%',
              '--sb-height': '1rem',
            }"
            class="w-full"
          ></scorebar>
          <div
            class="absolute top-0 z-10 w-full animate-[subscorein_0.4s_cubic-bezier(0.645,0.045,0.355,1)_0s_1_forwards] rounded-lg"
            v-if="!!open && open.filename === item.filename"
            @mouseleave="openParam = false"
          >
            <div
              class="mb-[1px] flex h-6 overflow-hidden rounded bg-bg3 p-0 leading-none"
              :class="{ 'rounded-b-none': !!openParam }"
            >
              <div
                class="transition-translate flex grow items-center justify-center border-l border-bc bg-bg3 duration-200 ease-out first:border-l-0 starting:-translate-y-8 hover:[&_.circle-icon]:opacity-100"
                v-for="(param, index) in params.filter((x: any) =>
                  x.types.some((i: string) =>
                    item.system.type
                      .split(',')
                      .map((x: string) => x.trim())
                      .includes(i.trim()),
                  ),
                )"
                :key="param.ref"
                :style="{ 'transition-delay': `${(index + 1) * 0.02}s` }"
                :class="{
                  'opacity-20': openParam && openParam !== param.ref,
                  '!delay-0': !!openParam,
                }"
                @mouseenter="openParam = param.ref"
                @touchmove="openParam = param.ref"
              >
                <div
                  class="m-0 inline-block h-4 w-4 grow p-0 text-g3 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                  v-if="item[param.ref]?.class === 'open'"
                  v-html="openIcon"
                ></div>
                <div
                  class="m-0 inline-block h-4 w-4 p-0 text-g1 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                  v-if="item[param.ref]?.class === 'closed'"
                  v-html="closedIcon"
                ></div>
                <div
                  class="m-0 inline-block h-4 w-4 p-0 text-g2 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                  v-if="item[param.ref]?.class === 'partial'"
                  v-html="partialIcon"
                ></div>
              </div>
            </div>
            <div
              class="relative w-full rounded-b bg-bg3 p-4 pb-8 text-xs"
              v-if="openParam && openParam !== undefined"
            >
              <div class="mb-1 font-semibold">
                <div class="mr-2 inline">{{ getCatName() }}:</div>
                <div class="mr-2 inline">
                  {{ params.find((x) => x.ref === openParam).name }}
                </div>
                <button
                  @click="bus.emit(openParam)"
                  class="m-0 p-0 text-fg2 hover:bg-transparent hover:text-blue-500 [&_svg]:m-0 [&_svg]:align-baseline"
                >
                  <Icon name="mage:question-mark-circle-fill"></Icon>
                </button>
              </div>
              <div
                class="max-w-[30em] text-fg2"
                v-if="item[openParam] && item[openParam].notes"
              >
                {{ item[openParam].notes }}
              </div>
              <div class="max-w-[30em] text-fg2" v-else>(undefined)</div>
              <div
                class="pt-2 text-[0.75em] text-fg2"
                @click.stop
                v-if="item[openParam] && item[openParam].link"
              >
                <NuxtLink
                  :to="item[openParam].link"
                  target="_blank"
                  v-if="typeof item[openParam].link === 'string'"
                  class="block"
                  >{{ item[openParam].link }}</NuxtLink
                >
                <NuxtLink
                  :to="link"
                  target="_blank"
                  v-else
                  v-for="link in item[openParam].link"
                  class="block"
                  >{{ link }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import openIcon from "@/assets/icons/open.svg?raw";
import closedIcon from "@/assets/icons/closed.svg?raw";
import partialIcon from "@/assets/icons/partial.svg?raw";
import { useEventBus } from "@vueuse/core";
const store = useMyComparisonStore();
const router = useRouter();
const { models, version } = defineProps(["models", "version"]);
const open = ref();
const openParam = ref();
const bus = useEventBus("description");

const { color, params, categories } = useModels(version);

function setOpenParam(item: any) {
  open.value = item;
}
function getCatName() {
  const catref = params.value.find(
    (x: any) => x.ref === openParam.value,
  ).category;
  return categories.value.find((x: any) => x.ref === catref).name;
}
</script>

<style>
@keyframes subscorein {
  to {
    opacity: 1;
  }
}
</style>
