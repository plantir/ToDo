<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { AppTopBar } from '$lib/components/AppTopBar'
  import { ProjectFilter } from '$lib/components/ProjectFilter'
  import { workspace } from '$lib/state/workspace.svelte'
  import {
    addDays,
    isoToday,
    jalaliWeekTitle,
    startOfPersianWeek,
    WEEKDAYS,
  } from '$lib/utils/jalali'
  import { toFa } from '$lib/utils/digits'
  import { jalaliParts } from '$lib/utils/jalali'

  const view = 'weekly' as const
  const title = $derived(jalaliWeekTitle(workspace.selectedDate))
  const capacity = $derived(workspace.calendar?.capacity)
  const percent = $derived(
    capacity ? Math.min(100, Math.round((capacity.used / Math.max(capacity.limit, 1)) * 100)) : 0,
  )

  onMount(() => {
    void workspace.load(view)
  })
</script>

<AppTopBar
  onPrev={async () => {
    workspace.selectedDate = addDays(startOfPersianWeek(workspace.selectedDate), -7)
    await workspace.refreshCalendar(view)
  }}
  onNext={async () => {
    workspace.selectedDate = addDays(startOfPersianWeek(workspace.selectedDate), 7)
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
      <div class="flex flex-1 items-center gap-4">
        <span class="text-sm">⏱</span>
        <div class="flex-1">
          <p class="text-sm font-semibold">
            {toFa(capacity.used)} / {toFa(capacity.limit)} پومودورو
          </p>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <div
              class="h-full {capacity.status === 'over' ? 'bg-danger' : 'bg-ok'}"
              style="width: {percent}%"
            ></div>
          </div>
        </div>
      </div>
      <p class="text-xs font-medium {capacity.status === 'over' ? 'text-danger' : 'text-ok'}">
        {capacity.status === 'over'
          ? `⚠ ${toFa(capacity.overBy)} تا اضافه داری`
          : `✓ ${toFa(capacity.remaining)} تا دیگه جا داری`}
      </p>
    </section>
  {/if}

  <div
    class="grid min-h-[520px] grid-cols-7 gap-0 overflow-hidden rounded-xl border border-line bg-white"
    dir="ltr"
  >
    {#each workspace.calendar?.days ?? [] as day, index (day.date)}
      {@const selected = day.date === workspace.selectedDate}
      <div
        class="flex flex-col border-s border-line first:border-s-0 {selected
          ? 'border-s-2 border-s-brand'
          : ''}"
      >
        <div class="border-b border-line px-3 py-3 text-center">
          <p class="text-xs text-muted">{WEEKDAYS[index]}</p>
          <p class="text-lg font-semibold">{toFa(jalaliParts(day.date).jd)}</p>
        </div>
        <div class="flex flex-1 flex-col gap-2 p-2">
          {#each day.tasks.filter((task) => !task.parentId) as task (task.id)}
            <button
              type="button"
              class="rounded-lg bg-canvas px-2 py-2 text-start"
              dir="rtl"
              onclick={() => {
                workspace.selectedDate = day.date
                void goto(resolve('/daily'))
              }}
            >
              <div class="mb-1 flex items-center gap-1">
                <span
                  class="size-1.5 rounded-full"
                  style="background: {task.project?.color ?? '#94a3b8'}"
                ></span>
                <span class="truncate text-[12px] font-medium">{task.title}</span>
              </div>
              <p class="text-[10px] text-muted">⏱ {toFa(task.estimatedPomodoros)}</p>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</main>
