FROM directus/directus:9.0.0-rc.85

ENV OAUTH_DISCORD_SCOPE "identify email guilds"

COPY --chown=node:node ./discord-oauth/hook.js ./extensions/hooks/discord-oauth/index.js
COPY --chown=node:node ./discord-oauth/migrations/* ./extensions/migrations/
