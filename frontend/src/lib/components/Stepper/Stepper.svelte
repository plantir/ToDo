<script lang="ts">
  interface Props {
    value: number
    min?: number
    max?: number
    step?: number
    unit?: string
    onChange: (value: number) => void
  }

  let { value, min = 1, max = 120, step = 1, unit, onChange }: Props = $props()

  function bump(delta: number): void {
    const next = Math.min(max, Math.max(min, value + delta))
    onChange(next)
  }
</script>

<div
  class="flex items-center overflow-hidden rounded-[10px] border border-line bg-canvas"
  dir="ltr"
>
  <button
    type="button"
    class="flex h-10 w-9 items-center justify-center text-lg text-muted"
    onclick={() => bump(-step)}
  >
    −
  </button>
  <div
    class="flex h-10 w-[88px] items-center justify-center gap-1 bg-white text-[15px] font-semibold"
  >
    <span>{value}</span>
    {#if unit}
      <span class="text-xs font-medium text-muted">{unit}</span>
    {/if}
  </div>
  <button
    type="button"
    class="flex h-10 w-9 items-center justify-center text-lg text-brand"
    onclick={() => bump(step)}
  >
    +
  </button>
</div>
