import { BaseTransformer } from '@adonisjs/core/transformers'
import type { CalendarResult } from '#services/calendar_service'
import { toTaskJson } from '#transformers/task_transformer'

export default class CalendarTransformer extends BaseTransformer<CalendarResult> {
  toObject() {
    return {
      view: this.resource.view,
      from: this.resource.from,
      to: this.resource.to,
      capacity: this.resource.capacity,
      days: this.resource.days.map((day) => ({
        date: day.date,
        weekday: day.weekday,
        isWorkingDay: day.isWorkingDay,
        used: day.used,
        tasks: day.tasks.map((task) => toTaskJson(task)),
      })),
    }
  }
}
