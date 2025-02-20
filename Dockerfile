# Use Node.js image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Install Playwright with dependencies
RUN npx playwright install --with-deps

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build

# Command to run tests
CMD ["npm", "test"]


#FROM node:14
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#CMD ["npm", "test"]

