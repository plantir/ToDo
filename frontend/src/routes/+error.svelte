<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
</script>

<div class="flex min-h-screen items-center justify-center bg-canvas px-4">
  <div class="rounded-2xl border border-line bg-white px-8 py-10 text-center shadow-card">
    <p class="text-sm font-semibold text-brand">{page.status}</p>
    <h1 class="mt-2 text-xl font-semibold">صفحه پیدا نشد</h1>
    <a class="mt-4 inline-block text-sm font-semibold text-brand" href={resolve('/daily')}>بازگشت</a
    >
  </div>
</div>
