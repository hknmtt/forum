# Simple Forum API

## Typescript

### Env Variables

- PORT: Port number for the server (default: 3000)
- JWT_SECRET: Secret key (default 'secret')
- DB_PATH: Sqlite file path (default: 'src/database/db.sqlite3')

### Running the server

```bash
npm install
npm run dev
```

### Running the tests

```bash
npm run test:unit
npm run test:integration
```

### OPENAPI docs

- http://localhost:3000/v1/docs

### API

- Included routes:
  - POST /v1/auth/login
  - GET /v1/users
  - POST /v1/users
  - GET /v1/users/:id
  - DELETE /v1/users/:id
  - PATCH /v1/users/:id/disable
  - PATCH /v1/users/:id/enable
