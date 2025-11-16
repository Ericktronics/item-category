# ---------- Base image ----------
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# ---------- Dependencies layer ----------
FROM base AS deps
COPY package*.json ./
RUN npm install

# ---------- Build layer ----------
FROM base AS build
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN npm run build

# ---------- Production runtime ----------
FROM node:20-alpine AS production
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy built JS and package files
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

# Install only production deps
RUN npm install --omit=dev

# Expose your app port
EXPOSE 3000

# Start the server (as defined in package.json: "start": "node dist/server.js")
CMD ["node", "dist/server.js"]