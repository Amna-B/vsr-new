# Step 1: Build React Frontend
FROM node:18 AS build

WORKDIR /app/client

# Copy React app package files and install deps
COPY client/package*.json ./
RUN npm install

# Copy all React frontend files
COPY client/ ./

# Build React frontend
RUN npm run build

# Step 2: Setup backend with frontend build
FROM node:18

WORKDIR /app/server

# Copy backend package files and install deps
COPY server/package*.json ./
RUN npm install

# Copy backend source files
COPY server/ ./

# Copy React build from previous stage into backend's public folder
COPY --from=build /app/client/build ./public

# Expose backend port
EXPOSE 5000

# Run backend server
CMD ["node", "index.js"]
