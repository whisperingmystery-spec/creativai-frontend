<script setup lang="ts">
import { computed, ref } from 'vue'

const birth = ref<string>('')
const target = ref<string>(new Date().toISOString().slice(0, 10))

const parseDate = (s: string) => (s ? new Date(s + 'T00:00:00') : null)

const results = computed(() => {
  const b = parseDate(birth.value)
  const t = parseDate(target.value)
  if (!b || !t || isNaN(b.getTime()) || isNaN(t.getTime()) || t < b) return null

  // Years, months, days
  let years = t.getFullYear() - b.getFullYear()
  let months = t.getMonth() - b.getMonth()
  let days = t.getDate() - b.getDate()
  if (days < 0) {
    months -= 1
    const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0).getDate()
    days += prevMonth
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const diffMs = t.getTime() - b.getTime()
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))

  // Next birthday
  const nextBirthdayYear = t.getMonth() > b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() >= b.getDate())
    ? t.getFullYear() + 1
    : t.getFullYear()
  const nextBirthday = new Date(nextBirthdayYear, b.getMonth(), b.getDate())
  const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - t.getTime()) / (1000 * 60 * 60 * 24))

  return { years, months, days, totalDays, totalWeeks, totalHours, daysUntilNextBirthday }
})
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Birth date</label>
          <input type="date" v-model="birth" class="w-60 rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Target date</label>
          <input type="date" v-model="target" class="w-60 rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="mb-3 text-xs uppercase tracking-[0.28em] text-slate-400">Results</div>
          <div v-if="results" class="space-y-2 text-sm text-slate-300">
            <div class="flex items-center justify-between"><span>Age (years)</span><span class="text-slate-100">{{ results.years }}</span></div>
            <div class="flex items-center justify-between"><span>Years, months, days</span><span class="text-slate-100">{{ results.years }}y {{ results.months }}m {{ results.days }}d</span></div>
            <div class="flex items-center justify-between"><span>Days until next birthday</span><span class="text-slate-100">{{ results.daysUntilNextBirthday }}</span></div>
            <div class="flex items-center justify-between"><span>Total days alive</span><span class="text-slate-100">{{ results.totalDays }}</span></div>
            <div class="flex items-center justify-between"><span>Total weeks alive</span><span class="text-slate-100">{{ results.totalWeeks }}</span></div>
            <div class="flex items-center justify-between"><span>Total hours alive</span><span class="text-slate-100">{{ results.totalHours }}</span></div>
          </div>
          <div v-else class="text-sm text-slate-400">Enter dates to see results.</div>
        </div>
      </div>
    </div>
  </div>
</template>


