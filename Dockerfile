# Use Node.js as base image
FROM node:24-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["sh", "-c", "npx prisma migrate dev && npm run dev"]