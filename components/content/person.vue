<template>
  <div class="person">
    <div class="head">
      <div class="image">
        <NuxtImg :src="src" :alt="props.name"></NuxtImg>
      </div>
      <div class="name">
        {{ props.name }}
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["image", "name"]);
const src = computed(() => {
  return `https://raw.githubusercontent.com/Language-Technology-Assessment/European-open-AI-index/main${props.image}`;
});
</script>

<style lang="less" scoped>
.person {
  background: var(--bg2);
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  width: var(--pwidth);
  max-width: var(--maxwidth);
  margin: 2rem auto 2rem;
  .head {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1.5rem;
    .image {
      width: 4rem;
      height: 4rem;
      flex-shrink: 0;
      img {
        border-radius: 100%;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--fg);
    }
  }
  .content {
    :deep(p) {
      width: 100%;
      max-width: 100%;
      margin: 0 auto 1rem;
      font-weight: 400;
      font-size: 0.8rem;
      line-height: 1.6;
    }
  }
}
</style>
