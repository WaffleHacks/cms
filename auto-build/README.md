# Auto Build

Auto Build is a [Cloudflare Worker](https://workers.cloudflare.com/) that receives a webhook from Directus and then triggers a rebuild of our website.
This is only necessary as Directus does not yet support headers in webhooks, which are required to authenticate with
Cloudflare pages, where our website is hosted.
