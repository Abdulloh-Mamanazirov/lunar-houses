import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='fixed inset-y-0 bg-slate-200 flex flex-col gap-5 pt-24 px-5'>
      <Link className='w-52 h-10 grid place-items-center border border-slate-600 rounded-xl text-center' to="/company"><span> Company</span></Link>
      <Link className='w-52 h-10 grid place-items-center border border-slate-600 rounded-xl text-center' to="/complex"><span> Complex</span></Link>
      <Link className='w-52 h-10 grid place-items-center border border-slate-600 rounded-xl text-center' to="/room"><span> Room</span></Link>
      <Link className='w-52 h-10 grid place-items-center border border-slate-600 rounded-xl text-center' to="/users"><span> Users</span></Link>
    </div>
  )
}

export default Sidebar
