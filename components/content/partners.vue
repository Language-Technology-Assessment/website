<template>
  <section class="partners" id="partners">
    <div class="label">Partners</div>
    <div class="logo-blocks" v-if="list?.items">
      <NuxtLink
        :to="item.url"
        v-for="item in list.items"
        :title="item.title"
        target="_blank"
        class="logo-block flex"
        v-visible
      >
        <div class="image">
          <NuxtImg :src="item.image" sizes="300px" :alt="item.title"></NuxtImg>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
import list from "@/repos/website/partners.yml";
</script>
