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
          The size is based on the selected parameter.
        </p>
      </div>

      <!-- Filter Box and Model Type Selector -->
      <div
        class="mx-auto mb-6 flex max-w-2xl flex-col items-start gap-3 sm:flex-row"
      >
        <!-- Filter Box -->
        <div class="relative w-full max-w-md flex-1">
          <div
            class="flex h-8.5 items-center gap-2 rounded border border-bg3 bg-bg2 px-3 py-2 transition-colors"
            :class="{
              'bg-bg3': filterFocused,
              'hover:bg-bg3': !filterFocused,
            }"
          >
            <Icon name="iconamoon:search-bold" class="shrink-0 text-fg2/50" />
            <input
              ref="filterInput"
              type="text"
              v-model="filterQuery"
              @focus="openFilterDropdown"
              @blur="handleFilterBlur"
              @input="openFilterDropdown"
              placeholder="Filter models..."
              class="min-w-0 flex-1 bg-transparent text-sm leading-3 text-fg outline-none placeholder:text-fg2/50"
            />
            <button
              v-if="selectedModels.length > 0 || filterQuery"
              @mousedown.prevent="clearFilter"
              class="shrink-0 cursor-pointer rounded-full px-0.5 leading-0 text-fg2 transition-colors hover:bg-bg3 hover:text-link"
            >
              <Icon name="material-symbols:close-rounded" class="text-xs" />
            </button>
            <button
              @mousedown.prevent="toggleFilterDropdown"
              class="shrink-0 cursor-pointer leading-0 text-fg2 transition-colors hover:text-link"
            >
              <Icon
                name="mdi:chevron-down"
                class="h-5 w-5 transition-transform"
                :class="{ 'rotate-180': filterDropdownOpen }"
              />
            </button>
          </div>

          <!-- Dropdown -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="filterDropdownOpen"
              class="absolute left-0 z-50 mt-1 max-h-64 w-full overflow-auto rounded border border-bc bg-bg shadow-lg"
            >
              <div
                v-if="filteredDropdownModels.length === 0"
                class="p-3 text-center text-xs text-fg2"
              >
                No models found
              </div>
              <div
                v-for="model in filteredDropdownModels"
                :key="model.filename"
                @mousedown.prevent="toggleModelSelection(model)"
                class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-bg3"
                :class="{
                  'bg-bg2': isModelSelected(model.filename),
                }"
              >
                <span
                  class="inline-block h-3 w-3 shrink-0 rounded-full"
                  :style="{ background: getColorMix(model.score) }"
                ></span>
                <span class="flex-1 truncate">{{ model.name }}</span>
                <span class="shrink-0 text-tiny text-fg2">
                  {{ Math.round(model.score * 100) }}%
                </span>
                <Icon
                  v-if="isModelSelected(model.filename)"
                  name="mdi:check"
                  class="shrink-0 text-link"
                />
              </div>
            </div>
          </Transition>

          <!-- Selected models pills -->
          <div
            v-if="selectedModels.length > 0"
            class="mt-2 flex flex-wrap gap-1"
          >
            <span
              v-for="model in selectedModels"
              :key="model.filename"
              class="inline-flex items-center gap-1 rounded-full border border-bg3 bg-bg px-2 py-0.5 text-xs text-fg"
            >
              <span
                class="inline-block h-2 w-2 rounded-full"
                :style="{ background: getColorMix(model.score) }"
              ></span>
              {{ model.name }}
              <button
                @mousedown.prevent="removeSelectedModel(model.filename)"
                class="cursor-pointer leading-0 text-fg2 hover:text-link"
              >
                <Icon name="material-symbols:close-rounded" class="h-3 w-3" />
              </button>
            </span>
          </div>
        </div>

        <!-- Model Type Selector -->
        <div
          class="flex gap-0 overflow-hidden rounded border border-bg3 text-xs leading-4 font-semibold"
        >
          <button
            v-for="type in modelTypes"
            :key="type"
            @click="toggleModelType(type.toLowerCase())"
            class="cursor-pointer border-l border-bg3 bg-bg2 px-3 py-2 text-fg2/50 transition-colors first:border-l-0 hover:text-link"
            :class="{
              'bg-bg! text-fg!': isModelTypeActive(type.toLowerCase()),
            }"
          >
            {{ type }}
          </button>
        </div>
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
            class="group absolute -translate-x-1/2 translate-y-1/2 cursor-pointer no-underline transition-all duration-200 hover:z-50 hover:scale-125"
            :class="{
              'z-50 scale-125': activeTooltip === point.filename,
              'z-40 scale-110':
                isModelSelected(point.filename) &&
                activeTooltip !== point.filename,
              'opacity-30':
                selectedModels.length > 0 && !isModelSelected(point.filename),
            }"
            :style="{
              left: `${point.adjustedX}%`,
              bottom: `${point.adjustedY}%`,
            }"
            @touchend.stop.prevent="handlePointTouch(point, $event)"
            @click.stop="handlePointClick(point, $event)"
          >
            <div
              class="rounded-full transition-opacity duration-200"
              :class="[
                getSizeClass(point),
                isModelSelected(point.filename)
                  ? 'opacity-100'
                  : 'opacity-80 group-hover:opacity-100',
              ]"
              :style="{ background: getColorMix(point.score) }"
            ></div>
            <!-- Highlight label for selected models -->
            <div
              v-if="isModelSelected(point.filename)"
              class="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded bg-fg px-1.5 py-0.5 text-tiny font-medium whitespace-nowrap text-bg shadow-sm"
              :class="[point.y > 85 ? 'top-full mt-1' : 'bottom-full mb-1']"
            >
              {{ point.name }}
            </div>
            <!-- Connector line -->
            <div
              v-if="!isModelSelected(point.filename)"
              class="absolute left-1/2 h-2 w-px -translate-x-1/2 bg-fg2 transition-opacity duration-200"
              :class="[
                activeTooltip === point.filename
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100',
                point.y > 85 ? 'top-full' : 'bottom-full',
              ]"
            ></div>
            <!-- Tooltip -->
            <div
              v-if="!isModelSelected(point.filename)"
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
        class="mt-12 flex flex-col items-center justify-center gap-4 text-xs"
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

        <!-- Size selector -->
        <div class="relative flex items-center gap-2">
          <span class="text-fg2">Size by:</span>
          <button
            @click.stop="toggleSizeDropdown"
            class="flex cursor-pointer items-center gap-1 rounded border border-bg3 bg-bg2 px-2 py-1 transition-colors hover:bg-bg3"
          >
            <span>{{ selectedSizeOptionLabel }}</span>
            <Icon
              name="mdi:chevron-down"
              class="h-4 w-4 transition-transform"
              :class="{ 'rotate-180': sizeDropdownOpen }"
            />
          </button>

          <!-- Size dropdown -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <div
              v-if="sizeDropdownOpen"
              class="absolute bottom-full left-0 z-50 mb-1 max-h-64 min-w-48 overflow-auto rounded border border-bc bg-bg shadow-lg"
            >
              <!-- Performance class option -->
              <div
                @mousedown.prevent="selectSizeOption('performanceclass')"
                class="flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:bg-bg3"
                :class="{
                  'bg-bg2': selectedSizeOption === 'performanceclass',
                }"
              >
                <span class="flex-1">Performance class</span>
                <Icon
                  v-if="selectedSizeOption === 'performanceclass'"
                  name="mdi:check"
                  class="shrink-0 text-link"
                />
              </div>

              <!-- Category groups -->
              <template v-for="cat in categories" :key="cat.ref">
                <div
                  @mousedown.prevent="selectSizeOption(`cat:${cat.ref}`)"
                  class="flex cursor-pointer items-center gap-2 border-t border-bg3 px-3 py-1.5 text-tiny font-semibold uppercase transition-colors hover:bg-bg3"
                  :class="{
                    'bg-bg2 text-fg': selectedSizeOption === `cat:${cat.ref}`,
                    'text-fg2': selectedSizeOption !== `cat:${cat.ref}`,
                  }"
                >
                  <span class="flex-1">{{ cat.name }}</span>
                  <Icon
                    v-if="selectedSizeOption === `cat:${cat.ref}`"
                    name="mdi:check"
                    class="shrink-0 text-link"
                  />
                </div>
                <div
                  v-for="param in cat.params"
                  :key="param.ref"
                  @mousedown.prevent="selectSizeOption(param.ref)"
                  class="flex cursor-pointer items-center gap-2 px-3 py-2 pl-5 transition-colors hover:bg-bg3"
                  :class="{
                    'bg-bg2': selectedSizeOption === param.ref,
                  }"
                >
                  <span class="flex-1 truncate">{{ param.name }}</span>
                  <Icon
                    v-if="selectedSizeOption === param.ref"
                    name="mdi:check"
                    class="shrink-0 text-link"
                  />
                </div>
              </template>
            </div>
          </Transition>
          <!-- Size legend -->
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-1">
              <span
                class="inline-block h-2 w-2 rounded-full border border-fg2"
              ></span>
              <span>{{ sizeLegendLabels.small }}</span>
            </span>
            <span class="flex items-center gap-1">
              <span
                class="inline-block h-3 w-3 rounded-full border border-fg2"
              ></span>
              <span>{{ sizeLegendLabels.medium }}</span>
            </span>
            <span class="flex items-center gap-1">
              <span
                class="inline-block h-4 w-4 rounded-full border border-fg2"
              ></span>
              <span>{{ sizeLegendLabels.large }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  version?: string;
}>();

