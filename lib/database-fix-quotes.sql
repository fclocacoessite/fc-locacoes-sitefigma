-- Script para corrigir a tabela de orçamentos
-- Execute este script no Supabase SQL Editor

-- Alterar a coluna client_id para permitir NULL (orçamentos anônimos)
ALTER TABLE public.quotes 
ALTER COLUMN client_id DROP NOT NULL;

-- Atualizar políticas de segurança para permitir orçamentos anônimos
DROP POLICY IF EXISTS "Usuários podem criar orçamentos" ON public.quotes;
CREATE POLICY "Qualquer um pode criar orçamentos" ON public.quotes
  FOR INSERT WITH CHECK (true);

-- Atualizar política de visualização para incluir orçamentos sem client_id
DROP POLICY IF EXISTS "Usuários podem ver próprios orçamentos" ON public.quotes;
CREATE POLICY "Usuários podem ver próprios orçamentos e admins veem todos" ON public.quotes
  FOR SELECT USING (
    client_id = auth.uid() OR 
    client_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );
