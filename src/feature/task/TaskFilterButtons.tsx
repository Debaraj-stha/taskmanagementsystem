import React, { useState } from 'react'

const TaskFilterButtons = () => {
    type buttons = "all" | "completed" | "todo"
    const [activeButton, setActiveButton] = useState<buttons>("all")
    const buttons = ["all", "completed", "todo"]
    const handleFilter = (btn: string) => {
        setActiveButton(btn as buttons)
    }
    return (
        <div className='flex flex-row flex-wrap gap-5'>
            {
                buttons.map((btn) => <button
                    onClick={() => handleFilter(btn)}
                    key={btn} className={`rounded-lg px-4 py-2  text-white cursor-pointer ${btn === activeButton ? "bg-blue-500 " : "bg-gray-500"}`}>{btn}</button>)
            }
        </div>
    )
}

export default TaskFilterButtons