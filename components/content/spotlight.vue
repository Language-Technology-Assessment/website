<template>
  <section
    class="relative z-10 transition-opacity delay-500 duration-1000 starting:opacity-0"
    id="spotlight"
  >
    <!-- <div class="label">Explore open source AI</div> -->
    <div class="mx-auto w-[70rem] max-w-full gap-12 *:w-full lg:flex">
      <div class="self-center">
        <div class="left-align">
          <slot></slot>
          <div class="mb-24 hidden py-8 text-center lg:block">
            <ActionButton link="/the-index">
              Explore all <Counter :value="models.length" /> models ->
            </ActionButton>
          </div>
        </div>
      </div>
      <div class="right">
        <slot name="right" />
      </div>
    </div>
    <div class="mb-24 block py-8 text-center lg:hidden">
      <ActionButton link="/the-index">
        Explore all <Counter :value="models.length" /> models ->
      </ActionButton>
    </div>
  </section>
</template>
<script lang="ts" setup>
const { models } = useModels();
</script>
<style lang="postcss">
@reference "../../assets/css/tailwind.css";
.left-align {
  @apply mx-auto mb-8 w-100 max-w-full sm:mb-24 lg:min-h-100;
  p {
    @apply mx-0 w-full max-w-full sm:text-xl sm:font-light;
  }
}
.right {
  .the-index {
    width: auto !important;
    max-width: 100% !important;
  }
}
</style>
