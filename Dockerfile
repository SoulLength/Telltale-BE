FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force
COPY dist ./dist
ENV NODE_ENV=production
EXPOSE 80

CMD ["node", "dist/main.js"]