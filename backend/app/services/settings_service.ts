import type User from '#models/user'
import UserSetting, { DEFAULT_SETTINGS, type Weekday } from '#models/user_setting'

export type SettingsPayload = {
  pomoDurationMinutes?: number
  shortBreakMinutes?: number
  longBreakAfter?: number
  longBreakMinutes?: number
  dailyPomoLimit?: number
  workingDays?: Weekday[]
}

export default class SettingsService {
  async getOrCreate(user: User): Promise<UserSetting> {
    const existing = await UserSetting.query().where('user_id', user.id).first()
    if (existing) {
      return existing
    }

    return UserSetting.create({
      userId: user.id,
      ...DEFAULT_SETTINGS,
    })
  }

  async update(user: User, payload: SettingsPayload): Promise<UserSetting> {
    const setting = await this.getOrCreate(user)
    setting.merge({
      pomoDurationMinutes: payload.pomoDurationMinutes ?? setting.pomoDurationMinutes,
      shortBreakMinutes: payload.shortBreakMinutes ?? setting.shortBreakMinutes,
      longBreakAfter: payload.longBreakAfter ?? setting.longBreakAfter,
      longBreakMinutes: payload.longBreakMinutes ?? setting.longBreakMinutes,
      dailyPomoLimit: payload.dailyPomoLimit ?? setting.dailyPomoLimit,
      workingDays: payload.workingDays ?? setting.workingDays,
    })
    await setting.save()
    return setting
  }
}
