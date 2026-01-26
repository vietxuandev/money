# Personal Finance Management Application

A full-stack personal finance management application with modern web technologies.

## 🏗️ Tech Stack

### Backend

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: GraphQL (Apollo Server)
- **Authentication**: JWT with bcrypt password hashing
- **Architecture**: Modular design (auth, user, category, expense, income, report)

### Frontend

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State & API**: Apollo Client
- **Charts**: Recharts
- **Routing**: React Router v6
- **Build Tool**: Vite

### DevOps

- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend)
- **Database**: PostgreSQL with persistent volumes

## 📋 Features

### Authentication

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and resolvers
- Extensible architecture for future OAuth support

### Category Management

- 2-level hierarchical categories (parent → children)
- Separate categories for expenses and incomes
- Full CRUD operations
- Pre-seeded sample categories

### Expense Management

- Track daily expenses
- Categorize expenses
- Add notes for context
- Full CRUD operations
- Date-based filtering

### Income Management

- Track monthly/periodic incomes
- Categorize income sources
- Add notes for reference
- Full CRUD operations
- Date-based filtering

### Reports & Analytics

- Financial overview dashboard
- Time range filters (Day, Week, Month, Quarter, Year)
- Summary cards (Total Income, Total Expenses, Balance)
- Interactive charts:
  - Pie charts for expense/income distribution by category
  - Line charts for income vs expenses trends
  - Bar charts for comparative analysis
- Real-time data visualization

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Clean and intuitive UI
- Tailwind CSS grid/flex layouts

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- PostgreSQL 16+ (for local development)

### Option 1: Docker (Recommended)

1. **Clone the repository**

```bash
cd /Users/xu/Code/money
```

2. **Start all services**

```bash
docker-compose up -d
```

3. **Access the application**

- Frontend: http://localhost:3000
- Backend GraphQL: http://localhost:4000/graphql
- Database: localhost:5432

4. **Stop all services**

```bash
docker-compose down
```

5. **Stop and remove volumes (clean slate)**

```bash
docker-compose down -v
```

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financedb?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
```

4. **Start PostgreSQL**

```bash
# Using Docker
docker run --name finance_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=financedb \
  -p 5432:5432 \
  -d postgres:16-alpine
```

5. **Run Prisma migrations**

```bash
npx prisma migrate dev
```

6. **Seed the database**

```bash
npx prisma db seed
```

7. **Start the backend**

```bash
npm run start:dev
```

Backend will run on http://localhost:4000/graphql

#### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   Create a `.env` file:

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

4. **Start the frontend**

```bash
npm run dev
```

Frontend will run on http://localhost:5173 (Vite default)

## 📊 Default Data

The application comes with pre-seeded categories:

### Expense Categories

- **Food**: Breakfast, Lunch, Dinner, Drinks, Snacks, Groceries, Others
- **Transportation**: Fuel, Maintenance, Taxi, Bus
- **Bills**: Rent, Phone, Internet
- **Fashion**: Clothes, Shoes, Accessories

### Income Categories

- **Salary**: Full-time, Part-time, Bonus
- **Investment**: Dividends, Interest

### Demo User

- Username: `demo`
- Password: Set during seed (default: requires update in seed.ts)

## 🗂️ Project Structure

```
money/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── category/
│   │   ├── expense/
│   │   ├── income/
│   │   ├── report/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── graphql/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml
```

## 🔑 GraphQL API

### Authentication

```graphql
# Register
mutation {
  register(input: { username: "john", password: "password123" }) {
    accessToken
    user {
      id
      username
      createdAt
    }
  }
}

# Login
mutation {
  login(input: { username: "john", password: "password123" }) {
    accessToken
    user {
      id
      username
    }
  }
}

# Get current user
query {
  me {
    id
    username
    createdAt
  }
}
```

### Categories

```graphql
# Get all categories (optionally filter by type)
query {
  categories(type: "EXPENSE") {
    id
    name
    type
    parentId
    children {
      id
      name
    }
  }
}

# Create category
mutation {
  createCategory(
    input: { name: "Entertainment", type: EXPENSE, parentId: null }
  ) {
    id
    name
  }
}
```

### Expenses

```graphql
# Get expenses
query {
  expenses {
    id
    amount
    date
    note
    category {
      name
    }
  }
}

# Create expense
mutation {
  createExpense(
    input: {
      amount: 25.50
      date: "2026-01-26T00:00:00Z"
      note: "Lunch with team"
      categoryId: "category-id"
    }
  ) {
    id
    amount
  }
}
```

### Incomes

```graphql
# Get incomes
query {
  incomes {
    id
    amount
    date
    note
    category {
      name
    }
  }
}

# Create income
mutation {
  createIncome(
    input: {
      amount: 5000.00
      date: "2026-01-01T00:00:00Z"
      note: "Monthly salary"
      categoryId: "category-id"
    }
  ) {
    id
    amount
  }
}
```

### Reports

```graphql
query {
  reportStatistics(
    range: "MONTH"
    startDate: "2026-01-01T00:00:00Z"
    endDate: "2026-01-31T23:59:59Z"
  ) {
    totalIncome
    totalExpense
    balance
    expenseByCategory {
      categoryName
      amount
      percentage
    }
    incomeByCategory {
      categoryName
      amount
      percentage
    }
    expenseByDate {
      date
      amount
    }
    incomeByDate {
      date
      amount
    }
  }
}
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT-based authentication
- Protected GraphQL resolvers
- CORS enabled for frontend
- Environment variable configuration
- SQL injection protection via Prisma

## 🧪 Testing

Access GraphQL Playground:

```
http://localhost:4000/graphql
```

Test authentication:

1. Register a new user
2. Copy the `accessToken`
3. Add to HTTP headers:

```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

## 📝 Development Notes

### Adding New Modules

The backend uses NestJS modular architecture. To add a new module:

```bash
cd backend
nest g module feature-name
nest g service feature-name
nest g resolver feature-name
```

### Database Migrations

After modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name description-of-change
npx prisma generate
```

### Updating Frontend Types

GraphQL queries and mutations are manually defined. For type generation:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations
```

## 🐛 Troubleshooting

### Backend won't start

- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npx prisma generate`
- Check port 4000 is not in use

### Frontend won't connect

- Verify backend is running
- Check VITE_GRAPHQL_URL in .env
- Clear browser cache
- Check browser console for errors

### Docker issues

```bash
# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Restart specific service
docker-compose restart backend

# Rebuild containers
docker-compose up -d --build
```

### Database issues

```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres
cd backend
npx prisma migrate dev
npx prisma db seed
```

## 🚧 Future Enhancements

- OAuth2 / Social login (Google, GitHub, etc.)
- Budget planning and alerts
- Recurring transactions
- Multi-currency support
- Export data (CSV, PDF)
- Mobile app (React Native)
- Email notifications
- Two-factor authentication
- Dark mode
- Advanced filtering and search

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Author

Built with ❤️ using modern web technologies.

---

**Happy Finance Tracking! 💰📊**
# Updated README
