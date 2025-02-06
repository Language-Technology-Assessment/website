<template>
  <section class="partners" id="partners">
    <div class="content-frame with-images">
      <div class="context">
        <label>Partners</label>
      </div>
      <div class="images" v-visiblecontainer v-if="list?.items">
        <NuxtLink
          :to="item.url"
          v-for="item in list.items"
          :title="item.title"
          target="_blank"
          class="flex"
        >
          <div class="image">
            <NuxtImg
              :src="`https://raw.githubusercontent.com/Language-Technology-Assessment/European-open-AI-index/main/${item.image}`"
              sizes="300px"
              :alt="item.title"
            ></NuxtImg>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import list from "@/repos/website/partners.yml";
</script>

<style lang="less" scoped>
.as-seen-in {
}
</style>
