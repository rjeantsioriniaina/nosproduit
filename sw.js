// Nom du cache
const CACHE_NAME = 'v1.0';

// URL des fichiers à mettre en cache
const CACHE_URLS = [
    '/',
    'css/style.css',
    'images/image-produit1.webp',
    'images/image-produit2.webp',
    'images/image-produit3.webp',
    'images/temoignage1.webp',
    'images/temoignage2.webp',
];

// Événement d'installation du service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_URLS);
        })
    );
});

// Événement de gestion des requêtes
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
