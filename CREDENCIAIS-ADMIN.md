# 🔐 Credenciais de Administrador - FC Locações

## 📧 Acesso Admin

**Email:** `admin@fclocacoes.com.br`  
**Senha:** `admin123456`  
**URL de Login:** http://localhost:3000/admin/login

---

## 🚀 Como Criar o Usuário Admin

Existem **3 formas** de criar o usuário administrador:

### Método 1: Via Supabase Dashboard (Mais Fácil) ⭐

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Selecione seu projeto

2. **Vá para Authentication:**
   - No menu lateral, clique em **"Authentication"**
   - Clique em **"Users"**

3. **Adicione um novo usuário:**
   - Clique em **"Add user"** → **"Create new user"**
   - Preencha:
     ```
     Email: admin@fclocacoes.com.br
     Password: admin123456
     ```
   - ✅ Marque: **"Auto Confirm User"** (importante!)
   - Clique em **"Create user"**

4. **Defina o role como admin:**
   - Vá para **SQL Editor**
   - Cole e execute o script: `lib/criar-usuario-admin.sql`

### Método 2: Via API (Com servidor rodando)

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acesse no navegador:**
   ```
   http://localhost:3000/api/admin/seed
   ```
   
   Ou use PowerShell:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3000/api/admin/seed" -Method POST
   ```

### Método 3: Criar manualmente e depois atualizar role

1. **Crie uma conta normal:**
   - Acesse: http://localhost:3000/auth/signup
   - Use o email: `admin@fclocacoes.com.br`
   - Senha: `admin123456`

2. **Atualize o role no Supabase:**
   - Vá para **SQL Editor** no Supabase
   - Execute:
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'::jsonb),
     '{role}',
     '"admin"'
   )
   WHERE email = 'admin@fclocacoes.com.br';
   
   UPDATE public.users 
   SET role = 'admin'::user_role
   WHERE email = 'admin@fclocacoes.com.br';
   ```

---

## ✅ Verificar se Admin foi criado

Execute no SQL Editor do Supabase:

```sql
-- Verificar na tabela auth.users
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'name' as name,
  created_at
FROM auth.users 
WHERE email = 'admin@fclocacoes.com.br';

-- Verificar na tabela public.users
SELECT 
  id, 
  email, 
  name, 
  role,
  created_at
FROM public.users 
WHERE email = 'admin@fclocacoes.com.br';
```

Se retornar resultados com `role = 'admin'`, está configurado! ✅

---

## 🎯 Acessar o Painel Admin

1. **Acesse:** http://localhost:3000/admin/login
2. **Entre com:**
   - Email: `admin@fclocacoes.com.br`
   - Senha: `admin123456`
3. Pronto! Você terá acesso total ao painel administrativo

---

## 🔒 Segurança

**⚠️ IMPORTANTE - PRODUÇÃO:**

Após fazer o deploy em produção:

1. **Troque a senha padrão imediatamente**
2. Use uma senha forte (mínimo 12 caracteres)
3. Considere usar 2FA (Two-Factor Authentication)
4. Crie um email corporativo específico (ex: `admin@suaempresa.com`)

**Para trocar a senha:**
- Vá para: http://localhost:3000/auth/update-password
- Ou no Supabase Dashboard > Authentication > Users > Edit user

---

## 🛠️ Solução de Problemas

### "Credenciais inválidas" ao fazer login

**Causa:** Usuário não foi criado ou senha está incorreta

**Solução:**
1. Verifique se o usuário existe (SQL acima)
2. Recrie o usuário usando Método 1
3. Confirme que marcou "Auto Confirm User"

### Admin redireciona para página principal

**Causa:** O role não está definido como 'admin'

**Solução:**
Execute no SQL Editor:
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{role}',
  '"admin"'
)
WHERE email = 'admin@fclocacoes.com.br';

UPDATE public.users 
SET role = 'admin'::user_role
WHERE email = 'admin@fclocacoes.com.br';
```

### "Failed to load resource: 500"

**Causa:** Projeto Supabase pausado ou trigger não configurado

**Solução:**
1. Reative o projeto no Supabase Dashboard
2. Execute: `lib/fix-user-signup-trigger.sql`

---

## 📚 Recursos Adicionais

- **Script de criação:** `lib/criar-usuario-admin.sql`
- **Script de trigger:** `lib/fix-user-signup-trigger.sql`
- **Setup completo DB:** `lib/COMPLETE-DATABASE-SETUP.sql`

---

## 📞 Contato

Precisa de ajuda? Entre em contato com o suporte técnico.

