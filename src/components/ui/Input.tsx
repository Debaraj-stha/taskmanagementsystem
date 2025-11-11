import React from 'react'
interface InputProps{
    name:string
    value:string
    type?:"text"|"datetime-local"
    placeholder?:string
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
}
const Input = ({name,value,type,placeholder,onChange}:InputProps) => {
  return (
   <div className='my-2 flex-1'>
     <input
    type={type}
    className='rounded px-3 py-2 border-2 text-white bg-gray-800 border-white/10 w-full'
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    />
   </div>
  )
}

export default Input