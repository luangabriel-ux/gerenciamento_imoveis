import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CadastroImovel } from './components/CadastroImovel';
import { ListaImoveis } from './components/ListaImoveis';
import { EditarImovel } from './components/EditarImovel';
import { Login } from './components/Login';
import { Imovel, StatusFiltro } from './types/imovel';
import { supabase } from './lib/supabase';

function App() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>('todos');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [imovelParaEditar, setImovelParaEditar] = useState<Imovel | null>(null);

  useEffect(() => {
    checkUser();
    
    // Verificar diariamente para reiniciar o status de pagamento
    const verificarReinicioMensal = () => {
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const diaAtual = hoje.getDate();
      
      // Se estamos no primeiro dia do mês, reiniciar os status
      if (diaAtual === 1) {
        reiniciarStatusPagamento();
      }
      
      // Agendar a próxima verificação para meia-noite
      const amanha = new Date(hoje);
      amanha.setDate(hoje.getDate() + 1);
      amanha.setHours(0, 0, 0, 0);
      
      const tempoAteProximaVerificacao = amanha.getTime() - hoje.getTime();
      
      setTimeout(() => {
        verificarReinicioMensal();
      }, tempoAteProximaVerificacao);
    };
    
    verificarReinicioMensal();
    
    // Verificar diariamente os dias de atraso
    const intervaloDiario = setInterval(() => {
      atualizarDiasAtraso();
    }, 24 * 60 * 60 * 1000); // 24 horas
    
    // Verificar imediatamente os dias de atraso ao carregar
    atualizarDiasAtraso();
    
    return () => {
      clearInterval(intervaloDiario);
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        carregarImoveis();
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setLoading(false);
    }
  }

  async function carregarImoveis() {
    try {
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const imoveisProcessados = data.map(imovel => ({
        ...imovel,
        id: imovel.id,
        valor: Number(imovel.valor),
        dataVencimento: imovel.data_vencimento,
        statusPagamento: imovel.status_pagamento,
        ultimoPagamento: imovel.ultimo_pagamento,
        inicioContrato: imovel.inicio_contrato,
        fimContrato: imovel.fim_contrato
      }));
      
      setImoveis(imoveisProcessados);
      atualizarDiasAtraso(imoveisProcessados);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      alert('Erro ao carregar os imóveis. Por favor, tente novamente.');
    }
  }

  function atualizarDiasAtraso(imoveisAtuais = imoveis) {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    const imoveisAtualizados = imoveisAtuais.map(imovel => {
      if (imovel.statusPagamento) {
        return { ...imovel, diasAtraso: 0 };
      }
      
      // Se o dia atual é maior que o dia de vencimento, está atrasado neste mês
      if (diaAtual > imovel.dataVencimento) {
        const diasAtraso = diaAtual - imovel.dataVencimento;
        return { ...imovel, diasAtraso };
      }
      
      return { ...imovel, diasAtraso: 0 };
    });
    
    setImoveis(imoveisAtualizados);
  }

  async function reiniciarStatusPagamento() {
    if (!user) return;
    
    try {
      console.log("Reiniciando status de pagamento para o início do mês");
      
      // Atualizar todos os imóveis para status pendente no início do mês
      const { error } = await supabase
        .from('imoveis')
        .update({ status_pagamento: false })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Recarregar os imóveis após a atualização
      carregarImoveis();
    } catch (error) {
      console.error('Erro ao reiniciar status de pagamento:', error);
    }
  }

  // Função para verificar e reiniciar manualmente o status de pagamento
  const verificarEResetarStatusPagamento = async () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    try {
      // Buscar todos os imóveis com pagamento registrado
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('status_pagamento', true);
        
      if (error) throw error;
      
      // Para cada imóvel, verificar se o último pagamento foi em um mês anterior
      const imoveisParaAtualizar = data.filter(imovel => {
        if (!imovel.ultimo_pagamento) return false;
        
        const dataPagamento = new Date(imovel.ultimo_pagamento);
        const mesPagamento = dataPagamento.getMonth();
        const anoPagamento = dataPagamento.getFullYear();
        
        // Se o pagamento foi em um mês anterior ou ano anterior
        return (mesPagamento < mesAtual && anoPagamento === anoAtual) || 
               (anoPagamento < anoAtual);
      });
      
      // Atualizar os imóveis que precisam ser resetados
      if (imoveisParaAtualizar.length > 0) {
        const ids = imoveisParaAtualizar.map(imovel => imovel.id);
        
        const { error: updateError } = await supabase
          .from('imoveis')
          .update({ status_pagamento: false })
          .in('id', ids);
          
        if (updateError) throw updateError;
        
        // Recarregar os imóveis após a atualização
        carregarImoveis();
      }
    } catch (error) {
      console.error('Erro ao verificar e resetar status de pagamento:', error);
    }
  };

  // Executar a verificação manual ao carregar a aplicação
  useEffect(() => {
    if (user) {
      verificarEResetarStatusPagamento();
    }
  }, [user]);

  const handleAdicionarImovel = async (novoImovel: Omit<Imovel, 'id' | 'statusPagamento'>) => {
    if (!user) {
      alert('Você precisa estar autenticado para cadastrar um imóvel.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('imoveis')
        .insert([{
          endereco: novoImovel.endereco,
          inquilino: novoImovel.inquilino,
          valor: novoImovel.valor,
          data_vencimento: novoImovel.dataVencimento,
          inicio_contrato: novoImovel.inicioContrato,
          fim_contrato: novoImovel.fimContrato,
          status_pagamento: false,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const novoImovelProcessado = {
        ...data,
        id: data.id,
        valor: Number(data.valor),
        dataVencimento: data.data_vencimento,
        statusPagamento: data.status_pagamento,
        ultimoPagamento: data.ultimo_pagamento,
        inicioContrato: data.inicio_contrato,
        fimContrato: data.fim_contrato,
        diasAtraso: 0
      };

      setImoveis(imoveis => [novoImovelProcessado, ...imoveis]);
    } catch (error) {
      console.error('Erro ao adicionar imóvel:', error);
      alert('Erro ao adicionar o imóvel. Por favor, tente novamente.');
    }
  };

  const handleEditarImovel = (imovel: Imovel) => {
    setImovelParaEditar(imovel);
  };

  const handleSalvarEdicao = async (dadosAtualizados: Omit<Imovel, 'id' | 'statusPagamento' | 'ultimoPagamento' | 'diasAtraso'>) => {
    if (!imovelParaEditar || !user) return;
    
    try {
      const { error } = await supabase
        .from('imoveis')
        .update({
          endereco: dadosAtualizados.endereco,
          inquilino: dadosAtualizados.inquilino,
          valor: dadosAtualizados.valor,
          data_vencimento: dadosAtualizados.dataVencimento,
          inicio_contrato: dadosAtualizados.inicioContrato,
          fim_contrato: dadosAtualizados.fimContrato
        })
        .eq('id', imovelParaEditar.id);

      if (error) throw error;

      setImoveis(imoveis => imoveis.map(imovel => {
        if (imovel.id === imovelParaEditar.id) {
          return {
            ...imovel,
            endereco: dadosAtualizados.endereco,
            inquilino: dadosAtualizados.inquilino,
            valor: dadosAtualizados.valor,
            dataVencimento: dadosAtualizados.dataVencimento,
            inicioContrato: dadosAtualizados.inicioContrato,
            fimContrato: dadosAtualizados.fimContrato
          };
        }
        return imovel;
      }));
      
      setImovelParaEditar(null);
    } catch (error) {
      console.error('Erro ao editar imóvel:', error);
      alert('Erro ao editar o imóvel. Por favor, tente novamente.');
    }
  };

  const handleExcluirImovel = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('imoveis')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImoveis(imoveis => imoveis.filter(imovel => imovel.id !== id));
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      alert('Erro ao excluir o imóvel. Por favor, tente novamente.');
    }
  };

  const handlePagamento = async (id: string) => {
    try {
      const ultimoPagamento = new Date().toISOString();
      const { error } = await supabase
        .from('imoveis')
        .update({
          status_pagamento: true,
          ultimo_pagamento: ultimoPagamento
        })
        .eq('id', id);

      if (error) throw error;

      setImoveis(imoveis => imoveis.map(imovel => {
        if (imovel.id === id) {
          return {
            ...imovel,
            statusPagamento: true,
            ultimoPagamento,
            diasAtraso: 0
          };
        }
        return imovel;
      }));
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      alert('Erro ao registrar o pagamento. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Carregando...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={checkUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CadastroImovel onAdicionar={handleAdicionarImovel} />
        <ListaImoveis
          imoveis={imoveis}
          onPagamento={handlePagamento}
          onEditar={handleEditarImovel}
          onExcluir={handleExcluirImovel}
          filtroStatus={filtroStatus}
          onChangeFiltro={setFiltroStatus}
        />
        {imovelParaEditar && (
          <EditarImovel
            imovel={imovelParaEditar}
            onSalvar={handleSalvarEdicao}
            onCancelar={() => setImovelParaEditar(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;