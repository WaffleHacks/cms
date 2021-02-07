module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL'),
  admin: {
    auth: {
      secret: env('JWT_SECRET'),
    },
    serveAdminPanel: true,
    url: "/dashboard",
    autoOpen: false
  },
});
