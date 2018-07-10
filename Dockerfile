FROM node:10.5-alpine

LABEL MAINTAINER='Michael Granados <michael.granados@catho.com>'

RUN mkdir /app && chown node:node /app
RUN npm i --global nodemon

ENV WORKDIR /app
WORKDIR $WORKDIR

USER node
COPY --chown=node:node app/package.json app/package-lock.json $WORKDIR/
RUN npm install

COPY --chown=node:node app/ $WORKDIR
RUN npm run webpack

CMD npm start
