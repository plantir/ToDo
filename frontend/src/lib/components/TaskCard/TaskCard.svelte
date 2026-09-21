<script lang="ts">
  import { PriorityBadge } from '$lib/components/PriorityBadge'
  import { ProjectChip } from '$lib/components/ProjectChip'
  import type { Task } from '$lib/types'
  import { toFa } from '$lib/utils/digits'

  interface Props {
    task: Task
    onToggle: (task: Task) => void
    onAddSubtask?: (task: Task) => void
  }

  let { task, onToggle, onAddSubtask }: Props = $props()
  let userOpen = $state<boolean | null>(null)
  const open = $derived(userOpen ?? task.children.length > 0)
</script>

<article class="flex w-full flex-col gap-3 rounded-xl border border-line bg-white px-4 py-3.5">
  <div class="flex items-center gap-3">
    <button
      type="button"
      class="size-[18px] rounded border-[1.5px] {task.isCompleted
        ? 'border-ok bg-ok'
        : 'border-[#d1d5db] bg-white'}"
      onclick={() => onToggle(task)}
      aria-label="تکمیل تسک"
    ></button>
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <p
        class="text-[15px] font-semibold {task.isCompleted
          ? 'text-subtle line-through'
          : 'text-ink'}"
      >
        {task.title}
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {#if task.project}
          <ProjectChip project={task.project} />
        {/if}
        <span class="text-xs font-medium text-muted">{toFa(task.estimatedPomodoros)} پومودورو</span>
      </div>
    </div>
    {#if task.children.length > 0 || onAddSubtask}
      <button type="button" class="text-sm text-muted" onclick={() => (userOpen = !open)}>
        {open ? '▾' : '◂'}
      </button>
    {/if}
  </div>

  {#if open}
    <div class="flex flex-col gap-2 ps-7">
      {#each task.children as child (child.id)}
        <div class="flex items-center gap-2.5 rounded-lg bg-canvas px-3 py-2">
          <button
            type="button"
            class="size-[18px] rounded border-[1.5px] {child.isCompleted
              ? 'border-ok bg-ok'
              : 'border-[#d1d5db] bg-white'}"
            onclick={() => onToggle(child)}
            aria-label="تکمیل زیرتسک"
          ></button>
          <p
            class="flex-1 text-[13px] {child.isCompleted ? 'text-subtle line-through' : 'text-ink'}"
          >
            {child.title}
          </p>
          <span class="text-xs font-medium text-muted"
            >⏱ {toFa(child.estimatedPomodoros)} پومودورو</span
          >
        </div>
      {/each}
      {#if onAddSubtask}
        <div class="flex gap-2 pt-1">
          <button
            type="button"
            class="rounded-lg bg-brand-soft px-3 py-2 text-xs font-semibold text-brand"
            onclick={() => onAddSubtask(task)}
          >
            + افزودن زیرتسک
          </button>
        </div>
      {/if}
    </div>
  {/if}
</article>
