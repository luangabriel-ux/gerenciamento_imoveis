import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Imovel } from '../types/imovel';

interface EditarImovelProps {
  imovel: Imovel;
  onSalvar: (imovel: Omit<Imovel, 'id' | 'statusPagamento' | 'ultimoPagamento' | 'diasAtraso'>) => void;
  onCancelar: () => void;
}

export function EditarImovel({ imovel, onSalvar, onCancelar }: EditarImovelProps) {
  const [dadosImovel, setDadosImovel] = useState({
    endereco: '',
    inquilino: '',
    valor: '',
    dataVencimento: '',
    inicioContrato: '',
    fimContrato: ''
  });

  useEffect(() => {
    setDadosImovel({
      endereco: imovel.endereco,
      inquilino: imovel.inquilino,
      valor: imovel.valor.toString(),
      dataVencimento: imovel.dataVencimento.toString(),
      inicioContrato: imovel.inicioContrato,
      fimContrato: imovel.fimContrato
    });
  }, [imovel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar({
      endereco: dadosImovel.endereco,
      inquilino: dadosImovel.inquilino,
      valor: Number(dadosImovel.valor),
      dataVencimento: Number(dadosImovel.dataVencimento),
      inicioContrato: dadosImovel.inicioContrato,
      fimContrato: dadosImovel.fimContrato
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Editar Imóvel</h3>
          <button
            onClick={onCancelar}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={dadosImovel.endereco}
                onChange={(e) => setDadosImovel({ ...dadosImovel, endereco: e.target.value })}
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
                value={dadosImovel.inquilino}
                onChange={(e) => setDadosImovel({ ...dadosImovel, inquilino: e.target.value })}
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
                value={dadosImovel.valor}
                onChange={(e) => setDadosImovel({ ...dadosImovel, valor: e.target.value })}
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
                value={dadosImovel.dataVencimento}
                onChange={(e) => setDadosImovel({ ...dadosImovel, dataVencimento: e.target.value })}
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
                value={dadosImovel.inicioContrato}
                onChange={(e) => setDadosImovel({ ...dadosImovel, inicioContrato: e.target.value })}
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
                value={dadosImovel.fimContrato}
                onChange={(e) => setDadosImovel({ ...dadosImovel, fimContrato: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancelar}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}