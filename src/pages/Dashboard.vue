<template>
  <div class="flex flex-col gap-16">
    <section class="space-y-6 text-center">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Coming soon
      </span>
      <h1 class="text-4xl font-semibold text-slate-100 md:text-5xl">CAIA Dashboard</h1>
      <p class="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
        Account management, preset libraries, analytics, and team collaboration tools will live here. Supabase auth integration is underway.
      </p>
    </section>

    <section class="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-slate-400">
      <p class="text-sm uppercase tracking-[0.35em] text-slate-500">Roadmap</p>
      <div class="mt-6 grid gap-6 md:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h3 class="text-base font-semibold text-slate-100">Phase 1</h3>
          <p class="mt-3 text-sm">
            Supabase authentication, passwordless sign-in, and base profile management.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h3 class="text-base font-semibold text-slate-100">Phase 2</h3>
          <p class="mt-3 text-sm">
            Tool usage history, preset saving, and quick relaunch links for your favorite workflows.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h3 class="text-base font-semibold text-slate-100">Phase 3</h3>
          <p class="mt-3 text-sm">
            Team management, shared libraries, and Stripe-powered subscription controls.
          </p>
        </div>
      </div>
      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href="/auth/sign-up"
          class="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          Join dashboard waitlist
        </a>
        <a
          href="mailto:beta@creativaiagency.com"
          class="inline-flex items-center justify-center rounded-full border border-slate-700/70 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          beta@creativaiagency.com
        </a>
      </div>
    </section>
  </div>
</template>

