FROM directus/directus:v9-rc.82

ENV OAUTH_DISCORD_SCOPE "identify email guilds"

COPY ./discord-oauth/hook.js ./extensions/hooks/discord-oauth/index.js
COPY ./discord-oauth/migrations/* ./extensions/migrations/
