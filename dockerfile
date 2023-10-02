# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy all local files to the container
COPY . .

# Expose the port your application is running on
EXPOSE 3000

# Define the command to run your application
CMD ["node", "index.js"]
