import { test } from '@japa/runner'
import type { ApiClient } from '@japa/api-client'
import testUtils from '@adonisjs/core/services/test_utils'
import { dataOf } from '../helpers/envelope.js'

type AuthPayload = {
  token: string
}

type ProjectPayload = {
  id: number
}

type TaskPayload = {
  id: number
  title: string
  priority: number
  assignedDates: string[]
  children: Array<{ title: string }>
}

type CalendarPayload = {
  capacity: {
    used: number
    limit: number
    remaining: number
    overBy: number
    status: 'under' | 'over'
  }
}

async function register(client: ApiClient) {
  const email = `user-${Math.random().toString(16).slice(2)}@example.com`
  const response = await client.post('/api/v1/auth/register').json({
    fullName: 'آرمین',
    email,
    password: 'password123',
    passwordConfirmation: 'password123',
  })

  return {
    token: dataOf<AuthPayload>(response).token,
    email,
  }
}

test.group('Tasks', (group) => {
  group.each.setup(() => testUtils.db().migrate())
  test('creates a project and a nested task assigned to a day', async ({ client, assert }) => {
    const { token } = await register(client)
    const auth = { Authorization: `Bearer ${token}` }

    const projectResponse = await client.post('/api/v1/projects').headers(auth).json({
      name: 'رزینو',
      color: '#8b5cf6',
    })
    projectResponse.assertStatus(201)
    const projectId = dataOf<ProjectPayload>(projectResponse).id

    const taskResponse = await client.post('/api/v1/tasks').headers(auth).json({
      projectId,
      title: 'طراحی UI',
      priority: 1,
      estimatedPomodoros: 4,
      assignedOn: '2026-09-11',
    })
    taskResponse.assertStatus(201)
    const task = dataOf<TaskPayload>(taskResponse)
    assert.equal(task.title, 'طراحی UI')
    assert.equal(task.priority, 1)
    assert.include(task.assignedDates, '2026-09-11')

    const subtaskResponse = await client.post('/api/v1/tasks').headers(auth).json({
      projectId,
      parentId: task.id,
      title: 'وایرفریم صفحات اصلی',
      priority: 1,
      estimatedPomodoros: 2,
    })
    subtaskResponse.assertStatus(201)

    const dayTasks = await client
      .get('/api/v1/tasks')
      .headers(auth)
      .qs({ assignedOn: '2026-09-11' })
    dayTasks.assertStatus(200)
    const listed = dataOf<TaskPayload[]>(dayTasks)
    assert.lengthOf(listed, 1)
    assert.equal(listed[0].children[0].title, 'وایرفریم صفحات اصلی')
  })

  test('hides other users tasks with a not found response', async ({ client }) => {
    const owner = await register(client)
    const stranger = await register(client)

    const project = await client
      .post('/api/v1/projects')
      .header('Authorization', `Bearer ${owner.token}`)
      .json({ name: 'شخصی', color: '#14b8a6' })

    const task = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${owner.token}`)
      .json({
        projectId: dataOf<ProjectPayload>(project).id,
        title: 'ورزش',
        priority: 4,
        estimatedPomodoros: 1,
      })

    const response = await client
      .get(`/api/v1/tasks/${dataOf<TaskPayload>(task).id}`)
      .header('Authorization', `Bearer ${stranger.token}`)

    response.assertStatus(404)
    response.assertBodyContains({ code: 'E_NOT_FOUND' })
  })

  test('reports under and over daily pomodoro capacity', async ({ client, assert }) => {
    const { token } = await register(client)
    const auth = { Authorization: `Bearer ${token}` }

    const project = await client.post('/api/v1/projects').headers(auth).json({
      name: 'CTIP',
      color: '#3b82f6',
    })
    const projectId = dataOf<ProjectPayload>(project).id

    await client.post('/api/v1/tasks').headers(auth).json({
      projectId,
      title: 'جلسه تیم',
      priority: 2,
      estimatedPomodoros: 7,
      assignedOn: '2026-09-11',
    })

    const under = await client.get('/api/v1/calendar').headers(auth).qs({
      view: 'daily',
      date: '2026-09-11',
    })
    under.assertStatus(200)
    const underCapacity = dataOf<CalendarPayload>(under).capacity
    assert.equal(underCapacity.used, 7)
    assert.equal(underCapacity.limit, 10)
    assert.equal(underCapacity.remaining, 3)
    assert.equal(underCapacity.status, 'under')

    await client.post('/api/v1/tasks').headers(auth).json({
      projectId,
      title: 'نوشتن گزارش',
      priority: 3,
      estimatedPomodoros: 5,
      assignedOn: '2026-09-11',
    })

    const over = await client.get('/api/v1/calendar').headers(auth).qs({
      view: 'daily',
      date: '2026-09-11',
    })
    over.assertStatus(200)
    const overCapacity = dataOf<CalendarPayload>(over).capacity
    assert.equal(overCapacity.used, 12)
    assert.equal(overCapacity.overBy, 2)
    assert.equal(overCapacity.status, 'over')
  })

  test('does not double-count parent estimates when children are also loaded', async ({
    client,
    assert,
  }) => {
    const { token } = await register(client)
    const auth = { Authorization: `Bearer ${token}` }
    const project = await client.post('/api/v1/projects').headers(auth).json({
      name: 'رزینو',
      color: '#8b5cf6',
    })
    const projectId = dataOf<ProjectPayload>(project).id

    const parent = await client.post('/api/v1/tasks').headers(auth).json({
      projectId,
      title: 'طراحی UI',
      priority: 1,
      estimatedPomodoros: 4,
      assignedOn: '2026-09-11',
    })

    await client
      .post('/api/v1/tasks')
      .headers(auth)
      .json({
        projectId,
        parentId: dataOf<TaskPayload>(parent).id,
        title: 'وایرفریم',
        priority: 1,
        estimatedPomodoros: 2,
        assignedOn: '2026-09-11',
      })

    const calendar = await client.get('/api/v1/calendar').headers(auth).qs({
      view: 'daily',
      date: '2026-09-11',
    })

    assert.equal(dataOf<CalendarPayload>(calendar).capacity.used, 4)
  })
})
