FROM node:20

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

# Copie tout le code (src, public, etc.)
COPY . ./

EXPOSE 3000

CMD ["npm", "start"]
