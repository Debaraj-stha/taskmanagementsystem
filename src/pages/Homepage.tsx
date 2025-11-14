import  { useState } from 'react'
import Header from '../components/common/Header'
import Tasks from '../feature/Tasks'
import { useTask } from '../context/TaskContext'
import Modal from '../components/ui/Modal'

import CreateEditForm from '../feature/task/CreateEditForm'

const Homepage = () => {
  const { isOpened, setOpened ,setTask} = useTask()
  const [isProcessing, setProcessing] = useState(false)






  if (isOpened) {
    return (
      <Modal onClose={() => setOpened(false)}>
        <CreateEditForm
       
          isProcessing={isProcessing}
          setProcessing={setProcessing}
          
          onClose={() => {
            setProcessing(false)
            setOpened(false)
            setTask({
              title: '',
              description: '',
              due_date: new Date(),
              task_members: [],
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
