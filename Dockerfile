# Step 1: Build React Frontend
FROM node:18 AS build

WORKDIR /app

# Copy React app files
COPY client ./client
COPY client/package*.json ./client/

WORKDIR /app/client
RUN npm install
RUN npm run build

# Step 2: Serve with Node backend
FROM node:18

WORKDIR /app

# Copy backend
COPY server ./server
COPY server/package*.json ./server/

# Copy frontend build to backend public directory (assumes backend serves static files)
COPY --from=build /app/client/build ./server/public

WORKDIR /app/server
RUN npm install

EXPOSE 5000

CMD ["node", "app.js"]
