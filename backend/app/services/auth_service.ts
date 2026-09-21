import User from '#models/user'
import type { AccessToken } from '@adonisjs/auth/access_tokens'
import SettingsService from '#services/settings_service'

export type RegisterPayload = {
  fullName: string | null
  email: string
  password: string
}

export type AuthResult = {
  user: User
  token: string
}

export default class AuthService {
  private settingsService = new SettingsService()

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
    })
    await this.settingsService.getOrCreate(user)
    return this.issueToken(user)
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await User.verifyCredentials(email, password)
    return this.issueToken(user)
  }

  async logout(user: User): Promise<void> {
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }
  }

  private async issueToken(user: User): Promise<AuthResult> {
    const token: AccessToken = await User.accessTokens.create(user)
    return {
      user,
      token: token.value!.release(),
    }
  }
}
