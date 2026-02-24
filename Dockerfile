# Use an official Node.js runtime as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Set the port (fly.io sets PORT env variable)
ENV PORT=8080
# Set upload directory (mounted volume on fly.io)
ENV UPLOAD_DIR=/data

# Expose the port the app will run on
EXPOSE 8080

# Command to run the app
CMD ["npm","start"]
