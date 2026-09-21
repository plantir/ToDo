<script lang="ts">
  import { onMount } from 'svelte'
  import { AppTopBar } from '$lib/components/AppTopBar'
  import { CapacityPanel } from '$lib/components/CapacityPanel'
  import { ProjectFilter } from '$lib/components/ProjectFilter'
  import { TaskCard } from '$lib/components/TaskCard'
  import { workspace } from '$lib/state/workspace.svelte'
  import { ui } from '$lib/state/ui.svelte'
  import { addDays, isoToday, jalaliTitle } from '$lib/utils/jalali'

  const view = 'daily' as const
  const title = $derived(jalaliTitle(workspace.selectedDate))
  const day = $derived(workspace.calendar?.days[0] ?? null)

  onMount(() => {
    void workspace.load(view)
  })

  async function reload(): Promise<void> {
    await workspace.refreshCalendar(view)
    await workspace.refreshMeta()
  }
</script>

<AppTopBar
  onPrev={async () => {
    workspace.selectedDate = addDays(workspace.selectedDate, -1)
    await workspace.refreshCalendar(view)
  }}
  onNext={async () => {
    workspace.selectedDate = addDays(workspace.selectedDate, 1)
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
  <div class="flex gap-5">
    <section class="flex min-w-0 flex-1 flex-col gap-3" dir="rtl">
      <p class="text-sm font-semibold text-muted">برنامه روز</p>
      {#if day}
        {#each day.tasks.filter((task) => task.parentId === null) as task (task.id)}
          <TaskCard
            {task}
            onToggle={async (item) => {
              await workspace.toggleTask(item)
              await reload()
            }}
            onAddSubtask={(item) => ui.openSubtask?.(item)}
          />
        {/each}
      {/if}
    </section>
    {#if workspace.calendar}
      <div dir="rtl">
        <CapacityPanel
          capacity={workspace.calendar.capacity}
          days={workspace.calendar.days}
          sampleOver
        />
      </div>
    {/if}
  </div>
</main>
