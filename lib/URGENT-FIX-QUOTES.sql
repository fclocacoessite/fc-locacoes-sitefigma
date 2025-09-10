-- SOLUÇÃO URGENTE PARA CORRIGIR A TABELA QUOTES
-- Execute este script no Supabase SQL Editor

-- 1. REMOVER a tabela quotes existente (se houver)
DROP TABLE IF EXISTS public.quotes CASCADE;

-- 2. CRIAR a tabela quotes com a estrutura CORRETA
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

-- 3. CRIAR o trigger para updated_at
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. DESABILITAR RLS para permitir operações
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- 5. VERIFICAR se foi criada corretamente
SELECT 'Tabela quotes criada com sucesso!' as status;

-- 6. MOSTRAR a estrutura da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quotes' 
ORDER BY ordinal_position;
