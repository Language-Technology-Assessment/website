<template>
  <div class="mb-4 select-none">
    <div
      class="relative h-2 w-full cursor-pointer rounded bg-bg2"
      @mousedown="startMove($event)"
      @touchstart="startMove($event)"
      @touchend="isActive = false"
      ref="barElement"
    >
      <div
        ref="startElement"
        class="absolute -top-1 left-0 z-[2] h-4 w-1 -translate-x-0.5 cursor-pointer rounded bg-fg2 transition-all duration-75 ease-in-out hover:bg-link active:bg-link"
        :style="startStyle"
      ></div>
      <div
        class="absolute top-0 left-0 h-full w-0 bg-bg3 transition-all duration-75 ease-in-out"
        :style="selectionStyle"
      ></div>
      <div
        ref="endElement"
        class="absolute -top-1 left-0 z-[2] h-4 w-1 -translate-x-0.5 cursor-pointer rounded bg-fg2 transition-all duration-75 ease-in-out hover:bg-link active:bg-link"
        :style="endStyle"
      ></div>
    </div>
    <div class="flex pt-2 text-tiny font-semibold text-fg2">
      <label class="flex-1">{{ rangeStart }}</label>
      <label>{{ rangeEnd }}</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDateFormat, onClickOutside } from "@vueuse/core";
import { useMouse, useMousePressed } from "@vueuse/core";
const filters = defineModel();
const route = useRoute();
const router = useRouter();
const { pressed } = useMousePressed();
const { x } = useMouse();
const barElement = ref<HTMLElement | null>(null);
const startElement = ref<HTMLElement | null>(null);
const endElement = ref<HTMLElement | null>(null);

onClickOutside(barElement, (event) => {
  isActive.value = false;
});

const isActive = ref(false);
const isStart = ref(true);

const rangeStart = computed(() => {
  const date = new Date(startRange);
  date.setMonth(date.getMonth() + start.value);
  return useDateFormat(date, "MMM YYYY");
});
const rangeEnd = computed(() => {
  if (end.value === months) return "Now";
  const date = new Date(startRange);
  date.setMonth(date.getMonth() + end.value);
  return useDateFormat(date, "MMM YYYY");
});

watch(x, (val) => {
  if (!pressed.value) {
    isActive.value = false;
    return;
  }
  if (isActive.value) {
    const rect = barElement.value?.getBoundingClientRect();
    if (isStart.value) {
      start.value = maxRange(
        Math.round(((val - rect.left) / rect.width) * months),
        true,
      );
    } else {
      end.value = maxRange(
        Math.round(((val - rect.left) / rect.width) * months),
        false,
      );
    }
  }
});

const startRange = new Date(2022, 0, 1); // January 1, 2022
const now = new Date();
const months =
  (now.getFullYear() - startRange.getFullYear()) * 12 +
  (now.getMonth() - startRange.getMonth());

const start = ref(0);
const end = ref(months);

watch([start, end], (val) => {
  if (val[0] > 0) {
    const date = new Date(startRange);
    date.setMonth(date.getMonth() + start.value);
    filters.value.release_start = useDateFormat(date, "YYYY-MM");
  }
  if (val[1] < months) {
    const date = new Date(startRange);
    date.setMonth(date.getMonth() + end.value);
    filters.value.release_end = useDateFormat(date, "YYYY-MM");
  }
  if (val[0] === 0 && "release_start" in route.query) {
    delete filters.value.release_start;
  }
  if (val[1] === months && "release_end" in route.query) {
    delete filters.value.release_end;
  }
});

function getClosestElement(event, element1, element2) {
  // Get event coordinates
  const x = event.type.includes("touch")
    ? event.touches[0].clientX
    : event.clientX;
  const y = event.type.includes("touch")
    ? event.touches[0].clientY
    : event.clientY;

  // Get elements' rectangles
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  // Calculate centers
  const center1 = {
    x: rect1.left + rect1.width / 2,
    y: rect1.top + rect1.height / 2,
  };
  const center2 = {
    x: rect2.left + rect2.width / 2,
    y: rect2.top + rect2.height / 2,
  };

  // Calculate distances
  const distance1 = Math.hypot(x - center1.x, y - center1.y);
  const distance2 = Math.hypot(x - center2.x, y - center2.y);

  return distance1 < distance2 ? true : false;
}

function startMove(event: MouseEvent | TouchEvent) {
  isActive.value = true;
  // get closest:
  isStart.value = getClosestElement(
    event,
    startElement.value,
    endElement.value,
  );
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  if (isStart.value) {
    start.value = maxRange(Math.round((x / rect.width) * months), true);
  } else {
    end.value = maxRange(Math.round((x / rect.width) * months), false);
  }
}

function maxRange(number: number, starter: boolean) {
  if (isNaN(number)) return 0;
  return Math.max(
    starter ? 0 : start.value + 1,
    Math.min(number, starter ? end.value - 1 : months),
  );
}

const startStyle = computed(() => {
  return {
    left: `${(start.value / months) * 100}%`,
  };
});
const endStyle = computed(() => {
  return {
    left: `${(end.value / months) * 100}%`,
  };
});
const selectionStyle = computed(() => {
  return {
    left: startStyle.value.left,
    width: `${((end.value - start.value) / months) * 100}%`,
  };
});

function setFilterDate() {
  if (isActive.value) {
    return false;
  }
  if (filters.value?.release_start) {
    const tstart = new Date(startRange);
    const tend = new Date(filters.value.release_start);
    start.value =
      (tend.getFullYear() - tstart.getFullYear()) * 12 +
      (tend.getMonth() - tstart.getMonth());
  } else {
    start.value = 0;
  }
  if (filters.value?.release_end) {
    const tstart = new Date(startRange);
    const tend = new Date(filters.value.release_end);
    end.value =
      (tend.getFullYear() - tstart.getFullYear()) * 12 +
      (tend.getMonth() - tstart.getMonth());
  } else {
    end.value = months;
  }
}

watch(
  filters,
  (val) => {
    setFilterDate();
  },
  { deep: true },
);

onMounted(() => {
  // convert
  setFilterDate();
});
</script>
