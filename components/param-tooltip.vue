<template>
  <div class="inline-flex items-center" ref="wrapper">
    <div
      class="inline-flex cursor-pointer items-center"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @click="onClick"
      @touchstart.passive="onTouchStart"
    >
      <slot>
        <Icon
          name="mage:question-mark-circle-fill"
          class="shrink-0 cursor-pointer text-fg2 opacity-50 transition-all duration-200 ease-in-out hover:opacity-100"
        />
      </slot>
    </div>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150 ease-out"
        leave-active-class="transition-opacity duration-150 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isVisible && description"
          ref="tooltip"
          class="pointer-events-auto fixed z-[9999] w-70 max-w-[calc(100vw-24px)] max-sm:!left-3 max-sm:w-[calc(100vw-24px)] sm:w-70"
          :style="tooltipStyle"
          @mouseenter="onTooltipMouseEnter"
          @mouseleave="onTooltipMouseLeave"
        >
          <div
            class="relative rounded-lg border border-bc bg-bg p-3 px-4 shadow-lg"
          >
            <button
              v-if="isMobile"
              class="absolute top-2 right-2 m-0 cursor-pointer border-none bg-transparent p-0 leading-none text-fg2 hover:bg-transparent hover:text-fg"
              @click.stop="close"
            >
              <Icon name="ic:round-close" class="h-4 w-4" />
            </button>
            <div class="mb-1.5 pr-6 text-[0.8125rem] font-semibold text-fg">
              {{ paramName }}
            </div>
            <div class="text-xs leading-relaxed text-fg2">
              {{ description }}
            </div>
          </div>
          <div
            class="absolute -top-1.5 h-0 w-0 -translate-x-1/2 border-x-[6px] border-b-[6px] border-x-transparent border-b-bc max-sm:hidden"
            :style="arrowStyle"
          >
            <div
              class="absolute top-[1px] -left-[5px] h-0 w-0 border-x-[5px] border-b-[5px] border-x-transparent border-b-bg"
            ></div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core";

const props = defineProps<{
  paramRef: string;
}>();

const { descriptions: current_descriptions, params: current_params } =
  useModels();

const wrapper = ref<HTMLElement | null>(null);
const tooltip = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const isVisible = ref(false);
const isHoveringTooltip = ref(false);
const isMobile = ref(false);
const tooltipPosition = ref({ top: 0, left: 0 });
const arrowPosition = ref({ left: "50%" });

const { width: windowWidth } = useWindowSize();

// Detect mobile/touch device
onMounted(() => {
  isMobile.value = "ontouchstart" in window || navigator.maxTouchPoints > 0;
});

const paramName = computed(() => {
  const param = current_params.value.find((x: any) => x.ref === props.paramRef);
  return param?.name || props.paramRef;
});

const description = computed(() => {
  const desc = current_descriptions.value?.[props.paramRef];
  return desc?.en || desc || "";
});

const tooltipStyle = computed(() => ({
  top: `${tooltipPosition.value.top}px`,
  left: `${tooltipPosition.value.left}px`,
}));

const arrowStyle = computed(() => ({
  left: arrowPosition.value.left,
}));

let closeTimeout: ReturnType<typeof setTimeout> | null = null;

function calculatePosition() {
  if (!wrapper.value) return;

  const rect = wrapper.value.getBoundingClientRect();
  const tooltipWidth = 280;
  const tooltipHeight = 120;
  const padding = 12;
  const arrowSize = 8;

  let top = rect.bottom + arrowSize + 4;
  let left = rect.left + rect.width / 2 - tooltipWidth / 2;
  let arrowLeft = "50%";

  // Check if tooltip would go off the right edge
  if (left + tooltipWidth > windowWidth.value - padding) {
    const oldLeft = left;
    left = windowWidth.value - tooltipWidth - padding;
    const diff = oldLeft - left;
    arrowLeft = `calc(50% + ${diff}px)`;
  }

  // Check if tooltip would go off the left edge
  if (left < padding) {
    const oldLeft = left;
    left = padding;
    const diff = oldLeft - left;
    arrowLeft = `calc(50% + ${diff}px)`;
  }

  // Check if tooltip would go off the bottom
  const viewportHeight = window.innerHeight;
  if (top + tooltipHeight > viewportHeight - padding) {
    top = rect.top - tooltipHeight - arrowSize - 4;
  }

  tooltipPosition.value = { top, left };
  arrowPosition.value = { left: arrowLeft };
}

function open() {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
  isOpen.value = true;
  // Calculate position first, then show
  calculatePosition();
  nextTick(() => {
    isVisible.value = true;
  });
}

function close() {
  isVisible.value = false;
  isOpen.value = false;
  isHoveringTooltip.value = false;
}

function delayedClose() {
  closeTimeout = setTimeout(() => {
    if (!isHoveringTooltip.value) {
      close();
    }
  }, 150);
}

function onMouseEnter() {
  if (!isMobile.value) {
    open();
  }
}

function onMouseLeave() {
  if (!isMobile.value) {
    delayedClose();
  }
}

function onTooltipMouseEnter() {
  if (!isMobile.value) {
    isHoveringTooltip.value = true;
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }
}

function onTooltipMouseLeave() {
  if (!isMobile.value) {
    isHoveringTooltip.value = false;
    delayedClose();
  }
}

function onClick(e: MouseEvent) {
  if (isMobile.value) {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  }
}

function onTouchStart(e: TouchEvent) {
  if (isMobile.value && !isOpen.value) {
    open();
  }
}

// Close on click outside for mobile
function handleClickOutside(e: MouseEvent | TouchEvent) {
  if (!isOpen.value || !isMobile.value) return;

  const target = e.target as HTMLElement;
  if (
    wrapper.value &&
    !wrapper.value.contains(target) &&
    tooltip.value &&
    !tooltip.value.contains(target)
  ) {
    close();
  }
}

// Close on scroll for better UX
function handleScroll() {
  if (isOpen.value) {
    close();
  }
}

// Close on escape key
function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value) {
    close();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside, true);
  document.addEventListener("touchstart", handleClickOutside, true);
  document.addEventListener("scroll", handleScroll, true);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside, true);
  document.removeEventListener("touchstart", handleClickOutside, true);
  document.removeEventListener("scroll", handleScroll, true);
  document.removeEventListener("keydown", handleKeydown);
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
});

// Recalculate position on window resize
watch(windowWidth, () => {
  if (isOpen.value) {
    calculatePosition();
  }
});
</script>
