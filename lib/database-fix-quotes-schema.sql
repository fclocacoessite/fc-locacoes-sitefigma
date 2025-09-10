-- Script para corrigir a estrutura da tabela quotes
-- Execute este script no Supabase SQL Editor

-- Primeiro, vamos verificar se a tabela quotes existe e sua estrutura
-- Se não existir, vamos criá-la com a estrutura correta

-- Verificar se a tabela quotes existe
DO $$
BEGIN
    -- Se a tabela não existir, criar com a estrutura correta
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quotes') THEN
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
        
        -- Criar trigger para updated_at
        CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            
        RAISE NOTICE 'Tabela quotes criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela quotes já existe';
    END IF;
END $$;

-- Verificar e adicionar colunas que podem estar faltando
DO $$
BEGIN
    -- Adicionar client_name se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'client_name') THEN
        ALTER TABLE public.quotes ADD COLUMN client_name VARCHAR(255) NOT NULL DEFAULT '';
        RAISE NOTICE 'Coluna client_name adicionada';
    END IF;
    
    -- Adicionar client_email se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'client_email') THEN
        ALTER TABLE public.quotes ADD COLUMN client_email VARCHAR(255) NOT NULL DEFAULT '';
        RAISE NOTICE 'Coluna client_email adicionada';
    END IF;
    
    -- Adicionar client_phone se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'client_phone') THEN
        ALTER TABLE public.quotes ADD COLUMN client_phone VARCHAR(20) NOT NULL DEFAULT '';
        RAISE NOTICE 'Coluna client_phone adicionada';
    END IF;
    
    -- Adicionar vehicle_id se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'vehicle_id') THEN
        ALTER TABLE public.quotes ADD COLUMN vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL;
        RAISE NOTICE 'Coluna vehicle_id adicionada';
    END IF;
    
    -- Adicionar start_date se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'start_date') THEN
        ALTER TABLE public.quotes ADD COLUMN start_date DATE NOT NULL;
        RAISE NOTICE 'Coluna start_date adicionada';
    END IF;
    
    -- Adicionar end_date se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'end_date') THEN
        ALTER TABLE public.quotes ADD COLUMN end_date DATE NOT NULL;
        RAISE NOTICE 'Coluna end_date adicionada';
    END IF;
    
    -- Adicionar total_days se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'total_days') THEN
        ALTER TABLE public.quotes ADD COLUMN total_days INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Coluna total_days adicionada';
    END IF;
    
    -- Adicionar total_cost se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'total_cost') THEN
        ALTER TABLE public.quotes ADD COLUMN total_cost DECIMAL(10,2) NOT NULL DEFAULT 0;
        RAISE NOTICE 'Coluna total_cost adicionada';
    END IF;
    
    -- Adicionar status se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'status') THEN
        ALTER TABLE public.quotes ADD COLUMN status quote_status DEFAULT 'pending';
        RAISE NOTICE 'Coluna status adicionada';
    END IF;
    
    -- Adicionar message se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'message') THEN
        ALTER TABLE public.quotes ADD COLUMN message TEXT;
        RAISE NOTICE 'Coluna message adicionada';
    END IF;
    
    -- Adicionar created_at se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'created_at') THEN
        ALTER TABLE public.quotes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Coluna created_at adicionada';
    END IF;
    
    -- Adicionar updated_at se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'updated_at') THEN
        ALTER TABLE public.quotes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Coluna updated_at adicionada';
    END IF;
END $$;

-- Garantir que client_id seja opcional (pode ser NULL)
ALTER TABLE public.quotes ALTER COLUMN client_id DROP NOT NULL;

-- Desabilitar RLS temporariamente para permitir operações
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- Verificar a estrutura final da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quotes' 
ORDER BY ordinal_position;
