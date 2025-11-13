import React, { useState } from 'react'
import Input from '../../components/ui/Input'
import type { Task, User, Subtask } from './type'
import { useTask } from '../../context/TaskContext'
import PopupMessage from './PopupMessage'

interface CreateEditFormProps {
  isEdit?: boolean
  onClose?: () => void
  id?: string
  isProcessing?: boolean
  setProcessing: (value: boolean) => void
  mode?: 'task' | 'subtask'
}

const CreateEditForm = ({
  isEdit,
  onClose,
  id,
  isProcessing,
  setProcessing,
  mode = 'task',
}: CreateEditFormProps) => {
  const {
    createTask,
    updateTask,
    createSubtask,
    updateSubtask,
    message,
    users,
    task,
    subtask,
    setTask,
    setSubtask,
  } = useTask()

  const [modalOpen, setModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  let current: Task | Subtask = mode === 'task' ? task : subtask
  const setCurrent = (value: Task | Subtask) => {
    if (mode === 'task') {
      setTask(value as Task)
    } else {
      setSubtask(value as Subtask)
    }
  }

  if (modalOpen) {
    return (
      <PopupMessage
        onClose={() => {
          setModalOpen(false)
          onClose?.()
        }}
        message={message}
      />
    )
  }

  // Search users
  const searchUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    if (!value.trim()) {
      setFilteredUsers([])
      return
    }

    const matched = users.filter(u =>
      u.username.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredUsers(matched)
  }

  // Assign user
  const handleAssign = (user: User) => {
    if (mode === 'task') {
      const t = current as Task
      if (t.task_members.some(u => u.username === user.username)) return
      setCurrent({
        ...t,
        task_members: [...t.task_members, { username: user.username }],
      })
    } else {
      const s = current as Subtask
      if (s.assigned_to?.includes(user.username)) return
      setCurrent({
        ...s,
        assigned_to: [...(s.assigned_to || []), user.username],
      })
    }
    setSearchValue('')
    setFilteredUsers([])
  }

  // Remove user
  const handleRemove = (username: string) => {
    if (mode === 'task') {
      const t=current as Task
      setCurrent({
        ...current,
        task_members: t.task_members.filter(u => u.username !== username),
      })
    } else {
      const s=current as Subtask
      setCurrent({
        ...current,
        assigned_to: s.assigned_to?.filter(u => u !== username),
      })
    }
  }

  // Submit
  const handleSubmit = async () => {
    try {
      setProcessing(true)
      if (mode === 'task') {
        isEdit ? await updateTask(id!, current as Task) : await createTask(current as Task)
      } else {
        isEdit ? await updateSubtask(id!, current as Subtask) : await createSubtask(current as Subtask)
      }
    } finally {
      onClose?.()
    }
  }

  return (
    <div className='bg-white rounded-lg py-4 px-8 min-w-md flex flex-col gap-4'>
      <h2 className='text-gray-900 font-bold text-2xl'>
        {isEdit ? `Edit ${mode === 'task' ? 'Task' : 'Subtask'}` : `Create New ${mode === 'task' ? 'Task' : 'Subtask'}`}
      </h2>

      <Input
        label={mode === 'task' ? 'Title' : 'Subtask Title'}
        name={mode === 'task' ? 'title' : 'sub_title'}
        value={mode === 'task' ? (current as Task).title ?? '' : (current as Subtask).sub_title ?? ''}
        onChange={(e) => {
          setCurrent({ ...(current as any), [e.target.name]: e.target.value })
        }}
        placeholder={`Enter ${mode === 'task' ? 'task title' : 'subtask title'} here`}
      />

      <Input
        label={mode === 'task' ? 'Description' : 'Subtask Description'}
        name={mode === 'task' ? 'description' : 'sub_description'}
        value={mode === 'task' ? (current as Task).description ?? '' : (current as Subtask).sub_description ?? ''}
        onChange={(e) => {
          setCurrent({ ...current, [e.target.name]: e.target.value })
        }}
        placeholder='Enter description here'
      />

      <Input
        label='Due Date'
        name='due_date'
        type='datetime-local'
        value={
          ((current as Task).due_date || (current as Subtask).end_date)
            ? new Date((current as Task).due_date || (current as Subtask).end_date!).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16)
        }
        onChange={(e) => {
          setCurrent({
            ...current,
            [mode === 'task' ? 'due_date' : 'end_date']: new Date(e.target.value),
          })
        }}
        placeholder='Enter due date'
      />

      {/* Assign Members */}
      <div className='relative'>
        <Input
          label='Assign Members'
          name='assigned-members'
          value={searchValue}
          placeholder='Type member name...'
          onChange={searchUsers}
        />

        {filteredUsers.length > 0 && (
          <div className='absolute bg-white border rounded shadow-md mt-1 w-full z-10'>
            {filteredUsers.map((user, index) => (
              <div
                key={index}
                onClick={() => handleAssign(user)}
                className='px-3 py-2 cursor-pointer text-gray-900 hover:bg-gray-100'
              >
                {user.username}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Members */}
      <p className='text-gray-900 flex gap-3 flex-wrap'>
        {mode === 'task'
          ? (current as Task).task_members?.length === 0
            ? <span className='italic text-gray-500'>No members assigned yet</span>
            : (current as Task).task_members.map((user, i) => (
              <span key={i} onClick={() => handleRemove(user.username)} className='rounded-2xl px-4 py-1 bg-yellow-100 cursor-pointer hover:bg-red-200 transition'>
                {user.username} ✕
              </span>
            ))
          : ((current as Subtask)??[]).assigned_to?.length === 0
            ? <span className='italic text-gray-500'>No members assigned yet</span>
            : (current as Subtask).assigned_to?.map((username, i) => (
              <span key={i} onClick={() => handleRemove(username)} className='rounded-2xl px-4 py-1 bg-yellow-100 cursor-pointer hover:bg-red-200 transition'>
                {username} ✕
              </span>
            ))
        }
      </p>

      <button
        disabled={isProcessing}
        onClick={handleSubmit}
        className='py-2.5 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-55'
      >
        {isEdit ? `Update ${mode === 'task' ? 'Task' : 'Subtask'}` : `Create ${mode === 'task' ? 'Task' : 'Subtask'}`}
      </button>
    </div>
  )
}

export default CreateEditForm
