<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { AppSidebar } from '$lib/components/AppSidebar'
  import { Modal } from '$lib/components/Modal'
  import { session } from '$lib/state/session.svelte'
  import { workspace } from '$lib/state/workspace.svelte'
  import { ui } from '$lib/state/ui.svelte'
  import type { Priority, Task } from '$lib/types'

  let { children } = $props()
  let projectOpen = $state(false)
  let taskOpen = $state(false)
  let projectName = $state('')
  let projectColor = $state('#8b5cf6')
  let taskTitle = $state('')
  let taskProjectId = $state<number | null>(null)
  let taskPriority = $state<Priority>(3)
  let taskPomos = $state(1)
  let parentId = $state<number | null>(null)

  const dimmed = $derived(page.url.pathname === '/settings')

  $effect(() => {
    if (session.ready && !session.isAuthenticated) {
      void goto(resolve('/login'))
    }
  })

  async function createProject(): Promise<void> {
    if (!projectName.trim()) {
      return
    }
    await workspace.createProject(projectName.trim(), projectColor)
    projectName = ''
    projectOpen = false
  }

  async function createTask(): Promise<void> {
    if (!taskTitle.trim() || !taskProjectId) {
      return
    }
    await workspace.createTask({
      projectId: taskProjectId,
      title: taskTitle.trim(),
      priority: taskPriority,
      estimatedPomodoros: taskPomos,
      parentId: parentId ?? undefined,
    })
    taskTitle = ''
    parentId = null
    taskOpen = false
    await workspace.refreshMeta()
  }

  async function assign(task: Task): Promise<void> {
    await workspace.assignToDate(task.id, workspace.selectedDate)
    await workspace.refreshMeta()
  }

  function openSubtask(task: Task): void {
    parentId = task.id
    taskProjectId = task.projectId
    taskTitle = ''
    taskOpen = true
  }

  $effect(() => {
    ui.openSubtask = openSubtask
  })
</script>

<div class="flex h-screen overflow-hidden bg-canvas" dir="ltr">
  <div dir="rtl">
    <AppSidebar
      {dimmed}
      onAddProject={() => (projectOpen = true)}
      onAddTask={() => {
        parentId = null
        taskProjectId = workspace.projects[0]?.id ?? null
        taskOpen = true
      }}
      onAssign={assign}
    />
  </div>
  <div class="flex min-w-0 flex-1 flex-col" dir="rtl">
    {@render children()}
  </div>
</div>

<Modal title="پروژه جدید" open={projectOpen} onClose={() => (projectOpen = false)}>
  <form
    class="flex flex-col gap-4"
    onsubmit={(event) => {
      event.preventDefault()
      void createProject()
    }}
  >
    <input
      class="rounded-input border border-line px-3 py-3"
      placeholder="نام پروژه"
      bind:value={projectName}
    />
    <input
      class="h-10 w-24 rounded-input border border-line"
      type="color"
      bind:value={projectColor}
    />
    <button type="submit" class="rounded-input bg-brand py-3 font-semibold text-white"
      >افزودن</button
    >
  </form>
</Modal>

<Modal
  title={parentId ? 'زیرتسک جدید' : 'تسک جدید'}
  open={taskOpen}
  onClose={() => (taskOpen = false)}
>
  <form
    class="flex flex-col gap-4"
    onsubmit={(event) => {
      event.preventDefault()
      void createTask()
    }}
  >
    <input
      class="rounded-input border border-line px-3 py-3"
      placeholder="عنوان تسک"
      bind:value={taskTitle}
    />
    <select class="rounded-input border border-line px-3 py-3" bind:value={taskProjectId}>
      {#each workspace.projects as project (project.id)}
        <option value={project.id}>{project.name}</option>
      {/each}
    </select>
    <select class="rounded-input border border-line px-3 py-3" bind:value={taskPriority}>
      <option value={1}>P1</option>
      <option value={2}>P2</option>
      <option value={3}>P3</option>
      <option value={4}>P4</option>
    </select>
    <input
      class="rounded-input border border-line px-3 py-3"
      type="number"
      min="1"
      max="40"
      bind:value={taskPomos}
    />
    <button type="submit" class="rounded-input bg-brand py-3 font-semibold text-white"
      >افزودن</button
    >
  </form>
</Modal>
