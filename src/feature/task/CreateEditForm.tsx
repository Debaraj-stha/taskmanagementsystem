import React from 'react'
import Input from '../../components/ui/Input'
import type { Task } from './type'
import { useTask } from '../../context/TaskContext'
interface CreateEditFormProps {
  task: Task
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isEdit?: boolean
  onClose?: () => void
  id?: string
  isProcessing?: boolean
  setProcessing: (value: boolean) => void

}

const CreateEditForm = ({ task, handleChange, onClose, isEdit, id, isProcessing, setProcessing }: CreateEditFormProps) => {
  const { createTask, updateTask } = useTask()
  return (
    <div className='bg-white rounded-lg py-4 px-8  min-w-md flex flex-col gap-4'>
      <h2 className='text-gray-900'>{isEdit ? "Edit Task":"Create New Task"}</h2>
      <Input name='title' value={task!.title ?? ""} onChange={handleChange} placeholder='Enter title here' />
      <Input name='description' value={task!.description ?? ""} onChange={handleChange} placeholder='Enter description here' />
      <Input name='due_date' type="datetime-local" value={(task.due_date ?? new Date()).toISOString()} onChange={handleChange} placeholder='Enter due date' />
      <button
        disabled={isProcessing}
        onClick={async () => {
          try {
            setProcessing(true)
            isEdit ? await updateTask(id!, task) : await createTask(task)
          } finally {
            onClose?.()
          }

        }}
        className='py-2.5 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-55'>Create</button>
    </div>
  )
}

export default CreateEditForm