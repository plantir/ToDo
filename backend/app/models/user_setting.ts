import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export const WEEKDAY_VALUES = [0, 1, 2, 3, 4, 5, 6] as const
export type Weekday = (typeof WEEKDAY_VALUES)[number]

export const DEFAULT_SETTINGS = {
  pomoDurationMinutes: 25,
  shortBreakMinutes: 5,
  longBreakAfter: 5,
  longBreakMinutes: 15,
  dailyPomoLimit: 10,
  workingDays: [6, 0, 1, 2, 3] as Weekday[],
}

export default class UserSetting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare pomoDurationMinutes: number

  @column()
  declare shortBreakMinutes: number

  @column()
  declare longBreakAfter: number

  @column()
  declare longBreakMinutes: number

  @column()
  declare dailyPomoLimit: number

  @column({
    prepare: (value: Weekday[]) => JSON.stringify(value),
    consume: (value: Weekday[] | string): Weekday[] => {
      if (Array.isArray(value)) {
        return value
      }
      return JSON.parse(value) as Weekday[]
    },
  })
  declare workingDays: Weekday[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
