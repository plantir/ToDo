import { DateTime } from 'luxon'
import { toGregorian, toJalaali, jalaaliMonthLength } from 'jalaali-js'
import Task from '#models/task'
import type User from '#models/user'
import type UserSetting from '#models/user_setting'
import { type Weekday } from '#models/user_setting'
import SettingsService from '#services/settings_service'

export type CalendarView = 'daily' | 'weekly' | 'monthly'

export type CapacitySnapshot = {
  used: number
  limit: number
  remaining: number
  overBy: number
  status: 'under' | 'over'
}

export type CalendarDay = {
  date: string
  weekday: Weekday
  isWorkingDay: boolean
  used: number
  tasks: Task[]
}

export type CalendarResult = {
  view: CalendarView
  from: string
  to: string
  capacity: CapacitySnapshot
  days: CalendarDay[]
}

export default class CalendarService {
  private settingsService = new SettingsService()

  async getView(
    user: User,
    view: CalendarView,
    date: string,
    projectId: number | null
  ): Promise<CalendarResult> {
    const setting = await this.settingsService.getOrCreate(user)
    const { from, to } = this.resolveRange(view, date)
    const tasks = await this.loadAssignedTasks(user, from, to, projectId)
    const days = this.buildDays(from, to, tasks, setting.workingDays)
    const used = this.sumUsed(tasks)
    const limit = this.capacityLimit(view, setting, days)

    return {
      view,
      from: from.toISODate()!,
      to: to.toISODate()!,
      capacity: this.toCapacity(used, limit),
      days,
    }
  }

  resolveRange(view: CalendarView, date: string): { from: DateTime; to: DateTime } {
    const day = DateTime.fromISO(date, { zone: 'utc' }).startOf('day')

    if (view === 'daily') {
      return { from: day, to: day }
    }

    if (view === 'weekly') {
      const daysSinceSaturday = (day.weekday + 1) % 7
      const from = day.minus({ days: daysSinceSaturday })
      return { from, to: from.plus({ days: 6 }) }
    }

    const jalali = toJalaali(day.year, day.month, day.day)
    const start = toGregorian(jalali.jy, jalali.jm, 1)
    const lastDay = jalaaliMonthLength(jalali.jy, jalali.jm)
    const end = toGregorian(jalali.jy, jalali.jm, lastDay)

    return {
      from: DateTime.utc(start.gy, start.gm, start.gd).startOf('day'),
      to: DateTime.utc(end.gy, end.gm, end.gd).startOf('day'),
    }
  }

  toCapacity(used: number, limit: number): CapacitySnapshot {
    const remaining = limit - used
    return {
      used,
      limit,
      remaining: remaining > 0 ? remaining : 0,
      overBy: remaining < 0 ? Math.abs(remaining) : 0,
      status: remaining < 0 ? 'over' : 'under',
    }
  }

  private capacityLimit(view: CalendarView, setting: UserSetting, days: CalendarDay[]): number {
    if (view === 'daily') {
      return setting.dailyPomoLimit
    }

    const workingDays = days.filter((day) => day.isWorkingDay).length
    return setting.dailyPomoLimit * workingDays
  }

  private async loadAssignedTasks(
    user: User,
    from: DateTime,
    to: DateTime,
    projectId: number | null
  ): Promise<Task[]> {
    const query = Task.query()
      .where('user_id', user.id)
      .whereHas('assignments', (assignments) => {
        assignments.whereBetween('assigned_on', [from.toISODate()!, to.toISODate()!])
      })
      .preload('project')
      .preload('assignments')
      .preload('children', (children) => {
        children.preload('project').orderBy('sort_order', 'asc').orderBy('id', 'asc')
      })
      .orderBy('sort_order', 'asc')
      .orderBy('id', 'asc')

    if (projectId) {
      query.where('project_id', projectId)
    }

    return query
  }

  private buildDays(
    from: DateTime,
    to: DateTime,
    tasks: Task[],
    workingDays: Weekday[]
  ): CalendarDay[] {
    const days: CalendarDay[] = []
    let cursor = from

    while (cursor <= to) {
      const iso = cursor.toISODate()!
      const weekday = cursor.toJSDate().getUTCDay() as Weekday
      const dayTasks = tasks.filter((task) =>
        task.assignments.some((assignment) => assignment.assignedOn.toISODate() === iso)
      )

      days.push({
        date: iso,
        weekday,
        isWorkingDay: workingDays.includes(weekday),
        used: this.sumUsed(dayTasks),
        tasks: dayTasks,
      })

      cursor = cursor.plus({ days: 1 })
    }

    return days
  }

  private sumUsed(tasks: Task[]): number {
    const assignedIds = new Set(tasks.map((task) => task.id))
    return tasks
      .filter((task) => task.parentId === null || !assignedIds.has(task.parentId))
      .reduce((sum, task) => sum + task.estimatedPomodoros, 0)
  }
}
