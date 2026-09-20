<script lang="ts">
  import { onMount } from 'svelte'
  import { AppTopBar } from '$lib/components/AppTopBar'
  import { ProjectFilter } from '$lib/components/ProjectFilter'
  import { workspace } from '$lib/state/workspace.svelte'
  import {
    isoToday,
    jalaliMonthGrid,
    jalaliMonthTitle,
    shiftJalaliMonth,
    WEEKDAYS,
  } from '$lib/utils/jalali'
  import { toFa } from '$lib/utils/digits'

  const view = 'monthly' as const
  const title = $derived(jalaliMonthTitle(workspace.selectedDate))
  const cells = $derived(jalaliMonthGrid(workspace.selectedDate))
  const capacity = $derived(workspace.calendar?.capacity)
  const percent = $derived(
    capacity ? Math.min(100, Math.round((capacity.used / Math.max(capacity.limit, 1)) * 100)) : 0,
  )
  const tasksByDate = $derived(
    Object.fromEntries((workspace.calendar?.days ?? []).map((day) => [day.date, day.tasks])),
  )

  onMount(() => {
    void workspace.load(view)
  })
</script>

<AppTopBar
  onPrev={async () => {
    workspace.selectedDate = shiftJalaliMonth(workspace.selectedDate, -1)
    await workspace.refreshCalendar(view)
  }}
  onNext={async () => {
    workspace.selectedDate = shiftJalaliMonth(workspace.selectedDate, 1)
    await workspace.refreshCalendar(view)
  }}
  onToday={async () => {
    workspace.selectedDate = isoToday()
    await workspace.refreshCalendar(view)
  }}
/>

<main class="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-7 py-6" dir="ltr">
  <h1 class="text-2xl font-semibold" dir="rtl">{title}</h1>
  <ProjectFilter onChange={() => void workspace.refreshCalendar(view)} />

  {#if capacity}
    <section
      class="flex items-center justify-between rounded-xl border px-4 py-3 {capacity.status ===
      'over'
        ? 'border-danger/20 bg-danger-soft'
        : 'border-ok/20 bg-ok-soft'}"
      dir="ltr"
    >
      <p class="text-sm font-semibold">⏱ {toFa(capacity.used)} / {toFa(capacity.limit)} پومودورو</p>
      <div class="mx-4 h-2 flex-1 overflow-hidden rounded-full bg-white">
        <div
          class="h-full {capacity.status === 'over' ? 'bg-danger' : 'bg-ok'}"
          style="width: {percent}%"
        ></div>
      </div>
      <p class="text-xs font-medium {capacity.status === 'over' ? 'text-danger' : 'text-ok'}">
        {capacity.status === 'over'
          ? `⚠ ${toFa(capacity.overBy)} تا اضافه داری`
          : `✓ ${toFa(capacity.remaining)} تا دیگه جا داری`}
      </p>
    </section>
  {/if}

  <div class="overflow-hidden rounded-xl border border-line bg-white" dir="ltr">
    <div class="grid grid-cols-7 border-b border-line text-center text-xs text-muted">
      {#each WEEKDAYS as weekday (weekday)}
        <div class="py-3">{weekday}</div>
      {/each}
    </div>
    <div class="grid grid-cols-7">
      {#each cells as cell, index (`${cell.iso ?? 'empty'}-${index}`)}
        {@const selected = cell.iso === workspace.selectedDate}
        <button
          type="button"
          class="min-h-[110px] border-s border-t border-line p-2 text-start first:border-s-0 {selected
            ? 'outline outline-2 outline-brand'
            : ''}"
          dir="rtl"
          disabled={!cell.iso}
          onclick={() => {
            if (cell.iso) {
              workspace.selectedDate = cell.iso
            }
          }}
        >
          {#if cell.day}
            <p class="mb-2 text-sm font-semibold">{toFa(cell.day)}</p>
            <div class="flex flex-col gap-1">
              {#each (cell.iso ? (tasksByDate[cell.iso] ?? []) : [])
                .filter((task) => !task.parentId)
                .slice(0, 3) as task (task.id)}
                <span
                  class="truncate rounded-md px-1.5 py-0.5 text-[11px]"
                  style="background: color-mix(in srgb, {task.project?.color ??
                    '#94a3b8'} 12%, white)"
                >
                  {task.title}
                </span>
              {/each}
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</main>
