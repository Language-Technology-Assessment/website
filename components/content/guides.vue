<template>
  <section class="relative z-3" id="latest-guides">
    <div class="label">Latest Guides</div>
    <div
      class="content"
      v-visiblecontainer
      v-if="visibleData && status === 'success'"
    >
      <div class="relative mb-12">
        <!-- Carousel Container -->
        <div class="mx-auto max-w-[70rem] overflow-hidden">
          <div
            ref="carouselContainer"
            class="flex transition-transform duration-500 ease-in-out"
            :style="{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <div
              v-for="(guide, index) in visibleData"
              :key="guide.id"
              class="flex-shrink-0 px-3"
              :class="cardWidthClass"
            >
              <GuideCard :item="guide" class="mb-0!" />
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          v-if="visibleData.length > cardsPerView"
          @click="
            previousSlide();
            stopAutoSlide();
          "
          class="absolute top-1/2 -left-3 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-fg/20 bg-bg3/50 text-fg transition-all duration-200 hover:bg-bg3/80 md:-left-4 md:flex"
          :disabled="currentIndex === 0"
          :class="{ 'cursor-not-allowed opacity-50': currentIndex === 0 }"
        >
          <Icon name="mdi:chevron-left" class="h-5 w-5" />
        </button>

        <button
          v-if="visibleData.length > cardsPerView"
          @click="
            nextSlide();
            stopAutoSlide();
          "
          class="absolute top-1/2 -right-2 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-fg/20 bg-bg3/50 text-white transition-all duration-200 hover:bg-bg3/80 md:-right-4 md:flex"
          :disabled="currentIndex >= maxIndex"
          :class="{
            'cursor-not-allowed opacity-50': currentIndex >= maxIndex,
          }"
        >
          <Icon name="mdi:chevron-right" class="h-5 w-5" />
        </button>
      </div>

      <!-- Dots Indicator -->
      <div
        v-if="visibleData.length > cardsPerView && totalPages > 1"
        class="mb-8 flex justify-center gap-3"
      >
        <button
          v-for="page in totalPages"
          :key="`dot-${page}`"
          @click="
            goToPage(page - 1);
            stopAutoSlide();
          "
          class="h-3 w-3 cursor-pointer rounded-full transition-all duration-200"
          :class="[
            currentPage === page - 1
              ? 'scale-110 bg-fg'
              : 'bg-fg/20 hover:bg-link',
          ]"
        />
      </div>

      <div class="text-center">
        <ActionButton link="/guides" class="mr-0!"
          >Read all guides -></ActionButton
        >
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const limit = ref(10);
const currentIndex = ref(0);
const carouselContainer = ref<HTMLElement | null>(null);
const windowWidth = ref(0);
let autoSlideInterval: NodeJS.Timeout | null = null;

const { data, status } = await useAsyncData("guides-landing", () =>
  queryCollectionNavigation("guides", ["date", "description", "author"])
    .where("status", "=", "published")
    .order("date", "DESC"),
);

const visibleData = computed(() => {
  return data.value?.slice(0, limit.value);
});

// Responsive cards per view
const cardsPerView = computed(() => {
  if (process.client) {
    if (windowWidth.value >= 1400) return 3; // Desktop: 3 cards
    if (windowWidth.value >= 800) return 2; // Tablet: 2 cards
    return 1; // Mobile: 1 card
  }
  return 3; // Default for SSR
});

// Dynamic card width classes
const cardWidthClass = computed(() => {
  const baseClass = "flex justify-center";
  if (cardsPerView.value === 1) return `w-full ${baseClass}`;
  if (cardsPerView.value === 2) return `w-1/2 ${baseClass}`;
  return `w-1/3 ${baseClass}`;
});

// Calculate total pages and current page
const totalPages = computed(() => {
  if (!visibleData.value) return 0;
  return Math.ceil(visibleData.value.length / cardsPerView.value);
});

const currentPage = computed(() => {
  return Math.floor(currentIndex.value / cardsPerView.value);
});

const maxIndex = computed(() => {
  if (!visibleData.value) return 0;
  return Math.max(0, visibleData.value.length - cardsPerView.value);
});

const nextSlide = () => {
  const nextPage = currentPage.value + 1;
  if (nextPage < totalPages.value) {
    goToPage(nextPage);
  } else {
    goToPage(0); // Loop back to first page
  }
};

const previousSlide = () => {
  const prevPage = currentPage.value - 1;
  if (prevPage >= 0) {
    goToPage(prevPage);
  } else {
    goToPage(totalPages.value - 1); // Loop to last page
  }
};

const goToPage = (pageIndex: number) => {
  currentIndex.value = pageIndex * cardsPerView.value;
};

const startAutoSlide = () => {
  if (visibleData.value && visibleData.value.length > cardsPerView.value) {
    autoSlideInterval = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
  }
};

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
};

// Handle window resize
const handleResize = () => {
  if (process.client) {
    windowWidth.value = window.innerWidth;
    // Reset to first slide when screen size changes
    currentIndex.value = 0;
    stopAutoSlide();
    startAutoSlide();
  }
};

// Auto-slide functionality
onMounted(() => {
  if (process.client) {
    windowWidth.value = window.innerWidth;
    window.addEventListener("resize", handleResize);
  }

  startAutoSlide();

  // Add touch/swipe support
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;

    const deltaX = startX - endX;
    const deltaY = startY - endY;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }
  };

  if (carouselContainer.value) {
    carouselContainer.value.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    carouselContainer.value.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });
  }
});

onUnmounted(() => {
  stopAutoSlide();
  if (process.client) {
    window.removeEventListener("resize", handleResize);
  }
});

// Pause auto-slide on hover
const handleMouseEnter = () => {
  stopAutoSlide();
};

const handleMouseLeave = () => {
  startAutoSlide();
};

// Watch for data changes to reset carousel
watch(visibleData, (newData) => {
  if (newData && newData.length > 0) {
    currentIndex.value = 0;
    stopAutoSlide();
    startAutoSlide();
  }
});

// Watch for cards per view changes
watch(cardsPerView, () => {
  currentIndex.value = 0;
  stopAutoSlide();
  startAutoSlide();
});
</script>

<style scoped>
/* Smooth scrolling for better UX */
@media (prefers-reduced-motion: no-preference) {
  .transition-transform {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Ensure proper spacing and alignment */
.flex-shrink-0 {
  min-width: 0;
}

/* Mobile optimizations */
@media (max-width: 799px) {
  .px-3 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

/* Tablet optimizations */
@media (min-width: 800px) and (max-width: 1400px) {
  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

/* Desktop optimizations */
@media (min-width: 1400px) {
  .px-3 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