const { models, color, categories } = useModels(props.version);

// Model type filter - default to "text"
const selectedModelTypes = ref<string[]>(["text"]);

function toggleModelType(type: string) {
  if (selectedModelTypes.value.includes(type)) {
    selectedModelTypes.value = selectedModelTypes.value.filter(
      (t) => t !== type,
    );
  } else {
    selectedModelTypes.value = [...selectedModelTypes.value, type];
  }
}

function isModelTypeActive(type: string): boolean {
  return selectedModelTypes.value.includes(type);
}
const router = useRouter();

const chartHeight = 600;
const activeTooltip = ref<string | null>(null);
const cutoffDate = new Date("2022-01-01");

// Filter state
const filterInput = ref<HTMLInputElement | null>(null);
const filterQuery = ref("");
const filterFocused = ref(false);
const filterDropdownOpen = ref(false);
const selectedModels = ref<
  Array<{ filename: string; name: string; score: number }>
>([]);

// Size selector state
const sizeDropdownOpen = ref(false);
const selectedSizeOption = ref("performanceclass");

function toggleSizeDropdown() {
  sizeDropdownOpen.value = !sizeDropdownOpen.value;
}

function selectSizeOption(option: string) {
  selectedSizeOption.value = option;
  sizeDropdownOpen.value = false;
}

