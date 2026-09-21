import { PUBLIC_API_URL } from '$env/static/public'
import type { Envelope } from '$lib/types'

export class ApiError extends Error {
  status: number
  code: string | null

  constructor(message: string, status: number, code: string | null) {
    super(message)
    this.status = status
    this.code = code
  }
}

function getToken(): string | null {
  if (typeof localStorage === 'undefined') {
    return null
  }
  return localStorage.getItem('taskcal.token')
}

export function setToken(token: string | null): void {
  if (typeof localStorage === 'undefined') {
    return
  }
  if (token) {
    localStorage.setItem('taskcal.token', token)
  } else {
    localStorage.removeItem('taskcal.token')
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...init,
    headers,
  })

  const payload = (await response.json().catch(() => ({}))) as Envelope<T> & {
    message?: string
    code?: string
  }

  if (!response.ok) {
    throw new ApiError(
      payload.message ?? 'خطای پیش‌بینی‌نشده',
      response.status,
      payload.code ?? null,
    )
  }

  return (payload.data ?? payload) as T
}
