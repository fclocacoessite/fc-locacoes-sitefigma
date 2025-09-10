-- Script para testar a estrutura da tabela quotes
-- Execute este script no Supabase SQL Editor para verificar se tudo está funcionando

-- 1. Verificar se a tabela quotes existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quotes') 
        THEN '✅ Tabela quotes existe'
        ELSE '❌ Tabela quotes NÃO existe'
    END as status_tabela;

-- 2. Verificar estrutura da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quotes' 
ORDER BY ordinal_position;

-- 3. Verificar se as colunas obrigatórias existem
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'client_email') 
        THEN '✅ Coluna client_email existe'
        ELSE '❌ Coluna client_email NÃO existe'
    END as status_client_email,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'client_name') 
        THEN '✅ Coluna client_name existe'
        ELSE '❌ Coluna client_name NÃO existe'
    END as status_client_name,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'client_phone') 
        THEN '✅ Coluna client_phone existe'
        ELSE '❌ Coluna client_phone NÃO existe'
    END as status_client_phone,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'vehicle_id') 
        THEN '✅ Coluna vehicle_id existe'
        ELSE '❌ Coluna vehicle_id NÃO existe'
    END as status_vehicle_id;

-- 4. Testar inserção de um orçamento de exemplo
INSERT INTO public.quotes (
    client_name,
    client_email,
    client_phone,
    vehicle_id,
    start_date,
    end_date,
    total_days,
    total_cost,
    status,
    message
) VALUES (
    'Teste Cliente',
    'teste@email.com',
    '11999999999',
    (SELECT id FROM public.vehicles LIMIT 1), -- Pega o primeiro veículo disponível
    '2024-01-15',
    '2024-01-20',
    5,
    2500.00,
    'pending',
    'Orçamento de teste'
);

-- 5. Verificar se a inserção funcionou
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.quotes WHERE client_email = 'teste@email.com') 
        THEN '✅ Inserção de orçamento funcionou'
        ELSE '❌ Inserção de orçamento falhou'
    END as status_insercao;

-- 6. Mostrar o orçamento inserido
SELECT * FROM public.quotes WHERE client_email = 'teste@email.com';

-- 7. Limpar o orçamento de teste
DELETE FROM public.quotes WHERE client_email = 'teste@email.com';

-- 8. Verificar se a limpeza funcionou
SELECT 
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM public.quotes WHERE client_email = 'teste@email.com') 
        THEN '✅ Limpeza do teste funcionou'
        ELSE '❌ Limpeza do teste falhou'
    END as status_limpeza;

-- 9. Resumo final
SELECT '🎉 Teste de estrutura da tabela quotes concluído!' as resultado;
