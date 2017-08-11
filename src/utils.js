const apiUrl = process.env.REACT_APP_API_URL

export function fetchJson(url, auth, options) {
  const authOpts = {
    headers: {
      'Authorization': 'bearer ' + auth.getAccessToken()
    }
  }
  const allOpts = Object.assign({}, authOpts, options)
  return fetch(apiUrl + url, allOpts).then(res => res.json())
}
