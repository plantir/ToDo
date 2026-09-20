<script lang="ts">
  import type { Priority } from '$lib/types'

  interface Props {
    priority: Priority
  }

  let { priority }: Props = $props()

  const styles: Record<Priority, string> = {
    1: 'bg-p1/12 text-p1',
    2: 'bg-p2/12 text-p2',
    3: 'bg-p3/12 text-p3',
    4: 'bg-p4/12 text-p4',
  }
</script>

<span
  class="inline-flex items-center justify-center rounded-[6px] px-2 py-0.5 text-[11px] font-semibold {styles[
    priority
  ]}"
>
  P{priority}
</span>
