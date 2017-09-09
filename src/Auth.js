import auth0 from 'auth0-js'

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientID = process.env.REACT_APP_AUTH0_CLIENT_ID
const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK
const audience = process.env.REACT_APP_AUTH0_AUDIENCE
const scope = process.env.REACT_APP_AUTH0_SCOPE

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain,
    clientID,
    redirectUri,
    audience,
    responseType: 'token id_token',
    scope
  })

  login() {
    this.auth0.authorize()
  }

  parseHash = () => {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash({hash: window.location.hash}, (err, authResult) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        return resolve(authResult)
      })
    })
  }

  renewAuth = () => {
    return new Promise((resolve, reject) =>
      this.auth0.renewAuth(
        {usePostMessage: false},
        (err, authResult) => {
          if (err) {
            console.log(err)
            return reject(err)
          }
          return resolve(authResult)
        }
      )
    )
  }

  handleAuthentication = async() => {
    const authResult = await this.parseHash()
    this.saveAuth(authResult)
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  }

  saveAuth(authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      this.setSession(authResult)
    } else {
      throw Error('Invalid authResult')
    }
  }

  renew = async () => {
    try {
      this.getAccessToken()
      const authResult = await this.renewAuth()
      this.saveAuth(authResult)
      return true
    } catch (err) {
      // No previous access token: login
      return this.login()
    }
  }
}
