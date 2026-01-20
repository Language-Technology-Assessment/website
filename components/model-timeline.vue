<template>
  <div
    class="overflow-x-auto border border-bc bg-bg p-4 pb-8 md:mx-8 md:rounded-lg"
    @click="handleOutsideClick"
  >
    <div class="min-w-[600px] px-0 md:px-12">
      <!-- Header -->
      <div class="mb-6 text-center">
        <p class="text-tiny text-fg2/50">
          Models plotted by release date and openness score.<br />
          The size is based on the performance class.
        </p>
      </div>

      <!-- Chart Container -->
      <div class="relative" :style="{ height: `${chartHeight}px` }">
        <!-- Y-axis labels -->
        <div
          class="absolute top-0 left-0 flex h-full w-12 flex-col justify-between pb-8 text-right text-xs text-fg2"
        >
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        <!-- Chart area -->
        <div class="relative ml-14 h-full border-b border-l border-bc">
          <!-- Horizontal grid lines -->
          <div
            class="absolute left-0 w-full border-t border-bg3"
            style="top: 0%"
          ></div>
          <div
            class="absolute left-0 w-full border-t border-dashed border-bg3"
            style="top: 25%"
          ></div>
          <div
            class="absolute left-0 w-full border-t border-dashed border-bg3"
            style="top: 50%"
          ></div>
          <div
            class="absolute left-0 w-full border-t border-dashed border-bg3"
            style="top: 75%"
          ></div>

          <!-- Vertical year markers -->
          <div
            v-for="year in yearMarkers"
            :key="year.year"
            class="absolute top-0 h-full border-l border-dashed border-bg3"
            :style="{ left: `${year.x}%` }"
          ></div>

          <!-- Data points -->
          <div
            v-for="point in dataPoints"
            :key="point.filename"
            class="group absolute -translate-x-1/2 translate-y-1/2 cursor-pointer no-underline transition-transform duration-200 hover:z-50 hover:scale-125"
            :class="{ 'z-50 scale-125': activeTooltip === point.filename }"
            :style="{
              left: `${point.x}%`,
              bottom: `${point.y}%`,
            }"
            @touchend.stop.prevent="handlePointTouch(point, $event)"
            @click.stop="handlePointClick(point, $event)"
          >
            <div
              class="rounded-full opacity-80 transition-opacity duration-200 group-hover:opacity-100"
              :class="[getSizeClass(point.performanceClass)]"
              :style="{ background: getColorMix(point.score) }"
            ></div>
            <!-- Connector line -->
            <div
              class="absolute left-1/2 h-2 w-px -translate-x-1/2 bg-bc transition-opacity duration-200"
              :class="[
                activeTooltip === point.filename
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100',
                point.y > 85 ? 'top-full' : 'bottom-full',
              ]"
            ></div>
            <!-- Tooltip -->
            <div
              class="absolute mb-2 rounded border border-bc bg-bg px-2 py-1 text-xs whitespace-nowrap shadow-lg transition-opacity duration-200"
              :class="[
                activeTooltip === point.filename
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none opacity-0 group-hover:opacity-100',
              ]"
              :style="getTooltipPosition(point)"
              @touchend.stop.prevent="
                handleTooltipTouch(point.filename, $event)
              "
              @click.stop="navigateToModel(point.filename)"
            >
              <!-- Close button (visible on touch/active) -->
              <button
                v-if="activeTooltip === point.filename"
                class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-bc bg-bg text-xs text-fg2 hover:bg-fg2 hover:text-bg"
                @touchend.stop.prevent="closeTooltip"
                @click.stop="closeTooltip"
              >
                <Icon name="material-symbols:close-rounded" />
              </button>
              <div class="mb-0.5 font-semibold text-fg">{{ point.name }}</div>
              <div class="text-tiny text-fg2">
                {{ formatReleaseDate(point.releaseDate) }} •
                {{ Math.round(point.score * 100) }}% open
              </div>
              <div
                v-if="activeTooltip === point.filename"
                class="mt-1 text-tiny text-link"
              >
                More info →
              </div>
            </div>
          </div>
        </div>

        <!-- X-axis year labels -->
        <div class="relative mt-2 ml-14 h-6">
          <span
            v-for="year in yearMarkers"
            :key="year.year"
            class="absolute -translate-x-1/2 text-xs text-fg2"
            :style="{ left: `${year.x}%` }"
          >
            {{ year.year }}
          </span>
        </div>
      </div>

      <!-- Legend -->
      <div
        class="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs"
      >
        <div class="flex items-center gap-2">
          <span class="text-fg2">Openness:</span>
          <span class="flex items-center gap-1">
            <span class="inline-block h-3 w-3 rounded-full bg-g1"></span>
            <span>Closed</span>
          </span>
          <span class="flex items-center gap-1">
            <span class="inline-block h-3 w-3 rounded-full bg-g2"></span>
            <span>Partial</span>
          </span>
          <span class="flex items-center gap-1">
            <span class="inline-block h-3 w-3 rounded-full bg-g3"></span>
            <span>Open</span>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-fg2">Performance class:</span>
          <span class="flex items-center gap-1">
            <span
              class="inline-block h-2 w-2 rounded-full border border-fg2"
            ></span>
            <span>Limited</span>
          </span>
          <span class="flex items-center gap-1">
            <span
              class="inline-block h-3 w-3 rounded-full border border-fg2"
            ></span>
            <span>Full</span>
          </span>
          <span class="flex items-center gap-1">
            <span
              class="inline-block h-4 w-4 rounded-full border border-fg2"
            ></span>
            <span>Latest</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  version?: string;
}>();

