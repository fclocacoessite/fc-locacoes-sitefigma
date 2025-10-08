# 🔧 Correção do Erro de Cadastro de Clientes

## 📋 O Problema

Quando clientes tentam se cadastrar no site, aparece um erro 500 (Internal Server Error). 

### Por que isso acontece?

1. O Supabase Auth cria o usuário com sucesso em `auth.users`
2. **MAS** o sistema não cria automaticamente o registro correspondente na tabela `public.users`
3. Como outras partes do sistema dependem dessa tabela, isso causa erro 500

## ✅ Solução

Criar um **trigger automático** no banco de dados que insere o usuário em `public.users` sempre que um novo usuário se cadastra.

## 🚀 Como Aplicar a Correção

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Entre no projeto: `gdwpvvdncdqesakkfmle`
3. No menu lateral, clique em **"SQL Editor"**

### Passo 2: Executar o Script

1. Clique em **"New Query"**
2. Cole o conteúdo do arquivo: `lib/fix-user-signup-trigger.sql`
3. Clique em **"Run"** (ou pressione Ctrl+Enter)

### Passo 3: Verificar se Funcionou

Você deve ver mensagens de sucesso:

```
✅ Trigger de criação automática de usuários configurado com sucesso!
✅ Usuários existentes sincronizados!
```

### Passo 4: Testar o Cadastro

1. Acesse o site: http://localhost:3000
2. Clique em **"Cadastre-se"** no header
3. Preencha o formulário com:
   - Nome completo
   - Email
   - Telefone
   - Empresa
   - Senha (mínimo 6 caracteres)
4. Clique em **"Criar conta"**

Se tudo estiver correto, você verá:
- ✅ Mensagem de sucesso
- ✅ Redirecionamento para a página de login

## 🔍 O Que o Script Faz?

### 1. Cria a Função de Trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
```
- Insere automaticamente em `public.users` quando um usuário se cadastra
- Copia os dados do `auth.users` para `public.users`
- Define o role padrão como 'client'

### 2. Cria o Trigger
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
```
- Executa a função automaticamente após cada cadastro

### 3. Sincroniza Usuários Existentes
- Verifica se há usuários em `auth.users` que não estão em `public.users`
- Cria os registros faltantes automaticamente

## 🛡️ Segurança

- O script usa `SECURITY DEFINER` para executar com privilégios elevados
- RLS (Row Level Security) é desabilitado na tabela `users` para permitir o trigger
- Usa `ON CONFLICT DO NOTHING` para evitar erros de duplicação

## 🐛 Problemas Comuns

### Erro: "relation public.users does not exist"
**Solução:** Execute primeiro o `lib/COMPLETE-DATABASE-SETUP.sql`

### Erro: "type user_role does not exist"
**Solução:** O enum `user_role` precisa ser criado:
```sql
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'client');
```

### Cadastro continua dando erro 500
**Verifique:**
1. Se o trigger foi criado: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Se a função existe: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
3. Se há erros no console do Supabase: Dashboard > Logs

## 📞 Suporte

Se o problema persistir:
1. Verifique os logs do Supabase (Dashboard > Logs)
2. Verifique o console do navegador (F12)
3. Verifique se as credenciais do Supabase estão corretas em `lib/supabase-client.ts`

## ✨ Depois de Aplicar

Após aplicar o script, todo novo cadastro irá:
1. ✅ Criar usuário no Supabase Auth
2. ✅ Criar automaticamente o registro em `public.users`
3. ✅ Permitir login imediato
4. ✅ Funcionar com o Portal do Cliente

