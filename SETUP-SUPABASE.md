# 🗄️ Configuração do Supabase para FC Locações

## 📋 Passo a Passo para Ativar o Banco de Dados

### 1. **Acesse o Painel Supabase**
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto: `gdwpvvdncdqesakkfmle`

### 2. **Configure o Banco de Dados**
1. **Clique em "SQL Editor"** no menu lateral
2. **Clique em "New Query"**
3. **Cole todo o conteúdo** do arquivo `lib/database-setup.sql`
4. **Clique em "Run"** para executar o script

### 3. **Verificar se as Tabelas foram Criadas**
1. Vá em **"Table Editor"** no menu lateral
2. Você deve ver as seguintes tabelas:
   - `users` - Usuários do sistema
   - `vehicles` - Frota de veículos
   - `quotes` - Orçamentos
   - `contracts` - Contratos

### 4. **Verificar Dados de Exemplo**
1. Clique na tabela **"vehicles"**
2. Você deve ver 6 veículos já inseridos:
   - Mercedes-Benz Atego 1719 (Munck)
   - Volvo FH 460 (Cesto Aéreo)
   - Ford Cargo 816 (Caminhão 3/4)
   - Scania P 320 (Munck)
   - Iveco Daily 70C17 (Cesto Aéreo)
   - Mercedes-Benz Accelo 815 (Munck)

### 5. **Configurar Autenticação (Opcional)**
1. Vá em **"Authentication"** no menu lateral
2. Em **"Settings"** configure:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** `http://localhost:3000/auth/callback`

### 6. **Configurar Storage (Opcional)**
Para upload de imagens dos veículos:
1. Vá em **"Storage"** no menu lateral
2. Clique em **"Create a new bucket"**
3. Nome do bucket: `vehicle-images`
4. Torne público marcando **"Public bucket"**

---

## ✅ **Teste se Está Funcionando**

### 1. **Teste a API**
Abra o navegador e acesse:
```
http://localhost:3000/api/vehicles
```
Deve retornar um JSON com os veículos.

### 2. **Teste o Formulário**
1. Acesse: `http://localhost:3000/orcamento`
2. Preencha o formulário
3. Clique em "Solicitar Orçamento"
4. Deve aparecer "Orçamento Enviado!"

### 3. **Verificar no Supabase**
1. Vá em **"Table Editor"**
2. Clique na tabela **"quotes"**
3. Deve aparecer o orçamento que você enviou

---

## 🔧 **Comandos de Monitoramento**

### Ver logs em tempo real:
```sql
-- No SQL Editor do Supabase
SELECT * FROM quotes ORDER BY created_at DESC LIMIT 10;
```

### Verificar veículos disponíveis:
```sql
SELECT brand, model, year, is_available 
FROM vehicles 
WHERE is_available = true;
```

---

## 🚨 **Solução de Problemas**

### **Erro: "relation does not exist"**
- Execute novamente o script `database-setup.sql`
- Verifique se está no projeto correto

### **Erro: "RLS policy violation"**
- Desabilite temporariamente o RLS:
```sql
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
```

### **Dados não aparecem**
- Verifique se os dados foram inseridos:
```sql
SELECT COUNT(*) FROM vehicles;
```

---

## 📊 **Status das Funcionalidades**

✅ **Funcionando:**
- API de veículos (`GET /api/vehicles`)
- API de orçamentos (`POST /api/quotes`)
- Formulário de orçamento
- Catálogo de frota
- Navegação entre páginas

⏳ **Opcional:**
- Autenticação de usuários
- Painel administrativo
- Upload de imagens

---

**🎉 Após seguir esses passos, o site estará 100% funcional com banco de dados!**
