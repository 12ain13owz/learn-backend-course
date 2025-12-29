# Backend Complete Course (Node.js)

## 📚 Learning source

- Platform: YouTube
- Title: Backend Complete Course | NodeJS, ExpressJS, JWT, PostgreSQL, Prisma
- URL: [Youtube](https://www.youtube.com/watch?v=g09PoiCob4Y)

## 🛠 Tech Stack

- Node.js
- Express.js
- JWT Authentication
- PostgreSQL
- Prisma ORM

## 🚀 Getting Started with Docker

You can run the entire stack (Node.js API and PostgreSQL database) with a single command using Docker Compose.

### 1. Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- A `.env` file in the root directory.

### 2. Environment Variables

Initialize your environment variables by copying the example file:

```bash
cp .env.example .env
```

### 3. Run the Application

Execute the following command to build and start all services:

```bash
docker-compose up --build -d
```

## 🔧 Development Commands

### Local Development (Without Docker)

If you prefer to run the Node.js app locally while connecting to a database:

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run in development mode
npm run dev
```
