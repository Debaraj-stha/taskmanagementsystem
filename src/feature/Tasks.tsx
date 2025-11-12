import React from 'react'
import TaskFilterButtons from './task/TaskFilterButtons'
import type { Task } from './task/type'
import RenderTasks from './task/RenderTasks'
import ActionButtons from './task/ActionButtons'

const Tasks = () => {
 
  
  return (
    <div className='space-y-5 mx-auto max-w-5xl '>
      <h2 className='font-semibold text-3xl'>Manage your Tasks</h2>
      {/* buttons to filter tasks */}
      <TaskFilterButtons/>
      <RenderTasks/>
      <ActionButtons/>
    </div>
  )
}

export default Tasks