import { DateTime } from 'luxon'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Project from '#models/project'
import Task from '#models/task'
import TaskAssignment from '#models/task_assignment'
import SettingsService from '#services/settings_service'
import type { TaskPriority } from '#models/task'

type ChildSeed = {
  title: string
  estimatedPomodoros: number
  isCompleted: boolean
}

type TaskSeed = {
  title: string
  project: string
  priority: TaskPriority
  estimatedPomodoros: number
  assignedOn: DateTime | null
  isCompleted?: boolean
  children: ChildSeed[]
}

export default class extends BaseSeeder {
  async run() {
    const settingsService = new SettingsService()

    const user = await User.updateOrCreate(
      { email: 'demo@example.com' },
      {
        fullName: 'آرمین',
        email: 'demo@example.com',
        password: 'password123',
      }
    )
    await settingsService.getOrCreate(user)

    const colors: Record<string, string> = {
      رزینو: '#8b5cf6',
      شخصی: '#14b8a6',
      CTIP: '#3b82f6',
      یادگیری: '#f59e0b',
    }

    const projects: Record<string, Project> = {}
    let sortOrder = 0
    for (const [name, color] of Object.entries(colors)) {
      projects[name] = await Project.updateOrCreate(
        { userId: user.id, name },
        { userId: user.id, name, color, sortOrder }
      )
      sortOrder += 1
    }

    const today = DateTime.local().startOf('day')
    const daysSinceSaturday = (today.weekday + 1) % 7
    const saturday = today.minus({ days: daysSinceSaturday })

    const catalog: TaskSeed[] = [
      {
        title: 'طراحی UI',
        project: 'رزینو',
        priority: 1,
        estimatedPomodoros: 4,
        assignedOn: today,
        children: [
          { title: 'وایرفریم صفحات اصلی', estimatedPomodoros: 2, isCompleted: true },
          { title: 'کامپوننت‌های مشترک', estimatedPomodoros: 1, isCompleted: false },
          { title: 'بازبینی با تیم', estimatedPomodoros: 1, isCompleted: false },
        ],
      },
      {
        title: 'جلسه تیم',
        project: 'CTIP',
        priority: 2,
        estimatedPomodoros: 2,
        assignedOn: today,
        children: [
          { title: 'آماده‌سازی دستور جلسه', estimatedPomodoros: 1, isCompleted: true },
          { title: 'صورت‌جلسه', estimatedPomodoros: 1, isCompleted: true },
        ],
      },
      {
        title: 'نوشتن گزارش',
        project: 'CTIP',
        priority: 3,
        estimatedPomodoros: 3,
        assignedOn: today,
        children: [],
      },
      {
        title: 'ورزش',
        project: 'شخصی',
        priority: 4,
        estimatedPomodoros: 1,
        assignedOn: saturday,
        children: [],
      },
      {
        title: 'مرور ایمیل‌ها',
        project: 'شخصی',
        priority: 3,
        estimatedPomodoros: 1,
        assignedOn: saturday.plus({ days: 2 }),
        children: [],
      },
      {
        title: 'برنامه‌ریزی اسپرینت',
        project: 'CTIP',
        priority: 2,
        estimatedPomodoros: 2,
        assignedOn: saturday.plus({ days: 2 }),
        children: [],
      },
      {
        title: 'ویتامین',
        project: 'شخصی',
        priority: 4,
        estimatedPomodoros: 1,
        assignedOn: saturday.minus({ days: 7 }),
        isCompleted: true,
        children: [],
      },
      {
        title: 'گزارش هفتگی',
        project: 'CTIP',
        priority: 3,
        estimatedPomodoros: 2,
        assignedOn: saturday.minus({ days: 5 }),
        children: [],
      },
      {
        title: 'ایمیل مشتریان',
        project: 'رزینو',
        priority: 2,
        estimatedPomodoros: 1,
        assignedOn: saturday.plus({ days: 1 }),
        isCompleted: true,
        children: [],
      },
      {
        title: 'مطالعه مستندات',
        project: 'یادگیری',
        priority: 3,
        estimatedPomodoros: 2,
        assignedOn: saturday.plus({ days: 3 }),
        children: [],
      },
      {
        title: 'دمو محصول',
        project: 'رزینو',
        priority: 1,
        estimatedPomodoros: 3,
        assignedOn: saturday.plus({ days: 4 }),
        children: [],
      },
      {
        title: 'ایده محصول',
        project: 'رزینو',
        priority: 2,
        estimatedPomodoros: 1,
        assignedOn: null,
        children: [],
      },
      {
        title: 'مرور مقالات',
        project: 'یادگیری',
        priority: 4,
        estimatedPomodoros: 1,
        assignedOn: null,
        children: [],
      },
    ]

    for (const item of catalog) {
      const task = await Task.updateOrCreate(
        { userId: user.id, title: item.title, parentId: null },
        {
          userId: user.id,
          projectId: projects[item.project].id,
          parentId: null,
          title: item.title,
          priority: item.priority,
          estimatedPomodoros: item.estimatedPomodoros,
          isCompleted: item.isCompleted ?? false,
          sortOrder: 0,
        }
      )

      if (item.assignedOn) {
        await TaskAssignment.updateOrCreate(
          { taskId: task.id, assignedOn: item.assignedOn },
          { taskId: task.id, assignedOn: item.assignedOn }
        )
      }

      for (const [index, child] of item.children.entries()) {
        await Task.updateOrCreate(
          { userId: user.id, title: child.title, parentId: task.id },
          {
            userId: user.id,
            projectId: projects[item.project].id,
            parentId: task.id,
            title: child.title,
            priority: item.priority,
            estimatedPomodoros: child.estimatedPomodoros,
            isCompleted: child.isCompleted,
            sortOrder: index,
          }
        )
      }
    }
  }
}
