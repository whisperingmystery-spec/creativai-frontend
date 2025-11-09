<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

onMounted(async () => {
  try {
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(window.location.href)
      await auth.refresh()
    }
  } catch (e) {
    // swallow and proceed to redirect
  } finally {
    const next = (route.query.next as string) || '/dashboard'
    router.replace(next)
  }
})
</script>

<template>
  <div class="mx-auto max-w-md space-y-4 text-center">
    <h1 class="text-2xl font-semibold text-slate-100">Signing you in…</h1>
    <p class="text-sm text-slate-400">Please wait while we complete the login.</p>
  </div>
  </template>
*** End Patch  */

