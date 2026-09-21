import { api } from '$lib/api/client'
import type { CalendarPayload, CalendarView, Project, Settings, Task } from '$lib/types'
import { isoToday } from '$lib/utils/jalali'

class Workspace {
  projects = $state<Project[]>([])
  library = $state<Task[]>([])
  settings = $state<Settings | null>(null)
  calendar = $state<CalendarPayload | null>(null)
  selectedDate = $state(isoToday())
  projectFilter = $state<number | null>(null)
  loading = $state(false)

  async refreshMeta(): Promise<void> {
    const [projects, library, settings] = await Promise.all([
      api<Project[]>('/projects'),
      api<Task[]>('/tasks?unassigned=true'),
      api<Settings>('/settings'),
    ])
    this.projects = projects
    this.library = library
    this.settings = settings
  }

  async refreshCalendar(view: CalendarView): Promise<void> {
    const params = new URLSearchParams({ view, date: this.selectedDate })
    if (this.projectFilter) {
      params.set('projectId', String(this.projectFilter))
    }
    this.calendar = await api<CalendarPayload>(`/calendar?${params.toString()}`)
  }

  async load(view: CalendarView): Promise<void> {
    this.loading = true
    try {
      await Promise.all([this.refreshMeta(), this.refreshCalendar(view)])
    } finally {
      this.loading = false
    }
  }

  async createProject(name: string, color: string): Promise<void> {
    await api('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    })
    await this.refreshMeta()
  }

  async createTask(input: {
    projectId: number
    title: string
    priority: number
    estimatedPomodoros: number
    parentId?: number
    assignedOn?: string
  }): Promise<void> {
    await api('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  async toggleTask(task: Task): Promise<void> {
    await api(`/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted: !task.isCompleted }),
    })
  }

  async assignToDate(taskId: number, date: string): Promise<void> {
    await api(`/tasks/${taskId}/assignments`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    })
  }

  async saveSettings(settings: Settings): Promise<void> {
    this.settings = await api<Settings>('/settings', {
      method: 'PATCH',
      body: JSON.stringify({
        pomoDurationMinutes: settings.pomoDurationMinutes,
        shortBreakMinutes: settings.shortBreakMinutes,
        longBreakAfter: settings.longBreakAfter,
        longBreakMinutes: settings.longBreakMinutes,
        dailyPomoLimit: settings.dailyPomoLimit,
        workingDays: settings.workingDays,
      }),
    })
  }
}

export const workspace = new Workspace()
