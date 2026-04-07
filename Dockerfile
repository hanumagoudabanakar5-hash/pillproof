FROM node:20

WORKDIR /app

# Copy the backend folder specifically
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy the rest of the backend code
COPY backend/ ./backend/

# Set working directory to backend to run the app
WORKDIR /app/backend

# Adjust this to whatever your start script is (e.g., node index.js)
CMD ["npm", "start"]
