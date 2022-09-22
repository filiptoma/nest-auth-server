# reference: https://blog.logrocket.com/containerized-development-nestjs-docker/

FROM node:lts-alpine As development

# each command below will be executed in this new context
WORKDIR /usr/src/app

COPY package*.json ./

# in new context, run npm install on just devDependencies
RUN npm install --only=development

# copy the rest of files into docker container
COPY . .

# builds app in /dist directory of current context
# note: needs to be executed in development image, as app
# uses ts and other build-time dependencies
RUN npm run build

# creates a new image without any connections to previous
FROM node:lts-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# same process as in development image
# though this time install dependencies instead
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# copy /dist from development image
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
