-- Script para aplicar as correções do schema diretamente no Supabase
-- Execute este script no SQL Editor do Supabase

-- Verificar se as colunas existem e adicionar se necessário
DO $$ 
BEGIN
    -- Adicionar client_name se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'client_name'
    ) THEN
        ALTER TABLE public.quotes ADD COLUMN client_name VARCHAR(255);
    END IF;

    -- Adicionar client_email se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'client_email'
    ) THEN
        ALTER TABLE public.quotes ADD COLUMN client_email VARCHAR(255);
    END IF;

    -- Adicionar client_phone se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'client_phone'
    ) THEN
        ALTER TABLE public.quotes ADD COLUMN client_phone VARCHAR(20);
    END IF;

    -- Adicionar message se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'message'
    ) THEN
        ALTER TABLE public.quotes ADD COLUMN message TEXT;
    END IF;

    -- Tornar client_id opcional (nullable) se não for
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'client_id' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.quotes ALTER COLUMN client_id DROP NOT NULL;
    END IF;

    -- Adicionar constraints NOT NULL para campos obrigatórios se não existirem
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'client_name' AND is_nullable = 'YES'
    ) THEN
        -- Primeiro, atualizar registros existentes com valores padrão se necessário
        UPDATE public.quotes SET client_name = 'Cliente Anônimo' WHERE client_name IS NULL;
        ALTER TABLE public.quotes ALTER COLUMN client_name SET NOT NULL;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'client_email' AND is_nullable = 'YES'
    ) THEN
        -- Primeiro, atualizar registros existentes com valores padrão se necessário
        UPDATE public.quotes SET client_email = 'sem-email@exemplo.com' WHERE client_email IS NULL;
        ALTER TABLE public.quotes ALTER COLUMN client_email SET NOT NULL;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'client_phone' AND is_nullable = 'YES'
    ) THEN
        -- Primeiro, atualizar registros existentes com valores padrão se necessário
        UPDATE public.quotes SET client_phone = '(00) 00000-0000' WHERE client_phone IS NULL;
        ALTER TABLE public.quotes ALTER COLUMN client_phone SET NOT NULL;
    END IF;
END $$;

-- Verificar a estrutura final da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'quotes' 
ORDER BY ordinal_position;
