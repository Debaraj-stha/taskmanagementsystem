import React from 'react'
import Modal from '../../components/ui/Modal'
interface PopupMessageProps{
onClose:()=>void
message:string
}

const PopupMessage = ({onClose,message}:PopupMessageProps) => {
  return (
 <Modal onClose={onClose}>
      <div className='bg-white rounded w-md text-gray-900 px-5 py-3 space-y-3 flex justify-center flex-col items-center'>
        <h2 className='text-2xl font-semibold'>Task management system</h2>
        <p className=''>{message}</p>
        <button onClick={()=>onClose()} className='bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded'>Close</button>
      </div>
    </Modal>
  )
}

export default PopupMessage