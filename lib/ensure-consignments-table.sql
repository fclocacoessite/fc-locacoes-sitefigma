-- SCRIPT PARA GARANTIR QUE A TABELA CONSIGNMENTS ESTEJA COMPLETA
-- Execute este script no SQL Editor do Supabase

-- PASSO 1: Criar tabela consignments se não existir
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    admin_notes TEXT
);

-- PASSO 2: Adicionar colunas que podem estar faltando
DO $$ 
BEGIN
    -- Adicionar coluna approved_at se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'consignments' 
                   AND column_name = 'approved_at') THEN
        ALTER TABLE public.consignments ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Adicionar coluna rejected_at se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'consignments' 
                   AND column_name = 'rejected_at') THEN
        ALTER TABLE public.consignments ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Adicionar coluna rejection_reason se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'consignments' 
                   AND column_name = 'rejection_reason') THEN
        ALTER TABLE public.consignments ADD COLUMN rejection_reason TEXT;
    END IF;

    -- Adicionar coluna admin_notes se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'consignments' 
                   AND column_name = 'admin_notes') THEN
        ALTER TABLE public.consignments ADD COLUMN admin_notes TEXT;
    END IF;
END $$;

-- PASSO 3: Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_consignments_status ON public.consignments(status);
CREATE INDEX IF NOT EXISTS idx_consignments_created_at ON public.consignments(created_at);
CREATE INDEX IF NOT EXISTS idx_consignments_email ON public.consignments(email);
CREATE INDEX IF NOT EXISTS idx_consignments_owner_name ON public.consignments(owner_name);

-- PASSO 4: Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_consignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASSO 5: Criar trigger para updated_at
DROP TRIGGER IF EXISTS update_consignments_updated_at ON public.consignments;
CREATE TRIGGER update_consignments_updated_at
    BEFORE UPDATE ON public.consignments
    FOR EACH ROW
    EXECUTE FUNCTION update_consignments_updated_at();

-- PASSO 6: Configurar RLS (Row Level Security)
ALTER TABLE public.consignments ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir inserção pública de consignações" ON public.consignments;
DROP POLICY IF EXISTS "Permitir leitura pública de consignações" ON public.consignments;
DROP POLICY IF EXISTS "Permitir atualização pública de consignações" ON public.consignments;
DROP POLICY IF EXISTS "Permitir exclusão pública de consignações" ON public.consignments;

-- Criar políticas permissivas
CREATE POLICY "Consignações - Inserção pública" ON public.consignments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Consignações - Leitura pública" ON public.consignments
    FOR SELECT USING (true);

CREATE POLICY "Consignações - Atualização pública" ON public.consignments
    FOR UPDATE USING (true);

CREATE POLICY "Consignações - Exclusão pública" ON public.consignments
    FOR DELETE USING (true);

-- PASSO 7: Verificar estrutura final da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'consignments' 
ORDER BY ordinal_position;

-- PASSO 8: Testar inserção de dados
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
    submitted_at
) VALUES (
    'CON-' || extract(epoch from now())::text,
    'João Silva',
    'joao@teste.com',
    '(11) 99999-9999',
    'Mercedes-Benz',
    'Atego 1719',
    2022,
    'Caminhão Munck',
    'Excelente',
    500.00,
    ARRAY['https://exemplo.com/foto1.jpg'],
    'pending',
    NOW()
);

-- PASSO 9: Verificar se funcionou
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.consignments WHERE email = 'joao@teste.com')
        THEN '✅ TABELA CONSIGNMENTS CONFIGURADA COM SUCESSO!'
        ELSE '❌ ERRO NA CONFIGURAÇÃO DA TABELA'
    END as resultado;

-- PASSO 10: Mostrar dados inseridos
SELECT 
    id,
    owner_name,
    email,
    brand,
    model,
    status,
    created_at
FROM public.consignments 
WHERE email = 'joao@teste.com';

-- PASSO 11: Limpar dados de teste
DELETE FROM public.consignments WHERE email = 'joao@teste.com';

-- PASSO 12: Mostrar políticas criadas
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'consignments' 
AND schemaname = 'public';

-- PASSO 13: Confirmação final
SELECT '🎉 CONFIGURAÇÃO COMPLETA! O formulário de consignação agora deve funcionar perfeitamente.' as status_final;
