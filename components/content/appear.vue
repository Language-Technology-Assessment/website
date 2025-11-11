<template>
  <div
    ref="target"
    class="target mx-auto mb-24 w-140 text-center font-display text-4xl font-light"
    style="filter: url(#textedit)"
  >
    <span
      v-for="(word, index) in words"
      :key="index"
      :class="{ animate: isVisible }"
      :style="`transition-delay: ${index * 40}ms`"
    >
      {{ word }}<span v-if="word.match(/\s+/)">&nbsp;</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { useIntersectionObserver, useMouse, useWindowSize } from "@vueuse/core";
const props = defineProps<{
  text: string;
}>();

const text = ref("");

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

onMounted(() => {
  text.value = props.text;
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

<style scoped>
@reference "@/assets/css/tailwind.css";
.target > span {
  @apply relative inline-block;
  transform-origin: center;
  transform: translateY(0.2em);
  opacity: 0;
  transition:
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.target > span.animate {
  transform: translateY(0);
  opacity: 1;
}
</style>
