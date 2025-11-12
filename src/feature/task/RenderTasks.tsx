import React, { useEffect, useState } from 'react'
import type { Task } from './type'
import { useTask } from '../../context/TaskContext'
import Modal from '../../components/ui/Modal'
import CreateEditForm from './CreateEditForm'

const RenderTasks = () => {
    const { tasks, getTasks, deleteTask, filteredTasks } = useTask()
    const [isLoading, setLoading] = useState(false)

    const [isUpdating, setUpdating] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [task, setTask] = useState<Task>({ title: "", description: "" })
    const [updateId, setUpdateId] = useState<string | null>(null)


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
                                <div className='flex gap-5'>
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => setUpdateId(t.id!)}
                                        className='bg-green-500 hover:bg-green-600 cursor-pointer rounded-xl px-3 py-2 text-white disabled:opacity-50'>Update</button>
                                    <button
                                        disabled={isDeleting}
                                        onClick={() => handleDelete(t.id!)}
                                        className='bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-xl px-3 py-2 disabled:opacity-50'>Delete</button>
                                </div>
                            </div>
                        ))
            }

        </div>
    )
}

export default RenderTasks