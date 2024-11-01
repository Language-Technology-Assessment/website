<template>
  <section class="guides" id="guides">
    <div class="content-frame">
      <div class="context">
        <label>Guides</label>
      </div>
      <div class="content" v-visiblecontainer v-if="data && status === 'success'">
        <NuxtLink :to="data[k]._path" v-for="(v, k) in limit" :key="data[k]._path">
          <div class="title">{{ data[k].title }}</div>
          <div class="description">{{ data[k].description }}</div>
        </NuxtLink>
        <button class="showmore" @click="limit = limit + perpage" v-if="limit < data.length">Show more</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
const props = defineProps(['perpage'])
const limit = ref(props.perpage || 3)
const perpage = computed(() => {
  return props.perpage || 3
})

const { data, status } = await useAsyncData('guides', () => queryContent('/guides').where({
  _file: {
    $not: /\.(.*).md$/
  }
}).find())

</script>

<style lang="less" scoped>
.guides {}
</style>