const { models, color } = useModels(props.version);
const router = useRouter();

const chartHeight = 600;
const activeTooltip = ref<string | null>(null);
const cutoffDate = new Date("2022-01-01");

interface DataPoint {
  filename: string;
  name: string;
  releaseDate: string;
  score: number;
  performanceClass: string;
  x: number;
  y: number;
}

const validModels = computed(() => {
  if (!models.value || !Array.isArray(models.value)) return [];
  return models.value.filter((m: any) => {
    if (!m.system?.releasedate || typeof m.score !== "number") return false;
    const releaseDate = new Date(m.system.releasedate);
    if (isNaN(releaseDate.getTime())) return false;
    // Filter out models before 2022
    if (releaseDate < cutoffDate) return false;
    return true;
  });
});

const dateRange = computed(() => {
  if (validModels.value.length === 0) {
    return { min: cutoffDate, max: new Date() };
  }

  const dates = validModels.value.map((m: any) =>
    new Date(m.system.releasedate).getTime(),
  );
  const minDate = Math.max(Math.min(...dates), cutoffDate.getTime());
  const maxDate = Math.max(...dates);

  // Add some padding (1 month on each side)
  const padding = 30 * 24 * 60 * 60 * 1000;
  return {
    min: new Date(minDate - padding),
    max: new Date(maxDate + padding),
  };
});

const yearMarkers = computed(() => {
  const { min, max } = dateRange.value;
  const timeRange = max.getTime() - min.getTime();
  const markers: { year: number; x: number }[] = [];

  const startYear = min.getFullYear();
  const endYear = max.getFullYear();

  for (let year = startYear; year <= endYear; year++) {
    const yearDate = new Date(year, 0, 1); // January 1st of each year
    if (yearDate >= min && yearDate <= max) {
      const x = ((yearDate.getTime() - min.getTime()) / timeRange) * 100;
      markers.push({ year, x });
    }
  }

  return markers;
});

const dataPoints = computed<DataPoint[]>(() => {
  if (validModels.value.length === 0) return [];

  const { min, max } = dateRange.value;
  const timeRange = max.getTime() - min.getTime();

  return validModels.value.map((m: any) => {
    const releaseTime = new Date(m.system.releasedate).getTime();
    const x = ((releaseTime - min.getTime()) / timeRange) * 100;
    const y = m.score * 100;

    return {
      filename: m.filename,
      name: m.system?.name || "(undefined)",
      releaseDate: m.system.releasedate,
      score: m.score,
      performanceClass: m.system?.performanceclass || "limited",
      x: Math.max(2, Math.min(98, x)), // Clamp to keep points visible
      y: Math.max(2, Math.min(98, y)),
    };
  });
});

function getColorMix(score: number): string {
  return color(score);
}

function getSizeClass(performanceClass: string): string {
  switch (performanceClass?.toLowerCase()) {
    case "latest":
      return "h-6 w-6";
    case "full":
      return "h-4 w-4";
    case "limited":
    default:
      return "h-3 w-3";
  }
}

function getTooltipPosition(point: DataPoint): Record<string, string> {
  const style: Record<string, string> = {};

  // Vertical positioning: show below if point is near top (high score)
  if (point.y > 85) {
    // Point is near top, show tooltip below
    style.top = "100%";
    style.bottom = "auto";
    style.marginTop = "0.5rem";
    style.marginBottom = "0";
  } else {
    // Default: show tooltip above
    style.bottom = "100%";
    style.top = "auto";
  }

  // Horizontal positioning: adjust based on x position
  if (point.x < 15) {
    // Point is near left edge, align tooltip to left
    style.left = "0";
    style.right = "auto";
    style.transform = "translateX(0)";
  } else if (point.x > 85) {
    // Point is near right edge, align tooltip to right
    style.left = "auto";
    style.right = "0";
    style.transform = "translateX(0)";
  } else {
    // Center the tooltip
    style.left = "50%";
    style.right = "auto";
    style.transform = "translateX(-50%)";
  }

  return style;
}

// Track if the last interaction was a touch event
const lastInteractionWasTouch = ref(false);

function handlePointTouch(point: DataPoint, event: Event) {
  event.preventDefault();
  lastInteractionWasTouch.value = true;

  if (activeTooltip.value === point.filename) {
    // Second tap on same point: navigate
    navigateToModel(point.filename);
  } else {
    // First tap: show tooltip
    activeTooltip.value = point.filename;
  }
}

function handlePointClick(point: DataPoint, event: Event) {
  // If this click was triggered by a touch, ignore it (handled by touch handler)
  if (lastInteractionWasTouch.value) {
    lastInteractionWasTouch.value = false;
    return;
  }

  // Mouse click: navigate directly
  navigateToModel(point.filename);
}

function navigateToModel(filename: string) {
  router.push(`/model/${filename}`);
}

function closeTooltip() {
  activeTooltip.value = null;
}

function handleTooltipTouch(filename: string, event: TouchEvent) {
  // Check if the touch target is the close button
  const target = event.target as HTMLElement;
  if (target.closest("button")) {
    // Let the close button handler deal with it
    return;
  }
  // Navigate to model page
  navigateToModel(filename);
}

function handleOutsideClick(event: Event) {
  // Close tooltip when clicking outside
  activeTooltip.value = null;
}
</script>
