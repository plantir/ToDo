<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  interface Props {
    onPrev: () => void
    onNext: () => void
    onToday: () => void
  }

  let { onPrev, onNext, onToday }: Props = $props()

  const tabs = [
    { href: '/daily', label: 'روزانه' },
    { href: '/weekly', label: 'هفتگی' },
    { href: '/monthly', label: 'ماهانه' },
    { href: '/tasks', label: 'همه تسک‌ها' },
  ] as const
</script>

<header class="flex items-center justify-between border-b border-line bg-white px-7 py-4" dir="ltr">
  <div class="flex items-center gap-2">
    <button
      type="button"
      class="rounded-lg border border-line bg-white px-3 py-2 text-[13px]"
      onclick={onPrev}>‹</button
    >
    <button
      type="button"
      class="rounded-lg border border-line bg-white px-3 py-2 text-[13px]"
      onclick={onToday}>امروز</button
    >
    <button
      type="button"
      class="rounded-lg border border-line bg-white px-3 py-2 text-[13px]"
      onclick={onNext}>›</button
    >
  </div>
  <div class="flex items-center gap-1 rounded-[10px] bg-canvas p-1" dir="rtl">
    {#each tabs as tab (tab.href)}
      {@const active = page.url.pathname === tab.href}
      <button
        type="button"
        class="rounded-lg px-3.5 py-2 text-[13px] {active
          ? 'border border-line bg-white font-semibold text-ink'
          : 'font-medium text-muted'}"
        onclick={() => goto(resolve(tab.href))}
      >
        {tab.label}
      </button>
    {/each}
  </div>
</header>
