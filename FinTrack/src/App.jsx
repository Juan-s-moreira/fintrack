import { Link, Route } from 'react-router'
import './App.css'


function Home() {
  return (
    <>
      <div className='bg-gray-900 h-screen flex flex-col text-center text-white'>
        <div className='m-auto'>
          <div className='border-3 border-blue-500 rounded-full h-[14rem] w-[14rem] mx-auto my-12'>
            <img src="src/assets/wallet-home.png" alt="black-wallet" />
          </div>
          <div>
            <h1 className='text-5xl font-bold m-5'>Welcome to
              <span className='text-blue-500'> FinTrack</span>
            </h1>
            <p className='text-lg text-gray-200 mb-6'>Track your finances effortlessly and take control of your goals.</p>

            <button >
              <a href="fintrack"  className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-md hover:shadow-lg'>
                Wallet home
              </a>
              {/* Começar */}
            </button>
          </div>
        </div>
      </div>




    </>
  )


}

export default Home
