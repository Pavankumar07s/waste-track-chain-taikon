# Use the official Node.js image as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock

COPY package.json ./
# Install dependencies
RUN yarn install


# Copy the rest of the application
COPY . .

# Expose port 4000 (or your API port)
EXPOSE 5000

# Start the backend application
CMD ["yarn", "dev"]
