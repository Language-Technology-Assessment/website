<template>
  <section class="guides" id="guides">
    <div class="content-frame">
      <div class="context">
        <label>Guides</label>
      </div>
      <div class="content" v-visiblecontainer>
        <ContentList :query="query" v-slot="{ list }">
          <NuxtLink :to="article._path" v-for="article in list" :key="article._path">
            <div class="title">{{ article.title }}</div>
            <div class="description">{{ article.description }}</div>
          </NuxtLink>
        </ContentList>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
const query: QueryBuilderParams = {
  path: '/guides/', limit: 99, where: [{
    _file: {
      $not: /\.(.*).md$/
    }
  }]
}
</script>

<style lang="less" scoped>
.guides {}
</style>