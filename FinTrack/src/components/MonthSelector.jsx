
const MonthSelector = ( {mes, ano, onChangePeriod}) => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    const nextMonth = () => {
        if (mes === 12) {
            onChangePeriod({mes: 1, ano: ano + 1})
        } else {
            onChangePeriod({mes: mes + 1, ano})
        }
    }

    const prevMonth = () => {
        if (mes === 1) {
            onChangePeriod({mes: 12, ano: ano -1})
        } else {
            onChangePeriod( {mes: mes - 1, ano})
        }
    }

    return (
        <div className="flex items-center justify-center gap-5 my-6">
      <button 
        onClick={prevMonth} 
        className="px-4 py-2 font-bold text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-400 active:bg-gray-100 transition duration-200 ease-in-out cursor-pointer"
      >
        &lt;
      </button>
      
      <span className="text-xl font-bold text-gray-300 min-w-[160px] text-center select-none">
        {months[mes - 1]} {ano}
      </span>
      
      <button 
        onClick={nextMonth} 
        className="px-4 py-2 font-bold text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-400 active:bg-gray-100 transition duration-200 ease-in-out cursor-pointer"
      >
        &gt;
      </button>
    </div>
  )
}

export default MonthSelector

