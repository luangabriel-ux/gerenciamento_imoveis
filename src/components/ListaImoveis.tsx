import React, { useState } from 'react';
import { Check, X, Printer, Info, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Imovel, StatusFiltro } from '../types/imovel';

interface ListaImoveisProps {
  imoveis: Imovel[];
  onPagamento: (id: string) => void;
  onEditar: (imovel: Imovel) => void;
  onExcluir: (id: string) => void;
  filtroStatus: StatusFiltro;
  onChangeFiltro: (status: StatusFiltro) => void;
}

export function ListaImoveis({ 
  imoveis, 
  onPagamento, 
  onEditar, 
  onExcluir, 
  filtroStatus, 
  onChangeFiltro 
}: ListaImoveisProps) {
  const [imovelSelecionado, setImovelSelecionado] = useState<Imovel | null>(null);
  const [confirmExcluir, setConfirmExcluir] = useState<string | null>(null);

  const imoveisFiltrados = imoveis.filter((imovel) => {
    if (filtroStatus === 'pagos') return imovel.statusPagamento;
    if (filtroStatus === 'pendentes') return !imovel.statusPagamento;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleConfirmExcluir = (id: string) => {
    onExcluir(id);
    setConfirmExcluir(null);
    setImovelSelecionado(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {imovelSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 print:hidden z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Detalhes do Contrato</h3>
            <div className="space-y-3">
              <p><strong>Inquilino:</strong> {imovelSelecionado.inquilino}</p>
              <p><strong>Endereço:</strong> {imovelSelecionado.endereco}</p>
              <p><strong>Valor do Aluguel:</strong> {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(imovelSelecionado.valor)}</p>
              <p><strong>Início do Contrato:</strong> {formatarData(imovelSelecionado.inicioContrato)}</p>
              <p><strong>Fim do Contrato:</strong> {formatarData(imovelSelecionado.fimContrato)}</p>
              <p><strong>Dia do Vencimento:</strong> {imovelSelecionado.dataVencimento}</p>
              {imovelSelecionado.ultimoPagamento && (
                <p><strong>Último Pagamento:</strong> {formatarData(imovelSelecionado.ultimoPagamento)}</p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => setImovelSelecionado(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fechar
              </button>
              {!imovelSelecionado.statusPagamento && (
                <button
                  onClick={() => {
                    onPagamento(imovelSelecionado.id);
                    setImovelSelecionado(null);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <Check size={18} />
                  Registrar Pagamento
                </button>
              )}
              <button
                onClick={() => {
                  onEditar(imovelSelecionado);
                  setImovelSelecionado(null);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Edit size={18} />
                Editar
              </button>
              <button
                onClick={() => setConfirmExcluir(imovelSelecionado.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                <Trash2 size={18} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 print:hidden z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Confirmar Exclusão</h3>
            <p className="mb-4">Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmExcluir(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmExcluir(confirmExcluir)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChangeFiltro('todos')}
            className={`px-3 py-1 rounded-full ${
              filtroStatus === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onChangeFiltro('pagos')}
            className={`px-3 py-1 rounded-full ${
              filtroStatus === 'pagos'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pagos
          </button>
          <button
            onClick={() => onChangeFiltro('pendentes')}
            className={`px-3 py-1 rounded-full ${
              filtroStatus === 'pendentes'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendentes
          </button>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center"
        >
          <Printer size={20} />
          Imprimir
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="block sm:hidden">
          {imoveisFiltrados.map((imovel) => (
            <div key={imovel.id} className="p-4 border-b">
              <div className="space-y-2">
                <div className="font-medium">{imovel.endereco}</div>
                <div className="text-sm text-gray-600">{imovel.inquilino}</div>
                <div className="text-sm">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(imovel.valor)}
                </div>
                <div className="text-sm">Vencimento: Dia {imovel.dataVencimento}</div>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      imovel.statusPagamento
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {imovel.statusPagamento ? (
                      <>
                        <Check size={14} className="mr-1" />
                        Pago
                      </>
                    ) : (
                      <>
                        <X size={14} className="mr-1" />
                        Pendente
                      </>
                    )}
                  </span>
                  {!imovel.statusPagamento && imovel.diasAtraso && imovel.diasAtraso > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <AlertCircle size={14} className="mr-1" />
                      {imovel.diasAtraso} {imovel.diasAtraso === 1 ? 'dia' : 'dias'} de atraso
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setImovelSelecionado(imovel)}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  >
                    <Info size={16} />
                    Detalhes
                  </button>
                  {!imovel.statusPagamento && (
                    <button
                      onClick={() => onPagamento(imovel.id)}
                      className="text-green-600 hover:text-green-900 flex items-center gap-1"
                    >
                      <Check size={16} />
                      Registrar Pagamento
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <table className="w-full hidden sm:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endereço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inquilino
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:hidden">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {imoveisFiltrados.map((imovel) => (
              <tr key={imovel.id}>
                <td className="px-6 py-4 whitespace-nowrap">{imovel.endereco}</td>
                <td className="px-6 py-4 whitespace-nowrap">{imovel.inquilino}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(imovel.valor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">Dia {imovel.dataVencimento}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      imovel.statusPagamento
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {imovel.statusPagamento ? (
                      <>
                        <Check size={14} className="mr-1" />
                        Pago
                      </>
                    ) : (
                      <>
                        <X size={14} className="mr-1" />
                        Pendente
                      </>
                    )}
                  </span>
                  {!imovel.statusPagamento && imovel.diasAtraso && imovel.diasAtraso > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <AlertCircle size={14} className="mr-1" />
                      {imovel.diasAtraso} {imovel.diasAtraso === 1 ? 'dia' : 'dias'} de atraso
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap print:hidden">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setImovelSelecionado(imovel)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Info size={16} />
                      Detalhes
                    </button>
                    {!imovel.statusPagamento && (
                      <button
                        onClick={() => onPagamento(imovel.id)}
                        className="text-green-600 hover:text-green-900 flex items-center gap-1"
                      >
                        <Check size={16} />
                        Registrar Pagamento
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}