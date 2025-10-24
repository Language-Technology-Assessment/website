<template>
  <div class="mx-auto py-16 text-center">
    <div class="!important mb-4 text-xs text-fg2" v-if="commitDate">
      Last updated {{ commitDate }}
    </div>
    <div class="mb-4 text-fg2">
      <slot>Is this information not up to date?</slot>
    </div>
    <ActionButton
      :link="`https://github.com/${info.owner}/${info.repo}/blob/preview/${route.params.model}.yaml`"
      target="_blank"
    >
      Contribute here ->
    </ActionButton>
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
