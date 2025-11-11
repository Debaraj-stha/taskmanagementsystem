import React, { useState } from 'react'
import Modal from '../../components/ui/Modal'
import { useTask } from '../../context/TaskContext'

const ActionButtons = () => {
const{setOpened}=useTask()
  return (
    <div className=''>
        <button
        onClick={()=>setOpened(true)}
        className='bg-blue-600 hover:bg-blue-700 transition-colors duration-100 text-white rounded py-2 px-4 cursor-pointer disabled:opacity-50'>Create new Task</button>
    </div>
  )
}

export default ActionButtons