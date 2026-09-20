import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Task from '#models/task'
import TaskAssignment from '#models/task_assignment'
import type User from '#models/user'
import { ResourceNotFoundError } from '#exceptions/domain_errors'
import ProjectService from '#services/project_service'

export type CreateTaskPayload = {
  projectId: number
  parentId?: number | null
  title: string
  priority: 1 | 2 | 3 | 4
  estimatedPomodoros: number
  assignedOn?: string | null
}

export type UpdateTaskPayload = {
  projectId?: number
  title?: string
  priority?: 1 | 2 | 3 | 4
  estimatedPomodoros?: number
  isCompleted?: boolean
}

export type TaskListFilters = {
  projectId?: number
  assignedOn?: string
  unassigned?: boolean
  parentId?: number | null
}

export default class TaskService {
  private projectService = new ProjectService()

  async list(user: User, filters: TaskListFilters): Promise<Task[]> {
    const query = Task.query()
      .where('user_id', user.id)
      .preload('project')
      .preload('assignments')
      .preload('children', (children) => {
        children.preload('project').orderBy('sort_order', 'asc').orderBy('id', 'asc')
      })
      .orderBy('sort_order', 'asc')
      .orderBy('id', 'asc')

    if (filters.projectId) {
      query.where('project_id', filters.projectId)
    }

    if (filters.parentId !== undefined) {
      if (filters.parentId === null) {
        query.whereNull('parent_id')
      } else {
        query.where('parent_id', filters.parentId)
      }
    }

    if (filters.assignedOn) {
      query.whereHas('assignments', (assignments) => {
        assignments.where('assigned_on', filters.assignedOn!)
      })
    }

    if (filters.unassigned) {
      query.whereDoesntHave('assignments', () => {})
      query.whereNull('parent_id')
    }

    return query
  }

  async findOwned(user: User, id: number): Promise<Task> {
    const task = await Task.query()
      .where('user_id', user.id)
      .where('id', id)
      .preload('project')
      .preload('assignments')
      .preload('children', (children) => {
        children.preload('project').orderBy('sort_order', 'asc').orderBy('id', 'asc')
      })
      .first()

    if (!task) {
      throw new ResourceNotFoundError('Task')
    }

    return task
  }

  async create(user: User, payload: CreateTaskPayload): Promise<Task> {
    await this.projectService.findOwned(user, payload.projectId)

    if (payload.parentId) {
      const parent = await this.findOwned(user, payload.parentId)
      if (parent.projectId !== payload.projectId) {
        throw new ResourceNotFoundError('Task')
      }
    }

    const task = await db.transaction(async (trx) => {
      const last = await Task.query({ client: trx })
        .where('user_id', user.id)
        .where('project_id', payload.projectId)
        .if(payload.parentId, (q) => q.where('parent_id', payload.parentId!))
        .if(!payload.parentId, (q) => q.whereNull('parent_id'))
        .orderBy('sort_order', 'desc')
        .first()

      const created = await Task.create(
        {
          userId: user.id,
          projectId: payload.projectId,
          parentId: payload.parentId || null,
          title: payload.title,
          priority: payload.priority,
          estimatedPomodoros: payload.estimatedPomodoros,
          isCompleted: false,
          sortOrder: last ? last.sortOrder + 1 : 0,
        },
        { client: trx }
      )

      if (payload.assignedOn) {
        await TaskAssignment.create(
          {
            taskId: created.id,
            assignedOn: DateTime.fromISO(payload.assignedOn),
          },
          { client: trx }
        )
      }

      return created
    })

    return this.findOwned(user, task.id)
  }

  async update(user: User, id: number, payload: UpdateTaskPayload): Promise<Task> {
    const task = await this.findOwned(user, id)

    if (payload.projectId && payload.projectId !== task.projectId) {
      await this.projectService.findOwned(user, payload.projectId)
    }

    task.merge({
      projectId: payload.projectId ?? task.projectId,
      title: payload.title ?? task.title,
      priority: payload.priority ?? task.priority,
      estimatedPomodoros: payload.estimatedPomodoros ?? task.estimatedPomodoros,
      isCompleted: payload.isCompleted ?? task.isCompleted,
    })
    await task.save()
    return this.findOwned(user, task.id)
  }

  async destroy(user: User, id: number): Promise<void> {
    const task = await this.findOwned(user, id)
    await task.delete()
  }

  async assign(user: User, id: number, assignedOn: string): Promise<Task> {
    const task = await this.findOwned(user, id)
    const existing = await TaskAssignment.query()
      .where('task_id', task.id)
      .where('assigned_on', assignedOn)
      .first()

    if (!existing) {
      await TaskAssignment.create({
        taskId: task.id,
        assignedOn: DateTime.fromISO(assignedOn),
      })
    }

    return this.findOwned(user, task.id)
  }

  async unassign(user: User, id: number, assignedOn: string): Promise<Task> {
    const task = await this.findOwned(user, id)
    await TaskAssignment.query().where('task_id', task.id).where('assigned_on', assignedOn).delete()
    return this.findOwned(user, task.id)
  }
}
