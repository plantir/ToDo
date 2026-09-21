import type { Task } from '$lib/types'

type SubtaskHandler = (task: Task) => void

class UiBridge {
  openSubtask: SubtaskHandler | null = $state(null)
}

export const ui = new UiBridge()
