
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY ./ ./
# COPY ./public ./public
RUN npm install 
RUN npm install -D tailwindcss
RUN npx tailwindcss init
RUN npx tailwindcss -i ./src/App.css -o ./src/output.css --watch


EXPOSE 3000

CMD ["npm", "start"]
