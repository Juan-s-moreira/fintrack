import React, { useState } from 'react';
import axios from 'axios';

const TransactionModal = ({ isOpen, onClose, type, onSuccess }) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');


      await axios.post('http://localhost:3000/api/financeiro/add', {
        description,
        value: Number(value),
        type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });


      setDescription('');
      setValue('');


      onSuccess();
      onClose(); // Fecha a janela

    } catch (error) {
      alert("Erro ao salvar, painho! " + error.message);
    }
  };

  return (

    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">

      {/*  Modal */}
      <div className={`bg-gray-800 md:p-8 p-4 rounded-2xl md:w-96 w-56 border-2 ${type === 'income' ? 'border-emerald-500' : 'border-red-500'} shadow-2xl`}>

        <h2 className="md:text-2xl text-lg font-bold text-white mb-2 md:mb-6 uppercase tracking-wider text-center">
          Nova {type === 'income' ? <span className="text-emerald-400">Receita </span> : <span className="text-red-500">Despesa </span>}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-gray-400 text-sm ml-1">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Salário, Pizza..."
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg md:p-3 p-1 focus:outline-none focus:border-blue-500 transition-colors"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm ml-1">Valor (R$)</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg md:p-3 p-1 focus:outline-none focus:border-blue-500 transition-colors"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              step="0.01"
            />
          </div>

          <div className="flex gap-3 md:mt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 md:text-base text-sm  bg-gray-700 hover:bg-gray-600 text-white py-1.5 md:py-3 rounded-xl font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 text-sm md:text-base md:py-3 py-1.5 rounded-xl font-bold text-white transition-all ${type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              Salvar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TransactionModal;