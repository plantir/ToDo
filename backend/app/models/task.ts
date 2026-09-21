import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Project from '#models/project'
import TaskAssignment from '#models/task_assignment'

export const TASK_PRIORITIES = [1, 2, 3, 4] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare projectId: number

  @column()
  declare parentId: number | null

  @column()
  declare title: string

  @column()
  declare priority: TaskPriority

  @column()
  declare estimatedPomodoros: number

  @column()
  declare isCompleted: boolean

  @column()
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => Task, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Task>

  @hasMany(() => Task, { foreignKey: 'parentId' })
  declare children: HasMany<typeof Task>

  @hasMany(() => TaskAssignment)
  declare assignments: HasMany<typeof TaskAssignment>
}
