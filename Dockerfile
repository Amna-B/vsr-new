# Step 1: Build React frontend
FROM node:18 AS build-frontend
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Step 2: Build and run Node.js server
FROM node:18

# Set working directory
WORKDIR /app

# Copy server code
COPY server ./server
COPY server/package*.json ./server/

# Install backend dependencies
WORKDIR /app/server
RUN npm install

# Copy React build into server
COPY --from=build-frontend /app/client/build ./client/build

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]














# # Step 1: Build React Frontend
# FROM node:18 AS build

# WORKDIR /app/client

# # Copy React app package files and install deps
# COPY client/package*.json ./
# RUN npm install

# # Copy all React frontend files
# COPY client/ ./

# # Build React frontend
# RUN npm run build

# # Step 2: Setup backend with frontend build
# FROM node:18

# WORKDIR /app/server

# # Copy backend package files and install deps
# COPY server/package*.json ./
# RUN npm install

# # Copy backend source files
# COPY server/ ./

# # Copy React build from previous stage into backend's public folder
# COPY --from=build /app/client/build ./public

# # Expose backend port
# EXPOSE 5000

# # Run backend server
# CMD ["node", "index.js"]
