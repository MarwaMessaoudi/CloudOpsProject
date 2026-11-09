# CloudOps

A cloud infrastructure monitoring platform. This repository contains the backend API (NestJS), a frontend (Next.js, not started yet), and a Docker Compose file for the PostgreSQL database.

## Project structure

```
CloudOpsProject/
├── backend/             NestJS API (TypeORM + PostgreSQL)
├── frontend/            Next.js app (in progress)
├── docker-compose.yml   PostgreSQL database
└── README.md
```

## Tech stack

- **Backend:** NestJS, TypeORM, PostgreSQL, Passport JWT, bcrypt, Swagger
- **Frontend:** Next.js
- **Infrastructure:** Docker (database only)

## Prerequisites

- Node.js 20 or newer
- Docker Desktop

## Getting started

### 1. Start the database

From the project root:

```bash
docker compose up -d
```

PostgreSQL is exposed on port **5433** of your machine (mapped to 5432 inside the container).

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set a real `JWT_SECRET`. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Install and run

```bash
npm install
npm run start:dev
```

The API runs on **http://localhost:3000** and the Swagger documentation is at **http://localhost:3000/api/docs**.

On first start, an admin account is created automatically from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

## Environment variables (backend)

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | Database host | `127.0.0.1` |
| `DB_PORT` | Database port | `5433` |
| `DB_USER` | Database user | `cloudops` |
| `DB_PASSWORD` | Database password | `cloudops` |
| `DB_NAME` | Database name | `cloudops` |
| `JWT_SECRET` | Secret used to sign tokens | (generated) |
| `JWT_EXPIRES_IN` | Token lifetime | `1h` |
| `ADMIN_EMAIL` | Email of the seeded first admin | `admin@cloudops.local` |
| `ADMIN_PASSWORD` | Password of the seeded first admin | `ChangeMe123!` |

## Authentication

The API uses JWT bearer tokens. Every route is protected unless marked as public.

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create an account (always a Viewer) |
| POST | `/auth/login` | Public | Log in, returns an access token (5 attempts per minute) |
| GET | `/auth/me` | Authenticated | Current user profile |
| PATCH | `/auth/me` | Authenticated | Edit own name |
| PATCH | `/auth/me/password` | Authenticated | Change own password |
| GET | `/auth/admin-check` | Admin | Test route for the roles guard |

### Roles

Roles are cumulative: **Admin** includes **DevOps**, which includes **Viewer**.

- New accounts are always created as Viewer. The role cannot be chosen at registration.
- The first Admin is seeded from the `.env` file.
- The user is reloaded from the database on each request, so deactivation or a role change takes effect immediately.

### Testing in Swagger

1. Open `/api/docs` and call `POST /auth/register`.
2. Call `POST /auth/login` and copy the `accessToken`.
3. Click **Authorize** and paste the token (without the word "Bearer").
4. Call the protected routes.

## Development notes

- `synchronize: true` is enabled in TypeORM for development, so tables are created automatically. Disable it and use migrations before deploying.
- Never commit `.env` files. Use `.env.example` as a template.

## Roadmap

- [x] Authentication and role-based access control
- [ ] Teams, projects and environments
- [ ] Servers and applications
- [ ] Monitoring, metrics and alerts
- [ ] Audit log
- [ ] Next.js frontend (login, dashboard, role-based routes)
