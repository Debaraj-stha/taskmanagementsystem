import React, { useEffect, useState } from 'react'
import type { Task } from './type'
import { useTask } from '../../context/TaskContext'
import Modal from '../../components/ui/Modal'
import CreateEditForm from './CreateEditForm'
import { CgChevronRight } from 'react-icons/cg'

const RenderTasks = () => {
    const { tasks, getTasks, deleteTask, filteredTasks,updateStatus } = useTask()
    const [isLoading, setLoading] = useState(false)

    const [isUpdating, setUpdating] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [task, setTask] = useState<Task>({ title: "", description: "" })
    const [updateId, setUpdateId] = useState<string | null>(null)
    const [slideUpId, setSlideUpId] = useState<string | null>(null)


    const handleDelete = async (id: string) => {
        try {
            setDeleting(true)
            await deleteTask(id)
        } finally {
            setDeleting(false)
        }
    }



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setTask((prev) => {
            if (!prev) {
                return { title: "", description: "", [name]: value } as Task
            }
            return { ...prev, [name]: value }
        })
    }


    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                await getTasks()
            } finally {
                setLoading(false)
            }
        })()

    }, [])


    if (updateId) {
        return <Modal>
            <CreateEditForm
                handleChange={handleChange}
                isEdit={true}
                isProcessing={isUpdating}
                setProcessing={setUpdating}
                id={updateId}
                task={task}
                onClose={() => {
                    setUpdateId(null);
                    setUpdating(false)
                }}
            />
        </Modal>
    }




    return (
        <div className='space-y-4'>
            {
                isLoading ?
                    <p className='text-blue-600 font-semibold animate-pulse'>Loading...</p>
                    : tasks!.length == 0 ? <p className='text-center font-semibold'>No tasks available</p>
                        :
                        (filteredTasks.length > 0 ? filteredTasks : tasks).map((t, index) => (
                            <div key={index} className='bg-gray-50 px-4 py-2 rounded hover:bg-gray-100 transition-colors space-y-5'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='font-semibold'>{t.title}</h2>
                                    <p className='rounded-4xl bg-green-100 text-green-600 py-2 px-3'>{t.status}</p>

                                </div>
                                <p>{t.description}</p>
                                <button
                                    onClick={() => setSlideUpId(prev => !prev ? t.id! : null)}
                                    className='rounded-lg bg-blue-200 px-3 py-1 hover:bg-blue-300'><CgChevronRight className='text-blue-500' size={20} /></button>
                                {
                                    slideUpId === t.id && (
                                        <div className='flex gap-5'>
                                             {
                                               ( t.status!=="completed" && t.status!=="in progress") &&
                                                <button
                                                disabled={isUpdating}
                                                onClick={async() => {
                                                    await updateStatus(t.id!,"in progress")
                                                }}
                                                className='bg-yellow-300 hover:bg-yellow-400 cursor-pointer rounded-xl px-3 py-2 text-yellow-800 disabled:opacity-50'>
                                                start
                                                </button>
                                             }
                                           {
                                           ( t.status!=="pending" && t.status!=="completed") && 
                                             <button
                                                disabled={isUpdating}
                                                onClick={async() => {
                                                   await updateStatus(t.id!,"completed")
                                                }}
                                                className='bg-blue-300 hover:bg-blue-400 cursor-pointer rounded-xl px-3 py-2 text-blue-800 disabled:opacity-50'>
                                                completed</button>
                                           }
                                            <button
                                                disabled={isUpdating}
                                                onClick={() => {
                                                    setUpdateId(t.id!);
                                                    setTask(t)
                                                }}
                                                className='bg-green-300 hover:bg-green-400 cursor-pointer rounded-xl px-3 py-2 text-green-800 disabled:opacity-50'>
                                                Update</button>
                                            <button
                                                disabled={isDeleting}
                                                onClick={() => handleDelete(t.id!)}
                                                className='bg-red-300 cursor-pointer hover:bg-red-400 text-red-800 rounded-xl px-3 py-2 disabled:opacity-50'>Delete</button>
                                        </div>
                                    )
                                }
                            </div>
                        ))
            }

        </div>
    )
}

export default RenderTasks