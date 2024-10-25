<template>
  <section class="news" id="news">
    <div class="content-frame">
      <div class="context">
        <label>News</label>
      </div>
      <div class="content" v-visiblecontainer>
        <ContentList :query="query" v-slot="{ list }">
          <NuxtLink :to="article._path" v-for="article in list" :key="article._path">
            <div class="date">{{ toDate(article.date) }}</div>
            <div class="title">{{ article.title }}</div>
            <!-- <div class="description">{{ article.description }}</div> -->
          </NuxtLink>
        </ContentList>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'

import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
const query: QueryBuilderParams = { path: '/news', limit: 10, sort: [{ date: -1 }] }
function toDate(time: string) {
  // return time
  const rep = time.split('-').reverse().join('-')
  return useDateFormat(rep, 'DD MMMM YYYY')
}
</script>

<style lang="less" scoped>
.news {}
</style>