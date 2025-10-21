<template>
  <div class="block">
    <div class="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-12">
      <NuxtLink
        :to="`/model/${item.filename}`"
        class="flex-1 aspect-[3/4] p-4 transition-all duration-200 ease-in-out cursor-pointer bg-fg text-listfg flex flex-col rounded min-w-0 min-h-0 no-underline hover:scale-105"
        v-for="item in models"
        :style="bg(item.score)"
      >
        <div class="font-semibold text-2xl leading-tight mb-2">
          {{ item.system.name || "(undefined)" }}
        </div>
        <div class="text-base leading-normal font-normal" v-if="item?.org">
          by
          <span class="font-semibold">{{
            item.org.name || "(undefined)"
          }}</span>
        </div>
        <div class="flex-1"></div>
        <div class="text-3xl leading-none text-right">
          {{ item.score.toFixed(2) }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { models, bg } = useModels();
</script>
