-- CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS
-- Execute este script no Supabase SQL Editor

-- PASSO 1: Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PASSO 2: Criar enums necessários
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'manager', 'client');
        RAISE NOTICE 'Enum user_role criado!';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quote_status') THEN
        CREATE TYPE quote_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
        RAISE NOTICE 'Enum quote_status criado!';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_status') THEN
        CREATE TYPE contract_status AS ENUM ('active', 'completed', 'cancelled');
        RAISE NOTICE 'Enum contract_status criado!';
    END IF;
END $$;

-- PASSO 3: Criar função para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- PASSO 4: Criar tabela users (se não existir)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role user_role DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 5: Criar tabela vehicles (se não existir)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    plate VARCHAR(20) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    weekly_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    image_url TEXT,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 6: Remover tabela quotes existente (se houver)
DROP TABLE IF EXISTS public.quotes CASCADE;

-- PASSO 7: Criar tabela quotes com estrutura correta
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

-- PASSO 8: Criar triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- PASSO 9: Desabilitar RLS para permitir operações
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- PASSO 10: Inserir dados de teste para vehicles (se não existir)
INSERT INTO public.vehicles (brand, model, year, plate, category, daily_rate, weekly_rate, monthly_rate, description, features)
SELECT * FROM (VALUES 
    ('Mercedes', 'Sprinter', 2023, 'ABC-1234', 'Van', 300.00, 1800.00, 7200.00, 'Van para transporte de passageiros', ARRAY['Ar condicionado', 'WiFi', 'Poltronas reclináveis']),
    ('Volkswagen', 'Crafter', 2022, 'DEF-5678', 'Van', 280.00, 1680.00, 6720.00, 'Van executiva para eventos', ARRAY['Ar condicionado', 'Som ambiente', 'Poltronas de couro'])
) AS v(brand, model, year, plate, category, daily_rate, weekly_rate, monthly_rate, description, features)
WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE plate = v.plate);

-- PASSO 11: Testar inserção de orçamento
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
    1500.00,
    'pending',
    'Teste de funcionamento'
);

-- PASSO 12: Verificar se funcionou
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.quotes WHERE client_email = 'teste@email.com') 
        THEN '✅ TESTE PASSOU - Sistema funcionando!'
        ELSE '❌ TESTE FALHOU - Verificar erros'
    END as resultado_teste;

-- PASSO 13: Limpar teste
DELETE FROM public.quotes WHERE client_email = 'teste@email.com';

-- PASSO 14: Mostrar estrutura da tabela quotes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quotes' 
ORDER BY ordinal_position;

-- PASSO 15: Criar tabela consignments
CREATE TABLE IF NOT EXISTS public.consignments (
    id TEXT PRIMARY KEY,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    category TEXT NOT NULL,
    capacity TEXT,
    condition TEXT NOT NULL,
    mileage TEXT,
    price TEXT,
    daily_rate DECIMAL(10,2) NOT NULL,
    description TEXT,
    photos TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed')),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para consignments
CREATE INDEX IF NOT EXISTS idx_consignments_status ON public.consignments(status);
CREATE INDEX IF NOT EXISTS idx_consignments_created_at ON public.consignments(created_at);
CREATE INDEX IF NOT EXISTS idx_consignments_email ON public.consignments(email);

-- Habilitar RLS para consignments
ALTER TABLE public.consignments ENABLE ROW LEVEL SECURITY;

-- Políticas para consignments (todos podem acessar)
DROP POLICY IF EXISTS "Todos podem ler consignações" ON public.consignments;
CREATE POLICY "Todos podem ler consignações" ON public.consignments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Todos podem inserir consignações" ON public.consignments;
CREATE POLICY "Todos podem inserir consignações" ON public.consignments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Todos podem atualizar consignações" ON public.consignments;
CREATE POLICY "Todos podem atualizar consignações" ON public.consignments
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Todos podem deletar consignações" ON public.consignments;
CREATE POLICY "Todos podem deletar consignações" ON public.consignments
    FOR DELETE USING (true);

-- Trigger para updated_at em consignments
CREATE TRIGGER update_consignments_updated_at
    BEFORE UPDATE ON public.consignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- PASSO 16: Confirmação final
SELECT '🎉 BANCO DE DADOS CONFIGURADO COMPLETAMENTE! Sistema pronto para uso!' as status_final;
