import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Task from '#models/task'

export default class TaskAssignment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare taskId: number

  @column.date()
  declare assignedOn: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>
}
