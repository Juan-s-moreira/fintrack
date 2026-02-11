import { useState, useEffect } from 'react'
import axios from 'axios'
import TransactionModal from '../../components/TransactionModal'


const Fintrack = () => {

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [balance, setBalance] = useState(0)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income');
  // const [transactions, setTransactions] = useState([]);


  
    const fetchFinanceData = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          console.log('Sem token painho! Loga ai pa nois');
          return
        }

        const response = await axios.get('http://localhost:3000/api/financeiro/get', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = response.data
        // setTransactions(data)

        const totalIncome = data
          .filter(item => item.type === 'income')
          .reduce((acc, curr) => acc + curr.value, 0)

        const totalExpense = data
          .filter(item => item.type === 'expense')
          .reduce((acc, curr) => acc + curr.value, 0)

        setIncome(totalIncome)
        setExpense(totalExpense)
        setBalance(totalIncome - totalExpense)
      } catch (error) {
        console.error('Erro ao buscar seus dados veinho', error);
      }

    }
    useEffect(() => {
    fetchFinanceData()
  }, [])

  const handleOpenModal = (type) => {
    setModalType(type)
    setIsModalOpen(true)
  }




  return (

    <div className='bg-gray-900 min-h-screen flex flex-col items-center text-white p-10'>


      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        onSuccess={fetchFinanceData}

      />

      <h1 className="text-5xl font-bold mb-6 text-gray-200 ">WELCOME TO YOUR
        <span className="text-blue-500"> FINTRACK </span>
        DASHBOARD</h1>

      <div className='w-full max-w-4xl flex gap-6 flex-wrap md:flex-nowrap'>
        {/* Card de Ganhos */}
        <div className='flex-1 bg-gray-800 border-t-4 border-emerald-500 h-48 rounded-xl flex flex-col justify-center items-center shadow-2xl'>
          <h2 className='text-emerald-400 text-2xl font-bold uppercase tracking-[0.2em] mb-4'>Income</h2>
          <div className='text-3xl font-bold text-white' id='income'>
            R$ {income.toFixed(2)}
          </div>
          <button
            onClick={() => handleOpenModal('income')}
            className='mt-4 font-bold border-2 border-emerald-500 rounded-xl p-1.5 hover:bg-emerald-600 transition-all duration-300 cursor-pointer text-gray-200 '>ADD INCOME</button>
        </div>

        {/* Card de Despesas */}
        <div className='flex-1 bg-gray-800 border-t-4 border-red-500 h-48 rounded-xl flex flex-col justify-center items-center shadow-2xl'>
          <h2 className='text-red-500 text-2xl font-bold uppercase tracking-[0.2em] mb-4'>Expenses</h2>
          <div className='text-3xl font-black text-white' id='expenses'>
            R$ {expense.toFixed(2)}
          </div>
          <button className='mt-4 font-bold border-2 border-red-500 hover:bg-red-700 transition-all duration-300 cursor-pointer rounded-xl p-1.5 text-gray-200 '
            onClick={() => handleOpenModal('expense')}
          >ADD EXPENSES</button>

        </div>
      </div>

      <div className='flex-1 flex items-center justify-center w-full'>
        {/* Card de Balanço  */}
        <div className='w-[40%] bg-gray-800 border border-blue-500/50 h-56 rounded-2xl flex flex-col justify-center items-center '>
          <h2 className='text-blue-400 text-3xl font-bold uppercase tracking-[0.3em] mb-6'>Balance</h2>
          <div className={`text-4xl font-black ${balance >= 0 ? 'text-blue-50' : 'text-red-500'}`} id='balance'>
            R$ {balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* --- LISTA DE HISTÓRICO --- */}


    </div >
  )
}

export default Fintrack