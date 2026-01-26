# Development Guide

## 🏃‍♂️ Quick Start Commands

### Using Docker (Recommended for Production)

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Clean slate (removes data)
docker-compose down -v
```

### Local Development

#### Terminal 1 - Database

```bash
docker run --name finance_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=financedb \
  -p 5432:5432 \
  -d postgres:16-alpine
```

#### Terminal 2 - Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

#### Terminal 3 - Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📁 Directory Structure

```
money/
├── backend/               # NestJS Backend
│   ├── src/
│   │   ├── auth/         # Authentication (JWT, bcrypt)
│   │   ├── user/         # User management
│   │   ├── category/     # Category CRUD
│   │   ├── expense/      # Expense management
│   │   ├── income/       # Income management
│   │   ├── report/       # Statistics & reports
│   │   └── prisma/       # Prisma service
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── seed.ts       # Seed data
│   └── Dockerfile
│
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── graphql/      # GraphQL queries/mutations
│   │   ├── layouts/      # Layout components
│   │   ├── lib/          # Apollo client setup
│   │   └── pages/        # Page components
│   ├── nginx.conf        # Nginx configuration
│   └── Dockerfile
│
└── docker-compose.yml     # Orchestration
```

## 🔧 Common Tasks

### Backend

#### Create a new migration

```bash
cd backend
npx prisma migrate dev --name add_new_feature
```

#### Reset database

```bash
npx prisma migrate reset
```

#### Generate Prisma Client

```bash
npx prisma generate
```

#### View database in Prisma Studio

```bash
npx prisma studio
```

#### Add a new NestJS module

```bash
nest g module feature-name
nest g service feature-name
nest g resolver feature-name
```

### Frontend

#### Install a new package

```bash
cd frontend
npm install package-name
```

#### Build for production

```bash
npm run build
```

#### Preview production build

```bash
npm run preview
```

## 🐛 Debugging

### Backend Issues

#### Check if backend is running

```bash
curl http://localhost:4000/graphql
```

#### View backend logs

```bash
docker-compose logs -f backend
```

#### Connect to database

```bash
docker exec -it finance_postgres psql -U postgres -d financedb
```

### Frontend Issues

#### Check if frontend is running

```bash
curl http://localhost:3000
```

#### View frontend logs

```bash
docker-compose logs -f frontend
```

#### Clear cache and rebuild

```bash
cd frontend
rm -rf node_modules dist
npm install
npm run dev
```

## 🧪 Testing GraphQL API

1. Open http://localhost:4000/graphql
2. Register a user:

```graphql
mutation {
  register(input: { username: "testuser", password: "password123" }) {
    accessToken
    user {
      id
      username
    }
  }
}
```

3. Copy the `accessToken`
4. Add to HTTP Headers:

```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

5. Test protected queries:

```graphql
query {
  me {
    id
    username
  }
  categories {
    id
    name
    children {
      id
      name
    }
  }
}
```

## 📊 Database Schema

### User

- id (UUID, Primary Key)
- username (Unique)
- password (Hashed)
- createdAt (DateTime)

### Category

- id (UUID, Primary Key)
- name (String)
- type (EXPENSE | INCOME)
- parentId (UUID, nullable, Foreign Key)
- userId (UUID, Foreign Key)

### Expense

- id (UUID, Primary Key)
- amount (Float)
- date (DateTime)
- note (String, nullable)
- categoryId (UUID, Foreign Key)
- userId (UUID, Foreign Key)

### Income

- id (UUID, Primary Key)
- amount (Float)
- date (DateTime)
- note (String, nullable)
- categoryId (UUID, Foreign Key)
- userId (UUID, Foreign Key)

## 🔐 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financedb?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
```

### Frontend (.env)

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

## 🚀 Deployment Tips

### Backend

- Change JWT_SECRET to a strong random string
- Use a managed PostgreSQL database
- Enable SSL for database connections
- Set NODE_ENV=production
- Configure proper CORS origins

### Frontend

- Update VITE_GRAPHQL_URL to production backend URL
- Enable HTTPS
- Configure CDN for static assets
- Set up proper caching headers (done in nginx.conf)

### Database

- Regular backups
- Connection pooling
- Monitoring and alerts
- Index optimization

## 📝 Code Style

### Backend (NestJS)

- Use decorators (@Injectable, @Resolver, etc.)
- Follow modular architecture
- Use DTOs for input validation
- Use Guards for authentication
- Use Pipes for transformation

### Frontend (React)

- Functional components with hooks
- Use TypeScript for type safety
- Follow naming conventions (PascalCase for components)
- Keep components small and focused
- Use context for global state

## 🎨 UI/UX Guidelines

- Mobile-first responsive design
- Use Tailwind CSS utility classes
- Consistent color scheme (Indigo for primary actions)
- Clear visual hierarchy
- Accessible (semantic HTML, proper labels)
- Loading states for async operations
- Error handling and user feedback

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Recharts Documentation](https://recharts.org/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📧 Support

For issues or questions, please open an issue on the repository.

---

Happy coding! 🎉
