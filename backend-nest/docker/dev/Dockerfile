FROM node:24.14.1

RUN npm i -g @nestjs/cli
RUN npm i -g madge

WORKDIR /api

RUN apt update && apt install git vim acl -y && apt clean && rm -rf /var/lib/apt/lists/*

RUN echo "alias ll='ls -alh'" > ~/.bashrc

ENV TZ='Europe/Brussels'

CMD npm install && npm run migration:run && npm run start:debug --preserveWatchOutput