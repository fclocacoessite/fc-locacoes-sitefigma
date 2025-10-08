-- ============================================
-- CORREÇÃO: Criar usuário automaticamente após signup
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. Criar função que será executada após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')::user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Criar trigger que executa a função após inserção em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Garantir que a tabela users existe com a estrutura correta
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role user_role DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Desabilitar RLS na tabela users para permitir o trigger funcionar
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 5. Verificar se há usuários em auth.users que não estão em public.users e criar
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  COALESCE((au.raw_user_meta_data->>'role')::user_role, 'client'),
  au.created_at,
  au.updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Trigger de criação automática de usuários configurado com sucesso!';
  RAISE NOTICE '✅ Usuários existentes sincronizados!';
END $$;

