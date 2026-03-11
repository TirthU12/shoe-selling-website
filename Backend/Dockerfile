FROM node:18

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy everything
COPY . .

# Expose your backend port (3000)
EXPOSE 3000

# Start with nodemon
CMD ["npm", "run", "dev"]
