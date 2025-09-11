-- Atualizações idempotentes para suportar consignação

DO $$ BEGIN
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Adicionar colunas em vehicles se não existirem
DO $$ BEGIN
  ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.users(id);
  ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'company';
  ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'approved';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Políticas para administradores gerenciarem veículos
CREATE POLICY IF NOT EXISTS "Admins gerenciam quaisquer veículos" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Atualização do banco de dados FC Locações para compatibilidade com o código
-- Execute este script após o database-setup.sql

-- Adicionar campos necessários à tabela vehicles
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS capacity_ton DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS height_m DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS cabine_suplementar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS carroceria_aberta BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS banheiro BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS documents TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'available',
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Atualizar veículos existentes com dados mais específicos
UPDATE public.vehicles SET 
  capacity_ton = 12,
  cabine_suplementar = true,
  carroceria_aberta = true,
  status = 'available',
  featured = true,
  photos = ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  documents = ARRAY['CRLV', 'Seguro']
WHERE plate = 'ABC-1234';

UPDATE public.vehicles SET 
  height_m = 20,
  cabine_suplementar = false,
  carroceria_aberta = false,
  status = 'available',
  featured = true,
  photos = ARRAY['https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  documents = ARRAY['CRLV', 'ART']
WHERE plate = 'DEF-5678';

UPDATE public.vehicles SET 
  capacity_ton = 3.5,
  cabine_suplementar = false,
  carroceria_aberta = true,
  status = 'rented',
  featured = false,
  photos = ARRAY['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  documents = ARRAY['CRLV']
WHERE plate = 'GHI-9012';

UPDATE public.vehicles SET 
  capacity_ton = 25,
  cabine_suplementar = true,
  carroceria_aberta = true,
  status = 'available',
  featured = true,
  photos = ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  documents = ARRAY['CRLV', 'Seguro', 'Certificado']
WHERE plate = 'JKL-3456';

UPDATE public.vehicles SET 
  height_m = 35,
  cabine_suplementar = false,
  carroceria_aberta = false,
  banheiro = true,
  status = 'available',
  featured = true,
  photos = ARRAY['https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  documents = ARRAY['CRLV', 'ART', 'NR-35']
WHERE plate = 'MNO-7890';

UPDATE public.vehicles SET 
  capacity_ton = 15,
  cabine_suplementar = true,
  carroceria_aberta = true,
  status = 'available',
  featured = false,
  photos = ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  documents = ARRAY['CRLV', 'Seguro']
WHERE plate = 'PQR-2468';

-- Temporariamente desabilitar RLS para permitir acesso público aos veículos
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- Criar política mais permissiva para veículos (temporária para desenvolvimento)
-- DROP POLICY IF EXISTS "Veículos são públicos para visualização" ON public.vehicles;
-- CREATE POLICY "Acesso público a veículos" ON public.vehicles FOR ALL USING (true);

-- Criar política mais permissiva para orçamentos (temporária para desenvolvimento)  
-- DROP POLICY IF EXISTS "Usuários podem criar orçamentos" ON public.quotes;
-- CREATE POLICY "Acesso público a orçamentos" ON public.quotes FOR ALL USING (true);

COMMIT;