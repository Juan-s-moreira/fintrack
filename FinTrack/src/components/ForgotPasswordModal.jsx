import { useState } from 'react'
import api from '../services/apii'
import Swal from 'sweetalert2'

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('')
    const [step, setStep] = useState(1)
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen) return null;

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/auth/forgotPassword', { email });

            await Swal.fire({
                icon: 'success',
                title: 'Código enviado, painho!',
                text: 'Verifique seu e-mail para pegar o código de recuperação.',
                background: '#1f2937', color: '#f3f4f6',
                confirmButtonColor: '#3b82f6',
                timer: 2000, showConfirmButton: false
            });
            setStep(2)
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || "Não foi possível enviar o código, veinho.";

            Swal.fire({
                icon: 'error',
                title: 'Ops...',
                text: errorMsg,
                background: '#1f2937', color: '#f3f4f6',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await api.post('/auth/verify-code', { email, code })

            await Swal.fire({
                icon: 'success',
                title: 'Código validado!',
                text: 'Agora crie sua nova senha.',
                background: '#1f2937', color: '#f3f4f6',
                confirmButtonColor: '#3b82f6',
                timer: 1500, showConfirmButton: false
            });

            setStep(3)
        } catch (error) {
            console.error(error)
            const errorMsg = error.response?.data.error || "Codigo invalido veinho"

            Swal.fire({
                icon: 'error',
                title: 'Ops...',
                text: errorMsg,
                background: '#1f2937', color: '#f3f4f6',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsLoading(false)
        }

    }

    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            return Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'As senhas não coincidem!',
                background: '#1f2937', color: '#f3f4f6',
                confirmButtonColor: '#f59e0b'
            });
        }

        setIsLoading(true)

        try {
            await api.post('/auth/resetPassword', { email, code, newPassword })

            await Swal.fire({
                icon: 'success',
                title: 'Senha alterada, painho!',
                text: 'Agora é só fazer o login com a sua nova senha.',
                background: '#1f2937', color: '#f3f4f6',
                confirmButtonColor: '#3b82f6',
                timer: 2500, showConfirmButton: false
            })

            handleClose()
        } catch (error) {
            console.error(error)
            const errorMsg = error.response?.data?.error || "Nao deu pra mudar a senha nengue"

            Swal.fire({
                icon: 'error',
                title: 'Ops...',
                text: errorMsg,
                background: '#1f2937', color: '#f3f4f6',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setStep(1)
        setEmail('')
        setCode('')
        setNewPassword('')
        setConfirmPassword('')
        onClose()
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop:blur-sm p-4'>
            <div className='bg-gray-800 md:p-8 p-6 rounded-2xl w-full max-w-sm border-2 border-blue-500 shadow-2xl relative text-center'>
                <button
                    onClick={handleClose}
                    className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 text-2xl cursor-pointer hover:scale-110'
                >
                    X
                </button>
                {step === 1 && (
                    <>


                        <h2 className='text-2xl font-bold text-white mb-2'>Esqueci a senha</h2>
                        <p className='text-gray-400 text-sm mb-6'>
                            Insira seu email para receber o codigo de recuperação de senha.
                        </p>

                        <form onSubmit={handleSendEmail} className='flex flex-col gap-4'>
                            <input type="email"
                                placeholder='Digite seu email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 text-center text-sm font-bold focus:outline-none focus:border-blue-500 transition-colors'
                                required
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 mt-2 rounded-xl font-bold text-white transition-all cursor-pointer ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isLoading ? 'Sending...' : 'Send Code'}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className='text-2xl font-bold text-white mb-2'>
                            Verify Code
                        </h2>
                        <p className='text-gray-400 text-sm mb-6'>
                            Mandamos um codigo de 6 digitos para <span className='text-blue-400 font-bold'>{email}</span>
                        </p>

                        <form onSubmit={handleVerifyCode} className='flex flex-col gap-4'>
                            <input type="text"
                                maxLength="6"
                                placeholder='000000'
                                className='w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:border-blue-500 transition-colors'
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                required
                            />

                            <button
                                type='submit'
                                disabled={isLoading || code.length < 6}
                                className={`w-full py-3 mt-2 rounded-xl font-bold text-white transition-all ${isLoading || code.length < 6 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>

                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2">Nova Senha</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Crie uma nova senha para sua conta nengue
                        </p>

                        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                            <input
                                type="password"
                                placeholder="Nova senha"
                                className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-colors"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Confirme a senha"
                                className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-colors"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 mt-2 rounded-xl font-bold text-white transition-all cursor-pointer ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                                    }`}
                            >
                                {isLoading ? 'Saving...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

            </div>
        </div>
    )
}

export default ForgotPasswordModal
