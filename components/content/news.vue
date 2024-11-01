<template>
  <section class="news" id="news">
    <div class="content-frame">
      <div class="context">
        <label>News</label>
      </div>
      <div class="content" v-visiblecontainer v-if="data && status === 'success'">
        <NuxtLink :to="data[k]._path" v-for="(v, k) in limit" :key="data[k]._path">
          <div class="date">{{ toDate(data[k].date) }}</div>
          <div class="title">{{ data[k].title }}</div>
        </NuxtLink>
        <button class="showmore" @click="limit = limit + perpage" v-if="limit < data.length">Show more</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'

const props = defineProps(['perpage'])
const limit = ref(props.perpage || 3)
const perpage = computed(() => {
  return props.perpage || 3
})

const { data, status } = await useAsyncData('news', () => queryContent('/news').find())

function toDate(time: string) {
  // return time
  const rep = time.split('-').reverse().join('-')
  return useDateFormat(rep, 'DD MMMM YYYY')
}
</script>

<style lang="less" scoped>
.news {}
</style>