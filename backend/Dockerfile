# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Expose the application port
EXPOSE 4000

# Command to run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]