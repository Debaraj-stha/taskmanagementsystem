import React, { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from "react";
import type { Task } from "../feature/task/type";
import apiHelper from "../utils/apiHelper";


interface TaskContextValue{
createTask:(task:Task)=>Promise<void>|void
tasks:Task[]
deleteTask:(id:string)=>Promise<void>|void
getTasks:()=>Promise<void>|void
updateTask:(id:string,task:Task)=>Promise<void>|void
isOpened:boolean
filteredTasks:Task[]
setFilteredTasks:(tasks:Task[])=>void
setOpened:(val:boolean)=>void
}

const TaskContext = createContext<TaskContextValue|null>(null)




const TaskContextProvider = ({ children }: { children: ReactNode }) => {
    const[tasks,setTasks]=useState<Task[]>([])
    const[isOpened,setOpened]=useState(false)
    const[filteredTasks,setFilteredTasks]=useState<Task[]>([])

 

 
  

    const url = import.meta.env.VITE_SERVER_URL
    const createTask = async (task:Task) => {
        try {
            await apiHelper(`${url}/create_task/`, {
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
            await apiHelper(`${url}/delete_task/${id}/`, {
                method: "DELETE",
            })
            alert("task deleted")
        } catch (error) {
            alert(error)
        }
    }
    const getTasks=async()=>{
        try {
            const res=await apiHelper(`${url}/task_details/`, {
                method: "GET",
            })
            setTasks(res)
        } catch (error) {
            alert(error)
        }
    }

      const updateTask=async(id:string,task:Task)=>{
        try {
            await apiHelper(`${url}/update_task/${id}/`, {
                method: "PUT",
                data:{...task}
            })
            alert("task updated")
        } catch (error) {
            alert(error)
        }
    }

    return (
        <TaskContext.Provider value={{
            createTask,
            tasks,
            deleteTask,
            updateTask,
            getTasks,
            isOpened,
            setOpened,
            setFilteredTasks,
            filteredTasks



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