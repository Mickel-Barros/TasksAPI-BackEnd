# TasksAPI-BackEnd (TypeScript + Express + Prisma + Postgres)
API simples para gerenciar tarefas.

### Endpoints
- `GET /tasks` - lista todas as tarefas
- `POST /tasks` - cria uma tarefa (body: `{ title: string, description?: string }`)
- `DELETE /tasks/:id` - deleta tarefa por id
- `PATCH /tasks/:id/complete` - marca a tarefa como concluída

### Tecnologias
- Node.js + Express
- TypeScript
- Prisma (Postgres)
- Docker + docker-compose
- Jest (tests)
- express-validator (validação)

### Como rodar (com Docker)
1. Copie `.env.example` para `.env` e ajuste se necessário.
2. Rode:
```bash
docker compose up --build
```
O banco Postgres ficará acessível como `db:5432` dentro da rede Docker; a API estará em `http://localhost:4000`.

### Migrations / Prisma
Após o container do banco estar pronto você pode gerar e aplicar migrations:
```bash
npx prisma migrate dev --name init --preview-feature
```
ou no ambiente de produção:
```bash
npx prisma migrate deploy
```

### Desenvolvimento local (sem Docker)
1. Instale dependências:
```bash
npm install
```
2. Configure `DATABASE_URL` no `.env` apontando para seu Postgres local.
3. Rode em dev:
```bash
npm run dev
```

### Testes
```bash
npm test
```

### Observações e boas práticas implementadas
- Código organizado em rotas, controllers e services.
- Validação de entrada com `express-validator`.
- Uso de Prisma como ORM.
- Dockerfile e docker-compose para facilitar deploy local.
- Testes unitários do serviço (mockando Prisma) com Jest.

