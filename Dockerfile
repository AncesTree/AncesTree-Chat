FROM node:12.13.0
WORKDIR /usr/scr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
