# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (adjust if needed)
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
