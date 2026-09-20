import type { HttpContext } from '@adonisjs/core/http'
import { signupValidator } from '#validators/user'
import UserTransformer from '#transformers/user_transformer'
import AuthService from '#services/auth_service'

export default class NewAccountController {
  private authService = new AuthService()

  async store({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const { user, token } = await this.authService.register({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
    })

    return serialize({
      user: UserTransformer.transform(user),
      token,
    })
  }
}
