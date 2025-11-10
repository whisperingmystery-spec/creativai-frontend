<script setup>
import { reactive, computed } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import Navbar from '@/components/common/Navbar.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const navigationLinks = reactive([
  { label: 'Home', to: '/' },
  { label: 'Tools Hub', to: '/tools' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Dashboard', to: '/dashboard', requiresAuth: true }
])

const auth = useAuthStore()
const user = computed(() => (auth.user ? { name: auth.user.email, initials: auth.user.email?.[0]?.toUpperCase() } : null))
const router = useRouter()

const footerColumns = reactive([
  {
    title: 'Company',
    links: [
      { label: 'About', to: { name: 'about' } },
      { label: 'Contact', to: { name: 'contact' } },
      { label: 'Newsletter', to: { name: 'newsletter' } }
    ]
  },
  {
    title: 'Products',
    links: [
      { label: 'Image Optimization Suite', to: { name: 'image-optimization-suite' } },
      { label: 'QR Code Generator', to: { name: 'qr-code-generator' } },
      { label: 'Password Generator', to: { name: 'password-generator' } },
      { label: 'Text Case Converter', to: { name: 'text-case-converter' } },
      { label: 'Word Counter', to: { name: 'word-counter' } }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', to: { name: 'blog' } },
      { label: 'Tools Hub', to: { name: 'tools' } },
      { label: 'Support', to: '/support' }
    ]
  }
])

const legalLinks = reactive([
  { label: 'Privacy Policy', to: { name: 'privacy' } },
  { label: 'Terms of Service', to: { name: 'terms' } },
  { label: 'Cookie Policy', to: { name: 'cookies' } }
])

const handleSignIn = () => router.push({ name: 'sign-in' })

const handleSignOut = async () => { await auth.signOut() }
</script>

<template>
  <MainLayout
    background-class="bg-gradient-to-b from-brand-surface via-slate-900 to-slate-950"
    content-class="space-y-24"
    main-padding-class="py-20 sm:py-24 lg:py-28"
  >
    <template #header>
      <Navbar
        logo-src="/CAIA_logo.png"
        :links="navigationLinks"
        :user="user"
        @sign-in="handleSignIn"
        @sign-out="handleSignOut"
      />
    </template>

    <RouterView />

    <template #footer>
      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-8 md:flex-row md:justify-between">
          <div class="max-w-sm space-y-4">
            <div class="flex items-center gap-3">
              <img src="/CAIA_logo.png" alt="CAIA logo" class="h-10 w-10 rounded-2xl border border-slate-800/60 bg-white/5 p-1" />
              <div>
                <p class="text-lg font-semibold text-slate-100">CAIA</p>
                <p class="text-sm text-slate-500">creativaiagency.com</p>
              </div>
            </div>
            <p class="text-sm text-slate-400">
              Premium AI-powered tools for modern teams. Compress, create, and calculate at lightning speed with zero compromise.
            </p>
            <div class="flex flex-col gap-1 text-sm text-slate-400">
              <p>Email: <a href="mailto:team@creativaiagency.com" class="text-slate-200 hover:text-brand-accent">team@creativaiagency.com</a></p>
              <p>Support: <a href="mailto:support@creativaiagency.com" class="text-slate-200 hover:text-brand-accent">support@creativaiagency.com</a></p>
              <p>Location: San Francisco · Remote First</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div v-for="column in footerColumns" :key="column.title" class="space-y-4">
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                {{ column.title }}
              </p>
              <ul class="space-y-3 text-sm text-slate-400">
                <li v-for="link in column.links" :key="link.label">
                  <RouterLink
                    :to="link.to ?? link.href"
                    class="transition hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    {{ link.label }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 border-t border-slate-800/60 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {{ new Date().getFullYear() }} CAIA · All rights reserved.</p>
          <div class="flex flex-wrap items-center gap-4">
            <RouterLink
              v-for="link in legalLinks"
              :key="link.label"
              :to="link.to ?? link.href"
              class="transition hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              {{ link.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>
