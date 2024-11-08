<template>
  <NuxtLink :href="props.href" :target="customTarget">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const customTarget = computed(() => {
  if (props.target) return props.target
  if (props.href.startsWith('http') && !props.href.match(/^(?:https?:\/\/)?(?:[^.]+\.)?osai-index\.eu(\/.*)?$/)) return '_blank'
})

const props = defineProps({
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: undefined,
    required: false
  }
})
</script>