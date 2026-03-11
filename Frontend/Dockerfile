FROM oven/bun:1

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies using bun
RUN bun install

# Expose Vite Dev Server port
EXPOSE 5173

# Run Vite dev server with Bun
CMD ["bun", "run", "dev", "--host"]