const selectedSizeOptionLabel = computed(() => {
  if (selectedSizeOption.value === "performanceclass") {
    return "Performance class";
  }
  // Check if it's a category
  if (selectedSizeOption.value.startsWith("cat:")) {
    const catRef = selectedSizeOption.value.replace("cat:", "");
    const cat = (categories.value || []).find((c: any) => c.ref === catRef);
    if (cat) {
      return cat.name;
    }
  }
  // Find the param name
  for (const cat of categories.value || []) {
    const param = cat.params?.find(
      (p: any) => p.ref === selectedSizeOption.value,
    );
    if (param) {
      return param.name;
    }
  }
  return "Performance class";
});

const sizeLegendLabels = computed(() => {
  if (selectedSizeOption.value === "performanceclass") {
    return { small: "Limited", medium: "Full", large: "Latest" };
  }
  // For categories: show percentage ranges
  if (selectedSizeOption.value.startsWith("cat:")) {
    return { small: "0-33%", medium: "34-66%", large: "67-100%" };
  }
  // For params: closed (0) = small, partial (0.5) = medium, open (1) = large
  return { small: "Closed", medium: "Partial", large: "Open" };
});

function openFilterDropdown() {
  filterFocused.value = true;
  filterDropdownOpen.value = true;
}

function handleFilterBlur() {
  filterFocused.value = false;
  // Delay closing to allow click events on dropdown items
  setTimeout(() => {
    filterDropdownOpen.value = false;
  }, 150);
}

function toggleFilterDropdown() {
  filterDropdownOpen.value = !filterDropdownOpen.value;
  if (filterDropdownOpen.value) {
    filterInput.value?.focus();
  }
}

function clearFilter() {
  filterQuery.value = "";
  selectedModels.value = [];
  filterDropdownOpen.value = false;
}

function isModelSelected(filename: string): boolean {
  return selectedModels.value.some((m) => m.filename === filename);
}

function toggleModelSelection(model: {
  filename: string;
  name: string;
  score: number;
}) {
  if (isModelSelected(model.filename)) {
    removeSelectedModel(model.filename);
  } else {
    selectedModels.value.push({
      filename: model.filename,
      name: model.name,
      score: model.score,
    });
  }
}

function removeSelectedModel(filename: string) {
  selectedModels.value = selectedModels.value.filter(
    (m) => m.filename !== filename,
  );
}

