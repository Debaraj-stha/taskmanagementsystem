import React, { useState } from 'react'
import Header from '../components/common/Header'
import Tasks from '../feature/Tasks'
import { useTask } from '../context/TaskContext'
import Modal from '../components/ui/Modal'
import type { Task } from '../feature/task/type'
import CreateEditForm from '../feature/task/CreateEditForm'

const Homepage = () => {
  const { isOpened, setOpened ,setTask,task} = useTask()
  const [isProcessing, setProcessing] = useState(false)




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const base: Task = task ?? {
      title: '',
      description: '',
      due_date: new Date(),
      assignedUsers: [{ username: 'jhon' }, { username: 'Alex' }],
    }
    setTask({ ...base, [name]: value } as Task)
  }
 

  if (isOpened) {
    return (
      <Modal onClose={() => setOpened(false)}>
        <CreateEditForm
       
          isProcessing={isProcessing}
          setProcessing={setProcessing}
          handleChange={handleChange}
          onClose={() => {
            setProcessing(false)
            setOpened(false)
            setTask({
              title: '',
              description: '',
              due_date: new Date(),
              assignedUsers: [],
            })
          }}
        />
      </Modal>
    )
  }

  return (
    <div className="flex flex-col gap-5 bg-gray-50 min-h-screen">
      <Header />
      <div className="w-5xl mx-auto bg-blue-100 shadow-2xl text-gray-900 rounded-xl py-5 px-8">
        <Tasks />
      </div>
    </div>
  )
}

export default Homepage
