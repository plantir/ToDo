<script lang="ts">
  import { PriorityBadge } from '$lib/components/PriorityBadge'
  import { ProjectChip } from '$lib/components/ProjectChip'
  import type { Task } from '$lib/types'
  import { toFa } from '$lib/utils/digits'

  interface Props {
    task: Task
    compact?: boolean
    onAssign?: (task: Task) => void
  }

  let { task, compact = false, onAssign }: Props = $props()
</script>

<button
  type="button"
  class="flex w-full items-center gap-2 rounded-[10px] border border-line bg-white p-2.5 text-start"
  onclick={() => onAssign?.(task)}
>
  <div class="flex min-w-0 flex-1 flex-col gap-1">
    <p class="truncate text-[13px] font-medium">{task.title}</p>
    {#if task.project}
      <ProjectChip project={task.project} />
    {/if}
    {#if !compact}
      <p class="text-xs font-medium text-muted">⏱ × {toFa(task.estimatedPomodoros)}</p>
    {/if}
  </div>
  <PriorityBadge priority={task.priority} />
</button>
