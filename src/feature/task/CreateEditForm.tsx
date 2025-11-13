import React, { useState } from 'react'
import Input from '../../components/ui/Input'
import type { Task } from './type'
import { useTask } from '../../context/TaskContext'
import PopupMessage from './PopupMessage'
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
  const { createTask, updateTask,message } = useTask()
  const [modalOpen, setModalOpen] = useState(false)
  if (modalOpen) {
    return <PopupMessage onClose={()=>{
      setModalOpen(false);
      onClose?.()
    }}
    message={message}
    />
  }
  return (
    <div className='bg-white rounded-lg py-4 px-8  min-w-md flex flex-col gap-4'>
      <h2 className='text-gray-900 font-bold text-2xl'>{isEdit ? "Edit Task" : "Create New Task"}</h2>
      <Input label='Title' name='title' value={task!.title ?? ""} onChange={handleChange} placeholder='Enter title here' />
      <Input label='Description' name='description' value={task!.description ?? ""} onChange={handleChange} placeholder='Enter description here' />

      <Input
        label='Due Date'
        name='due_date'
        type="datetime-local"
        value={
          task.due_date
            ? new Date(task.due_date).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16)
        }
        onChange={handleChange}
        placeholder='Enter due date'
      />

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
        className='py-2.5 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-55'>{isEdit ? "Update Task" : "Create Task"}</button>
    </div>
  )
}

export default CreateEditForm