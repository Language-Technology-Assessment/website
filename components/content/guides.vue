<template>
  <ClientOnly>
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
              class="carousel-container flex transition-transform duration-500 ease-in-out select-none"
              :style="{
                transform: `translateX(calc(-${currentIndex * (100 / cardsPerView)}% + ${touchState.dragOffset}px))`,
                transitionDuration: touchState.isDragging ? '0ms' : '500ms',
              }"
              :class="{ 'pointer-events-none': touchState.isDragging }"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
              role="region"
              aria-label="Guides carousel"
              aria-live="polite"
            >
              <div
                v-for="(guide, index) in visibleData"
                :key="`guide-${index}`"
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
            @click="previousSlide()"
            class="absolute top-1/2 -left-3 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-fg/20 bg-bg3/50 text-fg transition-all duration-200 hover:bg-bg3/80 focus:ring-2 focus:ring-link/50 focus:outline-none md:-left-4 lg:flex"
            :disabled="currentIndex === 0"
            :class="{ 'cursor-not-allowed opacity-50': currentIndex === 0 }"
          >
            <Icon name="mdi:chevron-left" class="h-5 w-5" />
          </button>

          <button
            v-if="visibleData.length > cardsPerView"
            @click="nextSlide()"
            class="absolute top-1/2 -right-2 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-fg/20 bg-bg3/50 text-white transition-all duration-200 hover:bg-bg3/80 focus:ring-2 focus:ring-link/50 focus:outline-none md:-right-4 lg:flex"
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
          role="tablist"
          aria-label="Carousel navigation"
        >
          <button
            v-for="page in totalPages"
            :key="`dot-${page}`"
            @click="goToPage(page - 1)"
            class="h-2 w-2 cursor-pointer rounded-full transition-all duration-200"
            :class="[
              currentPage === page - 1
                ? 'scale-110 bg-fg'
                : 'bg-fg/20 hover:bg-link',
            ]"
            role="tab"
            :aria-selected="currentPage === page - 1"
            :aria-label="`Go to page ${page}`"
          />
        </div>

        <div class="text-center">
          <ActionButton link="/guides" class="mr-0!"
            >Read all guides -></ActionButton
          >
        </div>
      </div>
    </section>
  </ClientOnly>
</template>

<script lang="ts" setup>
const limit = ref(10);
const currentIndex = ref(0);
const carouselContainer = ref<HTMLElement | null>(null);
const windowWidth = ref(0);
let autoSlideInterval: NodeJS.Timeout | null = null;

// Touch/Swipe state
const touchState = ref({
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  isDragging: false,
  startTime: 0,
  dragOffset: 0,
});

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
  if (import.meta.client) {
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
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value = Math.min(
      currentIndex.value + cardsPerView.value,
      maxIndex.value,
    );
  } else {
    currentIndex.value = 0; // Loop back to first slide
  }
};

const previousSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value = Math.max(currentIndex.value - cardsPerView.value, 0);
  } else {
    currentIndex.value = maxIndex.value; // Loop to last slide
  }
};

const goToPage = (pageIndex: number) => {
  currentIndex.value = pageIndex * cardsPerView.value;
};

const startAutoSlide = () => {
  // Auto-slide disabled
};

const stopAutoSlide = () => {
  // Auto-slide disabled
};

// Handle window resize
const handleResize = () => {
  if (import.meta.client) {
    windowWidth.value = window.innerWidth;
    // Reset to first slide when screen size changes
    currentIndex.value = 0;
    stopAutoSlide();
    startAutoSlide();
  }
};

// Enhanced touch/swipe handlers
const handleTouchStart = (e: TouchEvent) => {
  if (!e.touches[0]) return;
  touchState.value.startX = e.touches[0].clientX;
  touchState.value.startY = e.touches[0].clientY;
  touchState.value.currentX = e.touches[0].clientX;
  touchState.value.currentY = e.touches[0].clientY;
  touchState.value.isDragging = true;
  touchState.value.startTime = Date.now();
};

