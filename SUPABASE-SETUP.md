# 🔧 Configuração do Supabase - FC Locações

## 🚨 ERRO ATUAL
```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

## ✅ SOLUÇÃO

### 1. Criar arquivo `.env.local` na raiz do projeto:

```bash
# Na raiz do projeto, crie um arquivo chamado .env.local
touch .env.local
```

### 2. Adicionar as seguintes variáveis no arquivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gdwpvvdncdqesakkfmle.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODkyNzksImV4cCI6MjA3MDk2NTI3OX0.SBaaDe0_RxnHE0IJie1FwSgCIE2PY6hggiocEOdZBIg

# Service Role Key (NUNCA exponha no frontend)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTI3OSwiZXhwIjoyMDcwOTY1Mjc5fQ.vx6l5XpyAY_s0K036QLWUcO39YcVWkfC0YKlFgfHS1s
```

### 3. Reiniciar o servidor de desenvolvimento:

```bash
# Parar o servidor (Ctrl+C)
# Depois executar novamente:
npm run dev
```

## 🔍 VERIFICAÇÃO

### 1. Verificar se o arquivo foi criado:
```bash
ls -la | grep .env
```

### 2. Verificar se as variáveis estão sendo carregadas:
- Abrir o console do navegador
- Deve aparecer as URLs do Supabase
- Não deve aparecer o erro de variáveis não encontradas

## 🛡️ SEGURANÇA

- ✅ `.env.local` está no `.gitignore`
- ✅ Chaves não serão commitadas
- ✅ Fallback configurado para desenvolvimento

## 🚀 PRÓXIMOS PASSOS

1. Criar o arquivo `.env.local`
2. Adicionar as variáveis
3. Reiniciar o servidor
4. Testar o acesso ao admin: `/admin`

## 📞 SUPORTE

Se o erro persistir, verificar:
- Arquivo `.env.local` criado corretamente
- Variáveis escritas sem espaços extras
- Servidor reiniciado após as mudanças
- Console do navegador para logs de erro
