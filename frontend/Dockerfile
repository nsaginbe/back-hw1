# Stage 1: Build the frontend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Install test dependencies
RUN npm install --save-dev @testing-library/react @testing-library/jest-dom jest

CMD ["npm", "start"]

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
