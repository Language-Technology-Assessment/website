<template>
  <div class="mainfooter">
    <div class="frame">
      <ContentRendererMarkdown :value="data" v-if="data && status !== 'pending'">
        <template #empty></template>
      </ContentRendererMarkdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import markdownParser from "@nuxt/content/transformers/markdown";
import footer from '@/repos/website/footer.md?raw'
const { data, error, status } = await useAsyncData(() => markdownParser.parse('footer.md', footer))

</script>

<style lang="less" scoped>
.mainfooter {
  .frame {
    .row();

    :deep(p) {
      // width: var(--pwidth);
      // max-width: var(--maxwidth);
      margin: 0 auto;
    }
  }

  margin-top: 2rem;
  font-size: 0.75rem;
  padding-top: 2rem;
  padding-bottom: 3rem;
  color: var(--fg2);
  background: var(--bg2);
  line-height: 1.4;
}
</style>