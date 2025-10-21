<template>
  <section class="mb-12" id="as-seen-in">
    <div class="split-layout">
      <div class="left-side">
        <div class="mb-4 block px-0 text-xs font-semibold uppercase">
          As seen in
        </div>
      </div>
      <div class="logo-blocks">
        <NuxtLink
          :to="item.url"
          v-for="item in list.items"
          :title="item.title"
          target="_blank"
          class="logo-block flex"
        >
          <div class="image">
            <NuxtImg
              :src="item.image"
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
import list from "@/repos/website/as-seen-in.yml";
</script>
