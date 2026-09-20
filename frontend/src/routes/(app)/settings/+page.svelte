<script lang="ts">
  import { onMount } from 'svelte'
  import { Stepper } from '$lib/components/Stepper'
  import { workspace } from '$lib/state/workspace.svelte'
  import type { Settings, Weekday } from '$lib/types'
  import { WEEKDAYS } from '$lib/utils/jalali'
  import { toFa } from '$lib/utils/digits'

  let draft = $state<Settings | null>(null)
  let saved = $state(false)

  const weekdayOrder: Weekday[] = [6, 0, 1, 2, 3, 4, 5]

  onMount(async () => {
    await workspace.refreshMeta()
    draft = workspace.settings ? { ...workspace.settings } : null
  })

  const hint = $derived.by(() => {
    if (!draft) {
      return ''
    }
    const weekly = draft.dailyPomoLimit * draft.workingDays.length
    const monthly = weekly * 4
    return `بر اساس ${toFa(draft.dailyPomoLimit)} پومودورو روزانه و ${toFa(draft.workingDays.length)} روز کاری: حدود ${toFa(weekly)} در هفته · ${toFa(monthly)} در ماه`
  })

  function toggleDay(day: Weekday): void {
    if (!draft) {
      return
    }
    draft.workingDays = draft.workingDays.includes(day)
      ? draft.workingDays.filter((item) => item !== day)
      : [...draft.workingDays, day]
  }

  async function save(): Promise<void> {
    if (!draft) {
      return
    }
    await workspace.saveSettings(draft)
    saved = true
  }
</script>

<main class="flex min-h-0 flex-1 flex-col gap-5 overflow-auto px-10 py-7" dir="ltr">
  <div dir="rtl">
    <h1 class="text-2xl font-semibold">تنظیمات</h1>
    <p class="mt-2 text-[13px] text-muted">پومودورو، استراحت‌ها و روزهای کاری</p>
  </div>

  {#if draft}
    <section class="w-full max-w-[1040px] overflow-hidden rounded-card border border-line bg-white">
      <div class="px-5 pb-3 pt-4 text-[15px] font-semibold" dir="rtl">پومودورو</div>
      <div class="flex items-center justify-between px-5 py-4">
        <div dir="rtl">
          <p class="text-sm font-semibold">زمان هر پومودورو</p>
          <p class="text-xs text-muted">مدت تمرکز برای هر جلسه</p>
        </div>
        <Stepper
          value={draft.pomoDurationMinutes}
          unit="دقیقه"
          onChange={(value) => (draft = { ...draft!, pomoDurationMinutes: value })}
        />
      </div>
      <div class="mx-5 h-px bg-line"></div>
      <div class="flex items-center justify-between px-5 py-4">
        <div dir="rtl">
          <p class="text-sm font-semibold">استراحت کوتاه بین پومودوروها</p>
          <p class="text-xs text-muted">پس از هر پومودورو</p>
        </div>
        <Stepper
          value={draft.shortBreakMinutes}
          unit="دقیقه"
          onChange={(value) => (draft = { ...draft!, shortBreakMinutes: value })}
        />
      </div>
      <div class="mx-5 h-px bg-line"></div>
      <div class="flex items-center justify-between px-5 py-4">
        <div dir="rtl">
          <p class="text-sm font-semibold">استراحت طولانی بعد از چند پومودورو</p>
          <p class="text-xs text-muted">پس از N پومودورو متوالی</p>
        </div>
        <Stepper
          value={draft.longBreakAfter}
          onChange={(value) => (draft = { ...draft!, longBreakAfter: value })}
        />
      </div>
      <div class="mx-5 h-px bg-line"></div>
      <div class="flex items-center justify-between px-5 py-4">
        <div dir="rtl">
          <p class="text-sm font-semibold">مدت استراحت طولانی</p>
          <p class="text-xs text-muted">قابل تنظیم</p>
        </div>
        <Stepper
          value={draft.longBreakMinutes}
          unit="دقیقه"
          onChange={(value) => (draft = { ...draft!, longBreakMinutes: value })}
        />
      </div>
      <div class="mx-5 h-px bg-line"></div>
      <div class="flex items-center justify-between px-5 py-4">
        <div dir="rtl">
          <p class="text-sm font-semibold">تعداد پومودورو مجاز روزانه</p>
          <p class="text-xs text-muted">سقف ظرفیت روزانه (پیش‌فرض ۱۰)</p>
        </div>
        <Stepper
          value={draft.dailyPomoLimit}
          onChange={(value) => (draft = { ...draft!, dailyPomoLimit: value })}
        />
      </div>
    </section>

    <section class="w-full max-w-[1040px] overflow-hidden rounded-card border border-line bg-white">
      <div class="px-5 pb-3 pt-4 text-[15px] font-semibold" dir="rtl">برنامه هفتگی</div>
      <div class="flex items-center justify-between px-5 py-4">
        <div dir="rtl">
          <p class="text-sm font-semibold">روزهای کاری هفته</p>
          <p class="text-xs text-muted">روزهای فعال برای برنامه‌ریزی</p>
        </div>
        <div class="flex flex-wrap gap-1.5">
          {#each weekdayOrder as day (day)}
            {@const active = draft.workingDays.includes(day)}
            <button
              type="button"
              class="rounded-chip px-3 py-2 text-xs {active
                ? 'border-[1.5px] border-brand bg-brand-soft font-semibold text-brand'
                : 'border border-line bg-canvas font-medium text-muted'}"
              onclick={() => toggleDay(day)}
            >
              {WEEKDAYS[(day + 1) % 7]}
            </button>
          {/each}
        </div>
      </div>
    </section>

    <div
      class="flex w-full max-w-[1040px] items-center gap-3 rounded-xl bg-brand-soft px-4 py-3 text-brand"
      dir="rtl"
    >
      <span>💡</span>
      <p class="text-xs font-medium">{hint}</p>
    </div>

    <div class="flex w-full max-w-[1040px] justify-end">
      <button
        type="button"
        class="rounded-input bg-brand px-7 py-3.5 text-sm font-semibold text-white"
        onclick={() => void save()}
      >
        ذخیره تغییرات
      </button>
    </div>
    {#if saved}
      <p class="text-sm text-ok">ذخیره شد</p>
    {/if}
  {/if}
</main>
