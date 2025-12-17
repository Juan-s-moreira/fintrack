import React from 'react'

const Fintrack = () => {
  return (
    <>
      <div className='bg-gray-900 h-screen gap-10 text-center flex justify-center items-center text-white'>
        <div className='bg-gray-500 w-45 h-25 rounded-sm'>
          <h2 className='text-emerald-400'>Income</h2>
          <div>
            <h2> $3500</h2>
          </div>
        </div>

        <div className='bg-gray-500 w-45 h-25 rounded-sm'>
          <h2 className='text-red-500'>Expenses</h2>
          <div>
            <h2>$1500</h2>
          </div>
        </div>


        <div className='bg-gray-500 rounded-sm items-center w-45 h-45 justify-center '>
          <h2 className='text-blue-400'>Balance</h2>
          <div>
            <h2>$2000 </h2>
          </div>
        </div>
      </div>
    </>
  )
}

export default Fintrack
