const OFFLINE_ASSETS_CACHE_NAME = 'offline-assets'

self.addEventListener('install', event => {
    console.log('Offline handler service worker installed')

    event.waitUntil(
        caches
            .open(OFFLINE_ASSETS_CACHE_NAME)
            .catch(error =>
                console.error(
                    'Error occurred while initializing offline page cache:',
                    error,
                ),
            ),
    )
})

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || !event.request.url.includes(self.origin)) {
        return
    }

    async function fetchOrGetFromCache(request) {
        const offlineAssetsCache = await caches.open(OFFLINE_ASSETS_CACHE_NAME)

        try {
            const response = await fetch(request)

            await offlineAssetsCache.put(request, response.clone())

            return response
        } catch (error) {
            console.warn(
                `${request.url}: Network request failed, falling back to cache if it exists`,
            )

            return offlineAssetsCache.match(request)
        }
    }

    event.respondWith(fetchOrGetFromCache(event.request))
})
