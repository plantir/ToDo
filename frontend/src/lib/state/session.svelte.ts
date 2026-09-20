import { api, setToken } from '$lib/api/client'
import type { User } from '$lib/types'

class Session {
  user = $state<User | null>(null)
  token = $state<string | null>(null)
  ready = $state(false)

  get isAuthenticated(): boolean {
    return Boolean(this.token && this.user)
  }

  hydrate(): void {
    if (typeof localStorage === 'undefined') {
      this.ready = true
      return
    }
    this.token = localStorage.getItem('taskcal.token')
    this.ready = true
  }

  async bootstrap(): Promise<void> {
    this.hydrate()
    if (!this.token) {
      return
    }
    try {
      this.user = await api<User>('/account/profile')
    } catch {
      this.clear()
    }
  }

  async login(email: string, password: string): Promise<void> {
    const data = await api<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.applyAuth(data.user, data.token)
  }

  async register(fullName: string, email: string, password: string): Promise<void> {
    const data = await api<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName,
        email,
        password,
        passwordConfirmation: password,
      }),
    })
    this.applyAuth(data.user, data.token)
  }

  async logout(): Promise<void> {
    try {
      await api('/account/logout', { method: 'POST' })
    } finally {
      this.clear()
    }
  }

  private applyAuth(user: User, token: string): void {
    this.user = user
    this.token = token
    setToken(token)
  }

  private clear(): void {
    this.user = null
    this.token = null
    setToken(null)
  }
}

export const session = new Session()
