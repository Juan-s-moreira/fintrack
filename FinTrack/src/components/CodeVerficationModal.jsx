
import { useState } from 'react';
import api from '../services/apii';
import Swal from 'sweetalert2';

const CodeVerificationModal = ({ isOpen, onClose, email, onSuccess }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      await api.post('/verify-email', { email, code });

      await Swal.fire({
        icon: 'success',
        title: 'Sucesso, painho!',
        text: 'E-mail verificado. Agora é só fazer o login!',
        background: '#1f2937', color: '#f3f4f6',
        confirmButtonColor: '#3b82f6',
        timer: 2000, showConfirmButton: false
      });

      setCode('');
      onSuccess(); 

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || "Código inválido, veinho.";
      
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

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm p-4">
      <div className="bg-gray-800 md:p-8 p-6 rounded-2xl w-full max-w-sm border-2 border-blue-500 shadow-2xl relative text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 text-2xl cursor-pointer hover:scale-110"
        >
          X
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Verify Your E-mail</h2>
        <p className="text-gray-400 text-sm mb-6">
          We sent a 6-digit code to  <span className="text-blue-400 font-bold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            maxLength="6"
            placeholder="000000"
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:border-blue-500 transition-colors"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} 
            required
          />

          <button
            type="submit"
            disabled={isLoading || code.length < 6}
            className={`w-full py-3 mt-2 rounded-xl font-bold text-white transition-all ${
              isLoading || code.length < 6 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Confirm Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodeVerificationModal;