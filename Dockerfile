# Use a lightweight base image
FROM node:alpine as build

ARG ROOT_PATH=/

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Install Vite globally
RUN npm install -g vite

# Copy the entire project to the working directory
COPY . .

# Build the Vite React project
RUN npm run build -- --base=${ROOT_PATH}

# Use a lightweight base image for serving the build artifacts
FROM node:alpine

# Install the `serve` package globally
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Copy the build artifacts from the previous stage
COPY --from=build /app/dist .

# Expose port 6900
EXPOSE 6901

# Start the `serve` command to serve the build artifacts
CMD ["serve", "-p", "6901", "-s", "."]
