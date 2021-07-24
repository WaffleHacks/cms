declare global {
  const ACCOUNT_EMAIL: string
  const ACCOUNT_ID: string
  const ACCOUNT_TOKEN: string
  const BUILD_TOKEN: string
  const PAGES_PROJECT: string
}

const endpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PAGES_PROJECT}/deployments`

export async function handleRequest(request: Request): Promise<Response> {
  // Check the request is authorized
  const url = new URL(request.url)
  if (
    request.method !== 'POST' ||
    !url.searchParams.has('token') ||
    url.searchParams.get('token') !== BUILD_TOKEN
  ) {
    return new Response('unauthorized', { status: 401 })
  }

  // Send the build trigger
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Auth-Email': ACCOUNT_EMAIL,
      'X-Auth-Key': ACCOUNT_TOKEN,
    },
  })

  return new Response(null, { status: response.status })
}
