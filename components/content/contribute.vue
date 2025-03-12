<template>
  <div class="contribute">
    <div class="last-updated" v-if="commitDate">
      Last updated {{ commitDate }}
    </div>
    <div>
      <slot>Is this information not up to date?</slot>
    </div>
    <NuxtLink
      :to="`https://github.com/${info.owner}/${info.repo}/blob/preview/${route.params.model}.yaml`"
      target="_blank"
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
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1${path}`
    )
      .then((response) => response.json())
      .catch((err) => console.warn(err));
    if (!data[0]?.commit?.committer?.date) return false;
    const latestCommit = data[0];
    return useDateFormat(latestCommit.commit.committer.date, "DD MMM YYYY");
  }
);
</script>

<style lang="less" scoped>
.contribute {
  padding: 4rem 0;
  margin: 0 auto;
  text-align: center;

  > div {
    margin-bottom: 2rem;
    color: var(--fg2);
  }

  a {
    background: var(--bg2);
    padding: 0.5rem 1.5rem;
    text-decoration: none;
    border-radius: 0.25rem;

    &:hover {
      color: var(--link);
      background: var(--bg3);
    }
  }
}

.last-updated {
  font-size: 0.7rem;
  margin-bottom: 1rem !important;
}
</style>
