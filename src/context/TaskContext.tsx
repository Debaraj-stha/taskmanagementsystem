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
updateStatus:(id:string,status:string)=>Promise<void>
}

const TaskContext = createContext<TaskContextValue|null>(null)
export const staticTasks: Task[] = [
  {
    id: "1",
    title: "Design login page UI",
    status: "in progress",
    due_date: new Date("2025-11-15"),
    description: "Create a responsive login page using Tailwind CSS and Figma design reference."
  },
  {
    id: "2",
    title: "Set up Firebase authentication",
    status: "pending",
    due_date: new Date("2025-11-13"),
    description: "Implement email/password and Google sign-in methods using Firebase Auth."
  },
  {
    id: "3",
    title: "Implement Redux store for user state",
    status: "completed",
    due_date: new Date("2025-11-10"),
    description: "Set up Redux Toolkit slice for managing user authentication and profile data."
  },
  {
    id: "4",
    title: "Integrate WebRTC for video calls",
    status: "completed",
    due_date: new Date("2025-11-20"),
    description: "Build real-time video call functionality using WebRTC and Socket.IO."
  },
  {
    id: "5",
    title: "Deploy app to Vercel",
    status: "pending",
    due_date: new Date("2025-11-18"),
    description: "Prepare the project for production deployment and connect to custom domain."
  }
]



const TaskContextProvider = ({ children }: { children: ReactNode }) => {
    const[tasks,setTasks]=useState<Task[]>([])
    const[isOpened,setOpened]=useState(false)
    const[filteredTasks,setFilteredTasks]=useState<Task[]>([])

    useEffect(()=>{
setTasks(staticTasks)
    },[])

 

 
  

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
            const updatedTasks=tasks.map((t)=>t.id==id? {...t,...task}:t)
            setTasks(updatedTasks)
            alert("task updated")
        } catch (error) {
            alert(error)
        }
    }

    const updateStatus=async(id:string,status:string)=>{
        try {
            await apiHelper(`${url}/update_task_status/${id}/`, {
                method: "PATCH",
                data:{
                    status
                }
                
            })
            const updatedTasks=tasks.map((t)=>t.id==id? {...t,status}:t)
            setTasks(updatedTasks)
            alert("task status updated")
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
            updateStatus,
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