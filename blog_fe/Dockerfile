FROM node:latest
ENV NODE_ENV=development
WORKDIR /blog_fe
COPY package.json /blog_fe
COPY package-lock.json /blog_fe
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "start" ]
