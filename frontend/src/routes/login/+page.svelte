<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { AuthShell } from '$lib/components/AuthShell'
  import { TextField } from '$lib/components/TextField'
  import { session } from '$lib/state/session.svelte'
  import { ApiError } from '$lib/api/client'

  let email = $state('')
  let password = $state('')
  let error = $state('')
  let pending = $state(false)

  async function submit(event: Event): Promise<void> {
    event.preventDefault()
    error = ''
    pending = true
    try {
      await session.login(email, password)
      await goto(resolve('/daily'))
    } catch (caught) {
      error = caught instanceof ApiError ? 'ایمیل یا رمز عبور نادرست است' : 'ورود ناموفق بود'
    } finally {
      pending = false
    }
  }
</script>

<AuthShell title="تقویم تسک" subtitle="برنامه‌ریزی تسک‌ها با پومودورو — ساده و متمرکز">
  <form class="flex w-[360px] max-w-full flex-col gap-4" onsubmit={submit}>
    <TextField
      label="ایمیل"
      type="email"
      placeholder="name@example.com"
      autocomplete="email"
      bind:value={email}
    />
    <TextField
      label="رمز عبور"
      type="password"
      placeholder="••••••••"
      autocomplete="current-password"
      bind:value={password}
    />
    <div class="flex justify-end">
      <button type="button" class="text-xs font-medium text-brand"
        >رمز عبور را فراموش کرده‌اید؟</button
      >
    </div>
    {#if error}
      <p class="text-sm text-danger">{error}</p>
    {/if}
    <button
      type="submit"
      class="rounded-input bg-brand px-5 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
      disabled={pending}
    >
      ورود
    </button>
    <p class="pt-2 text-center text-[13px] text-muted">
      حساب ندارید؟
      <a href={resolve('/signup')} class="font-semibold text-brand">ثبت‌نام</a>
    </p>
  </form>
</AuthShell>
