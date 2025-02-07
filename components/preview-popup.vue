<template>
  <div
    class="preview-popup"
    v-if="
      (config.public.NODE_ENV === 'preview' ||
        config.public.NODE_ENV === 'development') &&
      !isOk
    "
  >
    <div class="frame">
      <div>
        <p>Welcome to the preview site of osai-index.eu.</p>
        <p>For our published content, please visit:</p>
        <a href="https://www.osai-index.eu">www.osai-index.eu</a>
      </div>
      <button @click="isOk = true">Ok</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const justSet = ref(false);
const isOk = computed({
  get() {
    return localStorage.getItem("preview-ok") === "true" || justSet.value;
  },
  set(val) {
    justSet.value = true;
    localStorage.setItem("preview-ok", val ? "true" : "false");
  },
});

onMounted(() => {
  console.log(config.public.NODE_ENV);
});
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
