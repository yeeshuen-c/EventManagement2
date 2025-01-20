# Use Node.js image as a base
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port for the app
EXPOSE 8080

# Start the backend app
CMD [ "node", "server.js" ]
