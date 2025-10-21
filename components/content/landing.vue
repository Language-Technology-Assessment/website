<template>
  <div
    class="landing relative mt-0 mb-4 flex max-h-none min-h-[80vh] justify-center overflow-visible transition-opacity duration-1000 max-[50rem]:mb-4 lg:mb-[calc(100vh-14rem-24rem)] lg:h-auto lg:min-h-[40vh] portrait:max-h-[46rem]"
    :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
    ref="mainelement"
  >
    <div
      class="fixed top-0 right-0 bottom-0 left-0 overflow-visible"
      :style="{
        transform: `translateY(${y / -2}px)`,
        opacity: clamp(1 - y / height, 0.3, 1),
      }"
    >
      <img
        src="/sphere2.svg"
        class="sphere pointer-events-none absolute top-[90vh] -right-[30vw] z-[-1] flex w-full scale-200 overflow-visible opacity-30 transition-all duration-2000 ease-out lg:top-[60vh] lg:scale-100"
        :class="{ 'translate-y-50 opacity-0': !isVisible }"
      />
    </div>

    <!-- text -->
    <div
      class="relative z-0 flex w-full items-end overflow-visible portrait:pb-8 portrait:max-[30rem]:pb-4 starting:translate-y-40 starting:opacity-0"
      :style="{
        transform: `translateY(${y / 2}px)`,
        opacity: clamp(1 - (y * 2) / height, 0.1, 1),
      }"
    >
      <div
        class="split-layout"
        :style="{ opacity: 1 - (y * 2) / height + '!important' }"
      >
        <div class="left-side"></div>
        <div class="">
          <div
            class="slot mb-8 max-w-[24em] font-[InterDisplay] text-4xl [&>p]:leading-[1.2]"
          >
            <slot></slot>
          </div>
          <NuxtLink
            to="/about"
            class="label mb-12 block no-underline transition-opacity delay-1000 duration-1000 starting:opacity-0"
            v-if="isVisible"
            >Read more -></NuxtLink
          >
          <div
            class="notesframe right-0 z-[4] max-w-80 text-xs delay-2000 duration-1000 starting:!opacity-0"
            :style="{ opacity: 1 - (y / height) * 2 }"
            v-if="isVisible"
          >
            <div class="notes leading-4 opacity-50 [&>p]:leading-[1.4]">
              <slot name="notes"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowScroll, useWindowSize, clamp } from "@vueuse/core";
const slots = useSlots();
const mainelement = ref(null);
const { y } = useWindowScroll();
const { height } = useWindowSize();
const isVisible = ref(false);

onMounted(() => {
  nextTick(() => {
    isVisible.value = true;
  });
});

const getSlotChildrenText = (children: any) =>
  children
    .map((node: any) => {
      if (!node.children || typeof node.children === "string")
        return node.children || "";
      else if (Array.isArray(node.children))
        return getSlotChildrenText(node.children);
      else if (node.children.default)
        return getSlotChildrenText(node.children.default());
    })
    .join("");
</script>

<style>
@reference "@/assets/css/tailwind.css";
/* Deep selectors and specific styling that can't be converted to Tailwind classes */
.landing .frame .logo :deep(path) {
  fill: var(--fg);
}

.landing .frame p {
  margin: 0 0 1rem;
  /* max-width: 20em; */
  max-width: none;
  width: 100%;
}

.animation-frame > .slot > p > a {
  background: var(--fg);
  color: var(--bg);
  text-decoration: none;
  border-radius: 0.25rem;
  padding: 0.5em 1em;
  margin-top: 0.5em;
  display: inline-block;
  margin-right: 1em;
}

.animation-frame > .slot > p > a:hover {
  background: var(--link);
}

.sphere img {
  position: absolute;
  left: 0;
  top: 0;
  height: auto;
  width: 100%;
  object-fit: cover;
  object-position: top;
}
</style>
