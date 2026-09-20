import type Project from '#models/project'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ProjectTransformer extends BaseTransformer<Project> {
  toObject() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      color: this.resource.color,
      sortOrder: this.resource.sortOrder,
    }
  }
}
