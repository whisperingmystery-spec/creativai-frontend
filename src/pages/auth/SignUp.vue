<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const auth = useAuthStore()
const router = useRouter()

const submit = async () => {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }
  try {
    await auth.signUp(email.value, password.value)
    router.push({ name: 'dashboard' })
  } catch (e: any) {
    error.value = e?.message || 'Failed to sign up.'
  }
}

const signInWithGoogle = async () => {
  error.value = ''
  try {
    await auth.signInWithGoogle()
  } catch (e: any) {
    error.value = e?.message || 'Google sign in failed.'
  }
}
</script>

<template>
  <div class="mx-auto max-w-md space-y-8">
    <header class="space-y-3 text-center">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-brand/20 to-brand-accent/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Account
      </span>
      <h1 class="text-3xl font-semibold text-slate-100">Create account</h1>
      <p class="text-sm text-slate-400">Sign up with your email.</p>
    </header>

    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Email</label>
        <input v-model="email" type="email" required class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Password</label>
        <input v-model="password" type="password" minlength="6" required class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Confirm</label>
        <input v-model="confirm" type="password" minlength="6" required class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <p v-if="error" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-200">{{ error }}</p>
      <button type="submit" class="w-full rounded-full bg-gradient-to-br from-brand to-brand-accent px-5 py-2 text-sm font-medium text-white shadow-glow">Sign up</button>
      <div class="relative my-2">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="w-full border-t border-white/10"></div>
        </div>
        <div class="relative flex justify-center">
          <span class="bg-transparent px-2 text-xs text-slate-400">or</span>
        </div>
      </div>
      <button type="button" @click="signInWithGoogle" class="w-full rounded-full border border-white/10 bg-slate-900/60 px-5 py-2 text-sm font-medium text-slate-100 hover:border-brand-accent hover:text-brand-accent">
        Continue with Google
      </button>
      <div class="text-center text-xs text-slate-400">
        Already have an account?
        <RouterLink :to="{ name: 'sign-in' }" class="text-brand-accent">Sign in</RouterLink>
      </div>
    </form>
  </div>
</template>


