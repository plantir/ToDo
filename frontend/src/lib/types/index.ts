export type Priority = 1 | 2 | 3 | 4
export type CalendarView = 'daily' | 'weekly' | 'monthly'
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type User = {
  id: number
  fullName: string | null
  email: string
  initials: string
}

export type Project = {
  id: number
  name: string
  color: string
  sortOrder: number
}

export type Task = {
  id: number
  projectId: number
  parentId: number | null
  title: string
  priority: Priority
  estimatedPomodoros: number
  isCompleted: boolean
  sortOrder: number
  project: Project | null
  children: Task[]
  assignedDates: string[]
}

export type Settings = {
  pomoDurationMinutes: number
  shortBreakMinutes: number
  longBreakAfter: number
  longBreakMinutes: number
  dailyPomoLimit: number
  workingDays: Weekday[]
  weeklyCapacity: number
  monthlyCapacity: number
}

export type Capacity = {
  used: number
  limit: number
  remaining: number
  overBy: number
  status: 'under' | 'over'
}

export type CalendarDay = {
  date: string
  weekday: Weekday
  isWorkingDay: boolean
  used: number
  tasks: Task[]
}

export type CalendarPayload = {
  view: CalendarView
  from: string
  to: string
  capacity: Capacity
  days: CalendarDay[]
}

export type Envelope<T> = {
  data: T
}
