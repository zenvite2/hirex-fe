FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG REACT_APP_API_URL
ARG REACT_APP_OTHER_ENV_VAR

# Build the React application
RUN npm run build

FROM nginx:alpine

# Copy the built files from the build stage to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
