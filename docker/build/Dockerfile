# Use an official Node.js runtime as the base image
FROM node:21 as builder

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code into the Docker image
COPY . .

# Build the application
RUN npm run build

# Start a new stage to create a smaller final image
FROM node:21-alpine

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json into the Docker image
COPY package*.json .env.prod ./

RUN mv .env.prod .env

# Install only production dependencies
RUN npm install --only=production

# Copy the build output from the previous stage into the Docker image
COPY --from=builder /app/dist ./dist

# Copy the Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Expose port 3000 for the application
EXPOSE 3000 80

# Start the application
CMD ["node", "dist/src/main"]