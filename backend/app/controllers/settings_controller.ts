import type { HttpContext } from '@adonisjs/core/http'
import SettingsService from '#services/settings_service'
import { updateSettingsValidator } from '#validators/settings'
import SettingsTransformer from '#transformers/settings_transformer'

export default class SettingsController {
  private settingsService = new SettingsService()

  async show({ auth, serialize }: HttpContext) {
    const setting = await this.settingsService.getOrCreate(auth.user!)
    return serialize(SettingsTransformer.transform(setting))
  }

  async update({ auth, request, serialize }: HttpContext) {
    const payload = await request.validateUsing(updateSettingsValidator)
    const setting = await this.settingsService.update(auth.user!, payload)
    return serialize(SettingsTransformer.transform(setting))
  }
}
