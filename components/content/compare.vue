<template>
  <div class="mt-24">
    <!-- <div @click="rand = Math.random()">{{ rand }}</div> -->
    <div
      class="scroll-up:nottop:top-12 nottop:shadow-[0_0_0.5rem_var(--color-shadow)] sticky top-0 z-10 mb-0 bg-bg pt-0 transition-all duration-200 ease-in-out"
    >
      <div
        class="ml-[14rem] flex w-[calc(100%-14rem)] gap-8 overflow-visible bg-bg pt-4 pb-2"
      >
        <div class="bg-bg font-semibold" v-for="category in categories">
          <div
            class="relative mb-1 pb-2 text-center after:absolute after:top-full after:-left-[3px] after:box-content after:h-2 after:w-full after:border after:border-t after:border-r-[3px] after:border-b-0 after:border-l-[3px] after:border-bc after:content-['']"
          >
            {{ category.name }}
          </div>
          <div class="flex gap-0 text-[0.6rem]">
            <div
              class="w-16 text-center whitespace-nowrap"
              v-for="param in category.params"
            >
              {{ param.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div
        class="flex border-t border-bc p-0"
        v-for="item in models"
        :key="item.path"
      >
        <div class="w-[14rem] min-w-[14rem] pb-2">
          <NuxtLink
            :to="`/model/${item.filename}`"
            class="block max-w-[calc(100%-1rem)] pt-2 leading-[1.2] no-underline"
            v-if="item?.org?.name"
            >{{ item.org.name }}</NuxtLink
          >
          <NuxtLink
            :to="`/model/${item.filename}`"
            class="text-xs no-underline"
            v-if="item?.system?.name"
            >{{ item.system.name || "(undefined)" }}
          </NuxtLink>
        </div>
        <div class="flex-1">
          <div class="flex gap-8" v-for="category in categories">
            <!-- <div class="cat-name">{{ category }}</div> -->
            <div class="flex gap-0">
              <div
                class="relative w-16 flex-1 cursor-pointer overflow-visible py-2"
                v-for="param in category.params"
              >
                <div class="absolute text-[0.6rem] leading-4 opacity-0">
                  {{ param.name }}
                </div>
                <div
                  class="mx-auto h-8 w-8 text-g3 [&_svg]:block [&_svg]:!h-full [&_svg]:!w-full"
                  v-if="item[param.ref]?.class === 'open'"
                  v-html="openIcon"
                ></div>
                <div
                  class="mx-auto h-8 w-8 text-g1 [&_svg]:block [&_svg]:!h-full [&_svg]:!w-full"
                  v-if="item[param.ref]?.class === 'closed'"
                  v-html="closedIcon"
                ></div>
                <div
                  class="mx-auto h-8 w-8 text-g2 [&_svg]:block [&_svg]:!h-full [&_svg]:!w-full"
                  v-if="item[param.ref]?.class === 'partial'"
                  v-html="partialIcon"
                ></div>
                <!-- <div class="hover">
                  <div class="param-hover-name">{{ param.name }}</div>
                  <div class='notes' v-html="item[param.ref].notes">
                  </div>
                  <NuxtLink :to="item[param.ref].link">{{ item[param.ref].link }}</NuxtLink>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import openIcon from "@/assets/icons/open.svg?raw";
import closedIcon from "@/assets/icons/closed.svg?raw";
import partialIcon from "@/assets/icons/partial.svg?raw";

const { models, categories, sortModels } = useModels();
</script>
