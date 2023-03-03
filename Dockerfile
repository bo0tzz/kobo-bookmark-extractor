FROM node:16-alpine3.14 as base

WORKDIR /usr/src/app
EXPOSE 3000

FROM base as builder

RUN chown node:node /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000

FROM builder AS prod

RUN npm run build
RUN npm prune --omit=dev

FROM base

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=prod /usr/src/app/node_modules ./node_modules
COPY --from=prod /usr/src/app/build ./build

COPY package.json package-lock.json ./
COPY entrypoint.sh ./

CMD [ "/bin/sh", "./entrypoint.sh" ]