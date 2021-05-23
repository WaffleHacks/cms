FROM node:14-alpine

# Switch to non-root user
RUN adduser -D app
USER app

WORKDIR /cms

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Apply library patches
COPY ./patches/sso.patch ./node_modules/strapi/lib/utils/ee.js
COPY ./patches/webhook.patch ./node_modules/strapi/lib/services/webhook-runner.js

# Copy all the project files
COPY ./api ./api
COPY ./components ./components
COPY ./config ./config
COPY ./extensions ./extensions
COPY ./public ./public
COPY ./favicon.ico ./

# Build the app
ENV NODE_ENV production
RUN yarn build

# Prune unused dependencies/files
RUN npm prune --production

# Run the server
EXPOSE 1337
CMD ["yarn", "start"]
