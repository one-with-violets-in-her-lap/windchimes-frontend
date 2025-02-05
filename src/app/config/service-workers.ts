export function setupServiceWorkers() {
    navigator.serviceWorker.register('/offline-handler-service-worker.js')
}
