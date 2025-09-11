-- Script simplificado para criar tabela de consignações
-- Execute este script primeiro, sem RLS

-- Criar tabela de consignações
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
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    admin_notes TEXT
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_consignments_status ON public.consignments(status);
CREATE INDEX IF NOT EXISTS idx_consignments_created_at ON public.consignments(created_at);
CREATE INDEX IF NOT EXISTS idx_consignments_email ON public.consignments(email);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_consignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_consignments_updated_at ON public.consignments;
CREATE TRIGGER update_consignments_updated_at
    BEFORE UPDATE ON public.consignments
    FOR EACH ROW
    EXECUTE FUNCTION update_consignments_updated_at();

-- Comentários na tabela
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

