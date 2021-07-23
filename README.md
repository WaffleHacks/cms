# CMS

The CMS for [WaffleHacks](https://wafflehacks.tech).
We use a customized version of [Directus v9](https://directus.io) that adds authentication via OAuth2 for Discord.

## Development

All testing gets done within Docker using the [`docker-compose.yml`]() file.
So you must have Docker and Docker Compose installed.

To start or restart the environment after a change is made, use
```shell
# Start/restart
docker-compose up --build -V

# Run this if you get permission errors when uploading files
sudo chown -R $USER:root .docker/directus
```

Data for the Postgres database is stored in `.docker/postgres` and Directus uploads are stored in `.docker/directus`.
If you need to wipe any database and/or upload data, those are the folders to remove.

To remove all containers, use `docker-compose down --volumes`.
