FROM directus/directus:v9-rc.83

COPY ./discord-oauth/hook.js ./extensions/hooks/discord-oauth/index.js
COPY ./discord-oauth/migrations/* ./extensions/migrations/
