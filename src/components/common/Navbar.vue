<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  links: {
    type: Array,
    default: () => [
      { label: 'Home', to: '/' },
      { label: 'Tools Hub', to: '/tools' },
      { label: 'Blog', to: '/blog' },
      { label: 'About', to: '/about' },
      { label: 'Dashboard', to: '/dashboard', requiresAuth: true }
    ]
  },
  logoSrc: {
    type: String,
    default: '/CAIA_logo.png'
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['navigate', 'sign-in', 'sign-out'])

const isMenuOpen = ref(false)
const authenticatedLinks = computed(() => {
  return props.links.filter((item) => !item.requiresAuth || !!props.user)
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLinkClick = (link) => {
  emit('navigate', link)
  closeMenu()
}

const handleAuth = () => {
  if (props.user) {
    emit('sign-out')
  } else {
    emit('sign-in')
  }
  closeMenu()
}

const route = useRoute()
const isActive = (link) => {
  if (!link) return false
  if (typeof link.to === 'string') {
    if (link.to === '/') {
      return route.path === '/'
    }
    return route.path.startsWith(link.to)
  }
  if (link.to?.name) {
    return route.name === link.to.name
  }
  return false
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur-lg">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
      role="navigation"
      aria-label="Main navigation"
    >
      <RouterLink
        to="/"
        class="flex items-center gap-3 text-lg font-semibold tracking-tight text-slate-100 transition hover:text-brand-accent"
        @click.native="handleLinkClick({ label: 'Home', to: '/' })"
      >
        <img
          :src="logoSrc"
          alt="CAIA logo"
          class="h-9 w-9 rounded-2xl border border-slate-800/60 bg-white/5 object-cover p-1"
        />
        <span class="sr-only sm:not-sr-only">CAIA</span>
      </RouterLink>

      <div class="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
        <RouterLink
          v-for="link in authenticatedLinks"
          :key="link.label"
          :to="link.to"
          class="rounded-full px-3 py-2 transition hover:bg-slate-800/80 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          :class="isActive(link) ? 'bg-slate-800/80 text-slate-100' : ''"
          @click.native="handleLinkClick(link)"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <div class="hidden items-center gap-4 lg:flex">
        <div v-if="user" class="flex items-center gap-3 rounded-full bg-slate-800/70 px-3 py-2">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-sm font-semibold text-brand">
            {{ user.initials ?? 'U' }}
          </span>
          <div class="text-left text-xs text-slate-300">
            <p class="font-semibold text-slate-100">{{ user.name ?? 'Member' }}</p>
            <p class="text-slate-400">Account</p>
          </div>
        </div>
        <button
          type="button"
          class="rounded-full border border-slate-700/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          @click="handleAuth"
        >
          {{ user ? 'Sign out' : 'Sign in' }}
        </button>
      </div>

      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/80 text-slate-100 transition hover:border-brand-accent lg:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        @click="toggleMenu"
      >
        <span class="sr-only">Toggle navigation menu</span>
        <svg
          v-if="!isMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMenuOpen" id="mobile-menu" class="border-t border-slate-800/70 bg-slate-900/95 lg:hidden">
        <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-6 pt-4 sm:px-6">
          <RouterLink
            v-for="link in authenticatedLinks"
            :key="link.label"
            :to="link.to"
            class="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            @click.native="handleLinkClick(link)"
            :class="isActive(link) ? 'bg-slate-800/70 text-slate-100' : ''"
          >
            {{ link.label }}
          </RouterLink>
          <button
            type="button"
            class="mt-2 rounded-xl border border-slate-800/70 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            @click="handleAuth"
          >
            {{ user ? 'Sign out' : 'Sign in' }}
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

