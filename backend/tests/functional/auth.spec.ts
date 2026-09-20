import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth', (group) => {
  group.each.setup(() => testUtils.db().migrate())
  test('registers a user and returns a token', async ({ client, assert }) => {
    const response = await client.post('/api/v1/auth/register').json({
      fullName: 'آرمین',
      email: 'armin@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    response.assertStatus(200)
    assert.equal(response.body().data.user.email, 'armin@example.com')
    assert.equal(response.body().data.user.fullName, 'آرمین')
    assert.isString(response.body().data.token)
    assert.isUndefined(response.body().data.user.password)
  })

  test('creates default settings on register', async ({ client, assert }) => {
    const signup = await client.post('/api/v1/auth/register').json({
      fullName: 'آرمین',
      email: 'settings@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    const response = await client
      .get('/api/v1/settings')
      .header('Authorization', `Bearer ${signup.body().data.token}`)

    response.assertStatus(200)
    assert.equal(response.body().data.dailyPomoLimit, 10)
    assert.equal(response.body().data.pomoDurationMinutes, 25)
    assert.deepEqual(response.body().data.workingDays, [6, 0, 1, 2, 3])
    assert.equal(response.body().data.weeklyCapacity, 50)
    assert.equal(response.body().data.monthlyCapacity, 200)
  })

  test('rejects duplicate email', async ({ client }) => {
    const payload = {
      fullName: 'آرمین',
      email: 'dup@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    }

    await client.post('/api/v1/auth/register').json(payload)
    const response = await client.post('/api/v1/auth/register').json(payload)
    response.assertStatus(422)
  })

  test('rejects short password', async ({ client }) => {
    const response = await client.post('/api/v1/auth/register').json({
      fullName: 'آرمین',
      email: 'short@example.com',
      password: '123',
      passwordConfirmation: '123',
    })

    response.assertStatus(422)
  })

  test('logs in with valid credentials', async ({ client, assert }) => {
    await client.post('/api/v1/auth/register').json({
      fullName: 'آرمین',
      email: 'login@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    const response = await client.post('/api/v1/auth/login').json({
      email: 'login@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.equal(response.body().data.user.email, 'login@example.com')
    assert.isString(response.body().data.token)
  })

  test('rejects invalid credentials', async ({ client }) => {
    await client.post('/api/v1/auth/register').json({
      fullName: 'آرمین',
      email: 'badlogin@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    const response = await client.post('/api/v1/auth/login').json({
      email: 'badlogin@example.com',
      password: 'wrong-password',
    })

    response.assertStatus(400)
  })

  test('returns the current profile for an authenticated user', async ({ client, assert }) => {
    const signup = await client.post('/api/v1/auth/register').json({
      fullName: 'آرمین',
      email: 'me@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    const response = await client
      .get('/api/v1/account/profile')
      .header('Authorization', `Bearer ${signup.body().data.token}`)

    response.assertStatus(200)
    assert.equal(response.body().data.email, 'me@example.com')
  })

  test('rejects profile access without a token', async ({ client }) => {
    const response = await client.get('/api/v1/account/profile')
    response.assertStatus(401)
  })
})