const filteredDropdownModels = computed(() => {
  const query = filterQuery.value.toLowerCase().trim();
  return validModels.value
    .map((m: any) => ({
      filename: m.filename,
      name: m.system?.name || "(undefined)",
      score: m.score,
    }))
    .filter((m) => {
      if (!query) return true;
      return m.name.toLowerCase().includes(query);
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 50); // Limit for performance
});

interface DataPoint {
  filename: string;
  name: string;
  releaseDate: string;
  score: number;
  performanceClass: string;
  params: Record<string, number>;
  categories: Record<string, number>;
  x: number;
  y: number;
  // Adjusted positions after collision detection
  adjustedX: number;
  adjustedY: number;
  // Number of overlapping points at this location
  overlapCount: number;
}

const validModels = computed(() => {
  if (!models.value || !Array.isArray(models.value)) return [];
  return models.value.filter((m: any) => {
    if (!m.system?.releasedate || typeof m.score !== "number") return false;
    const releaseDate = new Date(m.system.releasedate);
    if (isNaN(releaseDate.getTime())) return false;
    // Filter out models before 2022
    if (releaseDate < cutoffDate) return false;
    // Filter by model type if any selected
    if (selectedModelTypes.value.length > 0) {
      const modelTypeArray = (m.system?.type || "")
        .split(",")
        .map((t: string) => t.trim().toLowerCase());
      if (!selectedModelTypes.value.some((t) => modelTypeArray.includes(t))) {
        return false;
      }
    }
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

// Collision detection threshold (in percentage units)
const COLLISION_THRESHOLD = 2.5;

function resolveCollisions(points: DataPoint[]): DataPoint[] {
  // Group points that are too close together
  const processed = new Set<number>();

  for (let i = 0; i < points.length; i++) {
    if (processed.has(i)) continue;

    const pointI = points[i];
    if (!pointI) continue;

    // Find all points that overlap with point i
    const cluster: number[] = [i];
    for (let j = i + 1; j < points.length; j++) {
      if (processed.has(j)) continue;

      const pointJ = points[j];
      if (!pointJ) continue;

      const dx = Math.abs(pointI.x - pointJ.x);
      const dy = Math.abs(pointI.y - pointJ.y);

      if (dx < COLLISION_THRESHOLD && dy < COLLISION_THRESHOLD) {
        cluster.push(j);
      }
    }

    // If we have overlapping points, spread them out
    if (cluster.length > 1) {
      const centerX =
        cluster.reduce((sum, idx) => sum + (points[idx]?.x ?? 0), 0) /
        cluster.length;
      const centerY =
        cluster.reduce((sum, idx) => sum + (points[idx]?.y ?? 0), 0) /
        cluster.length;

      // Arrange in a circle around the center
      const angleStep = (2 * Math.PI) / cluster.length;
      const radius = Math.min(1.5, 0.8 * cluster.length); // Scale radius with cluster size

      cluster.forEach((idx, posIndex) => {
        const point = points[idx];
        if (!point) return;

        const angle = angleStep * posIndex - Math.PI / 2; // Start from top
        point.adjustedX = Math.max(
          2,
          Math.min(98, centerX + radius * Math.cos(angle)),
        );
        point.adjustedY = Math.max(
          2,
          Math.min(98, centerY + radius * Math.sin(angle)),
        );
        point.overlapCount = cluster.length;
        processed.add(idx);
      });
    } else {
      pointI.adjustedX = pointI.x;
      pointI.adjustedY = pointI.y;
      pointI.overlapCount = 1;
      processed.add(i);
    }
  }

  return points;
}

const dataPoints = computed<DataPoint[]>(() => {
  if (validModels.value.length === 0) return [];

  const { min, max } = dateRange.value;
  const timeRange = max.getTime() - min.getTime();

  const points = validModels.value.map((m: any) => {
    const releaseTime = new Date(m.system.releasedate).getTime();
    const x = ((releaseTime - min.getTime()) / timeRange) * 100;
    const y = m.score * 100;

    return {
      filename: m.filename,
      name: m.system?.name || "(undefined)",
      releaseDate: m.system.releasedate,
      score: m.score,
      performanceClass: m.system?.performanceclass || "limited",
      params: m.params || {},
      categories: m.categories || {},
      x: Math.max(2, Math.min(98, x)), // Clamp to keep points visible
      y: Math.max(2, Math.min(98, y)),
      adjustedX: 0,
      adjustedY: 0,
      overlapCount: 1,
    };
  });

  return resolveCollisions(points);
});

function getColorMix(score: number): string {
  return color(score);
}

function getSizeClass(point: DataPoint): string {
  if (selectedSizeOption.value === "performanceclass") {
    switch (point.performanceClass?.toLowerCase()) {
      case "latest":
        return "h-6 w-6";
      case "full":
        return "h-4 w-4";
      case "limited":
      default:
        return "h-3 w-3";
    }
  }

  // Check if it's a category
  if (selectedSizeOption.value.startsWith("cat:")) {
    const catRef = selectedSizeOption.value.replace("cat:", "");
    const catValue = point.categories[catRef] ?? 0;
    if (catValue >= 0.67) {
      return "h-6 w-6";
    } else if (catValue >= 0.34) {
      return "h-4 w-4";
    } else {
      return "h-3 w-3";
    }
  }

  // For params: 0 = small, 0.5 = medium, 1 = large
  const paramValue = point.params[selectedSizeOption.value];
  if (paramValue === 1) {
    return "h-6 w-6";
  } else if (paramValue === 0.5) {
    return "h-4 w-4";
  } else {
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
  sizeDropdownOpen.value = false;
}
</script>
