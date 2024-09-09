self.addEventListener('install', (event) => {
    console.log('Service Worker installé.');
    // Précharge des ressources ici si nécessaire
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activé.');
    // Supprime les anciens caches ici si nécessaire
});

self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
    // Gérer les requêtes ici, par exemple avec un cache
});
