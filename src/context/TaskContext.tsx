import { createContext, useContext, useState, type ReactNode } from "react";
import type { Task } from "../feature/task/type";
import apiHelper from "../utils/apiHelper";

interface TaskContextValue{
createTask:()=>Promise<void>|void
task:Task
tasks:Task[]
deleteTask:(id:string)=>Promise<void>|void
getTasks:()=>Promise<void>|void
updateTask:(id:string)=>Promise<void>|void
}

const TaskContext = createContext<TaskContextValue|null>(null)

const TaskContextProvider = ({ children }: { children: ReactNode }) => {
    const [task, setTask] = useState<Task>({ title: "", description: "" })
    const [tasks, setTasks] = useState<Task[]>([])

    const url = import.meta.env.SERVER_URL
    const createTask = async () => {
        try {
            await apiHelper(url, {
                method: "POST",
                data: task
            })
            alert("task created")
        } catch (error) {
            alert(error)
        }
    }

    const deleteTask = async (id: string) => {
        try {
            await apiHelper(url, {
                method: "DELETE",
                data: {id}
            })
            alert("task deleted")
        } catch (error) {
            alert(error)
        }
    }
    const getTasks=async()=>{
        try {
            await apiHelper(url, {
                method: "GET",
            })
        } catch (error) {
            alert(error)
        }
    }

      const updateTask=async(id:string)=>{
        try {
            await apiHelper(url, {
                method: "PUT",
                data:{id,...task}
            })
            alert("task updated")
        } catch (error) {
            alert(error)
        }
    }

    return (
        <TaskContext.Provider value={{
            createTask,
            task,
            tasks,
            deleteTask,
            updateTask,
            getTasks


        }}>
            {children}
        </TaskContext.Provider>
    )
}
export const useTask = () => {
    const context = useContext(TaskContext)
    if (!context)
        throw Error("uasTask must be used within TaskContextProvider")
    return context
}

export default TaskContextProvider