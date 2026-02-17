import { useState, useEffect } from 'react'
import axios from 'axios'
import TransactionModal from '../../components/TransactionModal'
import { useNavigate } from 'react-router'


const Fintrack = () => {

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [balance, setBalance] = useState(0)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income');
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

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
      setTransactions(data)

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

    <div className='bg-gray-900 md:h-screen h-[100dvh] flex flex-col items-center text-white md:p-10 p-4 overflow-hidden '>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        onSuccess={fetchFinanceData}

      />

      <h1 className="md:text-5xl text-lg text-center font-bold mb-6 text-gray-200 ">WELCOME TO YOUR
        <span className="text-blue-500"> FINTRACK </span>
        DASHBOARD</h1>

      <div className='w-full max-w-4xl flex gap-3 md:gap-6 flex-row shrink-0'>
        {/* INCOME */}
        <div className='flex-1 bg-gray-800 border-t-2 border-emerald-500 md:h-48 h-28 p-2 md:p-4 rounded-xl flex flex-col justify-center items-center shadow-2xl'>
          <h2 className='text-emerald-400 text-sm md:text-2xl font-bold uppercase tracking-[0.15em] mb-1 md:mb-4'>Income</h2>
          <div className='md:text-3xl text-lg font-bold text-white' id='income'>
            R$ {income.toFixed(2)}
          </div>
          <button
            onClick={() => handleOpenModal('income')}
            className='md:mt-4 mt-2 font-bold text-sm md:text-base border-2 border-emerald-500 rounded-xl p-1 md:p-1.5 hover:bg-emerald-600 transition-all duration-300 cursor-pointer text-gray-200 w-full max-w-[120px]'> INCOME</button>
        </div>

        {/* EXPENSES */}
        <div className='flex-1 p-2 bg-gray-800 border-t-2 border-red-500 md:h-48 h-28 md:p-4 rounded-xl flex flex-col justify-center items-center shadow-2xl'>
          <h2 className='text-red-500 text-sm md:text-2xl font-bold uppercase tracking-[0.15em] mb-1 md:mb-4'>Expenses</h2>
          <div className='md:text-3xl text-lg font-bold text-white' id='expenses'>
            R$ {expense.toFixed(2)}
          </div>
          <button className='md:mt-4 mt-2 font-bold text-sm md:text-base border-2 border-red-500 hover:bg-red-700 transition-all duration-300 cursor-pointer rounded-xl p-1 md:p-1.5 text-gray-200 w-full max-w-[120px]'
            onClick={() => handleOpenModal('expense')}
          >EXPENSES</button>

        </div>
      </div>

      <div className='md:mt-10 mt-6 flex items-center justify-center w-full'>
        {/* BALANCE*/}
        <div className='md:w-[40%] w-full bg-gray-800 border border-blue-500/50 md:h-56 h-28 rounded-2xl flex flex-col justify-center items-center shrink-0 '>
          <h2 className='text-blue-400 md:text-3xl text-lg font-bold uppercase tracking-[0.1em] mb-1 md:mb-6'>Balance</h2>
          <div className={`md:text-4xl text-2xl font-bold ${balance >= 0 ? 'text-blue-50' : 'text-red-500'}`} id='balance'>
            R$ {balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ---HISTORY --- */}

      <div className="w-full max-w-4xl mt-6 md:mt-12 flex-1 min-h-0 flex flex-col px-2 md:px-0">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-300">History</h3>
          <span className="text-gray-500 text-sm">Recent activity</span>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 flex flex-col flex-1 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto flex-1
    [&::-webkit-scrollbar-track]:bg-gray-800 
    [&::-webkit-scrollbar-thumb]:bg-gray-600 
    [&::-webkit-scrollbar-thumb]:rounded-full 
    [scrollbar-width:thin] 
    [scrollbar-color:#4B5563_transparent]
    ">
            <table className="w-full text-left border-collapse min-w-[500px]">

              <thead className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700">
                <tr className="text-gray-400 text-[10px] md:text-xs uppercase md:tracking-wider">
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">Date</th>
                  <th className="p-3 md:p-4 font-semibold">Description</th>
                  <th className="p-3 md:p-4 font-semibold text-center">Type</th>
                  <th className="p-3 md:p-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700 text-xs md:text-sm">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 text-sm md:text-base">
                      Sem dados ainda, Painho...
                    </td>
                  </tr>
                ) : (
                  transactions.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-700/50 transition-colors">

                      <td className="p-3 md:p-4 text-gray-400 whitespace-nowrap">
                        {new Date(item.date || item.createdAt).toLocaleDateString('pt-BR')}
                      </td>

                      <td className="p-3 md:p-4 font-medium text-white">
                        {item.description}
                      </td>

                      <td className="p-3 md:p-4 text-center">
                        <span className={`px-2 py-1 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${item.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                          {item.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>

                      <td className={`p-3 md:p-4 text-right font-bold text-sm md:text-base whitespace-nowrap ${item.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        {item.type === 'income' ? '+' : '-'} R$ {item.value.toFixed(2)}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="fixed top-10 right-2 md:top-8 md:right-8 z-50 flex items-center gap-2 bg-gray-800 hover:bg-red-500 hover:scale-110 text-gray-400 hover:text-white border border-gray-700 hover:border-red-500 px-5 py-3 rounded-2xl shadow-2xl transition-all duration-500 font-bold group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        <span className="hidden md:block font-bold">Logout</span>
      </button>
    </div >
  )
}

export default Fintrack