const axios = require("axios");

// The bitflag for the MANAGE_SERVER permission
// From: https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
const MANAGE_SERVER_FlAG = 0x20;

// This is a hack to get around permissions to upload the user's profile picture
const HOOK_ACCOUNTABILITY = { admin: true, ip: "127.0.0.1", userAgent: "directus-hook/discord-oauth" };

/**
 * Find a user by their ID
 * @param {Object} service - the mappings service
 * @param {string} id - the user OIDC ID
 * @returns {Promise<string>} - the user's ID if found
 */
async function findUser(service, id) {
  const records = await service.readByQuery({filter: {id: {_eq: id}}, limit: 1});
  if (records.length === 0) return undefined;
  return records[0].user_id;
}

/**
 * Create a user and map them to their OIDC ID
 * @param {Object} users - the users service
 * @param {Object} mappings - the mapping service
 * @param {Object} files - the files service
 * @param {string} id - the user's OIDC ID
 * @param {string} avatar - the user's profile picture ID
 * @param {Object} userData - arbitrary user data to set on the user
 * @returns {Promise<void>}
 */
async function createUser(users, mappings, files, id, avatar, userData) {
  // Create the profile picture
  userData.avatar_id = await files.importOne(`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`);

  // Create the user
  const user_id = await users.createOne(userData);
  await mappings.createOne({ id, user_id });
}

module.exports = function registerHook({ env, services }) {
  const { FilesService, ItemsService, UsersService } = services;
  const { DISCORD_GUILD_ID } = env;

  if (DISCORD_GUILD_ID === "") {
    console.error("The DISCORD_GUILD_ID environment variable must be set!");
  }

  return {
    "oauth.discord.login.before": async function(input, { payload, schema }) {
      const { error, access_token, profile: { avatar, email, discriminator, id, username }} = payload;
      if (error !== undefined) return input;

      // Determine if the user is authorized by checking if they are in the correct guild,
      // and are either the owner or have the MANAGE_SERVER permission
      const { data: guilds } = await axios.get(
        "https://discord.com/api/v9/users/@me/guilds",
        { headers: { "Authorization": `Bearer ${access_token}` } }
      );
      const authorized = guilds.some(g =>
        g.id === DISCORD_GUILD_ID
        && (g.owner || g.permission & MANAGE_SERVER_FlAG === MANAGE_SERVER_FlAG)
      );

      if (!authorized) return input;

      // Open the services
      const files = new FilesService({ schema, accountability: HOOK_ACCOUNTABILITY });
      const mappings = new ItemsService("directus_oauth", { schema });
      const users = new UsersService({ schema });

      // Build the user's data
      const userData = {
        first_name: username,
        last_name: discriminator,
        email,
      }

      // Create or update the user
      const userId = await findUser(mappings, id);
      if (userId === undefined) await createUser(users, mappings, files, id, avatar, userData);
      else await users.updateOne(userId, userData);

      return input;
    },
  };
};
