-- Criar tabela client_profiles se não existir
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE, -- Referência ao auth.users do Supabase
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'CLIENT',
  
  -- Dados pessoais obrigatórios
  cpf VARCHAR(14) UNIQUE, -- CPF para pessoa física
  cnpj VARCHAR(18) UNIQUE, -- CNPJ para pessoa jurídica
  phone VARCHAR(20) NOT NULL,
  birth_date DATE,
  
  -- Endereço completo
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  country VARCHAR(50) DEFAULT 'Brasil',
  
  -- Documentos de identidade
  rg VARCHAR(20),
  cnh VARCHAR(20),
  cnh_expiry DATE,
  
  -- Comprovantes
  proof_of_residence TEXT, -- URL do arquivo
  proof_of_income TEXT, -- URL do arquivo
  company_documents TEXT, -- URL dos documentos da empresa
  
  -- Status de verificação
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  
  -- Dados adicionais
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(20),
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_client_profiles_email ON client_profiles(email);
CREATE INDEX IF NOT EXISTS idx_client_profiles_cpf ON client_profiles(cpf);
CREATE INDEX IF NOT EXISTS idx_client_profiles_cnpj ON client_profiles(cnpj);
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles(user_id);

-- Comentários para documentação
COMMENT ON TABLE client_profiles IS 'Perfis completos dos clientes com dados de segurança';
COMMENT ON COLUMN client_profiles.user_id IS 'Referência ao auth.users do Supabase';
COMMENT ON COLUMN client_profiles.role IS 'Papel do usuário: CLIENT, ADMIN, MANAGER';
COMMENT ON COLUMN client_profiles.is_verified IS 'Status de verificação do perfil';
COMMENT ON COLUMN client_profiles.proof_of_residence IS 'URL do arquivo de comprovante de residência';
COMMENT ON COLUMN client_profiles.proof_of_income IS 'URL do arquivo de comprovante de renda';
COMMENT ON COLUMN client_profiles.company_documents IS 'URL dos documentos da empresa';