const handleTouchMove = (e: TouchEvent) => {
  if (!touchState.value.isDragging || !e.touches[0]) return;

  touchState.value.currentX = e.touches[0].clientX;
  touchState.value.currentY = e.touches[0].clientY;

  const deltaX = touchState.value.startX - touchState.value.currentX;
  const deltaY = touchState.value.startY - touchState.value.currentY;

  // Prevent default scrolling if horizontal swipe is detected
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 15) {
    e.preventDefault();
    e.stopPropagation();

    // Calculate drag offset with resistance at boundaries
    const maxDrag = window.innerWidth * 0.25;
    let dragOffset = -deltaX * 0.5;

    // Add resistance when trying to drag beyond boundaries
    if (currentIndex.value === 0 && dragOffset > 0) {
      dragOffset = dragOffset * 0.2;
    } else if (currentIndex.value >= maxIndex.value && dragOffset < 0) {
      dragOffset = dragOffset * 0.2;
    }

    // Limit drag distance
    dragOffset = Math.max(-maxDrag, Math.min(maxDrag, dragOffset));
    touchState.value.dragOffset = dragOffset;
  }
};

const handleTouchEnd = (e: TouchEvent) => {
  if (!touchState.value.isDragging) return;

  e.preventDefault();
  e.stopPropagation();

  touchState.value.isDragging = false;

  const deltaX = touchState.value.startX - touchState.value.currentX;
  const deltaY = touchState.value.startY - touchState.value.currentY;
  const deltaTime = Date.now() - touchState.value.startTime;
  const velocity = Math.abs(deltaX) / Math.max(deltaTime, 1);

  // Swipe detection: minimum distance or high velocity
  const minSwipeDistance = 30;
  const minVelocity = 0.5;

  const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
  const isSignificantSwipe =
    Math.abs(deltaX) > minSwipeDistance || velocity > minVelocity;

  if (
    isHorizontalSwipe &&
    isSignificantSwipe &&
    visibleData.value &&
    visibleData.value.length > cardsPerView.value
  ) {
    // Add haptic feedback on supported devices
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    if (deltaX > 0) {
      nextSlide();
    } else if (deltaX < 0) {
      previousSlide();
    }
  }

  // Reset drag offset
  touchState.value.dragOffset = 0;
};

// Auto-slide functionality
onMounted(() => {
  if (import.meta.client) {
    handleResize();
    windowWidth.value = window.innerWidth;
    window.addEventListener("resize", handleResize);

    // Add enhanced touch/swipe support with timeout to ensure element is ready
    setTimeout(() => {
      if (carouselContainer.value) {
        carouselContainer.value.addEventListener(
          "touchstart",
          handleTouchStart,
          {
            passive: false,
          },
        );
        carouselContainer.value.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        carouselContainer.value.addEventListener("touchend", handleTouchEnd, {
          passive: false,
        });
      }
    }, 100);
  }

  startAutoSlide();
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("resize", handleResize);
  }

  // Clean up touch event listeners
  if (carouselContainer.value) {
    carouselContainer.value.removeEventListener("touchstart", handleTouchStart);
    carouselContainer.value.removeEventListener("touchmove", handleTouchMove);
    carouselContainer.value.removeEventListener("touchend", handleTouchEnd);
  }
});

// Mouse event handlers
const handleMouseEnter = () => {
  // No auto-slide functionality
};

const handleMouseLeave = () => {
  // No auto-slide functionality
};

// Watch for data changes to reset carousel
watch(visibleData, (newData) => {
  if (newData && newData.length > 0) {
    currentIndex.value = 0;
  }
});

// Watch for cards per view changes
watch(cardsPerView, () => {
  currentIndex.value = 0;
});
</script>

<style scoped>
/* Smooth scrolling for better UX */
@media (prefers-reduced-motion: no-preference) {
  .transition-transform {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Touch device optimizations */
.carousel-container {
  touch-action: pan-y pinch-zoom;
  -webkit-overflow-scrolling: touch;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Mobile-specific improvements */
@media (max-width: 1023px) {
  .carousel-container {
    cursor: grab;
  }

  .carousel-container:active {
    cursor: grabbing;
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
