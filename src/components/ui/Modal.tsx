import React, { useEffect, type ReactNode } from 'react'

const Modal = ({children,onClose}:{children:ReactNode,onClose:()=>void}) => {
  useEffect(()=>{
    const handleKeyDown=(e:KeyboardEvent)=>{
        if(e.key==="Escape"){
          onClose()
        }
    }
    window.addEventListener("keydown",handleKeyDown)
    return ()=>window.removeEventListener("keydown",handleKeyDown)
  },[])
  return (
    <div onClick={()=>onClose?.()} className='opacity-90 bg-gray-900 fixed flex justify-center items-center flex-col min-h-screen w-screen inset-0'>
      {children}
    </div>
  )
}

export default Modal