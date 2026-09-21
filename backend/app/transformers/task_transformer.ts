import type Task from '#models/task'
import { BaseTransformer } from '@adonisjs/core/transformers'

type TaskJson = {
  id: number
  projectId: number
  parentId: number | null
  title: string
  priority: number
  estimatedPomodoros: number
  isCompleted: boolean
  sortOrder: number
  project: { id: number; name: string; color: string; sortOrder: number } | null
  children: TaskJson[]
  assignedDates: (string | null)[]
}

export function toTaskJson(task: Task): TaskJson {
  const project = task.$preloaded.project
    ? {
        id: task.project.id,
        name: task.project.name,
        color: task.project.color,
        sortOrder: task.project.sortOrder,
      }
    : null

  const children = task.$preloaded.children ? task.children.map((child) => toTaskJson(child)) : []

  const assignedDates = task.$preloaded.assignments
    ? task.assignments.map((assignment) => assignment.assignedOn.toISODate())
    : []

  return {
    id: task.id,
    projectId: task.projectId,
    parentId: task.parentId,
    title: task.title,
    priority: task.priority,
    estimatedPomodoros: task.estimatedPomodoros,
    isCompleted: task.isCompleted,
    sortOrder: task.sortOrder,
    project,
    children,
    assignedDates,
  }
}

export default class TaskTransformer extends BaseTransformer<Task> {
  toObject(): TaskJson {
    return toTaskJson(this.resource)
  }
}
