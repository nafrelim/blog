FROM node:20-alpine
ENV NODE_ENV=development
WORKDIR /blog_fe
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
