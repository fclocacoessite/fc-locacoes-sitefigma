-- Script para limpar e criar tabela de consignações
-- Execute este script completo

-- 1. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Admins podem ver todas as consignações" ON public.consignments;
DROP POLICY IF EXISTS "Proprietários podem ver suas consignações" ON public.consignments;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir consignações" ON public.consignments;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar consignações" ON public.consignments;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar consignações" ON public.consignments;
DROP POLICY IF EXISTS "Permitir leitura para usuários autenticados" ON public.consignments;
DROP POLICY IF EXISTS "Permitir inserção para usuários autenticados" ON public.consignments;
DROP POLICY IF EXISTS "Permitir atualização para usuários autenticados" ON public.consignments;
DROP POLICY IF EXISTS "Permitir exclusão para usuários autenticados" ON public.consignments;

-- 2. Remover trigger e função (se existirem)
DROP TRIGGER IF EXISTS update_consignments_updated_at ON public.consignments;
DROP TRIGGER IF EXISTS set_consignments_updated_at ON public.consignments;
DROP FUNCTION IF EXISTS update_consignments_updated_at();
DROP FUNCTION IF EXISTS public.set_updated_at();

-- 3. Remover tabela existente (se houver)
DROP TABLE IF EXISTS public.consignments CASCADE;

-- 4. Criar tabela de consignações
CREATE TABLE public.consignments (
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
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    admin_notes TEXT
);

-- 5. Criar índices
CREATE INDEX idx_consignments_status ON public.consignments(status);
CREATE INDEX idx_consignments_created_at ON public.consignments(created_at);
CREATE INDEX idx_consignments_email ON public.consignments(email);

-- 6. Criar função para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar trigger
CREATE TRIGGER set_consignments_updated_at
    BEFORE UPDATE ON public.consignments
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- 8. Adicionar comentários
COMMENT ON TABLE public.consignments IS 'Tabela para armazenar solicitações de consignação de veículos';
COMMENT ON COLUMN public.consignments.id IS 'ID único da consignação (formato: CON-XXXXXX)';
COMMENT ON COLUMN public.consignments.owner_name IS 'Nome completo do proprietário do veículo';
COMMENT ON COLUMN public.consignments.email IS 'Email do proprietário';
COMMENT ON COLUMN public.consignments.phone IS 'Telefone/WhatsApp do proprietário';
COMMENT ON COLUMN public.consignments.brand IS 'Marca do veículo';
COMMENT ON COLUMN public.consignments.model IS 'Modelo do veículo';
COMMENT ON COLUMN public.consignments.year IS 'Ano do veículo';
COMMENT ON COLUMN public.consignments.category IS 'Categoria do veículo (Caminhão Munck, Cesto Aéreo, etc.)';
COMMENT ON COLUMN public.consignments.capacity IS 'Capacidade do veículo (ex: 12 toneladas)';
COMMENT ON COLUMN public.consignments.condition IS 'Estado de conservação do veículo';
COMMENT ON COLUMN public.consignments.mileage IS 'Quilometragem do veículo';
COMMENT ON COLUMN public.consignments.price IS 'Valor do veículo (opcional)';
COMMENT ON COLUMN public.consignments.daily_rate IS 'Valor da diária pretendida pelo proprietário';
COMMENT ON COLUMN public.consignments.description IS 'Descrição adicional do veículo';
COMMENT ON COLUMN public.consignments.photos IS 'Array com URLs das fotos do veículo';
COMMENT ON COLUMN public.consignments.status IS 'Status da consignação (pending, approved, rejected)';
COMMENT ON COLUMN public.consignments.submitted_at IS 'Data de envio da solicitação';
COMMENT ON COLUMN public.consignments.approved_at IS 'Data de aprovação (se aprovada)';
COMMENT ON COLUMN public.consignments.rejected_at IS 'Data de rejeição (se rejeitada)';
COMMENT ON COLUMN public.consignments.rejection_reason IS 'Motivo da rejeição (se rejeitada)';
COMMENT ON COLUMN public.consignments.admin_notes IS 'Notas internas dos administradores';

-- 9. Inserir dados de teste (opcional)
INSERT INTO public.consignments (
    id, owner_name, email, phone, brand, model, year, category, 
    condition, daily_rate, submitted_at
) VALUES (
    'CON-001', 'João Silva', 'joao@email.com', '(21) 99999-9999', 
    'Mercedes', 'Atego 1719', 2020, 'Caminhão Munck', 
    'Excelente', 800.00, NOW()
);

-- 10. Verificar se a tabela foi criada corretamente
SELECT 'Tabela consignments criada com sucesso!' as status;
SELECT COUNT(*) as total_consignments FROM public.consignments;

