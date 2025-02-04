self.addEventListener('install', event => {
    console.log(
        'Offline handler service worker installed. Caching offline page assets...',
    )

    event.waitUntil(
        caches
            .open('offline-page-assets')
            .then(offlineAssetsCache =>
                offlineAssetsCache
                    .addAll(['/index.html'])
                    .then(() => self.skipWaiting()),
            )
            .catch(error =>
                console.error(
                    'Error occurred while initializing offline page cache:',
                    error,
                ),
            ),
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || !event.request.url.includes('localhost')) {
        return
    }

    event.respondWith(
        fetch(event.request.url).catch(() => caches.match(event.request.url)),
    )
})
