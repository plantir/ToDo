import type UserSetting from '#models/user_setting'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class SettingsTransformer extends BaseTransformer<UserSetting> {
  toObject() {
    return {
      pomoDurationMinutes: this.resource.pomoDurationMinutes,
      shortBreakMinutes: this.resource.shortBreakMinutes,
      longBreakAfter: this.resource.longBreakAfter,
      longBreakMinutes: this.resource.longBreakMinutes,
      dailyPomoLimit: this.resource.dailyPomoLimit,
      workingDays: this.resource.workingDays,
      weeklyCapacity: this.resource.dailyPomoLimit * this.resource.workingDays.length,
      monthlyCapacity: this.resource.dailyPomoLimit * this.resource.workingDays.length * 4,
    }
  }
}
