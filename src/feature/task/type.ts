export interface User {
  id?: string
  username: string
  email?: string
  avatarUrl?: string
}

export interface Subtask {
  id?: string
  title: string
  description?: string
  status?: 'pending' | 'in progress' | 'completed'
  start_date?: Date
  due_date?: Date

  assignedUsers: User[]       // users responsible for the subtask
  assigned_names?: string[]   // optional cached names
}

export interface Task {
  id?: string
  title: string
  description: string
  status?: 'pending' | 'in progress' | 'completed'
  start_date?: Date
  due_date?: Date

  createdBy?: User
  assignedUsers: User[]
  assigned_names?: string[]

  subtasks?: Subtask[]        // each subtask can have its own assignees
}
