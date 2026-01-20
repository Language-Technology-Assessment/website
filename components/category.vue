<template>
  <div class="mb-2 w-200 max-w-full min-w-0 grow rounded bg-bg pt-4 pb-8">
    <div
      class="relative mb-8 flex flex-col items-center gap-1 rounded px-4 pt-8 pb-4 text-base leading-relaxed"
    >
      <div class="mb-2 flex-1 p-0 text-center font-semibold">
        {{ category.name }}
      </div>
      <scorebar
        :score="model.categories[category.ref]"
        class="scorebar-style border border-bc"
        :style="{
          '--fg': color(model.categories[category.ref]),
          '--bg': 'var(--color-bg3)',
          '--sb-height': '0.35rem',
        }"
      />
    </div>
    <div class="params w-full min-w-0">
      <div
        class="mb-0 flex w-full min-w-0 gap-3 px-3 py-4 pr-4 xl:px-6"
        v-for="param in category.params.filter((x: any) =>
          x.types.some((item: string) =>
            model.system.type
              .split(',')
              .map((x: any) => x.trim())
              .includes(item.trim()),
          ),
        )"
      >
        <!-- param score icon -->
        <div class="w-5 shrink-0 grow-0 pl-0 text-center xl:w-8">
          <div
            class="mt-0.5 h-5 w-5 shrink-0 [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
            v-if="model[param.ref]?.class === 'open'"
            v-html="openIcon"
            style="color: var(--color-g3)"
          ></div>
          <div
            class="mt-0.5 h-5 w-5 shrink-0 [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
            v-if="model[param.ref]?.class === 'closed'"
            v-html="closedIcon"
            style="color: var(--color-g1)"
          ></div>
          <div
            class="mt-0.5 h-5 w-5 shrink-0 [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
            v-if="model[param.ref]?.class === 'partial'"
            v-html="partialIcon"
            style="color: var(--color-g2)"
          ></div>
        </div>

        <!-- param text content -->
        <div class="group min-w-0 flex-1 grow">
          <!-- param title -->
          <div class="mb-2 flex min-w-0 font-semibold">
            <div class="min-w-0 flex-1 truncate">
              {{ param.name }}
            </div>
            <ParamTooltip :param-ref="param.ref" />
          </div>

          <!-- param content -->
          <div
            class="mb-2 min-w-0 text-xs leading-relaxed break-words text-fg2"
            v-html="model[param.ref].notes"
            v-if="model[param.ref]?.notes"
          ></div>

          <!-- param links -->
          <div class="min-w-0" @click.stop v-if="model[param.ref]?.link">
            <NuxtLink
              :to="model[param.ref].link"
              target="_blank"
              v-if="typeof model[param.ref].link === 'string'"
              class="block truncate text-xs break-all text-fg2 hover:text-link"
              >{{ model[param.ref].link }}</NuxtLink
            >
            <NuxtLink
              :to="link"
              target="_blank"
              v-else
              v-for="link in model[param.ref].link"
              class="block truncate text-xs break-all text-fg2 hover:text-link"
              >{{ link }}
            </NuxtLink>
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

const { color } = useModels();
const { model, category } = defineProps(["model", "category"]);
</script>
<style scoped>
.scorebar-style {
  border: 1px solid var(--bc);
}
</style>
