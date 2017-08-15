const apiUrl = process.env.REACT_APP_API_URL

export function fetchJson(url, auth, options) {
  const baseHeaders = {
    'Authorization': 'bearer ' + auth.getAccessToken(),
    'Content-Type': 'application/json',
  }

  const opts = options || {}

  const headers = Object.assign({}, baseHeaders, opts.headers)
  const allOpts = Object.assign({}, options, {headers})
  return fetch(apiUrl + url, allOpts).then(res => res.json())
}

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}
