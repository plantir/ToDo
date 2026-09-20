import Project from '#models/project'
import type User from '#models/user'
import { ResourceNotFoundError } from '#exceptions/domain_errors'

export type CreateProjectPayload = {
  name: string
  color: string
}

export type UpdateProjectPayload = {
  name?: string
  color?: string
}

export default class ProjectService {
  async list(user: User): Promise<Project[]> {
    return Project.query()
      .where('user_id', user.id)
      .orderBy('sort_order', 'asc')
      .orderBy('id', 'asc')
  }

  async create(user: User, payload: CreateProjectPayload): Promise<Project> {
    const last = await Project.query()
      .where('user_id', user.id)
      .orderBy('sort_order', 'desc')
      .first()
    return Project.create({
      userId: user.id,
      name: payload.name,
      color: payload.color,
      sortOrder: last ? last.sortOrder + 1 : 0,
    })
  }

  async findOwned(user: User, id: number): Promise<Project> {
    const project = await Project.query().where('user_id', user.id).where('id', id).first()
    if (!project) {
      throw new ResourceNotFoundError('Project')
    }
    return project
  }

  async update(user: User, id: number, payload: UpdateProjectPayload): Promise<Project> {
    const project = await this.findOwned(user, id)
    project.merge({
      name: payload.name ?? project.name,
      color: payload.color ?? project.color,
    })
    await project.save()
    return project
  }

  async destroy(user: User, id: number): Promise<void> {
    const project = await this.findOwned(user, id)
    await project.delete()
  }
}
