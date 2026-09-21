import type { HttpContext } from '@adonisjs/core/http'
import CalendarService from '#services/calendar_service'
import { calendarQueryValidator } from '#validators/calendar'
import CalendarTransformer from '#transformers/calendar_transformer'

export default class CalendarController {
  private calendarService = new CalendarService()

  async show({ auth, request, serialize }: HttpContext) {
    const query = await request.validateUsing(calendarQueryValidator, {
      data: request.qs(),
    })
    const calendar = await this.calendarService.getView(
      auth.user!,
      query.view,
      query.date,
      query.projectId ?? null
    )
    return serialize(CalendarTransformer.transform(calendar))
  }
}
