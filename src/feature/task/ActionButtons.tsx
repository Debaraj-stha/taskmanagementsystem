
import { useState } from 'react'
import { useTask } from '../../context/TaskContext'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import type { User } from './type'
import apiHelper from '../../utils/apiHelper'
import PopupMessage from './PopupMessage'

const ActionButtons = () => {
  const { setOpened, setMessage, message } = useTask()
  const [isUserModalOpened, setUSerModalOpened] = useState(false)
  const [user, setUSer] = useState<User>({ username: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false)

  const submitForm = async () => {
    try {
      setIsSubmitting(true)
      const url = import.meta.env.VITE_SERVER_URL
      const res = await apiHelper(`${url}/create_user/`, {
        method: "POST",
        data: { username: user.username }
      })
      setMessage("user created succesafully")
     
      console.log(res)
    } catch (error:any) {
      console.log(error)
      setMessage(error)
    }
    finally {
      setIsSubmitting(false)
       setUSerModalOpened(false)
    }
  }

  if (isPopupOpen) {
    return <PopupMessage onClose={() => {
      setPopupOpen(false);
      setUSerModalOpened(false)
    }}
      message={message}
    />
  }



  if (isUserModalOpened) {
    return <Modal onClose={() => setUSerModalOpened(false)}>
      <div className='rounded-2xl min-w-md bg-gray-100'>
        <h2 className='text-2xl font-bold'>Create New USer</h2>
        <Input
          name='username'
          value={user.username}
          placeholder='Enetr username'
          label='Username'
          onChange={(e) => setUSer({ username: e.target.value })}
        />
        <button
          disabled={isSubmitting}
          onClick={submitForm}
          className='disabled:opacity-50 bg-blue-600 hover:bg-blue-700 transition-colors duration-100 text-white rounded py-2 px-4 cursor-pointer'>
          Create</button>
      </div>
    </Modal>
  }
  return (
    <div className='flex gap-5 flex-row flex-wrap'>
      <button
        onClick={() => setOpened(true)}
        className='bg-blue-600 hover:bg-blue-700 transition-colors duration-100 text-white rounded py-2 px-4 cursor-pointer disabled:opacity-50'>
        Create new Task</button>

      <button
        onClick={() => setUSerModalOpened(true)}
        className='bg-green-600 hover:bg-green-700 transition-colors duration-100 text-white rounded py-2 px-4 cursor-pointer disabled:opacity-50'>
        Create new User</button>
    </div>
  )
}

export default ActionButtons