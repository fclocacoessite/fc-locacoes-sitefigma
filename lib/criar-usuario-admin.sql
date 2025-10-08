-- ============================================
-- CRIAR USUÁRIO ADMINISTRADOR
-- Execute no Supabase SQL Editor
-- ============================================

-- Este script cria um usuário admin no sistema
-- Credenciais:
-- Email: admin@fclocacoes.com.br
-- Senha: admin123456

-- NOTA: Não é possível criar usuários diretamente via SQL no Supabase Auth
-- Você precisa:
-- 1. Ir para Supabase Dashboard > Authentication > Users
-- 2. Clicar em "Add user" > "Create new user"
-- 3. Preencher:
--    - Email: admin@fclocacoes.com.br
--    - Password: admin123456
--    - Auto Confirm User: YES (marcar)
-- 4. Após criar, execute o SQL abaixo para definir o role como admin

-- Ou acesse: http://localhost:3000/api/admin/seed (com o servidor rodando)

-- ============================================
-- ATUALIZAR ROLE PARA ADMIN (após criar usuário)
-- ============================================

-- Primeiro, encontre o ID do usuário admin recém-criado
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'admin@fclocacoes.com.br';

-- Então, atualize o user_metadata para definir como admin
-- Substitua 'UUID_DO_USUARIO' pelo ID retornado acima
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@fclocacoes.com.br';

-- Verificar se funcionou
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'name' as name
FROM auth.users 
WHERE email = 'admin@fclocacoes.com.br';

-- Também garantir que o usuário existe na tabela public.users
INSERT INTO public.users (id, email, name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', 'Administrador FC Locações'),
  'admin'::user_role
FROM auth.users
WHERE email = 'admin@fclocacoes.com.br'
ON CONFLICT (id) DO UPDATE
SET role = 'admin'::user_role;

-- Mensagem final
DO $$
BEGIN
  RAISE NOTICE '✅ Usuário admin configurado com sucesso!';
  RAISE NOTICE '📧 Email: admin@fclocacoes.com.br';
  RAISE NOTICE '🔑 Senha: admin123456';
  RAISE NOTICE '🔗 Acesse: /admin/login';
END $$;

