

const Fintrack = () => {


  function calculateBalance(income, expenses) {
    return income - expenses;
  }



  return (

    <div className='bg-gray-900 h-screen flex flex-col items-center text-white p-10'>

      <h1 className="text-5xl font-bold mb-6 text-gray-200 ">WELCOME TO YOUR 
        <span className="text-blue-500"> FINTRACK </span>
         DASHBOARD</h1>

      <div className='w-[60%] flex gap-6 mt-4'>
        {/* Card de Ganhos */}
        <div className='flex-1 bg-gray-800 border-t-4 border-emerald-500 h-48 rounded-xl flex flex-col justify-center items-center shadow-2xl'>
          <h2 className='text-emerald-400 text-2xl font-bold uppercase tracking-[0.2em] mb-4'>Income</h2>
          <div className='text-3xl font-bold text-white' id='income'>
            R$3,500
          </div>
          <button className='mt-4 font-bold border-2 border-emerald-500 rounded-xl p-1.5 hover:bg-emerald-600 transition-all duration-300 cursor-pointer text-gray-200 '>ADD INCOME</button>
        </div>

        {/* Card de Despesas */}
        <div className='flex-1 bg-gray-800 border-t-4 border-red-500 h-48 rounded-xl flex flex-col justify-center items-center shadow-2xl'>
          <h2 className='text-red-500 text-2xl font-bold uppercase tracking-[0.2em] mb-4'>Expenses</h2>
          <div className='text-3xl font-black text-white' id='expenses'>
            R$1,500
          </div>
          <button className='mt-4 font-bold border-2 border-red-500 hover:bg-red-700 transition-all duration-300 cursor-pointer rounded-xl p-1.5 text-gray-200 '>ADD EXPENSES</button>

        </div>
      </div>

      <div className='flex-1 flex items-center justify-center w-full'>
        {/* Card de Balanço  */}
        <div className='w-[40%] bg-gray-800 border border-blue-500/50 h-56 rounded-2xl flex flex-col justify-center items-center '>
          <h2 className='text-blue-400 text-3xl font-bold uppercase tracking-[0.3em] mb-6'>Balance</h2>
          <div className='text-4xl font-black text-blue-50' id='balance'>
            R${calculateBalance(3500, 1500)}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Fintrack