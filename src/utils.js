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
