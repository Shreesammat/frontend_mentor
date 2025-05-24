import React from 'react'
import qr from './assets/image-qr-code.png'

const App = () => {
  return (
    <div className='w-full h-screen bg-[#d5e1ef] flex items-center justify-center p-8'>
      <div className='w-360px:sm md:w-1440px min-w-sm min-h-sm max-w-[300px] bg-white rounded-xl shadow-sm p-4 flex flex-col justify-center align-top gap-4'>
        <img className='w-full rounded-xl' src={qr} alt='qr code' />
        <h1 className='w-full text-center font-outfit font-extrabold text-xl text-[#2d3146]'>Improve your front-end skills by building projects</h1>
        <p className='w-full text-center font-outfit font-light text-xs text-[#a3a7b2]'>scan the QR to visit Frontend Mentor and take your coding skills to the next level</p>
      </div>
    </div>
  )
}

export default App