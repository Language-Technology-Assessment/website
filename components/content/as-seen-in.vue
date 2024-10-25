<template>
  <section class="as-seen-in" id="as-seen-in">
    <div class="content-frame with-images">
      <div class="context">
        <label>As seen in</label>
      </div>
      <div class="images" v-visiblecontainer>
        <NuxtLink :to="item.url" v-for="item in list.items" target="_blank" class="flex">
          <div class="image">
            <NuxtImg
              :src="`https://raw.githubusercontent.com/Language-Technology-Assessment/European-open-AI-index/main/${item.image}`"
              sizes="300px"></NuxtImg>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import list from "@/repos/website/as-seen-in.yml"
</script>

<style lang="less" scoped>
.as-seen-in {}
</style>