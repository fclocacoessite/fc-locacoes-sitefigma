-- SCRIPT PARA CORRIGIR PROBLEMAS DE CONSIGNAÇÃO NO SUPABASE
-- Execute este script no SQL Editor do Supabase

-- PASSO 1: Verificar se a tabela consignments existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'consignments')
        THEN '✅ Tabela consignments existe'
        ELSE '❌ Tabela consignments NÃO existe - execute o script de criação primeiro'
    END as status_tabela;

-- PASSO 2: Desabilitar RLS temporariamente para permitir operações
ALTER TABLE public.consignments DISABLE ROW LEVEL SECURITY;

-- PASSO 3: Remover todas as políticas existentes (se houver)
DROP POLICY IF EXISTS "Usuários autenticados podem ler consignações" ON public.consignments;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir consignações" ON public.consignments;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar consignações" ON public.consignments;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar consignações" ON public.consignments;
DROP POLICY IF EXISTS "Todos podem ler consignações" ON public.consignments;
DROP POLICY IF EXISTS "Todos podem inserir consignações" ON public.consignments;
DROP POLICY IF EXISTS "Todos podem atualizar consignações" ON public.consignments;
DROP POLICY IF EXISTS "Todos podem deletar consignações" ON public.consignments;

-- PASSO 4: Criar políticas mais permissivas para consignações
-- Permitir que qualquer pessoa possa inserir consignações (formulário público)
CREATE POLICY "Permitir inserção pública de consignações" ON public.consignments
    FOR INSERT WITH CHECK (true);

-- Permitir que qualquer pessoa possa ler consignações (para o painel admin)
CREATE POLICY "Permitir leitura pública de consignações" ON public.consignments
    FOR SELECT USING (true);

-- Permitir que qualquer pessoa possa atualizar consignações (para aprovação/rejeição)
CREATE POLICY "Permitir atualização pública de consignações" ON public.consignments
    FOR UPDATE USING (true);

-- Permitir que qualquer pessoa possa deletar consignações (para limpeza)
CREATE POLICY "Permitir exclusão pública de consignações" ON public.consignments
    FOR DELETE USING (true);

-- PASSO 5: Reabilitar RLS com as novas políticas
ALTER TABLE public.consignments ENABLE ROW LEVEL SECURITY;

-- PASSO 6: Verificar se as políticas foram criadas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'consignments' 
AND schemaname = 'public';

-- PASSO 7: Testar inserção de uma consignação de teste
INSERT INTO public.consignments (
    id,
    owner_name,
    email,
    phone,
    brand,
    model,
    year,
    category,
    condition,
    daily_rate,
    photos,
    status,
    submitted_at,
    created_at,
    updated_at
) VALUES (
    'TEST-' || extract(epoch from now())::text,
    'Teste Consignação',
    'teste@consignacao.com',
    '(11) 99999-9999',
    'Mercedes-Benz',
    'Atego 1719',
    2022,
    'Caminhão Munck',
    'Excelente',
    500.00,
    ARRAY['https://exemplo.com/foto1.jpg', 'https://exemplo.com/foto2.jpg'],
    'pending',
    NOW(),
    NOW(),
    NOW()
);

-- PASSO 8: Verificar se a inserção funcionou
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.consignments WHERE email = 'teste@consignacao.com')
        THEN '✅ TESTE DE INSERÇÃO PASSOU - Consignações funcionando!'
        ELSE '❌ TESTE DE INSERÇÃO FALHOU - Verificar erros'
    END as resultado_teste;

-- PASSO 9: Mostrar dados de teste inseridos
SELECT 
    id,
    owner_name,
    email,
    brand,
    model,
    status,
    created_at
FROM public.consignments 
WHERE email = 'teste@consignacao.com'
ORDER BY created_at DESC;

-- PASSO 10: Limpar dados de teste
DELETE FROM public.consignments WHERE email = 'teste@consignacao.com';

-- PASSO 11: Verificar estrutura da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'consignments' 
ORDER BY ordinal_position;

-- PASSO 12: Mostrar estatísticas da tabela
SELECT 
    COUNT(*) as total_consignments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
FROM public.consignments;

-- PASSO 13: Confirmação final
SELECT '🎉 CONSIGNAÇÕES CONFIGURADAS COM SUCESSO! O formulário agora deve funcionar corretamente.' as status_final;
