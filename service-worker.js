/**
 * service-worker.js
 *
 * This script runs in the background to provide Progressive Web App
 * features like offline access and caching.
 */

// A unique name for the cache, with a version number.
// When you update the app's files, increment this version number.
const CACHE_NAME = 'compact-snippet-lists-v1';

// A list of all the essential files the app needs to run offline.
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/styles/lists.css',
    '/styles/settings.css',
    '/scripts/data/default-data.js',
    '/scripts/utils/helpers.js',
    '/scripts/state/store.js',
    '/scripts/modules/list-renderer.js',
    '/scripts/modules/settings-panel.js',
    '/scripts/modules/color-handler.js',
    '/scripts/modules/dnd-handler.js',
    '/scripts/modules/list-interactions.js',
    '/scripts/main.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
];

// 1. Install Event: Caches the application's shell.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// 2. Fetch Event: Serves cached content first (Cache-First Strategy).
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If a cached response is found, return it.
                if (response) {
                    return response;
                }
                // Otherwise, fetch the resource from the network.
                return fetch(event.request);
            })
    );
});

// 3. Activate Event: Cleans up old, unused caches.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // If this cache name is not in our whitelist, delete it.
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});