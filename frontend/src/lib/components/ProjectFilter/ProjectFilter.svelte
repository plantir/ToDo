<script lang="ts">
  import { workspace } from '$lib/state/workspace.svelte'

  interface Props {
    onChange: () => void
  }

  let { onChange }: Props = $props()
</script>

<div class="flex flex-wrap items-center gap-2 py-1" dir="ltr">
  <span class="text-xs font-medium text-muted">فیلتر پروژه:</span>
  <button
    type="button"
    class="rounded-chip px-3.5 py-2 text-[13px] {workspace.projectFilter === null
      ? 'border-[1.5px] border-brand bg-brand-soft font-semibold text-brand'
      : 'border border-line bg-white font-medium text-muted'}"
    onclick={() => {
      workspace.projectFilter = null
      onChange()
    }}
  >
    همه
  </button>
  {#each workspace.projects as project (project.id)}
    <button
      type="button"
      class="flex items-center gap-1.5 rounded-chip px-3.5 py-2 text-[13px] {workspace.projectFilter ===
      project.id
        ? 'border-[1.5px] border-brand bg-brand-soft font-semibold text-brand'
        : 'border border-line bg-white font-medium text-muted'}"
      onclick={() => {
        workspace.projectFilter = project.id
        onChange()
      }}
    >
      <span class="size-2 rounded-full" style="background: {project.color}"></span>
      {project.name}
    </button>
  {/each}
</div>
