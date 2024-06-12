FROM node:18-slim
WORKDIR /app
RUN npm install express
COPY . .
EXPOSE 4200
CMD ["node", "index.js"]
