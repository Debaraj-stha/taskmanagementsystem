import React, { useState } from 'react'
import Header from '../components/common/Header'
import Tasks from '../feature/Tasks'
import { useTask } from '../context/TaskContext'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import type { Task } from '../feature/task/type'

const Homepage = () => {
  const { isOpened, setOpened,createTask } = useTask()
  const [isProcessing, setProcessing] = useState(false)
  const [task, setTask] = useState<Task>({ title: "", description: "", due_date: new Date() })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTask((prev) => {
      if (!prev) {
        return { title: "", description: "", [name]: value } as Task
      }
      return { ...prev, [name]: value }
    })
  }
  if (isOpened) {
    return <Modal>
      <div className='bg-white rounded-lg py-4 px-8  min-w-md flex flex-col gap-4'>
        <h2 className='text-gray-900'>Create New Task</h2>
        <Input name='title' value={task!.title ?? ""} onChange={handleChange} placeholder='Enter title here' />
        <Input name='description' value={task!.description ?? ""} onChange={handleChange} placeholder='Enter description here' />
        <Input name='due_date' type="datetime-local" value={(task.due_date?? new Date()).toISOString()} onChange={handleChange} placeholder='Enter due date' />
        <button
        disabled={isProcessing}
          onClick={async () => {
            try {
              setProcessing(true)
              await createTask(task)
            } finally {
              setProcessing(false)
              setOpened(false)
            }

          }}
          className='py-2.5 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-55'>Create</button>
      </div>
    </Modal>
  }
  return (
    <div className='flex flex-col gap-5'>
      <Header />
      <div className='w-5xl mx-auto bg-blue-100 text-gray-900 rounded-xl py-5 px-8'>
        <Tasks />
      </div>

    </div>
  )
}

export default Homepage