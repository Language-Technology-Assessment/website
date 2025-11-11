<template>
  <div>
    <div
      class="landing mt-0 mb-4 max-h-none min-h-[60vh] overflow-visible transition-opacity duration-1000 max-[50rem]:mb-4 lg:h-auto lg:min-h-[calc(80vh-14rem)] portrait:max-h-[46rem]"
      :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
      ref="mainelement"
    >
      <div
        class="pointer-events-none fixed top-0 right-0 bottom-0 left-0 overflow-visible"
        :style="{
          transform: `translateY(${y / -2}px)`,
          opacity: clamp(1 - y / height, 0.3, 1),
        }"
      >
        <img
          src="/sphere2.svg"
          class="sphere pointer-events-none absolute top-[90vh] -right-[30vw] z-[-1] flex w-full scale-200 overflow-visible opacity-30 transition-all duration-2000 ease-out lg:top-[60vh] lg:scale-100"
          :class="{ 'translate-y-50 scale-100! opacity-0': !isVisible }"
        />
      </div>

      <!-- text -->
      <div
        class="items-between relative z-0 flex w-full overflow-visible portrait:pb-8 portrait:max-[30rem]:pb-4 starting:translate-y-40 starting:opacity-0"
        :style="{
          transform: `translateY(${y / 2}px)`,
          opacity: clamp(1 - (y * 2) / height, 0.1, 1),
        }"
      >
        <div
          class="items-between mx-auto flex flex-col justify-between text-center"
          :style="{ opacity: 1 - (y * 2) / height + '!important' }"
        >
          <div
            class="slot mb-2 max-w-[24em] font-[InterDisplay] text-4xl sm:mb-8 [&>p]:leading-[1.2]"
          >
            <Appear :text="props.title" v-if="props.title"></Appear>
            <div class="pb-4">
              <div
                class="notesframe right-0 z-[4] mx-auto w-full max-w-full text-center text-xs delay-1000 duration-1000 starting:!opacity-0"
                :style="{ opacity: 1 - (y / height) * 2 }"
                v-if="isVisible"
              >
                <div
                  class="notes transition-colros hover:text-f leading-4 text-fg2 duration-300 [&>p]:leading-[1.4]"
                >
                  <MDC :value="props.notes" v-if="props.notes" />
                </div>
              </div>
            </div>
            <div>
              <ActionButton
                v-for="item in props.links"
                :link="item.link"
                class="block transition-opacity delay-1000 duration-1000 starting:opacity-0"
                v-if="isVisible"
              >
                {{ item.text }} ->
              </ActionButton>
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
const props = defineProps({
  title: String,
  links: Array<{ text: string; link: string }>,
  notes: String,
});
const mainelement = ref(null);
const { y } = useWindowScroll();
const { height } = useWindowSize();
const isVisible = ref(false);
const submenu = ref<Array<{ text: string; id: string }>>([]);
onMounted(() => {
  nextTick(() => {
    isVisible.value = true;
  });
  document.body.querySelectorAll(".label").forEach((label) => {
    const text = label.textContent || "";
    const id = label.id || text.toLowerCase().replace(/\s+/g, "-");
    submenu.value.push({ text, id });
  });
});

const getSlotChildrenText = (children: any) => {
  const result = children
    .map((node: any) => {
      if (!node.children || typeof node.children === "string")
        return { text: node.children || "", id: node.props?.id || "" };
      else if (Array.isArray(node.children))
        return getSlotChildrenText(node.children);
      else if (node.children.default)
        return getSlotChildrenText(node.children.default());
    })
    .filter(Boolean);

  return {
    text: result.map((item: any) => item.text).join(""),
    id: result.find((item: any) => item.id)?.id || "",
  };
};
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

.landing h1 {
  /*@apply text-5xl! leading-14! font-extralight;*/
  @apply xl:scale-110;
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
