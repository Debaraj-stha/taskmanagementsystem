import React, { useEffect, useState } from 'react'
import type { Task } from './type'
import { useTask } from '../../context/TaskContext'

const RenderTasks = () => {
    const { tasks,getTasks,deleteTask,updateTask } = useTask()
    const[isLoading,setLoading]=useState(false)

    const [isUpdating, setUpdating] = useState(false)
    const [isDeleting, setDeleting] = useState(false)


    const handleDelete = async(id:string) => {
        try {
            setDeleting(true)
            await deleteTask(id)
        } finally {
            setDeleting(false)
        }
    }

    const handleUpdate = async(id:string) => {
        try {
            setUpdating(true)
            await updateTask(id)
        } finally {
            setUpdating(false)
        }
    }

    useEffect(()=>{
        (async()=>{
            try {
                await getTasks()
            } finally{
                setLoading(false)
            }
        })

    },[])


    return (
        <div className='space-y-4'>
            {
                tasks.map((t, index) => (
                    <div key={index} className='bg-gray-50 px-4 py-2 rounded hover:bg-gray-100 transition-colors space-y-5'>
                        <div className='flex justify-between items-center'>
                            <h2 className='font-semibold'>{t.title}</h2>
                            {
                                t.status === "completed" && <p className='rounded-4xl bg-green-100 text-green-600 py-2 px-3'>{t.status}</p>
                            }
                        </div>
                        <p>{t.description}</p>
                        <div className='flex gap-5'>
                            <button
                                disabled={isUpdating}
                                onClick={()=>handleUpdate(t.id!)}
                                className='bg-green-500 hover:bg-green-600 cursor-pointer rounded-xl px-3 py-2 text-white disabled:opacity-50'>Update</button>
                            <button
                                disabled={isDeleting}
                                onClick={()=>handleDelete(t.id!)}
                                className='bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-xl px-3 py-2 disabled:opacity-50'>Delete</button>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default RenderTasks