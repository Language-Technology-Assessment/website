<template>
  <section
    class="transition-opacity delay-500 duration-1000 starting:opacity-0"
    id="spotlight"
  >
    <div class="label">Explore open source AI</div>
    <div class="mx-auto w-[70rem] max-w-full gap-12 *:w-full lg:flex">
      <div class="self-center">
        <div class="left-align">
          <slot></slot>
          <div class="mb-24 py-8 text-center">
            <ActionButton link="/the-index">
              Explore all {{ models.length }} models ->
            </ActionButton>
          </div>
        </div>
      </div>
      <div class="right">
        <slot name="right" />
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const { models } = useModels();
</script>
<style>
@reference "@/assets/css/tailwind.css";
.left-align {
  /*@apply ml-0 w-100 max-w-full;*/
  @apply mx-auto w-100 max-w-full;
  p {
    @apply text-xl font-light;
  }
}
:deep(.the-index) {
  outline: 2px solid red !important;
}
</style>
