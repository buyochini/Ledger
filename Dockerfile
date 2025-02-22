# Use the official Playwright image
FROM mcr.microsoft.com/playwright:v1.50.0-noble

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build

# Command to run tests
CMD ["npm", "test"]

