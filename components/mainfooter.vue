<template>
  <div class="mainfooter" :class="{ loaded }">
    <div class="frame">
      <ContentRenderer :value="page" v-if="page && status === 'success'">
        <template #empty></template>
      </ContentRenderer>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {
  data: page,
  error,
  status,
} = await useAsyncData("mainfooter", async () => {
  return queryCollection("docs").path("/footer").first();
});
const loaded = ref(false);
onMounted(() => {
  setTimeout(() => {
    loaded.value = true;
  }, 500);
});
</script>

<style lang="less" scoped>
.mainfooter {
  opacity: 0;
  transition: all 1s ease;

  &.loaded {
    opacity: 1;
  }

  .frame {
    .row();

    :deep(p) {
      // width: var(--pwidth);
      // max-width: var(--maxwidth);
      margin: 0 auto;
    }
  }

  margin-top: 2rem;
  font-size: 0.75rem;
  padding-top: 2rem;
  padding-bottom: 3rem;
  color: var(--fg2);
  background: var(--bg2);
  line-height: 1.4;
}
</style>
