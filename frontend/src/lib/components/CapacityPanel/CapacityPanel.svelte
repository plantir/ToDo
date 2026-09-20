<script lang="ts">
  import type { Capacity, CalendarDay } from '$lib/types'
  import { toFa } from '$lib/utils/digits'

  interface Props {
    capacity: Capacity
    days?: CalendarDay[]
    sampleOver?: boolean
  }

  let { capacity, days = [], sampleOver = false }: Props = $props()

  const percent = $derived(
    Math.min(100, Math.round((capacity.used / Math.max(capacity.limit, 1)) * 100)),
  )
  const over = $derived(capacity.status === 'over')
</script>

<aside class="flex w-[280px] shrink-0 flex-col gap-4">
  <section
    class="rounded-xl border px-4 py-4 {over
      ? 'border-danger/20 bg-danger-soft'
      : 'border-ok/20 bg-ok-soft'}"
  >
    <p class="mb-3 text-[13px] font-semibold">زمان‌بندی پومودورو</p>
    <p class="mb-1 text-xs text-muted">ظرفیت روزانه: حداکثر {toFa(capacity.limit)} پومودورو</p>
    <p class="text-2xl font-semibold">{toFa(capacity.used)} / {toFa(capacity.limit)}</p>
    <p class="mt-1 text-xs text-muted">پومودورو برنامه‌ریزی‌شده</p>
    <div class="my-3 h-2 overflow-hidden rounded-full bg-white">
      <div class="h-full {over ? 'bg-danger' : 'bg-ok'}" style="width: {percent}%"></div>
    </div>
    <p class="text-xs font-medium {over ? 'text-danger' : 'text-ok'}">
      {#if over}
        ⚠ {toFa(capacity.overBy)} تا اضافه داری
      {:else}
        ✓ {toFa(capacity.remaining)} تا دیگه جا داری
      {/if}
    </p>
  </section>

  {#if days.length}
    <section class="rounded-xl border border-line bg-white px-4 py-3">
      {#each days as day (day.date)}
        {#each day.tasks as task (task.id)}
          {#if !task.parentId}
            <div class="flex items-center justify-between py-1.5 text-[13px]">
              <div class="flex items-center gap-2">
                <span
                  class="size-2 rounded-full"
                  style="background: {task.project?.color ?? '#94a3b8'}"
                ></span>
                <span>{task.title}</span>
              </div>
              <span class="text-muted">{toFa(task.estimatedPomodoros)}</span>
            </div>
          {/if}
        {/each}
      {/each}
    </section>
  {/if}

  {#if sampleOver}
    <section class="rounded-xl border border-danger/20 bg-danger-soft px-4 py-4">
      <p class="text-[13px] font-semibold text-danger">نمونه: بیش از ظرفیت</p>
      <p class="mt-2 text-2xl font-semibold">{toFa(12)} / {toFa(10)}</p>
      <div class="my-3 h-2 overflow-hidden rounded-full bg-white">
        <div class="h-full w-full bg-danger"></div>
      </div>
      <p class="text-xs font-medium text-danger">⚠ {toFa(2)} تا اضافه داری</p>
    </section>
  {/if}
</aside>
