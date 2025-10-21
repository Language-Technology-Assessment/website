<template>
  <div
    class="fixed top-0 z-50 w-full bg-linear-to-b from-bg2/100 to-bg2/0 py-4 text-fg transition-all duration-300 sm:py-8 lg:py-10 down:-translate-y-12 down:opacity-0"
    ref="menuelement"
    :class="{ active, afteractive, menuopen }"
  >
    <div class="row flex items-start justify-between">
      <NuxtLink
        to="/"
        class="group/logo flex cursor-pointer items-center gap-2 self-start no-underline hover:text-link"
      >
        <logo class="logo h-auto w-12" />
        <div class="w-22 text-[0.75rem] leading-3.75 font-semibold">
          European Open Source AI Index
        </div>
      </NuxtLink>

      <button
        alt="Menu"
        class="cursor-pointer rounded-full bg-bg3/50 px-4 py-2 text-sm font-semibold text-fg uppercase backdrop-blur-sm hover:bg-link hover:text-bg"
        @click="menuopen = !menuopen"
        @mouseenter="menuopen = true"
      >
        Menu
      </button>
    </div>

    <div
      class="fixed top-0 right-0 bottom-0 left-0 z-1 cursor-pointer bg-bg3/80 transition-opacity"
      :class="{
        'pointer-events-none opacity-0 duration-200': !menuopen,
        'pointer-events-auto opacity-100 duration-500': menuopen,
      }"
      @click="menuopen = false"
    ></div>

    <!-- menu -->
    <div
      class="fixed top-0 right-0 z-50 h-screen w-[24rem] max-w-full overflow-auto bg-bg2/50 drop-shadow-lg backdrop-blur-sm transition-all"
      :class="{
        'pointer-events-auto translate-x-0 opacity-100 duration-200': menuopen,
        'pointer-events-none translate-x-12 opacity-0 duration-200': !menuopen,
      }"
      @mouseleave="menuopen = false"
      @click="menuopen = false"
    >
      <div class="p-8 sm:p-12">
        <Darkmode class="mb-8" />
        <NuxtLink
          :to="item.link"
          v-for="item in menu.menu"
          :target="item.target"
          class="mb-4 block text-2xl text-fg no-underline hover:text-link"
          :class="{
            withIcon: !!item.icon,
            exact: $route.fullPath === item.link,
          }"
          :aria-label="item?.name"
        >
          <span v-if="item.name">{{ item.name }}</span>
          <Icon :name="item.icon" v-if="item.icon" aria-hidden="true"></Icon>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";
import logo from "@/repos/website/images/logo-dark.svg?component";
import logoname from "@/repos/website/images/logo2-name-c.svg?component";
import menu from "@/repos/website/menu.yml";
const menuopen = ref(false);
const active = ref(false);
const afteractive = ref(false);
const isDark = useDark();
const toggleDark = useToggle(isDark);
onMounted(() => {
  setTimeout(() => {
    active.value = true;
  }, 0);
  setTimeout(() => {
    afteractive.value = true;
  }, 2500);
});
watch(menuopen, (val) => {
  if (val) {
    document.body.classList.add("scroll-block");
  } else {
    document.body.classList.remove("scroll-block");
  }
});
</script>
<style>
.logo {
  path {
    fill: currentColor;
  }
}
</style>
