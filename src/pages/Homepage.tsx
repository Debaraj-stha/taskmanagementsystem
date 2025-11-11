import React from 'react'
import Header from '../components/common/Header'
import Tasks from '../feature/Tasks'

const Homepage = () => {
  return (
    <div className='flex flex-col gap-5'>
        <Header/>
        <div className='w-5xl mx-auto bg-blue-100 text-gray-900 rounded-xl py-5 px-8'>
            <Tasks/>
        </div>

    </div>
  )
}

export default Homepage