import vine from '@vinejs/vine'
import { TASK_PRIORITIES } from '#models/task'

export const createTaskValidator = vine.create({
  projectId: vine.number().positive(),
  parentId: vine.number().positive().optional(),
  title: vine.string().trim().minLength(1).maxLength(200),
  priority: vine.enum(TASK_PRIORITIES),
  estimatedPomodoros: vine.number().min(1).max(40),
  assignedOn: vine
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
})

export const updateTaskValidator = vine.create({
  projectId: vine.number().positive().optional(),
  title: vine.string().trim().minLength(1).maxLength(200).optional(),
  priority: vine.enum(TASK_PRIORITIES).optional(),
  estimatedPomodoros: vine.number().min(1).max(40).optional(),
  isCompleted: vine.boolean().optional(),
})

export const listTasksValidator = vine.create({
  projectId: vine.number().positive().optional(),
  assignedOn: vine
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  unassigned: vine.boolean().optional(),
  parentId: vine.number().positive().optional(),
  limit: vine.number().min(1).max(100).optional(),
})

export const assignTaskValidator = vine.create({
  date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})
