# Inventory Management System

A full-stack inventory management system built with React, Node.js, Express, and MySQL. Features include product management, authentication, search functionality, and real-time stock tracking.

## 🚀 Features

1. **Authentication** - JWT-based login system with token management
2. **Product Management** - Full CRUD operations (Create, Read, Update, Delete)
3. **Search & Filter** - Real-time search by name, SKU, or category
4. **Stock Tracking** - Low stock alerts and inventory value calculation
5. **Dashboard Stats** - Total products, inventory value, and low stock count

## 📋 Technical Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MySQL 8.0
- **Authentication**: JWT tokens
- **Containerization**: Docker & Docker Compose

## 🛠️ Prerequisites

- Node.js 18+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- MySQL 8.0 (if running without Docker)

## 🚀 Quick Start with Docker

The easiest way to run the entire application:

```bash
# 1. Clone the repository
git clone <repository-url>
cd inventory-management

# 2. Create environment file
cp .env.example .env

# 3. Start all services with Docker Compose
docker-compose up -d

# 4. Check services are running
docker-compose ps

# 5. View logs
docker-compose logs -f backend
```

The API will be available at `http://localhost:3001`

### Default Login Credentials
- **Username**: `admin`
- **Password**: `password`

## 💻 Local Development Setup

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start MySQL (if not using Docker)
# Update .env with your MySQL credentials

# Run database migrations (automatic on first start)
npm start

# For development with auto-reload
npm run dev
```

### Frontend Setup

The React frontend is provided as an artifact that can be:
1. Copied into a new React project
2. Run directly in the Claude interface
3. Integrated into an existing React application

For a standalone React app:

```bash
# Create new React app
npx create-react-app inventory-frontend
cd inventory-frontend

# Install dependencies
npm install lucide-react

# Copy the React component code into src/App.js
# Update API_URL if needed

# Start development server
npm start
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Health Check
- `GET /api/health` - Check API status

## 📝 API Request Examples

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### Create Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name":"Laptop",
    "sku":"LAP-001",
    "quantity":50,
    "price":999.99,
    "category":"Electronics"
  }'
```

### Get All Products
```bash
curl -X GET http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 Testing

Run the test suite:

```bash
# Install test dependencies
npm install --save-dev jest supertest

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- Authentication endpoints
- CRUD operations
- Error handling
- Input validation
- Duplicate prevention

## Branching Strategy

- `main`: Production-ready code, protected
- `develop`: Integration branch for features
- `feature/*`: New features (branch from develop)
- `bugfix/*`: Bug fixes (branch from develop)
- `hotfix/*`: Emergency fixes (branch from main)
- `release/*`: Release preparation (branch from develop)

## Workflow
1. Create feature branch from develop
2. Develop and commit changes
3. Push branch and create Pull Request to develop
4. Pass all CI checks
5. Obtain 2 peer reviews
6. Merge to develop
7. Periodically merge develop to main through release branch
