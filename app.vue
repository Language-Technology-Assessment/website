<template>
  <div class="app" :class="[{ top: !nottop, nottop, mounted }, direction]">
    <NuxtLoadingIndicator :color="false" />
    <PreviewPopup />
    <!-- menu -->
    <Mainmenu></Mainmenu>
    <!-- page content -->
    <NuxtPage keep-alive></NuxtPage>
    <!-- footer -->
    <Mainfooter key="main-footer"></Mainfooter>
  </div>
</template>
<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";

// scroll directions
const direction = ref("");
const { y } = useWindowScroll();
let prevy = 0;
const nottop = computed(() => {
  direction.value = y.value > prevy ? "scroll-down" : "scroll-up";
  prevy = y.value;
  return y.value > 150;
});
// end

const mounted = ref(false);

const config = useRuntimeConfig();

onMounted(() => {
  mounted.value = true;
  console.log({ env: config.public.NUXT_SITE_ENV });
});
</script>
<style>
/* Initial paint overlay for smooth theme/background load */
.app::before {
  content: "";
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--bg2);
  pointer-events: none;
  z-index: 999;
  transition: all 0.5s ease;
  opacity: 1;
}
@media (prefers-color-scheme: dark) {
  .app::before {
    background: #1b1f28;
  }
}
.app.mounted::before {
  content: none;
  opacity: 0;
}
</style>
