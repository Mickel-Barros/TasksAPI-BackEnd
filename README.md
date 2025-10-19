# 🧠 Tasks API — Backend (TypeScript + Express + Prisma + PostgreSQL)

Uma API performática e escalável para gerenciamento de tarefas, construída com **Node.js**, **Express** e **TypeScript**, aplicando boas práticas de engenharia backend moderna.

> 🚀 Projetada com foco em qualidade de código, organização e extensibilidade.  
> Suporte completo a Docker, validação, testes e ambiente isolado de desenvolvimento e produção.

---

## ⚙️ Tech Stack

- **Framework:** Express (Node.js)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Validação:** express-validator
- **Testes:** Jest + Supertest
- **Containerização:** Docker + Docker Compose
- **Gerenciamento de ambiente:** dotenv
- **Documentação (opcional):** Swagger

---

## 🧩 Arquitetura e Organização

```bash
src/
 ├── app.ts                  # Inicializa Express e middlewares
 ├── index.ts                # Inicia servidor HTTP
 ├── routes/                 # Define endpoints REST
 │    └── tasks.ts
 ├── controllers/            # Controladores HTTP
 │    └── taskController.ts
 ├── services/               # Lógica de negócio
 │    └── taskService.ts
 ├── db/                     # Instância Prisma
 │    └── prismaClient.ts
 ├── validators/             # Middlewares de validação
 │    └── validateRequest.ts
 ├── middlewares/            # Logging, erros, segurança
 └── tests/                  # Testes unitários e integração
```

---

## 🧱 Endpoints

| Método | Rota | Descrição |
|--------|------|------------|
| **GET** | `/tasks` | Lista todas as tarefas (com paginação opcional `?page=&limit=`) |
| **POST** | `/tasks` | Cria uma nova tarefa (`{ title, description }`) |
| **PATCH** | `/tasks/:id` | Atualiza título e descrição de uma tarefa |
| **DELETE** | `/tasks/:id` | Marca tarefa como deletada (soft delete) |

---

## 🧠 Regras de Negócio

- **Criação:** título obrigatório, descrição opcional(mínmo de 5 caracteres)  
- **Listagem:** tarefas ordenadas por `createdAt DESC`, sem incluir deletadas  
- **Atualização:** só altera `title` e `description` se existir a tarefa  
- **Conclusão:** muda `completed` para `true`  
- **Soft delete:** define `deletedAt` sem remover o registro do banco  
- **Paginação:** `GET /tasks?page=1&limit=10`

---

## 🧰 Como Rodar (via Docker)

1. Copie `.env.example` → `.env`  
2. Suba os containers:
   ```bash
   docker compose up --build
   ```
3. Acesse a API em  
   👉 http://localhost:4000  
4. O banco estará acessível em  
   👉 `postgres://postgres:postgres@localhost:5432/tasksdb`

---

## ⚙️ Ambiente Local (sem Docker)

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

---

## 🧾 Migrations e Prisma

Gerar e aplicar migrations:
```bash
npx prisma migrate dev --name init
```

Ambiente de produção:
```bash
npx prisma migrate deploy
```

---

## 🧪 Testes Automatizados

Rodar testes:
```bash
npm test
```

### Estrutura de Testes
- **Unitários:** testam serviços com mock de Prisma  
- **Integração:** testam rotas com Supertest  
- **Cobertura:** `npx jest --coverage`

---

## 🔒 Boas Práticas e Segurança

| Recurso | Descrição |
|----------|------------|
| **Validação** | express-validator garante dados válidos |
| **Sanitização** | previne inputs perigosos para Prisma |
| **Rate limiting** | (recomendado) evitar abuso da API |
| **CORS restrito** | apenas origens conhecidas |
| **Graceful Shutdown** | encerra Prisma corretamente no SIGINT/SIGTERM |
| **Variáveis de ambiente** | `.env.development` e `.env.production` separados |
| **DRY** | middlewares e utils compartilhados para evitar duplicação |

---

## 🧩 Scripts Disponíveis

| Comando | Ação |
|----------|------|
| `npm run dev` | Modo desenvolvimento com reload |
| `npm run build` | Compila para JS (pasta `/dist`) |
| `npm start` | Executa build em produção |
| `npm test` | Roda testes Jest |
| `npm run lint` | Lint do projeto (ESLint + Prettier) |
| `npm run prisma:migrate` | Executa migrations Prisma |

---

## 🧩 Estrutura do Banco (Prisma Schema)

```prisma
model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
}
```

---

## 🌐 Swagger (opcional)

Documentação automática disponível em:  
👉 **`/docs`**

Gerada com **swagger-ui-express** + **swagger-jsdoc**.  

---

## 📚 Referências

- [Express Docs](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Jest Docs](https://jestjs.io/)
- [Docker Compose](https://docs.docker.com/compose/)

---
