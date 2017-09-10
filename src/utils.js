const apiUrl = process.env.REACT_APP_API_URL

export async function fetchJson(url, auth, options = {}) {
  const fetch = options.fetch || window.fetch

  const baseHeaders = {
    'Authorization': 'bearer ' + auth.getAccessToken(),
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }


  const opts = options || {}

  const headers = Object.assign({}, baseHeaders, opts.headers)
  const allOpts = Object.assign({}, options, {headers})

  const response = await fetch(apiUrl + url, allOpts)
  const data = await response.json()

  // In case of token error try renewing it with silentAuth and retry
  if (data.success === false && data.error.name === 'UnauthorizedError') {

    const success = await auth.renew()

    if (success && !opts.retry) {
      // retry
      const newOpts = Object.assign({}, options, {retry: true})
      return fetchJson(url, auth, newOpts)
    } else {
      // silent auth failed, let's do a flashy auth
      return auth.login()
    }

  }

  return data
}

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}
