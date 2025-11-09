<template>
  <div class="flex flex-col gap-20">
    <section class="space-y-8 text-center">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-brand/20 to-brand-accent/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        About CAIA Labs
      </span>
      <h1 class="text-4xl font-semibold text-slate-100 md:text-5xl">We build premium tools — for creatives and businesses</h1>
      <p class="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
        CAIA (creativaiagency.com) is the hub for designers, founders, and growth teams. We combine a design‑first mindset
        with AI‑assisted, client‑side workflows to eliminate bottlenecks between concept and delivery — now spanning Images,
        Documents, Measurement & Units, Finance, and Business tools.
      </p>
    </section>

    <section class="grid gap-6 rounded-[32px] border border-white/10 bg-white/5 p-8 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 text-center">
        <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Live tools</p>
        <p class="mt-2 text-3xl font-semibold text-slate-100">20+</p>
        <p class="text-sm text-slate-500">Across 5 categories</p>
      </div>
      <div class="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 text-center">
        <p class="text-sm uppercase tracking-[0.3em] text-slate-400">100% safe</p>
        <p class="mt-2 text-3xl font-semibold text-slate-100">On‑device</p>
        <p class="text-sm text-slate-500">Your files never upload to our servers</p>
      </div>
      <div class="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 text-center">
        <p class="text-sm uppercase tracking-[0.3em] text-slate-400">No sign‑up</p>
        <p class="mt-2 text-3xl font-semibold text-slate-100">Free to use</p>
        <p class="text-sm text-slate-500">Sign in only if you want to save progress</p>
      </div>
      <div class="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 text-center">
        <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Business suite</p>
        <p class="mt-2 text-3xl font-semibold text-slate-100">New</p>
        <p class="text-sm text-slate-500">Invoices, taxes, tracking</p>
      </div>
    </section>

    <!-- Visual collage + feature callouts -->
    <section class="grid gap-10 rounded-[32px] border border-white/10 bg-white/5 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div class="relative">
        <div class="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-white/5 to-white/0 ring-1 ring-white/10"></div>
        <div class="grid grid-cols-3 gap-3 p-4">
          <div class="h-24 rounded-xl bg-white/5 ring-1 ring-white/10 sm:h-28"></div>
          <div class="h-24 rounded-xl bg-white/5 ring-1 ring-white/10 sm:h-28"></div>
          <div class="h-24 rounded-xl bg-white/5 ring-1 ring-white/10 sm:h-28"></div>
          <div class="h-24 rounded-xl bg-white/5 ring-1 ring-white/10 sm:h-28"></div>
          <div class="h-24 rounded-xl bg-gradient-to-br from-brand/20 to-brand-accent/20 ring-1 ring-white/10 sm:h-28"></div>
          <div class="h-24 rounded-xl bg-white/5 ring-1 ring-white/10 sm:h-28"></div>
          <div class="h-24 rounded-xl bg-white/5 ring-1 ring-white/10 sm:h-28"></div>
          <div class="h-24 rounded-xl bg-white/5 ring-1 ring-white/10 sm:h-28"></div>
          <div class="h-24 rounded-xl bg-white/5 ring-1 ring-white/10 sm:h-28"></div>
        </div>
      </div>
      <div class="space-y-6">
        <h2 class="text-2xl font-semibold text-slate-100">Why CAIA is safe by design</h2>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <span class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">✓</span>
            <div>
              <p class="text-sm font-medium text-slate-100">100% on‑device processing</p>
              <p class="text-sm text-slate-400">We use browser APIs (Canvas, Web Workers, WASM) — your files never leave your computer.</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">✓</span>
            <div>
              <p class="text-sm font-medium text-slate-100">No sign‑up required</p>
              <p class="text-sm text-slate-400">Use every tool instantly. No account, no email — just get it done.</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">✓</span>
            <div>
              <p class="text-sm font-medium text-slate-100">Sign in to save progress (optional)</p>
              <p class="text-sm text-slate-400">If you sign in, we keep your preferences and drafts accessible on this device. You’re always in control.</p>
            </div>
          </li>
        </ul>
        <div>
          <a href="/tools" class="inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition hover:opacity-90">
            Browse the Tools Hub
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>

    <section class="grid gap-10 rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-10 md:grid-cols-2">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-100">Our mission</h2>
        <p class="text-sm text-slate-400">
          Help creative teams reclaim their time by automating repetitive production tasks, without sacrificing brand fidelity or security.
          Every CAIA tool runs client-side where possible, integrates seamlessly with Supabase auth, and ships with GSAP-polished interactions.
        </p>
      </div>
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-100">What’s next</h2>
        <p class="text-sm text-slate-400">
          We’re expanding our Business category (Receipt/Invoice Generator, Expense Tracker, Timesheets, US Sales Tax, GST, P&L),
          adding exports (CSV/PDF), and introducing team dashboards with presets and audit logs. If you want early access,
          join the waitlist and tell us what your team needs most.
        </p>
        <div class="pt-2">
          <a
            href="/tools"
            class="inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition hover:opacity-90"
          >
            Explore the Tools Hub
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>

    <section class="rounded-[32px] border border-white/10 bg-gradient-to-br from-brand/15 to-brand-accent/10 p-10 text-center">
      <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Let’s build your next workflow</h2>
      <p class="mx-auto mt-4 max-w-2xl text-base text-slate-400 md:text-lg">
        Share your use case and we’ll reach out with a tailored onboarding plan.
      </p>
      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href="/contact"
          class="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          Contact the team
        </a>
        <a
          href="mailto:hello@creativaiagency.com"
          class="inline-flex items-center justify-center rounded-full border border-slate-700/70 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          hello@creativaiagency.com
        </a>
      </div>
    </section>
  </div>
</template>

