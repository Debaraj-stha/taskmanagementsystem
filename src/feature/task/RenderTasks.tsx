import React, { useEffect, useState } from 'react'
import type { Task } from './type'
import { useTask } from '../../context/TaskContext'
import Modal from '../../components/ui/Modal'
import CreateEditForm from './CreateEditForm'
import PopupMessage from './PopupMessage'

const RenderTasks = () => {
    const { tasks, getTasks, deleteTask, filteredTasks, updateStatus, message ,activeButton,setSubtask,subtask} = useTask()
    const [isLoading, setLoading] = useState(false)
    const [isUpdating, setUpdating] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [task, setTask] = useState<Task>({ title: '', description: '', task_members: [] })
    const [updateId, setUpdateId] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const[parentTaskId,setParentTaskId]=useState<string|null>(null)

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
        setTask((prev) => ({ ...prev, [name]: value }))
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

    // === MODALS ===
    if (updateId) {
        return (
            <Modal onClose={() => setUpdateId(null)}>
                <CreateEditForm
                  
                    isEdit={true}
                    isProcessing={isUpdating}
                    setProcessing={setUpdating}
                    id={updateId}
                    onClose={() => {
                        setUpdateId(null)
                        setUpdating(false)
                    }}
                />
            </Modal>
        )
    }

    if (modalOpen) {
        return <PopupMessage onClose={() => setModalOpen(false)} message={message} />
    }

    //subtasks

    const Subtasks = ({ t }: { t: Task }) => {
        return <div className="border-t border-gray-200 pt-3 space-y-2">
            <h4 className="font-semibold text-gray-800">Subtasks:</h4>
            <ol className="list-disc list-inside space-y-2">
                {(t.subtasks ?? []).map((sub, i) => (
                    <li key={i} className="space-y-1 list-decimal">
                     
                            <span>{sub.sub_title}</span>
                     

                        {/* SUBTASK ASSIGNED USERS */}
                        <div className="ml-4 text-xs text-gray-600">
                            <span className="font-medium">Assigned To:</span>{' '}
                            {sub.assigned_to?.length ? (
                                <ul className="list-disc list-inside ml-3">
                                    {sub.assigned_to.map((user, j) => (
                                        <li key={j}>{user}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span>None</span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    }


    //action buttons
    const ActionButtons = ({ t }: { t: Task }) => {
        return <div className="flex flex-wrap gap-3 pt-2">
            {t.status !== 'completed' && t.status !== 'in progress' && (
                <button
                    disabled={isUpdating}
                    onClick={async () => await updateStatus(t.id!, 'in progress')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl px-3 py-2 disabled:opacity-50"
                >
                    Start
                </button>
            )}
            {t.status !== 'pending' && t.status !== 'completed' && (
                <button
                    disabled={isUpdating}
                    onClick={async () => await updateStatus(t.id!, 'completed')}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-3 py-2 disabled:opacity-50"
                >
                    Complete
                </button>
            )}
            <button
                disabled={isUpdating}
                onClick={() => {
                    setUpdateId(t.id!)
                    setTask(t)
                }}
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-3 py-2 disabled:opacity-50"
            >
                Update
            </button>
            <button
                disabled={isDeleting}
                onClick={() => {
                    if (window.confirm("Are you sure you want to delete this task? This can't be undone.")) {
                        handleDelete(t.id!)
                    }
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-3 py-2 disabled:opacity-50"
            >
                Delete
            </button>
            <button
                disabled={isDeleting}
                onClick={() => {
                   setParentTaskId(t.id!)
                   setSubtask({...subtask,parent_task:t.id!})
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl px-3 py-2 disabled:opacity-50"
            >
                Create Subtask
            </button>
        </div>
    }

    // === TASK LIST ===
    return (
        <div className="space-y-4 max-h-screen overflow-scroll">
            {isLoading ? (
                <p className="text-blue-600 font-semibold animate-pulse">Loading...</p>
            ) : tasks?.length === 0 ? (
                <p className="text-center font-semibold">No tasks available</p>
            ) : (
                (activeButton==="all" ?  tasks:tasks.filter(t=>
                    t.status===activeButton
                )).map((t, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 px-4 py-3 rounded hover:bg-gray-100 transition-colors space-y-3 shadow-sm"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-lg text-gray-800">{t.title}</h2>
                            <span
                                className={`rounded-4xl px-3 py-1 text-sm font-medium ${t.status === 'completed'
                                    ? 'bg-green-100 text-green-600'
                                    : t.status === 'in progress'
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {t.status}
                            </span>
                        </div>

                        {/* DESCRIPTION */}
                        <p className="text-gray-700">{t.description}</p>

                        {/* META INFO */}
                        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                            <p>
                                <span className="font-semibold text-gray-800">Created By:</span>{' '}
                                {t.createdBy?.username || 'Unknown'}
                            </p>
                            <div>
                                <span className="font-semibold text-gray-800">Assigned Users:</span>{' '}
                                {t.task_members?.length ? (
                                    <ul className="list-disc list-inside ml-2">
                                        {t.task_members.map((user, i) => (
                                            <li key={i}>{user.username}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>No assigned users</span>
                                )}
                            </div>
                        </div>

                        {/* SUBTASKS */}
                        {(t.subtasks ?? []).length > 0 && <Subtasks t={t} />}

                        {/* ACTION BUTTONS */}
                        <ActionButtons t={t} />
                    </div>
                ))
            )}
        </div>
    )
}

export default RenderTasks
