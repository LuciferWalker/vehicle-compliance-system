# Use the official Node.js image as the base image
FROM node:18-alpine

# Set build-time environment variable for production
ARG NODE_ENV=production

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Add the .env file to the container
COPY .env .env

# Generate Prisma client
RUN npx prisma generate

# Build the application without linting errors
RUN NEXT_PUBLIC_SKIP_ESLINT=true npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
