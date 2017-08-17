self.addEventListener('install', event  =>
  event.waitUntil(self.skipWaiting())
)

self.addEventListener('push', event => {
  const notificationMessage = event.data.text()
  const notificationOptions = {
    icon: '/android-chrome-192x192.png'
  }
  const notificationPromise =
    self.registration.showNotification(notificationMessage, notificationOptions)

  const clientsPromise = self.clients
    .matchAll()
    .then(clients => {
      for (const client of clients)
        client.postMessage('update')
    })


  event.waitUntil(Promise.all([clientsPromise, notificationPromise]))
})
