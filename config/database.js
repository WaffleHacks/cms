const parse = require('pg-connection-string').parse;
const config = parse(process.env.DATABASE_URL);

const sslEnabled = (process.env.NODE_ENV || 'development') === 'production'
const ssl = { rejectUnauthorized: false };

module.exports = ({ env }) => ({
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
        ssl: sslEnabled ? ssl : false
      },
      options: {
        useNullAsDefault: true,
        ssl: sslEnabled
      },
    },
  },
});
