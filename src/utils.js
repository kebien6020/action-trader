const apiUrl = process.env.REACT_APP_API_URL

export function fetchJson(url, ...args) {
  return fetch(apiUrl + url, ...args).then(res => res.json())
}
