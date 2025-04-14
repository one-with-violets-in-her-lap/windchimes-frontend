export function setupServiceWorkers() {
    if (import.meta.env.PROD) {
        navigator.serviceWorker.register('/offline-handler-service-worker.js')
    }
}
