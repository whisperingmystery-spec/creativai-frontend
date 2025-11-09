<script setup>
import { computed } from 'vue'

const props = defineProps({
  maxWidthClass: {
    type: String,
    default: 'max-w-7xl'
  },
  padded: {
    type: Boolean,
    default: true
  },
  backgroundClass: {
    type: String,
    default: 'bg-gradient-to-b from-brand-surface via-slate-900 to-slate-950'
  },
  contentClass: {
    type: String,
    default: ''
  },
  mainPaddingClass: {
    type: String,
    default: 'py-12 sm:py-16 lg:py-24'
  }
})

const containerClass = computed(() =>
  ['mx-auto w-full', props.maxWidthClass, props.padded ? 'px-4 sm:px-6 lg:px-8' : '']
    .filter(Boolean)
    .join(' ')
)

const mainClass = computed(() =>
  ['flex-1', props.mainPaddingClass, containerClass.value, props.contentClass].filter(Boolean).join(' ')
)
</script>

<template>
  <div
    :class="['min-h-screen flex flex-col text-slate-100 antialiased', backgroundClass]"
  >
    <slot name="top" />

    <header v-if="$slots.header" class="w-full">
      <slot name="header" />
    </header>

    <main :class="mainClass">
      <slot />
    </main>

    <footer v-if="$slots.footer" class="border-t border-slate-800/70">
      <div :class="[containerClass, 'py-10 text-sm text-slate-400']">
        <slot name="footer" />
      </div>
    </footer>
  </div>
</template>

