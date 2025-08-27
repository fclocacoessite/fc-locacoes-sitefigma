-- Configuração do banco de dados FC Locações no Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para tipos de usuário
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'client');

-- Enum para status de orçamento
CREATE TYPE quote_status AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- Enum para status de contrato
CREATE TYPE contract_status AS ENUM ('active', 'completed', 'cancelled');

-- Tabela de usuários (integrada com Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role user_role DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de veículos
CREATE TABLE public.vehicles (
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

-- Tabela de orçamentos
CREATE TABLE public.quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.users(id),
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

-- Tabela de contratos
CREATE TABLE public.contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote_id UUID REFERENCES public.quotes(id) NOT NULL,
  client_id UUID REFERENCES public.users(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  status contract_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS (Row Level Security)

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver próprio perfil" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para veículos (público para visualização)
CREATE POLICY "Veículos são públicos para visualização" ON public.vehicles
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem modificar veículos" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Políticas para orçamentos
CREATE POLICY "Usuários podem criar orçamentos" ON public.quotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários podem ver próprios orçamentos" ON public.quotes
  FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Apenas admins podem atualizar orçamentos" ON public.quotes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Políticas para contratos
CREATE POLICY "Usuários podem ver próprios contratos" ON public.contracts
  FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Apenas admins podem modificar contratos" ON public.contracts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Inserir dados de exemplo
INSERT INTO public.vehicles (brand, model, year, plate, category, daily_rate, weekly_rate, monthly_rate, description, features, image_url) VALUES
('Mercedes-Benz', 'Atego 1719', 2023, 'ABC-1234', 'Caminhão Munck', 800.00, 4800.00, 18000.00, 'Caminhão Munck com capacidade de 12 toneladas', ARRAY['Guindaste hidráulico', 'Operador incluso', 'Seguro total'], 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Volvo', 'FH 460', 2022, 'DEF-5678', 'Cesto Aéreo', 650.00, 3900.00, 14500.00, 'Cesto aéreo com altura de trabalho de 20 metros', ARRAY['Altura 20m', 'Capacidade 200kg', 'Estabilizadores automáticos'], 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Ford', 'Cargo 816', 2021, 'GHI-9012', 'Caminhão 3/4', 350.00, 2100.00, 7800.00, 'Caminhão 3/4 para transporte de materiais', ARRAY['Capacidade 3,5t', 'Carroceria fechada', 'GPS incluso'], 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Scania', 'P 320', 2023, 'JKL-3456', 'Caminhão Munck', 1200.00, 7200.00, 27000.00, 'Caminhão Munck pesado com capacidade de 25 toneladas', ARRAY['Capacidade 25t', 'Alcance 22m', 'Operador especializado'], 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Iveco', 'Daily 70C17', 2022, 'MNO-7890', 'Cesto Aéreo', 950.00, 5700.00, 21000.00, 'Cesto aéreo de grande altura - 35 metros', ARRAY['Altura 35m', 'Capacidade 230kg', 'Sistema anti-oscilação'], 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Mercedes-Benz', 'Accelo 815', 2022, 'PQR-2468', 'Caminhão Munck', 950.00, 5700.00, 21000.00, 'Munck articulado com ótima manobrabilidade', ARRAY['Articulado', 'Capacidade 15t', 'Alcance 18m'], 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

-- Inserir usuário admin padrão (será criado quando alguém fizer login)
-- O Supabase Auth cuidará da criação dos usuários
