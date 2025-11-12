import React, { type ReactNode } from 'react'

const Modal = ({children}:{children:ReactNode}) => {
  return (
    <div className='opacity-90 bg-gray-900 flex justify-center items-center flex-col min-h-screen w-screen'>
      {children}
    </div>
  )
}

export default Modal