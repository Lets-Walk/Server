FROM node:14

WORKDIR /app

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /app
COPY ./package*.json /app
RUN npm install

COPY . .

RUN chmod +x wait-for-it.sh

ENV NODE_ENV development
EXPOSE 3000
CMD ["npm", "run","dev"]