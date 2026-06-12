self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Sauerteig-Erinnerung', {
      badge: 'img/sauerteig_96.png',
      body: data.body || 'Der Timer ist abgelaufen!',
      icon: 'img/sauerteig_192.png',
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
