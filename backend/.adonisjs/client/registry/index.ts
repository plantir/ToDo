/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.signup': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.signup']['types'],
  },
  'auth.register': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register',
    tokens: [{"old":"/api/v1/auth/register","type":0,"val":"api","end":""},{"old":"/api/v1/auth/register","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/register","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/projects',
    tokens: [{"old":"/api/v1/projects","type":0,"val":"api","end":""},{"old":"/api/v1/projects","type":0,"val":"v1","end":""},{"old":"/api/v1/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/api/v1/projects',
    tokens: [{"old":"/api/v1/projects","type":0,"val":"api","end":""},{"old":"/api/v1/projects","type":0,"val":"v1","end":""},{"old":"/api/v1/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.store']['types'],
  },
  'projects.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/projects/:id',
    tokens: [{"old":"/api/v1/projects/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/projects/:id',
    tokens: [{"old":"/api/v1/projects/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.destroy']['types'],
  },
  'tasks.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/tasks',
    tokens: [{"old":"/api/v1/tasks","type":0,"val":"api","end":""},{"old":"/api/v1/tasks","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['tasks.index']['types'],
  },
  'tasks.store': {
    methods: ["POST"],
    pattern: '/api/v1/tasks',
    tokens: [{"old":"/api/v1/tasks","type":0,"val":"api","end":""},{"old":"/api/v1/tasks","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['tasks.store']['types'],
  },
  'tasks.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/tasks/:id',
    tokens: [{"old":"/api/v1/tasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.show']['types'],
  },
  'tasks.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/tasks/:id',
    tokens: [{"old":"/api/v1/tasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.update']['types'],
  },
  'tasks.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/tasks/:id',
    tokens: [{"old":"/api/v1/tasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.destroy']['types'],
  },
  'tasks.assign': {
    methods: ["POST"],
    pattern: '/api/v1/tasks/:id/assignments',
    tokens: [{"old":"/api/v1/tasks/:id/assignments","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/:id/assignments","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/:id/assignments","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/:id/assignments","type":1,"val":"id","end":""},{"old":"/api/v1/tasks/:id/assignments","type":0,"val":"assignments","end":""}],
    types: placeholder as Registry['tasks.assign']['types'],
  },
  'tasks.unassign': {
    methods: ["DELETE"],
    pattern: '/api/v1/tasks/:id/assignments/:date',
    tokens: [{"old":"/api/v1/tasks/:id/assignments/:date","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/:id/assignments/:date","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/:id/assignments/:date","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/:id/assignments/:date","type":1,"val":"id","end":""},{"old":"/api/v1/tasks/:id/assignments/:date","type":0,"val":"assignments","end":""},{"old":"/api/v1/tasks/:id/assignments/:date","type":1,"val":"date","end":""}],
    types: placeholder as Registry['tasks.unassign']['types'],
  },
  'settings.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/settings',
    tokens: [{"old":"/api/v1/settings","type":0,"val":"api","end":""},{"old":"/api/v1/settings","type":0,"val":"v1","end":""},{"old":"/api/v1/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings.show']['types'],
  },
  'settings.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/settings',
    tokens: [{"old":"/api/v1/settings","type":0,"val":"api","end":""},{"old":"/api/v1/settings","type":0,"val":"v1","end":""},{"old":"/api/v1/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings.update']['types'],
  },
  'calendar.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/calendar',
    tokens: [{"old":"/api/v1/calendar","type":0,"val":"api","end":""},{"old":"/api/v1/calendar","type":0,"val":"v1","end":""},{"old":"/api/v1/calendar","type":0,"val":"calendar","end":""}],
    types: placeholder as Registry['calendar.show']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
