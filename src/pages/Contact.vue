<script setup lang="ts">
import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const status = ref<'idle' | 'success' | 'error' | 'disabled'>('idle')
const feedback = ref('')

const submit = async () => {
  feedback.value = ''
  if (!isSupabaseConfigured) {
    status.value = 'disabled'
    feedback.value = 'Supabase is not configured. Your message was stored locally.'
    const stored = JSON.parse(localStorage.getItem('caia_contact_messages') || '[]')
    stored.push({ name: name.value, email: email.value, subject: subject.value, message: message.value, ts: Date.now() })
    localStorage.setItem('caia_contact_messages', JSON.stringify(stored))
    name.value = email.value = subject.value = message.value = ''
    return
  }
  try {
    const { error } = await supabase.from('contact_messages').insert({
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value
    })
    if (error) throw error
    status.value = 'success'
    feedback.value = 'Thanks! We will get back to you soon.'
    name.value = email.value = subject.value = message.value = ''
  } catch (e: any) {
    status.value = 'error'
    feedback.value = e?.message || 'Failed to send message.'
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-8">
    <header class="space-y-3 text-center">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-brand/20 to-brand-accent/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Contact
      </span>
      <h1 class="text-3xl font-semibold text-slate-100">Get in touch</h1>
      <p class="text-sm text-slate-400">Send a message and we’ll respond promptly.</p>
    </header>

    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="grid gap-2">
          <label class="text-sm text-slate-300">Name</label>
          <input v-model="name" type="text" required class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-2">
          <label class="text-sm text-slate-300">Email</label>
          <input v-model="email" type="email" required class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Subject</label>
        <input v-model="subject" type="text" required class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Message</label>
        <textarea v-model="message" rows="6" required class="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-100" />
      </div>
      <div class="flex gap-3">
        <button type="submit" class="rounded-full bg-gradient-to-br from-brand to-brand-accent px-5 py-2 text-sm font-medium text-white shadow-glow">Send</button>
        <a href="mailto:team@creativaiagency.com" class="rounded-full border border-slate-700/70 px-5 py-2 text-sm text-slate-200">Email us directly</a>
      </div>
      <p v-if="feedback" :class="status==='success' ? 'text-emerald-300' : status==='error' ? 'text-red-300' : 'text-slate-300'">{{ feedback }}</p>
    </form>
  </div>
</template>


