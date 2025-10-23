<template>
  <h1 ref="target" style="filter: url(#textedit)">
    <span
      v-for="(word, index) in words"
      :key="index"
      :class="{ animate: isVisible }"
      :style="`transition-delay: ${index * 40}ms`"
    >
      {{ word }}<span v-if="word.match(/\s+/)">&nbsp;</span>
    </span>
  </h1>
</template>

<script lang="ts" setup>
import { useIntersectionObserver, useMouse, useWindowSize } from "@vueuse/core";
const props = defineProps<{
  text: string;
}>();

const text = ref("");

onMounted(() => {
  text.value = props.text;
});

const { x } = useMouse();
const { width } = useWindowSize();

const target = ref<HTMLElement>();
const isVisible = ref(false);

const words = computed(() => {
  if (typeof text.value === "string") {
    // Split on both spaces and hyphens, but preserve the delimiter
    // This allows animation at both word boundaries and hyphen breaks
    return text.value.split(/(\s+|\-)/).filter((word) => word !== "");
  }
  return [];
});

// Use VueUse intersection observer
const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isVisible.value = true;
      // Stop observing once animation is triggered
      stop();
    }
  },
  {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px", // Trigger slightly before element is fully in view
  },
);
</script>

<style scoped>
@reference "@/assets/css/tailwind.css";
h1 > span {
  @apply relative inline-block;
  clip-path: inset(0 100% 0 0);
  opacity: 0;
  transition:
    clip-path 0.1s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

h1 > span.animate {
  clip-path: inset(0 0% 0 0);
  opacity: 1;
}
</style>
