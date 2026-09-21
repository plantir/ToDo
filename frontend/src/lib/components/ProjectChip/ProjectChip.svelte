<script lang="ts">
  import type { Project } from '$lib/types'

  interface Props {
    project: Project
  }

  let { project }: Props = $props()
</script>

<span
  class="inline-flex items-center gap-1.5 rounded-[6px] px-1.5 py-0.5 text-[10px] font-medium"
  style="background: color-mix(in srgb, {project.color} 12%, white); color: {project.color}"
>
  <span class="size-1.5 rounded-full" style="background: {project.color}"></span>
  {project.name}
</span>
