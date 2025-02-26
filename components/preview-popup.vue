<template>
  <div class="preview-popup" v-if="showPopup">
    <div class="frame">
      <div>
        <p>Welcome to the preview site of osai-index.eu.</p>
        <p>For our published content, please visit:</p>
        <a href="https://osai-index.eu">osai-index.eu</a>
      </div>
      <button @click="hidePopup()">Ok</button>
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

<style lang="less" scoped>
.preview-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  p {
    margin-bottom: 0.5rem;
  }
  button {
    margin-top: 2rem;
    display: inline-block;
    background: var(--fg2);
    color: var(--bg);
    padding: 0.5rem 2rem;
    min-width: 8rem;
    &:hover {
      background: var(--fg);
    }
  }
}
</style>
