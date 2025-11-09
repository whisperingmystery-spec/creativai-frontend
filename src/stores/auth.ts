import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const loading = ref<boolean>(false)
  const configured = isSupabaseConfigured

  const isSignedIn = computed(() => !!user.value)

  const refresh = async () => {
    if (!supabase) return
    const { data } = await supabase.auth.getUser()
    user.value = data.user || null
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    loading.value = true
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      await refresh()
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    loading.value = true
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      await refresh()
    } finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase not configured')
    loading.value = true
    try {
      const redirectTo =
        (import.meta as any).env?.VITE_CALLBACK_URL ||
        (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      })
      if (error) throw error
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    if (!supabase) return
    loading.value = true
    try {
      await supabase.auth.signOut()
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const init = () => {
    if (!supabase) return
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null
    })
    refresh()
  }

  onMounted(init)

  return { user, configured, isSignedIn, loading, refresh, signUp, signIn, signInWithGoogle, signOut }
})


