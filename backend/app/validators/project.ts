import vine from '@vinejs/vine'

export const createProjectValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(120),
  color: vine
    .string()
    .trim()
    .maxLength(16)
    .regex(/^#([0-9a-fA-F]{6})$/),
})

export const updateProjectValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(120).optional(),
  color: vine
    .string()
    .trim()
    .maxLength(16)
    .regex(/^#([0-9a-fA-F]{6})$/)
    .optional(),
})
