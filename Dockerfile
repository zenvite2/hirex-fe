FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY .env ./
COPY .env.prod ./

COPY . .

RUN npm run build:prod

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
