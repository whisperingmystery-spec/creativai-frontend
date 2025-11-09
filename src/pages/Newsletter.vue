<script setup lang="ts">
import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const email = ref('')
const consent = ref(true)
const status = ref<'idle' | 'success' | 'error' | 'disabled'>('idle')
const message = ref('')

const submit = async () => {
  message.value = ''
  if (!isSupabaseConfigured) {
    status.value = 'disabled'
    message.value = 'Supabase is not configured. Subscription saved locally.'
    localStorage.setItem('caia_newsletter_email', email.value)
    return
  }
  try {
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.value, consent: consent.value })
    if (error) throw error
    status.value = 'success'
    message.value = 'Thanks for subscribing!'
    email.value = ''
  } catch (e: any) {
    status.value = 'error'
    message.value = e?.message || 'Subscription failed. Try again.'
  }
}
</script>

<template>
  <div class="mx-auto max-w-lg space-y-8">
    <header class="space-y-3 text-center">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-brand/20 to-brand-accent/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Newsletter
      </span>
      <h1 class="text-3xl font-semibold text-slate-100">Subscribe to updates</h1>
      <p class="text-sm text-slate-400">Get product updates and launch notes.</p>
    </header>

    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Email</label>
        <input v-model="email" type="email" required class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <label class="inline-flex items-center gap-2 text-xs text-slate-400">
        <input type="checkbox" v-model="consent" /> I agree to receive emails from CAIA.
      </label>
      <div class="flex gap-3">
        <button type="submit" class="rounded-full bg-gradient-to-br from-brand to-brand-accent px-5 py-2 text-sm font-medium text-white shadow-glow">
          Subscribe
        </button>
      </div>
      <p v-if="message" :class="status==='success' ? 'text-emerald-300' : status==='error' ? 'text-red-300' : 'text-slate-300'">{{ message }}</p>
    </form>
  </div>
</template>


