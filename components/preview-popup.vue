<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-bg z-[1000] flex items-center justify-center text-center"
    v-if="showPopup"
  >
    <div class="frame">
      <div>
        <p class="mb-2">Welcome to the preview site of osai-index.eu.</p>
        <p>For our published content, please visit:</p>
        <a href="https://osai-index.eu">osai-index.eu</a>
      </div>
      <button
        class="mt-8 inline-block bg-fg2 text-bg px-8 py-2 min-w-[8rem] hover:bg-fg"
        @click="hidePopup()"
      >
        Ok
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const justSet = ref(false);
const showPopup = computed(() => {
  if (config.public.NUXT_SITE_ENV === "production") {
    return false;
  }
  if (typeof localStorage === "undefined") {
    return false;
  }
  if (localStorage.getItem("preview-ok") === "true") {
    return false;
  }
  if (justSet.value) {
    return false;
  }
  return true;
});
function hidePopup() {
  justSet.value = true;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("preview-ok", "true");
  }
}
</script>
