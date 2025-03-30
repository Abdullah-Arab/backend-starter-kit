# Use the Node.js base image
FROM node:22

# Install PostgreSQL client tools
# RUN apt-get update && apt-get install -y postgresql-client

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the API port
EXPOSE 3345

# Start the application
CMD ["npm", "start"]
