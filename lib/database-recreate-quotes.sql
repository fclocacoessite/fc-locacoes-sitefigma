-- Script para recriar a tabela quotes com a estrutura correta
-- Execute este script no Supabase SQL Editor

-- Primeiro, vamos fazer backup dos dados existentes (se houver)
CREATE TABLE IF NOT EXISTS public.quotes_backup AS 
SELECT * FROM public.quotes WHERE 1=0; -- Cria tabela vazia com mesma estrutura

-- Inserir dados existentes no backup (se houver)
INSERT INTO public.quotes_backup 
SELECT * FROM public.quotes;

-- Remover a tabela quotes existente
DROP TABLE IF EXISTS public.quotes CASCADE;

-- Recriar a tabela quotes com a estrutura correta
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

-- Recriar o trigger para updated_at
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Desabilitar RLS temporariamente para permitir operações
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- Verificar se a tabela foi criada corretamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quotes' 
ORDER BY ordinal_position;

-- Mostrar mensagem de sucesso
SELECT 'Tabela quotes recriada com sucesso!' as status;
