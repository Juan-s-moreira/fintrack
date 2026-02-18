import { useState, useEffect } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';


const TransactionModal = ({ isOpen, onClose, type, onSuccess, incomeToEdit }) => {

  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  const isEditing = !!incomeToEdit;

  useEffect(() => {
    if (isEditing && incomeToEdit) {
      setDescription(incomeToEdit.description);
      setValue(incomeToEdit.value);
    } else {
      setDescription('');
      setValue('');
    }
  }, [isOpen, isEditing, incomeToEdit]);

  if (!isOpen) return null;


  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      description,
      value: Number(value),
      type: isEditing ? incomeToEdit.type : type
    };

    try {
      if (isEditing) {

        await api.put(`/api/financeiro/${incomeToEdit._id}`, transactionData);

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
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
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

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${isIncome ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
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