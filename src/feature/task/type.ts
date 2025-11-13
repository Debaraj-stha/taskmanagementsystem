export interface User {
  id?: string
  username: string
  email?: string
  avatarUrl?: string
}

export interface Subtask {
  id?: string
  sub_title: string
  sub_description?: string
  // status?: 'pending' | 'in progress' | 'completed'
  start_date?: Date
  end_date?: Date      // users responsible for the subtask
  assigned_to?: string[]   // optional cached names
  parent_task?:string
}

export interface Task {
  id?: string
  title: string
  description: string
  status?: 'pending' | 'in progress' | 'completed'
  start_date?: Date
  due_date?: Date

  createdBy?: User
  task_members: User[]
  assigned_names?: string[]

  subtasks?: Subtask[]        // each subtask can have its own assignees
}
     export type buttons = "all" | "completed" | "pending"|"in progress"