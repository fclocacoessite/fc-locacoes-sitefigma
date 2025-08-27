# FC Locações - Sistema de Locação de Veículos

Sistema completo de locação de veículos desenvolvido com Next.js 14+, TypeScript, Prisma e PostgreSQL.

## 🚀 Tecnologias

- **Next.js 14+** com App Router
- **TypeScript**
- **Prisma** + **PostgreSQL**
- **NextAuth.js** para autenticação
- **Tailwind CSS** + **shadcn/ui**
- **Supabase Storage** para upload de imagens

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd fc-locacao-sitefigma
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fc_locacoes"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Configure o banco de dados**
```bash
# Gere o cliente Prisma
npm run db:generate

# Execute as migrações
npm run db:push
```

5. **Execute o projeto**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Página inicial
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── ...               # Componentes customizados
├── lib/                  # Utilitários e configurações
├── prisma/               # Schema e migrações do banco
└── styles/               # Estilos adicionais
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run start` - Executa o servidor de produção
- `npm run lint` - Executa o linter
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:push` - Sincroniza o schema com o banco
- `npm run db:studio` - Abre o Prisma Studio

## 🎯 Funcionalidades

### Site Público
- [x] Página inicial com hero section
- [x] Catálogo de veículos
- [x] Sistema de orçamentos
- [x] Depoimentos de clientes
- [x] Formulário de contato

### Portal do Cliente
- [ ] Autenticação de usuários
- [ ] Dashboard do cliente
- [ ] Histórico de locações
- [ ] Solicitação de orçamentos
- [ ] Pagamentos online

### Painel Administrativo
- [ ] Gestão de usuários (RBAC)
- [ ] Gestão da frota
- [ ] Gestão de orçamentos
- [ ] Gestão de contratos
- [ ] Relatórios financeiros
- [ ] Upload de imagens

## 🔐 Autenticação

O sistema utiliza NextAuth.js com:
- Autenticação por email/senha
- Login social (Google)
- Controle de acesso baseado em roles (RBAC)

## 🎨 UI/UX

- Design system baseado em shadcn/ui
- Componentes acessíveis e responsivos
- Tema claro/escuro
- Animações suaves com Tailwind CSS

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
O projeto pode ser deployado em qualquer plataforma que suporte Next.js.

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@fclocacoes.com 