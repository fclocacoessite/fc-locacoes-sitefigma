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

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.consignments ENABLE ROW LEVEL SECURITY;

-- Políticas simplificadas para evitar problemas com auth.users
-- Por enquanto, permitir acesso total para usuários autenticados
-- Você pode ajustar as permissões depois conforme necessário

-- Política para leitura (todos os usuários autenticados)
DROP POLICY IF EXISTS "Usuários autenticados podem ler consignações" ON public.consignments;
CREATE POLICY "Usuários autenticados podem ler consignações" ON public.consignments
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Política para inserção (todos os usuários autenticados)
DROP POLICY IF EXISTS "Usuários autenticados podem inserir consignações" ON public.consignments;
CREATE POLICY "Usuários autenticados podem inserir consignações" ON public.consignments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política para atualização (todos os usuários autenticados)
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar consignações" ON public.consignments;
CREATE POLICY "Usuários autenticados podem atualizar consignações" ON public.consignments
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Política para exclusão (todos os usuários autenticados)
DROP POLICY IF EXISTS "Usuários autenticados podem deletar consignações" ON public.consignments;
CREATE POLICY "Usuários autenticados podem deletar consignações" ON public.consignments
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_consignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
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
