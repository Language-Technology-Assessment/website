<template>
  <span
    ref="el"
    class="inline-block w-8 text-link transition-colors duration-200 group-hover/action:text-bg3"
    >{{ displayValue }}</span
  >
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
});

const el = ref<HTMLElement>();
const currentValue = ref(0);
const isAnimating = ref(false);

const displayValue = computed(() => Math.round(currentValue.value));

// Easing function for smooth deceleration
const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};

const animateCounter = () => {
  if (isAnimating.value) return;

  isAnimating.value = true;
  const startTime = performance.now();
  const duration = 2000; // 3 seconds
  const startValue = 0;
  const endValue = props.value;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Apply easing function
    const easedProgress = easeOutQuart(progress);

    currentValue.value = startValue + (endValue - startValue) * easedProgress;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentValue.value = endValue;
      isAnimating.value = false;
    }
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  setTimeout(() => {
    useIntersectionObserver(
      el,
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          animateCounter();
        }
      },
      { threshold: 0.1 },
    );
  }, 0);
});
</script>
