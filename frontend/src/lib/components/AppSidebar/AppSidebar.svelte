<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { LibraryCard } from '$lib/components/LibraryCard'
  import { session } from '$lib/state/session.svelte'
  import { workspace } from '$lib/state/workspace.svelte'
  import type { Task } from '$lib/types'

  interface Props {
    dimmed?: boolean
    onAddProject: () => void
    onAddTask: () => void
    onAssign?: (task: Task) => void
  }

  let { dimmed = false, onAddProject, onAddTask, onAssign }: Props = $props()

  const links = [
    { href: '/daily', label: 'روزانه' },
    { href: '/weekly', label: 'هفتگی' },
    { href: '/monthly', label: 'ماهانه' },
    { href: '/tasks', label: 'همه تسک‌ها' },
    { href: '/settings', label: 'تنظیمات' },
  ] as const
</script>

<aside
  class="flex h-full w-[280px] shrink-0 flex-col gap-2.5 overflow-y-auto border-e border-line bg-white px-4 py-6"
>
  <div class="flex items-center gap-2.5 pb-2">
    <span class="text-base">📅</span>
    <p class="text-lg font-semibold">تقویم تسک</p>
  </div>

  <nav class="flex flex-col gap-1 pb-3 pt-2">
    {#each links as link (link.href)}
      {@const active = page.url.pathname === link.href}
      <a
        href={resolve(link.href)}
        class="rounded-lg px-3 py-2.5 text-[13px] {active
          ? 'bg-brand-soft font-semibold text-brand'
          : 'font-medium text-muted'}"
      >
        {link.label}
      </a>
    {/each}
  </nav>

  <div class="flex items-center justify-between {dimmed ? 'opacity-70' : ''}">
    <p class="text-[13px] font-semibold {dimmed ? 'text-subtle' : 'text-ink'}">پروژه‌ها</p>
    {#if !dimmed}
      <button
        type="button"
        class="rounded-md bg-canvas px-2 py-1 text-sm font-semibold text-muted"
        onclick={onAddProject}
      >
        +
      </button>
    {/if}
  </div>
  <div class="flex flex-col gap-0.5 {dimmed ? 'opacity-70' : ''}">
    {#each workspace.projects as project (project.id)}
      <div class="flex items-center gap-2 rounded-lg px-2 py-1.5">
        <span class="size-2 rounded-full" style="background: {project.color}"></span>
        <span class="text-xs font-medium {dimmed ? 'text-muted' : 'text-ink'}">{project.name}</span>
      </div>
    {/each}
  </div>

  <div class="mt-2 flex items-center justify-between {dimmed ? 'opacity-55' : ''}">
    <p class="text-[13px] font-semibold {dimmed ? 'text-subtle' : 'text-ink'}">کتابخانه تسک‌ها</p>
    {#if !dimmed}
      <button
        type="button"
        class="rounded-md bg-canvas px-2 py-1 text-sm font-semibold text-muted"
        onclick={onAddTask}
      >
        +
      </button>
    {/if}
  </div>
  {#if !dimmed}
    <p class="text-[11px] text-subtle">تسک را به روز بکشید ←</p>
  {/if}
  <div class="flex flex-col gap-2 {dimmed ? 'opacity-50' : ''}">
    {#each workspace.library as task (task.id)}
      <LibraryCard {task} compact={dimmed} {onAssign} />
    {/each}
  </div>

  <div class="mt-auto border-t border-line pt-3">
    <p class="truncate text-xs text-muted">{session.user?.fullName ?? session.user?.email ?? ''}</p>
    <button
      type="button"
      class="mt-2 text-xs font-medium text-brand"
      onclick={async () => {
        await session.logout()
        await goto(resolve('/login'))
      }}
    >
      خروج
    </button>
  </div>
</aside>
