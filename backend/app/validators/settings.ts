import vine from '@vinejs/vine'
import { WEEKDAY_VALUES } from '#models/user_setting'

export const updateSettingsValidator = vine.create({
  pomoDurationMinutes: vine.number().min(1).max(120).optional(),
  shortBreakMinutes: vine.number().min(1).max(60).optional(),
  longBreakAfter: vine.number().min(1).max(12).optional(),
  longBreakMinutes: vine.number().min(1).max(90).optional(),
  dailyPomoLimit: vine.number().min(1).max(30).optional(),
  workingDays: vine.array(vine.enum(WEEKDAY_VALUES)).minLength(1).maxLength(7).optional(),
})
