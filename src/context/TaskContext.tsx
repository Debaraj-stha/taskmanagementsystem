import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Task } from "../feature/task/type";
import apiHelper from "../utils/apiHelper";


interface TaskContextValue{
createTask:(task:Task)=>Promise<void>
tasks:Task[]
deleteTask:(id:string)=>Promise<void>
getTasks:()=>Promise<void>|void
updateTask:(id:string,task:Task)=>Promise<void>
isOpened:boolean
filteredTasks:Task[]
setFilteredTasks:(tasks:Task[])=>void
setOpened:(val:boolean)=>void
updateStatus:(id:string,status:string)=>Promise<void>
message:string
setMessage:(val:string)=>void
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
    const[isSuccess,setIsSuccess]=useState()
    const[message,setMessage]=useState("")

    useEffect(()=>{
setTasks(staticTasks)
    },[])

 
const webSocketRef = React.useRef<WebSocket | null>(null);

useEffect(() => {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL ?? ""
    if (!wsUrl) return
    const ws = new WebSocket(wsUrl)
    webSocketRef.current = ws

    ws.onopen = (ev) => {
        console.log("connection opened")
    }

    ws.onmessage = (ev) => {
        console.log("websocket message:", ev.data)
        const data=JSON.parse(ev.data)
        console.log("data from server",data)
        alert(`message from server :${data.message}`)
    }

    ws.onerror = (ev) => {
        console.error("websocket error", ev)
    }

    ws.onclose = (ev) => {
        console.log("websocket closed", ev)
    }

    return () => {
        ws.close()
        webSocketRef.current = null
    }
}, [])

 
  

    const url = import.meta.env.VITE_SERVER_URL
    const createTask = async (task:Task)=> {
        try {
            await apiHelper(`${url}/create_task/`, {
                method: "POST",
                data: task
            })
           setMessage("Task created succesafully")
         
        } catch (error:any) {
           setMessage(error)
           
        }
    }

    const deleteTask = async (id: string) => {
        try {
            await apiHelper(`${url}/delete_task/${id}/`, {
                method: "DELETE",
            })
           setMessage("Task deleted succesafully")
        } catch (error:any) {
         setMessage(error)
        }
    }
    const getTasks=async()=>{
        try {
            const res=await apiHelper(`${url}/task_details/`, {
                method: "GET",
            })
            setTasks(res)
        } catch (error:any) {
            setMessage(error)
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
           setMessage("Task updated succesafully")
        } catch (error) {
            setMessage("Task updation failed")
        }
    }

    const updateStatus=async(id:string,status:string)=>{
        try {
            await apiHelper(`${url}/update_task/${id}/`, {
                method: "PUT",
                data:{
                    status
                }
                
            })
            const updatedTasks=tasks.map((t)=>t.id==id? {...t,status}:t)
            setTasks(updatedTasks)
         setMessage(`Task status updated to '${status}' succesafully`)
        } catch (error:any) {
           setMessage(error)
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
            filteredTasks,
            setMessage,
            message



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