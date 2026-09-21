/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    signup: typeof routes['auth.signup']
    register: typeof routes['auth.register']
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  projects: {
    index: typeof routes['projects.index']
    store: typeof routes['projects.store']
    update: typeof routes['projects.update']
    destroy: typeof routes['projects.destroy']
  }
  tasks: {
    index: typeof routes['tasks.index']
    store: typeof routes['tasks.store']
    show: typeof routes['tasks.show']
    update: typeof routes['tasks.update']
    destroy: typeof routes['tasks.destroy']
    assign: typeof routes['tasks.assign']
    unassign: typeof routes['tasks.unassign']
  }
  settings: {
    show: typeof routes['settings.show']
    update: typeof routes['settings.update']
  }
  calendar: {
    show: typeof routes['calendar.show']
  }
}
