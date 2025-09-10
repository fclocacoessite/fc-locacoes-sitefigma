# Configuração das Variáveis de Ambiente

## Problema
O Prisma precisa da variável `DATABASE_URL` para funcionar, mas ela não está configurada.

## Solução

### 1. Criar arquivo `.env.local`
Crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Configurações do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://gdwpvvdncdqesakkfmle.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODkyNzksImV4cCI6MjA3MDk2NTI3OX0.SBaaDe0_RxnHE0IJie1FwSgCIE2PY6hggiocEOdZBIg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTI3OSwiZXhwIjoyMDcwOTY1Mjc5fQ.vx6l5XpyAY_s0K036QLWUcO39YcVWkfC0YKlFgfHS1s

# URL do banco de dados para o Prisma
# IMPORTANTE: Substitua [YOUR-PASSWORD] pela senha real do seu banco Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.gdwpvvdncdqesakkfmle.supabase.co:5432/postgres"
```

### 2. Obter a senha do banco Supabase
1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá para o seu projeto
3. Clique em **Settings** > **Database**
4. Na seção **Connection string**, copie a string de conexão
5. Substitua `[YOUR-PASSWORD]` pela senha real do banco

### 3. Alternativa: Usar apenas Supabase (sem Prisma)
Se você não quiser usar o Prisma, pode simplesmente executar os scripts SQL diretamente no Supabase:

1. Acesse o painel do Supabase
2. Vá para **SQL Editor**
3. Execute o conteúdo do arquivo `lib/fix-quotes-table.sql`

### 4. Testar a correção
Após configurar o `.env.local`, execute:
```bash
npx prisma db push
```

## Nota Importante
O projeto está configurado para usar Supabase diretamente, não Prisma. O Prisma foi adicionado apenas para sincronizar o schema, mas a aplicação funciona sem ele.
