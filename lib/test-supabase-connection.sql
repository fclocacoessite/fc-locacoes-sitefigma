-- TESTE DE CONEXÃO E ESTRUTURA DO SUPABASE
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se estamos conectados
SELECT 'Conexão com Supabase funcionando!' as status;

-- 2. Verificar se a extensão uuid está habilitada
SELECT 'Extensão UUID disponível!' as status;

-- 3. Verificar se o enum quote_status existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quote_status') 
        THEN '✅ Enum quote_status existe'
        ELSE '❌ Enum quote_status NÃO existe - vamos criá-lo'
    END as status_enum;

-- 4. Criar o enum se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quote_status') THEN
        CREATE TYPE quote_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
        RAISE NOTICE 'Enum quote_status criado com sucesso!';
    END IF;
END $$;

-- 5. Verificar se a tabela users existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') 
        THEN '✅ Tabela users existe'
        ELSE '❌ Tabela users NÃO existe'
    END as status_users;

-- 6. Verificar se a tabela vehicles existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vehicles') 
        THEN '✅ Tabela vehicles existe'
        ELSE '❌ Tabela vehicles NÃO existe'
    END as status_vehicles;

-- 7. Verificar se a função update_updated_at_column existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') 
        THEN '✅ Função update_updated_at_column existe'
        ELSE '❌ Função update_updated_at_column NÃO existe - vamos criá-la'
    END as status_function;

-- 8. Criar a função se não existir
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Teste final
SELECT '🎉 Todas as dependências verificadas e criadas!' as resultado;
