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

# Build the Next.js application
RUN yarn build

# Expose port 3000
EXPOSE 3001

# Start the Next.js application
CMD ["yarn", "start"]
