<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    title: string
    subtitle: string
    children: Snippet
  }

  let { title, subtitle, children }: Props = $props()
</script>

<div class="flex min-h-screen items-center justify-center bg-canvas px-4">
  <div
    class="flex w-[440px] max-w-full flex-col items-center gap-7 rounded-2xl border border-line bg-white p-10 shadow-card"
  >
    <div class="flex flex-col items-center gap-2.5">
      <div
        class="flex size-14 items-center justify-center rounded-[14px] border border-brand/25 bg-brand-soft text-[26px]"
      >
        📅
      </div>
      <h1 class="text-[26px] font-semibold">{title}</h1>
      <p class="text-[13px] text-muted">{subtitle}</p>
    </div>
    {@render children()}
    <p class="text-[11px] text-subtle">تمرکز بیشتر · برنامه‌ریزی بهتر</p>
  </div>
</div>
