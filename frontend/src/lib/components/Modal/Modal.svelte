<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    title: string
    open: boolean
    onClose: () => void
    children: Snippet
  }

  let { title, open, onClose, children }: Props = $props()
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 px-4">
    <div class="w-[420px] max-w-full rounded-2xl border border-line bg-white p-6 shadow-card">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">{title}</h2>
        <button type="button" class="text-muted" onclick={onClose}>×</button>
      </div>
      {@render children()}
    </div>
  </div>
{/if}
