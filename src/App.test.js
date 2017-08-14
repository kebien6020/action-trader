import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import StorageShim from 'node-storage-shim'

// Shim localStorage
global.localStorage = new StorageShim()
global.window.localStorage = global.localStorage
// Shim crypto for auth0-js
// This is only for local testing and doesn't need
// cryptographically secure random numbers
global.crypto = global.window.crypto = {
  getRandomValues(array) {
    const max = Math.pow(2, array.BYTES_PER_ELEMENT * 8)
    for (let i = 0; i < array.length; ++i)
      array[i] = Math.floor(Math.random() * max)
    return array
  }
}

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
});
