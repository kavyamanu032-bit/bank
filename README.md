# KodBank

Full-stack banking simulation web app with React frontend, Node.js/Express backend, and MySQL.

## Setup

### 1. Database (Aiven MySQL)

1. Create your MySQL database on Aiven and note: host, port, user, password, database name.
2. Run the schema to create tables:

```bash
mysql -h YOUR_HOST -P YOUR_PORT -u YOUR_USER -p YOUR_DATABASE < database/schema.sql
```

Or paste the contents of `database/schema.sql` into your MySQL client.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your Aiven MySQL credentials and a strong JWT_SECRET
npm install
npm run dev
```

API runs at `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. Login/register and use the dashboard to check balance and transfer money.

## Features

- **Register**: customer_name, email, password (bcrypt); default balance 1000
- **Login**: JWT in HTTP-only cookie, stored in `jwt_tokens` with 1h expiry
- **Dashboard**: Check balance, transfer by recipient email + amount (DB transaction)
- **Security**: JWT validation middleware, bcrypt, env-based DB config

## Environment (backend/.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 3000) |
| `JWT_SECRET` | Secret for signing JWTs |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Aiven MySQL connection |
| `FRONTEND_ORIGIN` | React app origin for CORS (e.g. http://localhost:5173) |
