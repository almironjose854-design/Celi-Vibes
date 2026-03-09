FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

COPY . .

RUN mkdir -p /app/data /data

EXPOSE 8080

CMD ["node", "server.js"]
