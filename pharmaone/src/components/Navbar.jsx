import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full px-10  py-4'>
      <div  className=' w-full flex justify-between items-center h-full'>
        <div className='w-5/12 rounded-md overflow-hidden'>
          <input type="text" className='w-full px-2 py-1 outline-none bg-gray-200' placeholder="Search for anything here.." name="" id="" />
        </div>
        <div>English (US)</div>
        <div>Good Morning</div>
      </div>
    </div>
  )
}

export default Navbar