FROM node:21-alpine

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json into the Docker image
COPY . .

# Install only production dependencies
RUN npm install

RUN mv .env.prod .env

# Generate Prisma Client
RUN npx prisma generate

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]