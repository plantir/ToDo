import type { HttpContext } from '@adonisjs/core/http'
import ProjectService from '#services/project_service'
import { createProjectValidator, updateProjectValidator } from '#validators/project'
import ProjectTransformer from '#transformers/project_transformer'

export default class ProjectsController {
  private projectService = new ProjectService()

  async index({ auth, serialize }: HttpContext) {
    const user = auth.user!
    const projects = await this.projectService.list(user)
    return serialize.withoutWrapping({
      data: projects.map((project) => ({
        id: project.id,
        name: project.name,
        color: project.color,
        sortOrder: project.sortOrder,
      })),
    })
  }

  async store({ auth, request, serialize, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createProjectValidator)
    const project = await this.projectService.create(user, payload)
    response.status(201)
    return serialize(ProjectTransformer.transform(project))
  }

  async update({ auth, request, params, serialize }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(updateProjectValidator)
    const project = await this.projectService.update(user, Number(params.id), payload)
    return serialize(ProjectTransformer.transform(project))
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    await this.projectService.destroy(user, Number(params.id))
    return response.noContent()
  }
}
