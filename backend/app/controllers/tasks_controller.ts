import type { HttpContext } from '@adonisjs/core/http'
import TaskService from '#services/task_service'
import {
  assignTaskValidator,
  createTaskValidator,
  listTasksValidator,
  updateTaskValidator,
} from '#validators/task'
import { toTaskJson } from '#transformers/task_transformer'

export default class TasksController {
  private taskService = new TaskService()

  async index({ auth, request, serialize }: HttpContext) {
    const user = auth.user!
    const filters = await request.validateUsing(listTasksValidator, {
      data: request.qs(),
    })
    const tasks = await this.taskService.list(user, filters)
    return serialize.withoutWrapping({ data: tasks.map((task) => toTaskJson(task)) })
  }

  async show({ auth, params, serialize }: HttpContext) {
    const user = auth.user!
    const task = await this.taskService.findOwned(user, Number(params.id))
    return serialize(toTaskJson(task))
  }

  async store({ auth, request, serialize, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createTaskValidator)
    const task = await this.taskService.create(user, {
      ...payload,
      parentId: payload.parentId || null,
      assignedOn: payload.assignedOn || null,
    })
    response.status(201)
    return serialize(toTaskJson(task))
  }

  async update({ auth, request, params, serialize }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(updateTaskValidator)
    const task = await this.taskService.update(user, Number(params.id), payload)
    return serialize(toTaskJson(task))
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    await this.taskService.destroy(user, Number(params.id))
    return response.noContent()
  }

  async assign({ auth, request, params, serialize }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(assignTaskValidator)
    const task = await this.taskService.assign(user, Number(params.id), payload.date)
    return serialize(toTaskJson(task))
  }

  async unassign({ auth, params, serialize }: HttpContext) {
    const user = auth.user!
    const task = await this.taskService.unassign(user, Number(params.id), String(params.date))
    return serialize(toTaskJson(task))
  }
}
