<template>
  <div
    class="mt-8 bg-bg2 pt-8 pb-12 text-xs leading-[1.4] text-fg2 opacity-0 transition-all duration-1000"
    :class="{ 'opacity-100': loaded }"
  >
    <div
      class="mx-auto max-w-[30rem] text-center"
      style="width: var(--maxwidth)"
    >
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
