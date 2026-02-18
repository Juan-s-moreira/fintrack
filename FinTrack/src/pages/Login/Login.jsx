import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../services/apii";
import heroImage from '../../assets/wallet-home.png';


const Login = () => {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await api.post('/login', { email, password })
            const token = response.data.token

            localStorage.setItem('token', token)
            navigate('/fintrack')
        } catch (error) {
            alert("vish painho, ó pai ó, deu ruim no login", error)
            setIsLoading(false)

        }
    }


    const bgImage = heroImage;

    return (
        <div className="min-h-screen flex bg-gray-900 text-white">
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 z-10 bg-gray-900">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="mt-6 text-4xl font-extrabold">
                            Welcome!
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Access your <span className="text-blue-500">Fintrack</span></p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                    Email
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                            </div>

                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center mt-2 py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : 'Sign In'}

                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <Link to="/register"
                                className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
                                Don't have an account? Register now!
                            </Link>
                        </div>
                    </form>
                </div>

            </div>

            <div className="hidden md:flex md:w-1/2 bg-gray-900 items-center justify-center relative border-l border-gray-800">
                <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[1px]"></div>
                <img
                    src={bgImage}
                    alt="FinTrack Wallet"
                    className=" md:w-100 md:h-100 object-contain z-10  "
                />

            </div>



        </div>
    )
}

export default Login
