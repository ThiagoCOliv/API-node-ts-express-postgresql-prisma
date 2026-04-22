# Football API

API RESTful para gerenciamento de clubes e jogadores de futebol, construída com Node.js, TypeScript, Express e Prisma.

## 🛠️ Tecnologias

| Tecnologia | Versão |
|------------|--------|
| Node.js | 20.x |
| TypeScript | 5.4.3 |
| Express | 5.2.1 |
| Prisma | 7.7.0 |
| PostgreSQL | - |
| Zod | 4.3.6 |
| tsx | 4.7.1 |

## 📋 Funcionalidades

### Clubes (`/clubs`)
- `GET /clubs` — Listar todos os clubes (paginação)
- `GET /clubs/:id` — Buscar clube por ID
- `POST /clubs` — Criar novo clube
- `PUT /clubs/:id` — Atualizar clube
- `DELETE /clubs/:id` — Excluir clube (soft delete)

### Jogadores (`/players`)
- `GET /players` — Listar todos os jogadores (paginação)
- `GET /players/:id` — Buscar jogador por ID
- `POST /players` — Criar novo jogador
- `PUT /players/:id` — Atualizar jogador
- `DELETE /players/:id` — Excluir jogador (soft delete)

### Utilitários
- `GET /health` — Verificar status da API e conexão com banco

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar migrações do Prisma
npx prisma migrate dev

# Iniciar em modo desenvolvimento
npm run start:dev
```

## ▶️ Executando a API

```bash
# Desenvolvimento (com hot-reload)
npm run start:watch

# Produção (build)
npm run dist
npm run start:dist
```

##Parâmetros de Query

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|------------|
| `limit` | number | 10 | Limite de registros por página |
| `offset` | number | 0 | Deslocamento (paginação) |

## 📂 Estrutura do Projeto

```
src/
├── app.ts              # Configuração do Express
├── server.ts           # Ponto de entrada
├── controllers/        # Controladores (lógica de requisição)
├── services/           # Regras de negócio
├── repositories/       # Acesso a dados (Prisma)
├── data/               # Conexão com banco
├── models/             # Tipos TypeScript
├── validation/         # Schemas Zod
├── routes/             # Definição de rotas
├── middlewares/        # Middlewares (erros, logging)
└── utils/              # Utilitários
```

## 🔧 Variáveis de Ambiente

| Variável | Descrição |
|----------|------------|
| `DATABASE_URL` | String de conexão PostgreSQL |

Exemplo:
```
DATABASE_URL="postgresql://user:password@localhost:5432/football_db?schema=public"
```

## 📄 Modelos de Dados

### Club
```json
{
  "name": "string",
  "city": "string",
  "country": "string",
  "league": "string",
  "founded_year": "number",
  "colors": ["string"]
}
```

### Player
```json
{
  "name": "string",
  "position": "string",
  "number": "number",
  "birthday": "date",
  "country": "string",
  "club_id": "number"
}
```