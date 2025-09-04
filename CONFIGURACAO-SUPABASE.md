# 🔧 Configuração do Supabase

## ⚠️ Problema Identificado
O erro de login do admin está ocorrendo porque as variáveis de ambiente do Supabase não estão configuradas.

## ✅ Solução

### 1. Criar arquivo `.env.local`
Crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gdwpvvdncdqesakkfmle.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODkyNzksImV4cCI6MjA3MDk2NTI3OX0.SBaaDe0_RxnHE0IJie1FwSgCIE2PY6hggiocEOdZBIg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTI3OSwiZXhwIjoyMDcwOTY1Mjc5fQ.vx6l5XpyAY_s0K036QLWUcO39YcVWkfC0YKlFgfHS1s
```

### 2. Reiniciar o servidor de desenvolvimento
Após criar o arquivo `.env.local`, reinicie o servidor:

```bash
npm run dev
```

## 🔑 Chaves Fornecidas

### URL do Projeto
```
https://gdwpvvdncdqesakkfmle.supabase.co
```

### Chave Pública (anon)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODkyNzksImV4cCI6MjA3MDk2NTI3OX0.SBaaDe0_RxnHE0IJie1FwSgCIE2PY6hggiocEOdZBIg
```

### Chave de Serviço (service_role)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTI3OSwiZXhwIjoyMDcwOTY1Mjc5fQ.vx6l5XpyAY_s0K036QLWUcO39YcVWkfC0YKlFgfHS1s
```

## ✅ Correções Aplicadas

1. **Arquivo de Login do Admin**: Corrigido para usar o cliente Supabase configurado em `@/lib/supabase`
2. **Configuração do Supabase**: O arquivo `lib/supabase.ts` já tem as chaves corretas como fallback
3. **Providers**: O arquivo `app/providers.tsx` também tem as chaves corretas como fallback

## 🎯 Resultado Esperado

Após criar o arquivo `.env.local` e reiniciar o servidor:
- ✅ O erro de "URL and API key are required" será resolvido
- ✅ O login do admin funcionará corretamente
- ✅ A autenticação com Supabase estará funcionando

## 📝 Nota Importante

O arquivo `.env.local` não deve ser commitado no Git por questões de segurança. Ele já está no `.gitignore` do projeto.
