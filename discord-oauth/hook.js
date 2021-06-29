const axios = require("axios");

// The bitflag for the MANAGE_SERVER permission
// From: https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
const MANAGE_SERVER_FlAG = 0x20;

async function upsertUser(service, email, userData, exceptions) {
  try {
    // Create the user if they don't exist
    return await service.createOne({ 
      email, 
      ...userData,
    });
  } catch (e) {
    try {
      // If they do exist, ensure their details are up-to-date
      const ids = await service.updateByQuery({ filter: { email: { _eq: email } } }, userData);
      return ids[0];
    } catch (e) {
      throw new exceptions.ServiceUnavailableException(e);
    }
  }
}

module.exports = function registerHook({ env, exceptions, services }) {
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

      // Check if the user already exists
      const mappings = new ItemsService("directus_oauth", { schema });
      const userMapping = mappings.readByQuery({ filter: { id: { _eq: id } }, limit: 1 });

      // TODO: fix profile uploading
      /*
      // Upload the user's profile picture
      const files = new FilesService({ schema, accountability });
      const avatarId = await files.importOne(`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`);
      */

      // Build the user's data
      const userData = {
        first_name: username,
        last_name: discriminator,
        //avatar: avatarId,
      };

      // Create/update the user
      const users = new UsersService({ schema });
      const user_id = await upsertUser(users, email, userData, exceptions);

      // Map the user's ID to the provider ID
      const mappings = new ItemsService("directus_oauth", { schema });
      await mappings.upsertOne({ id, user_id });

      return input;
    },
  };
};
