FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt --build-from-source
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
