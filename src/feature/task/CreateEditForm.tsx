import React, { useState } from 'react'
import Input from '../../components/ui/Input'
import type { Task, User } from './type'
import { useTask } from '../../context/TaskContext'
import PopupMessage from './PopupMessage'

interface CreateEditFormProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isEdit?: boolean
  onClose?: () => void
  id?: string
  isProcessing?: boolean
  setProcessing: (value: boolean) => void
}

const CreateEditForm = ({
  handleChange,
  onClose,
  isEdit,
  id,
  isProcessing,
  setProcessing,
}: CreateEditFormProps) => {
  const { createTask, updateTask, message, users ,task,setTask} = useTask()
  const [modalOpen, setModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

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

  //  Search users by username
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

  //  Assign user
  const handleAssign = (user: User) => {
    // avoid duplicates
    if (task.task_members.some(u => u.username === user.username)) return

    setTask({
      ...task,
      task_members: [...task.task_members, { username: user.username }]
    })
    setSearchValue('')
    setFilteredUsers([])
  }

  // Remove assigned user
  const handleRemove = (username: string) => {
    setTask({
      ...task,
      task_members: task.task_members.filter(u => u.username !== username)
    })
  }

  //  Submit
  const handleSubmit = async () => {
    try {
      setProcessing(true)
      isEdit ? await updateTask(id!, task) : await createTask(task)
    } finally {
      onClose?.()
    }
  }

  return (
    <div className='bg-white rounded-lg py-4 px-8 min-w-md flex flex-col gap-4'>
      <h2 className='text-gray-900 font-bold text-2xl'>
        {isEdit ? 'Edit Task' : 'Create New Task'}
      </h2>

      <Input
        label='Title'
        name='title'
        value={task.title ?? ''}
        onChange={handleChange}
        placeholder='Enter title here'
      />

      <Input
        label='Description'
        name='description'
        value={task.description ?? ''}
        onChange={handleChange}
        placeholder='Enter description here'
      />

      <Input
        label='Due Date'
        name='due_date'
        type='datetime-local'
        value={
          task.due_date
            ? new Date(task.due_date).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16)
        }
        onChange={handleChange}
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
        {task.task_members.length === 0 ? (
          <span className='italic text-gray-500'>
            No members assigned yet
          </span>
        ) : (
          task.task_members.map((user, index) => (
            <span
              key={index}
              onClick={() => handleRemove(user.username)}
              className='rounded-2xl px-4 py-1 bg-yellow-100 cursor-pointer hover:bg-red-200 transition'
              title='Click to remove'
            >
              {user.username} ✕
            </span>
          ))
        )}
      </p>

      <button
        disabled={isProcessing}
        onClick={handleSubmit}
        className='py-2.5 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-55'
      >
        {isEdit ? 'Update Task' : 'Create Task'}
      </button>
    </div>
  )
}

export default CreateEditForm
