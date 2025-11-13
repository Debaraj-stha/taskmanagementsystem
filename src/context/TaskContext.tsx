import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { buttons, Subtask, Task, User } from "../feature/task/type";
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
task:Task
setTask:(val:Task)=>void
getUsers:()=>Promise<void>
users:User[]
handleFilter:(btn:string)=>void
activeButton:buttons
subtask:Subtask,
setSubtask:(task:Subtask)=>void
 createSubtask:(subtask:Subtask)=>Promise<void>,
    updateSubtask:(id:string,subtask:Subtask)=>Promise<void>,
}

const TaskContext = createContext<TaskContextValue|null>(null)
const staticTasks: Task []=[ 
    {
  id: 'task-001',
  title: 'Develop Task Management Feature',
  description: 'Implement task creation, assignment, and tracking',
  status: 'in progress',
  createdBy: { id: 'u1', username: 'Alice' },
  task_members: [
    { id: 'u2', username: 'Bob' },
    { id: 'u3', username: 'Carol' },
  ],
  subtasks: [
    {
      id: 'sub-001',
      sub_title: 'Design UI for tasks',
      assigned_to: ["Jhon"],
    },
    {
      id: 'sub-002',
      sub_title: 'Implement backend API',
      assigned_to: ['Carol' ],
    },
  ],
},
 
]



const TaskContextProvider = ({ children }: { children: ReactNode }) => {
    const[tasks,setTasks]=useState<Task[]>([])
    const[users,setUsers]=useState<User[]>([{username:"Jhon"},{username:"Alex"},{username:"Jeny"}])
     const [task, setTask] = useState<Task>({
       title: '',
       description: '',
       due_date: new Date(),
       task_members: [{username:"jhon",id:"1"},{username:"Alex",id:"2"}],
     })
    const[isOpened,setOpened]=useState(false)
    const[filteredTasks,setFilteredTasks]=useState<Task[]>([])


    const [activeButton, setActiveButton] = useState<buttons>("all")
    const[message,setMessage]=useState("")
    const[subtask,setSubtask]=useState<Subtask>({
        sub_title:"",
        sub_description:"",
        start_date:new Date(),
        end_date:new Date(),
        parent_task:""
    })

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

 
   const handleFilter = (btn: string) => {
        const filtered=[...tasks].filter((task)=>task.status===btn)
        setFilteredTasks(filtered)
        setActiveButton(btn as buttons)
    }

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
            setTasks(res.tasks)
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
            const updatedTasks=tasks.map((t)=>t.id==id? {...t,status: status as "in progress" | "pending" | "completed"}:t)
            setTasks(updatedTasks)
         setMessage(`Task status updated to '${status}' succesafully`)
        } catch (error:any) {
           setMessage(error)
        }
    }

    const getUsers=async()=>{
        try {
            const res=await apiHelper(`${url}/get_users/`,{
                method:"GET"
            })
            setUsers(res.users)
        } catch (error) {
            console.log(error)
        }
    }
const createSubtask=async(subtask:Subtask)=>{
 try {
            await apiHelper(`${url}/create_subtask/`, {
                method: "POST",
                data: subtask
            })
           setMessage("Subtask created succesafully")
         
        } catch (error:any) {
           setMessage(error)
           
        }
}
const updateSubtask = async (id: string, subtask: Subtask) => {
  try {
    await apiHelper(`${url}/update_subtask/${id}/`, {
      method: "PUT",
      data: subtask,
    });

    // Update subtask locally in parent task’s list
    const updatedTasks = tasks.map((task) => {
      if (task.id === subtask.parent_task) {
        return {
          ...task,
          subtasks: task.subtasks
            ? task.subtasks.map((st) =>
                st.id === subtask.id ? { ...subtask } : st
              )
            : [subtask],
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setMessage("Subtask updated successfully");
  } catch (error) {
    console.error("Subtask update error:", error);
    setMessage("Subtask update failed ");
  }
};



    useEffect(()=>{
getUsers()
    },[])

    return (
        <TaskContext.Provider value={{
            createTask,
            tasks,
            createSubtask,
            updateSubtask,
            deleteTask,
            updateTask,
            getTasks,
            isOpened,
            setOpened,
            getUsers,
            updateStatus,
            setFilteredTasks,
            filteredTasks,
            setMessage,
            message,
            task,
            setTask,
            handleFilter,
            users,
            activeButton,
            subtask,
            setSubtask


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