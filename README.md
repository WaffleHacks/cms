# CMS

The CMS for [WaffleHacks](https://wafflehacks.dev).

## Development

1. Install the latest LTS release of Node.js with [nvm](https://github.com/nvm-sh/nvm) or from the [official releases](https://nodejs.org/en/).
2. Setup a PostgreSQL database

If you have Docker and Docker Compose installed, you can run `docker-compose up -d` to setup a local instance of PostgreSQL and Redis.
The instance can then be connected with `postgres://postgres:postgres@127.0.0.1:5432/postgres`.

3. Install dependencies
```shell
$ yarn install
```
4. Start the development server
```shell
$ yarn develop
```
