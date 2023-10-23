# Use the desired Node.js version
FROM node:18

# Set the working directory
WORKDIR .

# Copy required config files from the "./frontend" directory
COPY frontend/package*.json ./

COPY frontend/tsconfig.json ./

COPY frontend/.env ./

COPY tsconfig.base.json ./

# Copy the entire frontend directory and its contents to the container
COPY frontend/src ./src

# Install project dependencies
RUN npm install

# Build project
RUN npm run build

# Expose the app on port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]