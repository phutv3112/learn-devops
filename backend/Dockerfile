FROM node:24.15.0-alpine3.22

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "\
    const http = require('http');\
    http.get('http://localhost:3000/health', (res) => {\
      if (res.statusCode !== 200) process.exit(1);\
    }).on('error', () => process.exit(1));"

CMD ["node", "index.js"]