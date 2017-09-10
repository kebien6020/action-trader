// This view will be loaded inside an invisible iframe and is expected
// to post the message back to the parent window

import React from 'react'

const SilentAuth = () => {
  // const targetURL = process.env.REACT_APP_BASE_URL
  const hash = window.location.hash
  window.parent.postMessage(hash, '*')

  return <p>Error: Esta página debería ser invisible</p>
}

export default SilentAuth
