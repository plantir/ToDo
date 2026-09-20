import vine from '@vinejs/vine'

export const CALENDAR_VIEWS = ['daily', 'weekly', 'monthly'] as const

export const calendarQueryValidator = vine.create({
  view: vine.enum(CALENDAR_VIEWS),
  date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectId: vine.number().positive().optional(),
})
