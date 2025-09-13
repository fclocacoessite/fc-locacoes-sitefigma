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
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed')),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_consignments_status ON public.consignments(status);
CREATE INDEX IF NOT EXISTS idx_consignments_created_at ON public.consignments(created_at);
CREATE INDEX IF NOT EXISTS idx_consignments_email ON public.consignments(email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.consignments ENABLE ROW LEVEL SECURITY;

-- Política para leitura (todos podem ler)
DROP POLICY IF EXISTS "Todos podem ler consignações" ON public.consignments;
CREATE POLICY "Todos podem ler consignações" ON public.consignments
    FOR SELECT USING (true);

-- Política para inserção (todos podem inserir)
DROP POLICY IF EXISTS "Todos podem inserir consignações" ON public.consignments;
CREATE POLICY "Todos podem inserir consignações" ON public.consignments
    FOR INSERT WITH CHECK (true);

-- Política para atualização (todos podem atualizar)
DROP POLICY IF EXISTS "Todos podem atualizar consignações" ON public.consignments;
CREATE POLICY "Todos podem atualizar consignações" ON public.consignments
    FOR UPDATE USING (true);

-- Política para exclusão (todos podem deletar)
DROP POLICY IF EXISTS "Todos podem deletar consignações" ON public.consignments;
CREATE POLICY "Todos podem deletar consignações" ON public.consignments
    FOR DELETE USING (true);

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