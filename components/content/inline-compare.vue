<template>
  <div class="inline-compare">

  </div>
</template>

<script lang="ts" setup>
import { createStorage } from "unstorage";
import githubDriver from "unstorage/drivers/github";
const props = defineProps(['branch'])

const storage = createStorage({
  driver: githubDriver({
    repo: "opening-up-chatgpt/opening-up-chatgpt.github.io",
    branch: props.branch || 'main',
    dir: "/projects",
  }),
});

onMounted(async () => {
  const keys = await storage.getKeys('')
  console.log('keys', keys)
})

</script>

<style lang="less" scoped></style>