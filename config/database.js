const parser = require('pg-connection-string');

module.exports = ({ env }) => {
  const config = parser.parse(env("DATABASE_URL", "postgres://postgres:postgres@127.0.0.1:5432/postgres"))
  return {
    defaultConnection: 'default',
    connections: {
      default: {
        connector: 'bookshelf',
        settings: {
          client: 'postgres',
          host: config.host,
          port: config.port,
          database: config.database,
          username: config.user,
          password: config.password,
          ssl: false
        },
        options: {
          useNullAsDefault: true,
          ssl: false
        },
      },
    },
  };
}
