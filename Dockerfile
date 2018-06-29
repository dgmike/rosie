FROM node:10.5-alpine

LABEL MAINTAINER='Michael Granados <michael.granados@catho.com>'

ENV WORKDIR '/app'
WORKDIR $WORKDIR

USER node
COPY --chown=node:node app/package.json app/package-lock.json $WORKDIR/
RUN npm install

COPY --chown=node:node app/ $WORKDIR
