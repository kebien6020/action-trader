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

  event.waitUntil(notificationPromise)
})
