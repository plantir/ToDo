<script lang="ts">
  interface Props {
    label: string
    type?: 'text' | 'email' | 'password'
    placeholder?: string
    value?: string
    autocomplete?: 'off' | 'email' | 'current-password' | 'new-password' | 'name'
  }

  let {
    label,
    type = 'text',
    placeholder = '',
    value = $bindable(''),
    autocomplete = 'off',
  }: Props = $props()

  let reveal = $state(false)
  let inputType = $derived(type === 'password' && reveal ? 'text' : type)
</script>

<label class="flex w-full flex-col gap-2">
  <span class="text-[13px] font-medium text-ink">{label}</span>
  <div class="flex items-center gap-2 rounded-input border border-line bg-white px-3.5 py-3">
    <input
      class="w-full bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
      {placeholder}
      {autocomplete}
      type={inputType}
      bind:value
    />
    {#if type === 'password'}
      <button
        type="button"
        class="rounded-lg bg-canvas px-2 py-1 text-xs font-medium text-muted"
        onclick={() => (reveal = !reveal)}
      >
        {reveal ? 'پنهان' : 'نمایش'}
      </button>
    {/if}
  </div>
</label>
