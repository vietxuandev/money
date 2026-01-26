# 🚀 Quick Reference Card

## One-Command Start

```bash
cd /Users/xu/Code/money
./setup.sh
```

## Access URLs

| Service     | URL                                   |
| ----------- | ------------------------------------- |
| Frontend    | http://localhost:3000                 |
| Backend API | http://localhost:4000/graphql         |
| Database    | postgresql://localhost:5432/financedb |

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Rebuild
docker-compose up -d --build

# Clean slate (removes data!)
docker-compose down -v
```

## Default Credentials

**Note**: No default user. Register at http://localhost:3000/register

## Project Structure

```
money/
├── backend/          # NestJS + GraphQL
├── frontend/         # React + Tailwind
├── docker-compose.yml
└── setup.sh
```

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Frontend  | React + TypeScript + Tailwind |
| API       | GraphQL (Apollo)              |
| Backend   | NestJS + TypeScript           |
| Database  | PostgreSQL + Prisma           |
| Charts    | Recharts                      |
| Auth      | JWT + bcrypt                  |
| Container | Docker + Docker Compose       |

## GraphQL Quick Test

```graphql
# Register
mutation {
  register(input: { username: "john", password: "password123" }) {
    accessToken
    user {
      id
      username
    }
  }
}

# Login
mutation {
  login(input: { username: "john", password: "password123" }) {
    accessToken
  }
}

# Then add to Headers:
# { "Authorization": "Bearer YOUR_TOKEN" }

# Get User Info
query {
  me {
    id
    username
    createdAt
  }
}
```

## Common Issues & Fixes

### "Port already in use"

```bash
# Check what's using the port
lsof -i :3000  # or :4000, :5432
# Kill the process or change port in docker-compose.yml
```

### "Backend won't start"

```bash
# Check logs
docker-compose logs backend
# Usually: wait for database to be ready
```

### "Database connection error"

```bash
# Restart postgres
docker-compose restart postgres
# Wait 10 seconds, then restart backend
docker-compose restart backend
```

### "Frontend can't connect to backend"

```bash
# Check backend is running
curl http://localhost:4000/graphql
# Check VITE_GRAPHQL_URL in frontend/.env
```

### "Fresh start needed"

```bash
docker-compose down -v
docker-compose up -d
# Wait 30 seconds for migrations
```

## File Locations

### Configuration

- Backend env: `backend/.env`
- Frontend env: `frontend/.env`
- Docker compose: `docker-compose.yml`

### Source Code

- Backend: `backend/src/`
- Frontend: `frontend/src/`
- Database schema: `backend/prisma/schema.prisma`

### Documentation

- Main: `README.md`
- Development: `DEVELOPMENT.md`
- Summary: `SUMMARY.md`
- Checklist: `CHECKLIST.md`
- Visual: `VISUAL_GUIDE.md`

## Features Checklist

- ✅ User authentication (register/login)
- ✅ 2-level category hierarchy
- ✅ Expense tracking with CRUD
- ✅ Income tracking with CRUD
- ✅ Dashboard with charts
- ✅ Time range filters (Day/Week/Month/Quarter/Year)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Real-time data updates
- ✅ JWT-based security
- ✅ Docker deployment

## API Endpoints (GraphQL)

### Queries

- `me` - Current user info
- `categories(type)` - Get categories
- `expenses(startDate, endDate, categoryId)` - Get expenses
- `incomes(startDate, endDate, categoryId)` - Get incomes
- `reportStatistics(range, startDate, endDate)` - Get stats

### Mutations

- `register(input)` - Create user
- `login(input)` - Login user
- `createCategory(input)` - Create category
- `updateCategory(id, input)` - Update category
- `deleteCategory(id)` - Delete category
- `createExpense(input)` - Create expense
- `updateExpense(id, input)` - Update expense
- `deleteExpense(id)` - Delete expense
- `createIncome(input)` - Create income
- `updateIncome(id, input)` - Update income
- `deleteIncome(id)` - Delete income

## Development Commands

### Backend

```bash
cd backend
npm install              # Install deps
npm run start:dev        # Dev mode
npx prisma studio        # DB GUI
npx prisma migrate dev   # New migration
npx prisma db seed       # Seed data
```

### Frontend

```bash
cd frontend
npm install              # Install deps
npm run dev              # Dev mode
npm run build            # Production build
```

## Database Operations

```bash
# Access database
docker exec -it finance_postgres psql -U postgres -d financedb

# Backup database
docker exec finance_postgres pg_dump -U postgres financedb > backup.sql

# Restore database
docker exec -i finance_postgres psql -U postgres -d financedb < backup.sql
```

## Health Checks

```bash
# Check if all services are healthy
docker-compose ps

# Individual health checks
curl http://localhost:3000/health  # Frontend
curl http://localhost:4000/graphql # Backend
docker exec finance_postgres pg_isready -U postgres
```

## Performance Tips

- Use Docker for production (optimized builds)
- Backend: Connection pooling enabled by default
- Frontend: Build includes code splitting
- Database: Indexes on foreign keys (Prisma default)

## Security Notes

- ⚠️ Change JWT_SECRET in production
- ⚠️ Use strong passwords
- ⚠️ Enable HTTPS in production
- ⚠️ Configure proper CORS origins
- ✅ Passwords are bcrypt hashed
- ✅ SQL injection protected (Prisma)
- ✅ User data isolated by userId

## Next Steps

1. Start the application (`./setup.sh`)
2. Register a new account
3. Add some categories
4. Add expenses and incomes
5. View the dashboard charts
6. Explore all features

## Support Resources

- README.md - Complete documentation
- DEVELOPMENT.md - Developer guide
- GraphQL Playground - http://localhost:4000/graphql
- Prisma Studio - `npx prisma studio`

## Version Info

- Version: 1.0.0
- Node: 20+
- React: 19+
- NestJS: 11+
- PostgreSQL: 16+

---

**🎉 Happy Finance Tracking!**

Need help? Check the full documentation in README.md
