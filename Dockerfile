# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install -g expo-cli
RUN npm install

# Copy all project files
COPY . .

# Expose Expo default ports
EXPOSE 19000 19001 19002

# Start Expo
CMD ["expo", "start", "--tunnel"]
