<template>
  <NuxtLink
    :to="props.link"
    ref="target"
    class="group/action relative z-5 mx-auto mr-4 inline-block cursor-pointer! rounded-full bg-bg3/50 px-5 py-0.5 text-base leading-8 font-semibold no-underline transition-all delay-200 duration-200 hover:bg-link hover:text-bg3"
    :class="isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
  >
    <slot mdc-unwrap="p"></slot>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core";
const props = defineProps(["link"]);
const target = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    // Use VueUse intersection observer
    const { stop } = useIntersectionObserver(
      target,
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          isVisible.value = true;
          stop();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );
  }, 0);
});
</script>
