import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Imovel } from '../types/imovel';

interface CadastroImovelProps {
  onAdicionar: (imovel: Omit<Imovel, 'id' | 'statusPagamento'>) => void;
}

export function CadastroImovel({ onAdicionar }: CadastroImovelProps) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [novoImovel, setNovoImovel] = useState({
    endereco: '',
    inquilino: '',
    valor: '',
    dataVencimento: '',
    inicioContrato: '',
    fimContrato: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdicionar({
      endereco: novoImovel.endereco,
      inquilino: novoImovel.inquilino,
      valor: Number(novoImovel.valor),
      dataVencimento: Number(novoImovel.dataVencimento),
      inicioContrato: novoImovel.inicioContrato,
      fimContrato: novoImovel.fimContrato
    });
    setNovoImovel({ 
      endereco: '', 
      inquilino: '', 
      valor: '', 
      dataVencimento: '',
      inicioContrato: '',
      fimContrato: ''
    });
    setMostrarForm(false);
  };

  return (
    <div className="mb-6">
      {!mostrarForm ? (
        <button
          onClick={() => setMostrarForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Cadastrar Novo Imóvel
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={novoImovel.endereco}
                onChange={(e) => setNovoImovel({ ...novoImovel, endereco: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inquilino
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={novoImovel.inquilino}
                onChange={(e) => setNovoImovel({ ...novoImovel, inquilino: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor do Aluguel
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-md"
                value={novoImovel.valor}
                onChange={(e) => setNovoImovel({ ...novoImovel, valor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dia do Vencimento
              </label>
              <input
                type="number"
                required
                min="1"
                max="31"
                className="w-full p-2 border rounded-md"
                value={novoImovel.dataVencimento}
                onChange={(e) => setNovoImovel({ ...novoImovel, dataVencimento: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Início do Contrato
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-md"
                value={novoImovel.inicioContrato}
                onChange={(e) => setNovoImovel({ ...novoImovel, inicioContrato: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fim do Contrato
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-md"
                value={novoImovel.fimContrato}
                onChange={(e) => setNovoImovel({ ...novoImovel, fimContrato: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cadastrar
            </button>
            <button
              type="button"
              onClick={() => setMostrarForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}