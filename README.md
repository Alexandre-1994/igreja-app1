# Igreja App - Sistema de Gestão de Membros

Uma aplicação web desenvolvida em Ionic React para gestão de membros de igreja.

## 🚀 Tecnologias Utilizadas

- **Frontend:** Ionic React + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth)
- **Build Tool:** Vite
- **Hosting:** Vercel
- **PDF Generation:** jsPDF

## 📋 Funcionalidades

- ✅ Sistema de autenticação
- ✅ Gestão de membros (CRUD)
- ✅ Filtros por região, paróquia, função
- ✅ Diferentes níveis de usuário
- ✅ Geração de relatórios em PDF
- ✅ Interface responsiva

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Supabase

### Configuração

1. Clone o repositório

```bash
git clone <repository-url>
cd igreja-app
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase
```

4. Execute o projeto

```bash
npm run dev
```

### Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção

## 🌐 Deploy

O projeto está configurado para deploy automático no Vercel.

### Variáveis de Ambiente (Vercel)

Certifique-se de configurar as seguintes variáveis no painel do Vercel:

- `VITE_SUPABASE_URL` - URL do seu projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase

## 📱 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── services/      # Serviços (API, Supabase)
├── types/         # Definições de tipos TypeScript
├── theme/         # Temas e estilos
└── utils/         # Utilitários
```

## 🔐 Autenticação

O sistema utiliza Supabase Auth com as seguintes funcionalidades:

- Login com email/senha
- Diferentes níveis de usuário
- Rotas protegidas

## 📊 Dados

A aplicação gerencia os seguintes dados:

- **Membros:** Informações pessoais, região, paróquia, função
- **Usuários:** Sistema de permissões
- **Relatórios:** Geração de PDFs

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
