<script lang="ts">
  import { onMount } from 'svelte'
  import { AppTopBar } from '$lib/components/AppTopBar'
  import { PriorityBadge } from '$lib/components/PriorityBadge'
  import { ProjectChip } from '$lib/components/ProjectChip'
  import { ProjectFilter } from '$lib/components/ProjectFilter'
  import { api } from '$lib/api/client'
  import { workspace } from '$lib/state/workspace.svelte'
  import type { Task } from '$lib/types'
  import { toFa } from '$lib/utils/digits'
  import { addDays, isoToday } from '$lib/utils/jalali'

  let roots = $state<Task[]>([])
  let collapsed = $state<Record<string, boolean>>({})

  const visible = $derived(
    roots.filter((task) => !workspace.projectFilter || task.projectId === workspace.projectFilter),
  )
  const groups = $derived(
    workspace.projects
      .map((project) => ({
        project,
        tasks: visible.filter((task) => task.projectId === project.id),
      }))
      .filter((group) => group.tasks.length > 0),
  )

  async function loadTasks(): Promise<void> {
    const tasks = await api<Task[]>('/tasks')
    roots = tasks.filter((task) => task.parentId === null)
  }

  onMount(() => {
    void workspace.refreshMeta()
    void loadTasks()
  })

  function toggleGroup(id: number): void {
    collapsed = { ...collapsed, [`p-${id}`]: !collapsed[`p-${id}`] }
  }

  function toggleTask(id: number): void {
    collapsed = { ...collapsed, [`t-${id}`]: !collapsed[`t-${id}`] }
  }
</script>

<AppTopBar
  onPrev={() => {
    workspace.selectedDate = addDays(workspace.selectedDate, -1)
  }}
  onNext={() => {
    workspace.selectedDate = addDays(workspace.selectedDate, 1)
  }}
  onToday={() => {
    workspace.selectedDate = isoToday()
  }}
/>

<main class="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-7 py-6" dir="ltr">
  <div class="flex items-center justify-between" dir="rtl">
    <h1 class="text-2xl font-semibold">همه تسک‌ها</h1>
    <p class="text-xs text-subtle">
      {workspace.projectFilter
        ? `فیلتر: ${workspace.projects.find((project) => project.id === workspace.projectFilter)?.name ?? ''}`
        : 'گروه‌بندی بر اساس پروژه و اولویت'}
    </p>
  </div>
  <ProjectFilter onChange={() => undefined} />

  <div class="flex flex-col gap-4" dir="rtl">
    {#each groups as group (group.project.id)}
      <section class="overflow-hidden rounded-xl border border-line bg-white">
        <button
          type="button"
          class="flex w-full items-center gap-2 px-4 py-3 text-start"
          onclick={() => toggleGroup(group.project.id)}
        >
          <span>{collapsed[`p-${group.project.id}`] ? '◂' : '▾'}</span>
          <span class="size-2 rounded-full" style="background: {group.project.color}"></span>
          <span class="font-semibold">{group.project.name}</span>
          <span class="text-xs text-muted">{toFa(group.tasks.length)} تسک</span>
        </button>
        {#if !collapsed[`p-${group.project.id}`]}
          <div class="flex flex-col gap-2 px-3 pb-3">
            {#each group.tasks as task (task.id)}
              <article class="rounded-xl border border-line px-3 py-3">
                <div class="flex items-center gap-3">
                  <button type="button" class="text-muted" onclick={() => toggleTask(task.id)}>
                    {task.children.length && !collapsed[`t-${task.id}`] ? '▾' : '◂'}
                  </button>
                  <button
                    type="button"
                    class="size-[18px] rounded border-[1.5px] {task.isCompleted
                      ? 'border-ok bg-ok'
                      : 'border-[#d1d5db]'}"
                    onclick={() => void workspace.toggleTask(task).then(loadTasks)}
                    aria-label="تکمیل تسک"
                  ></button>
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold">{task.title}</p>
                    <div class="mt-1 flex items-center gap-2">
                      <PriorityBadge priority={task.priority} />
                      {#if task.project}
                        <ProjectChip project={task.project} />
                      {/if}
                      <span class="text-xs text-muted">⏱ × {toFa(task.estimatedPomodoros)}</span>
                    </div>
                  </div>
                </div>
                {#if task.children.length && !collapsed[`t-${task.id}`]}
                  <div class="mt-2 flex flex-col gap-1 ps-10">
                    {#each task.children as child (child.id)}
                      <div
                        class="flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-[13px]"
                      >
                        <button
                          type="button"
                          class="size-4 rounded border {child.isCompleted
                            ? 'border-ok bg-ok'
                            : 'border-[#d1d5db]'}"
                          onclick={() => void workspace.toggleTask(child).then(loadTasks)}
                          aria-label="تکمیل زیرتسک"
                        ></button>
                        <span class="flex-1">{child.title}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </article>
            {/each}
          </div>
        {/if}
      </section>
    {/each}
  </div>
</main>
