FROM node:12

COPY . /opt/app

WORKDIR /opt/app

VOLUME db-data2:/var/lib/mysql mysql:5.7.20

RUN npm install

CMD npm run watch
