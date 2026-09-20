/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

const ProjectsController = () => import('#controllers/projects_controller')
const TasksController = () => import('#controllers/tasks_controller')
const SettingsController = () => import('#controllers/settings_controller')
const CalendarController = () => import('#controllers/calendar_controller')

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store']).as('signup')
        router.post('register', [controllers.NewAccount, 'store']).as('register')
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [ProjectsController, 'index'])
        router.post('/', [ProjectsController, 'store'])
        router.patch('/:id', [ProjectsController, 'update'])
        router.delete('/:id', [ProjectsController, 'destroy'])
      })
      .prefix('projects')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [TasksController, 'index'])
        router.post('/', [TasksController, 'store'])
        router.get('/:id', [TasksController, 'show'])
        router.patch('/:id', [TasksController, 'update'])
        router.delete('/:id', [TasksController, 'destroy'])
        router.post('/:id/assignments', [TasksController, 'assign'])
        router.delete('/:id/assignments/:date', [TasksController, 'unassign'])
      })
      .prefix('tasks')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [SettingsController, 'show'])
        router.patch('/', [SettingsController, 'update'])
      })
      .prefix('settings')
      .use(middleware.auth())

    router.get('/calendar', [CalendarController, 'show']).use(middleware.auth())
  })
  .prefix('/api/v1')
