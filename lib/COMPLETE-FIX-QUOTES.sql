-- CORREÇÃO COMPLETA DO SISTEMA DE ORÇAMENTOS
-- Execute este script no Supabase SQL Editor

-- PASSO 1: Verificar e criar dependências
SELECT 'Iniciando correção completa...' as status;

-- Criar enum se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quote_status') THEN
        CREATE TYPE quote_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
        RAISE NOTICE 'Enum quote_status criado!';
    END IF;
END $$;

-- Criar função se não existir
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- PASSO 2: Remover tabela quotes existente
DROP TABLE IF EXISTS public.quotes CASCADE;

-- PASSO 3: Criar tabela quotes com estrutura correta
CREATE TABLE public.quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.users(id), -- Opcional para orçamentos anônimos
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    status quote_status DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 4: Criar trigger
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- PASSO 5: Desabilitar RLS
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- PASSO 6: Testar inserção
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
    (SELECT id FROM public.vehicles LIMIT 1),
    '2024-01-15',
    '2024-01-20',
    5,
    2500.00,
    'pending',
    'Teste de funcionamento'
);

-- PASSO 7: Verificar se funcionou
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.quotes WHERE client_email = 'teste@email.com') 
        THEN '✅ TESTE PASSOU - Sistema funcionando!'
        ELSE '❌ TESTE FALHOU - Verificar erros'
    END as resultado_teste;

-- PASSO 8: Limpar teste
DELETE FROM public.quotes WHERE client_email = 'teste@email.com';

-- PASSO 9: Mostrar estrutura final
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quotes' 
ORDER BY ordinal_position;

-- PASSO 10: Confirmação final
SELECT '🎉 CORREÇÃO COMPLETA! Sistema de orçamentos pronto para uso!' as status_final;
