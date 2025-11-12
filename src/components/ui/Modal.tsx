import React, { useEffect, type ReactNode } from 'react'

const Modal = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="opacity-90 bg-gray-900 fixed flex justify-center items-center flex-col min-h-screen w-screen inset-0"
    >
      {/* Prevent click inside modal content from closing */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
