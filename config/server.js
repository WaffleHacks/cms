const DiscordStrategy = require("passport-discord");

const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const MANAGE_SERVER_PERMISSION = 0x20;

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL'),
  admin: {
    auth: {
      secret: env('JWT_SECRET'),
      providers: [
        {
          uid: "discord",
          displayName: "Discord",
          icon: "https://cdn0.iconfinder.com/data/icons/free-social-media-set/24/discord-512.png",
          createStrategy: strapi => new DiscordStrategy({
            clientID: env("DISCORD_CLIENT_ID"),
            clientSecret: env("DISCORD_CLIENT_SECRET"),
            callbackURL: strapi.admin.services.passport.getStrategyCallbackURL("discord"),
            scope: ["identify", "email", "guilds"],
          }, (accessToken, refreshToken, profile, done) => {
            // Check that the user is in the required guild and
            // is either the owner or has the MANAGE_SERVER permission
            const allowed = profile.guilds.some(g =>
              g.id === DISCORD_GUILD_ID
              && (g.owner || g.permission & MANAGE_SERVER_PERMISSION === MANAGE_SERVER_PERMISSION));

            // Handle not allowed
            if (!allowed) done(null, false, { message: "You do not have the required permissions to access this site!" });

            // Successfully authenticated
            else done(null, {
              email: profile.email,
              username: `${profile.username}#${profile.discriminator}`
            });
          }),
        },
      ],
    },
    serveAdminPanel: true,
    url: "/dashboard",
    autoOpen: false
  },
});
