import { useState } from "react"
import api from "../../services/apii";
import Swal from 'sweetalert2'
import { Link, useNavigate } from "react-router-dom"
import heroImage from '../../assets/wallet-home.png';
import CodeVerificationModal from "../../components/CodeVerficationModal";


const Register = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const navigate = useNavigate()


    const handleRegister = async (e) => {
        e.preventDefault()

        if (password !== repeatPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ei painho, ta errado!',
                background: '#1f2937', color: '#f3f4f6',
                confirmButtonColor: '#ef4444'
            })
            return
        }

        setIsLoading(true)

        try {
            const { status } = await api.post('/register', {
                email: email,
                password: password,
                repeat_password: repeatPassword
            })

            if (status === 201 || status === 200) {
                setRegisteredEmail(email);
                setIsModalOpen(true);

            }


        } catch (error) {

            const errorMessage = error.response?.data?.message || 'Registration failed. Try again.'

            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: errorMessage,
                background: '#1f2937', color: '#f3f4f6',
                confirmButtonColor: '#ef4444'
            })
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 relative overflow-hidden">


            <div className="w-full max-w-md bg-gray-800 border border-gray-700 p-8 rounded-3xl shadow-2xl z-10">
                <div className="flex justify-center mb-6">
                    <img src={heroImage} alt="FinTrack Logo" className="w-20 h-20 object-contain drop-shadow-lg" />
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-400">Join <span className="text-blue-500 font-bold">FinTrack</span></p>
                </div>

                <CodeVerificationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    email={registeredEmail}
                    onSuccess={() => navigate('/login')}
                />


                <form onSubmit={handleRegister} className="space-y-5">

                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Email</label>
                        <input
                            type="email" required
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="your@email.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Password</label>
                        <input
                            type="password" required minLength="8"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Minimum 8 characters"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* REPEAT PASSWORD */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Repeat Password</label>
                        <input
                            type="password" required minLength="8"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Type your password again"
                            value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className={`w-full py-3 px-4 font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 mt-4 ${isLoading ? 'opacity-70' : ''}`}>
                        {isLoading ? 'Criando conta...' : 'Cadastrar'}
                    </button>

                    <div className="text-sm text-center mt-6">
                        <Link to="/login" className="font-medium text-gray-400 hover:text-blue-400 transition-colors">
                            Already havee an account? <span className="text-blue-500">Sign In</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register