import { useState, useEffect } from 'react';
import api from '../services/apii';
import Swal from 'sweetalert2';


const TransactionModal = ({ isOpen, onClose, type, onSuccess, incomeToEdit }) => {

  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [customCategory, setCustomCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [installments, setInstallments] = useState('');
  const [statementFile, setStatementFile] = useState(null);

  const isEditing = !!incomeToEdit;

  useEffect(() => {
    if (isEditing && incomeToEdit) {
      setDescription(incomeToEdit.description);
      setValue(incomeToEdit.value);
      setCategory(incomeToEdit.category || 'Alimentação');
      setCustomCategory(incomeToEdit.customCategory || '');
      setPaymentMethod(incomeToEdit.paymentMethod || 'Pix');
      setInstallments(incomeToEdit.installments || '');
    } else {
      setDescription('');
      setValue('');
      setCategory('Alimentação');
      setCustomCategory('');
      setPaymentMethod('Pix');
      setInstallments('');
      setStatementFile(null);
    }
  }, [isOpen, isEditing, incomeToEdit]);

  if (!isOpen) return null;


  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = category === 'other' ? (customCategory.trim() || 'Outros') : category;

    const transactionData = {
      description,
      value: Number(value),
      type: isEditing ? incomeToEdit.type : type,
      category: finalCategory,
      paymentMethod,
      installments: installments ? { current: 1, total: Number(installments) } : undefined,
    };

    try {
      if (isEditing) {

        await api.put(`/financeiro/${incomeToEdit._id}`, transactionData);

        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Transaction updated successfully.',
          background: '#1f2937', color: '#f3f4f6',
          timer: 1500, showConfirmButton: false
        });

      } else {
        await api.post('/financeiro/add', transactionData);
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'New transaction added.',
          background: '#1f2937', color: '#f3f4f6',
          timer: 1500, showConfirmButton: false
        });
      }


      setDescription('');
      setValue('');
      onSuccess();
      onClose();

    } catch (error) {
      console.error("Erro ao salvar:", error);
      const errorMsg = error.response?.data?.error || "Something went wrong, painho.";

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMsg,
        background: '#1f2937', color: '#f3f4f6'
      });
    }
  };

  const currentType = isEditing ? incomeToEdit.type : type;
  const isIncome = currentType === 'income';

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm p-4">

      <div className={`bg-gray-800 md:p-8 p-6 rounded-2xl w-full max-w-md border-2 ${isIncome ? 'border-emerald-500' : 'border-red-500'} shadow-2xl relative`}>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer text-2xl hover:scale-110"
        >
          X
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider text-center">
          {isEditing ? 'Edit Transaction' : (
            isIncome ? <span className="text-emerald-400">New Income</span> : <span className="text-red-500">New Expense</span>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="text-gray-400 text-sm ml-1 block mb-1">Description</label>
            <input
              type="text"
              placeholder="Ex: Salary, Market..."
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm ml-1 block mb-1">Amount (R$)</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className='text-gray-400 text-sm ml-1 block mb-1'>Category</label>
              <select
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Alimentacao">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Lazer">Lazer</option>
                <option value="Utilidades">Utilidades</option>
                <option value="Saude">Saúde</option>
                <option value="Educacao">Educação</option>
                <option value="other">Outro (personalizado)</option>
              </select>
            </div>
            <div>
              <label className='text-gray-400 text-sm ml-1 block mb-1'>Payment</label>
              <select
                className="w-full bg-gray-900 text-white cursor-pointer border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Pix">Pix</option>
                <option value="Credit Card">Cartão de Crédito</option>
                <option value="Debit Card">Cartão de Débito</option>
                <option value="Cash">Dinheiro</option>
                <option value="Bank Transfer">Transferência Bancária</option>
              </select>
            </div>
          </div>

          {category === 'other' && (
            <div>
              <label className='text-gray-400 text-sm ml-1 block mb-1'>Custom Category</label>
              <input
                type="text"
                placeholder="Ex: tatuagem, freela, Pet, Viagem..."
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required={category === 'other'}
              />
            </div>
          )}
          {!isIncome && (

            <div>
              <label className='text-gray-400 text-sm ml-1 block mb-1'> Quantidade de parcelas</label>
              <input type="number"
                placeholder="Ex: 12"
                min="1"
                max="99"
                className='w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer'
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className='text-gray-400 text-sm ml-1 block mb-1'>upload de Extrato</label>
            <input type="file"
              accept='.pdf,.csv,image/*'
              className='w-full bg-gray-900 text-gray-400 border border-gray-700 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer '
              onChange={(e) => setStatementFile(e.target.files[0])}
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 rounded-xl font-bold cursor-pointer text-white transition-all ${isIncome ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;