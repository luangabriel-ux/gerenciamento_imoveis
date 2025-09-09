/*
  # Criação da tabela de imóveis

  1. Nova Tabela
    - `imoveis`
      - `id` (uuid, chave primária)
      - `endereco` (texto)
      - `inquilino` (texto)
      - `valor` (decimal)
      - `data_vencimento` (inteiro)
      - `status_pagamento` (booleano)
      - `ultimo_pagamento` (timestamp com fuso horário, opcional)
      - `inicio_contrato` (data)
      - `fim_contrato` (data)
      - `user_id` (uuid, referência ao usuário autenticado)
      - `created_at` (timestamp com fuso horário)

  2. Segurança
    - Habilitar RLS na tabela `imoveis`
    - Adicionar políticas para:
      - Leitura: usuário só pode ver seus próprios imóveis
      - Inserção: usuário só pode inserir imóveis vinculados a ele
      - Atualização: usuário só pode atualizar seus próprios imóveis
*/

CREATE TABLE IF NOT EXISTS imoveis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endereco text NOT NULL,
  inquilino text NOT NULL,
  valor decimal(10,2) NOT NULL,
  data_vencimento integer NOT NULL CHECK (data_vencimento BETWEEN 1 AND 31),
  status_pagamento boolean DEFAULT false,
  ultimo_pagamento timestamptz,
  inicio_contrato date NOT NULL,
  fim_contrato date NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (inicio_contrato <= fim_contrato)
);

ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ler seus próprios imóveis"
  ON imoveis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios imóveis"
  ON imoveis
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios imóveis"
  ON imoveis
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);