import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/user'
import UserTransformer from '#transformers/user_transformer'
import AuthService from '#services/auth_service'

export default class AccessTokensController {
  private authService = new AuthService()

  async store({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const { user, token } = await this.authService.login(email, password)

    return serialize({
      user: UserTransformer.transform(user),
      token,
    })
  }

  async destroy({ auth }: HttpContext) {
    await this.authService.logout(auth.getUserOrFail())
    return {
      message: 'Logged out successfully',
    }
  }
}
