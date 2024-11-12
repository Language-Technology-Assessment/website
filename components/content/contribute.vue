<template>
  <div class="contribute">
    <div>
      <slot>Is this information not up to date?</slot>
    </div>
    <NuxtLink :to="`https://github.com/${info.owner}/${info.repo}`" target="_blank">
      <slot name="button">Contribute here -></slot>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import info from '@/repos/data/.info.json'

</script>

<style lang="less" scoped>
.contribute {
  padding: 4rem 0;
  margin: 0 auto;
  text-align: center;

  >div {
    margin-bottom: 2rem;
    color: var(--fg2);
  }

  a {
    background: var(--bg2);
    padding: 0.5rem 1.5rem;
    text-decoration: none;

    &:hover {
      color: var(--link);
      background: var(--bg3);
    }
  }
}
</style>