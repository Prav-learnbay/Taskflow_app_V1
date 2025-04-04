export interface Task {
  id: string
  title: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
  dueDate: string
  collaborator: string
  createdAt: string
  completedAt: string | null
  isUrgent: boolean
  isImportant: boolean
  category: string
}

