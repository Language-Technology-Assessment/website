<template>
  <div
    class="mt-8 bg-bg3 pt-8 pb-12 text-xs leading-[1.4] text-fg2/50 opacity-0 transition-all duration-1000"
    :class="{ 'opacity-100': loaded }"
  >
    <div class="row">
      <div class="mx-auto ml-leftplus w-prose max-w-container-max text-left">
        <ContentRenderer
          :value="page"
          v-if="page && status === 'success'"
          unwrap="p"
        />
      </div>
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
