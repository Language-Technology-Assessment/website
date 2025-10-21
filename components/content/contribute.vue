<template>
  <div class="py-16 mx-auto text-center">
    <div class="text-xs mb-4 text-fg2 !important" v-if="commitDate">
      Last updated {{ commitDate }}
    </div>
    <div class="mb-8 text-fg2">
      <slot>Is this information not up to date?</slot>
    </div>
    <NuxtLink
      :to="`https://github.com/${info.owner}/${info.repo}/blob/preview/${route.params.model}.yaml`"
      target="_blank"
      class="bg-bg border border-bc px-6 py-2 no-underline rounded-md hover:text-link hover:bg-bg3"
    >
      <slot name="button">Contribute here -></slot>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
import info from "@/repos/data/.info.json";
const route = useRoute();
const { data: commitDate } = await useAsyncData(
  "fileLastCommit" + route.params.model,
  async () => {
    const modelref = route.params.model;
    // if (!modelref) return false;
    const owner = "Language-Technology-Assessment";
    const repo = "main-database";
    const path = modelref ? `&path=/${modelref}.yaml` : "";

    const data = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1${path}`,
    )
      .then((response) => response.json())
      .catch((err) => console.warn(err));
    if (!data[0]?.commit?.committer?.date) return false;
    const latestCommit = data[0];
    return useDateFormat(latestCommit.commit.committer.date, "DD MMMM YYYY");
  },
);
</script>
