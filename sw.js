// Enhanced Service Worker for Punjab Learning Platform
const CACHE_NAME = 'nabha-learning-v1.0.0';
const OFFLINE_CACHE = 'nabha-offline-v1.0.0';
const DYNAMIC_CACHE = 'nabha-dynamic-v1.0.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/student.html', 
    '/teacher.html',
    '/css/style.css',
    '/css/student.css',
    '/css/teacher.css',
    '/js/languages.js',
    '/js/script.js',
    '/js/student.js',
    '/js/teacher.js',
    '/manifest.json',
    '/assets/logo.jpg'
];

// Content that can be cached for offline use
const OFFLINE_CONTENT = [
    '/components/offline-page.html',
    '/data/quiz-data.json',
    '/data/literacy-modules.json',
    '/assets/gifs/mouse-click.gif',
    '/assets/gifs/browser-navigation.gif',
    '/assets/gifs/password-security.gif',
    '/assets/gifs/online-study.gif'
];

// Install event - Cache critical resources
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache critical resources
            caches.open(CACHE_NAME).then((cache) => {
                console.log('[ServiceWorker] Caching critical resources');
                return cache.addAll(CRITICAL_RESOURCES);
            }),
            // Cache offline content
            caches.open(OFFLINE_CACHE).then((cache) => {
                console.log('[ServiceWorker] Caching offline content');
                return cache.addAll(OFFLINE_CONTENT);
            })
        ])
    );
    
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && 
                        cacheName !== OFFLINE_CACHE && 
                        cacheName !== DYNAMIC_CACHE) {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Take control of all pages
    self.clients.claim();
});

// Fetch event - Implement caching strategies
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Handle different types of requests with appropriate strategies
    if (request.method !== 'GET') {
        return; // Don't cache non-GET requests
    }
    
    // Handle API requests (if any)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }
    
    // Handle video downloads for offline
    if (url.pathname.includes('/videos/') || request.headers.get('accept')?.includes('video')) {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }
    
    // Handle PDF downloads for offline
    if (url.pathname.includes('/pdfs/') || request.headers.get('accept')?.includes('application/pdf')) {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }
    
    // Handle images
    if (request.destination === 'image') {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }
    
    // Handle fonts
    if (request.destination === 'font') {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }
    
    // Handle HTML pages
    if (request.destination === 'document') {
        event.respondWith(networkFirstStrategy(request));
        return;
    }
    
    // Handle CSS and JS files
    if (request.destination === 'style' || request.destination === 'script') {
        event.respondWith(staleWhileRevalidateStrategy(request));
        return;
    }
    
    // Default: try network first, fallback to cache
    event.respondWith(networkFirstStrategy(request));
});

// Caching Strategies

// Network First - Good for dynamic content
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[ServiceWorker] Network failed, trying cache');
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            return caches.match('/components/offline-page.html');
        }
        
        // Return a generic offline response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}

// Cache First - Good for static assets
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[ServiceWorker] Cache and network both failed');
        return new Response('Content not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Stale While Revalidate - Good for CSS/JS files
async function staleWhileRevalidateStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    const networkResponsePromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then((c) => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    });
    
    return cachedResponse || networkResponsePromise;
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync triggered:', event.tag);
    
    if (event.tag === 'quiz-submission') {
        event.waitUntil(syncQuizSubmissions());
    }
    
    if (event.tag === 'progress-sync') {
        event.waitUntil(syncProgressData());
    }
    
    if (event.tag === 'download-content') {
        event.waitUntil(downloadOfflineContent());
    }
});

// Sync quiz submissions when online
async function syncQuizSubmissions() {
    try {
        const submissions = await getStoredSubmissions();
        
        for (const submission of submissions) {
            try {
                const response = await fetch('/api/quiz/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submission)
                });
                
                if (response.ok) {
                    await removeStoredSubmission(submission.id);
                    console.log('[ServiceWorker] Quiz submission synced:', submission.id);
                }
            } catch (error) {
                console.error('[ServiceWorker] Failed to sync quiz submission:', error);
            }
        }
    } catch (error) {
        console.error('[ServiceWorker] Background sync failed:', error);
    }
}

// Sync progress data when online
async function syncProgressData() {
    try {
        const progressData = await getStoredProgressData();
        
        if (progressData.length > 0) {
            const response = await fetch('/api/progress/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(progressData)
            });
            
            if (response.ok) {
                await clearStoredProgressData();
                console.log('[ServiceWorker] Progress data synced');
            }
        }
    } catch (error) {
        console.error('[ServiceWorker] Progress sync failed:', error);
    }
}

// Download content for offline use
async function downloadOfflineContent() {
    try {
        const contentList = await getContentToDownload();
        const cache = await caches.open(OFFLINE_CACHE);
        
        for (const url of contentList) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                    console.log('[ServiceWorker] Downloaded for offline:', url);
                }
            } catch (error) {
                console.error('[ServiceWorker] Failed to download:', url, error);
            }
        }
    } catch (error) {
        console.error('[ServiceWorker] Offline download failed:', error);
    }
}

// Push notifications for new content
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'New content available!',
        icon: '/assets/logo-192.png',
        badge: '/assets/logo-96.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {
                action: 'open',
                title: 'Open App',
                icon: '/assets/open-icon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/close-icon.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Nabha Learning App', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/student.html')
        );
    }
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received:', event.data);
    
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
                
            case 'CACHE_CONTENT':
                cacheContent(event.data.urls);
                break;
                
            case 'CLEAR_CACHE':
                clearCache(event.data.cacheName);
                break;
                
            case 'GET_CACHE_SIZE':
                getCacheSize().then((size) => {
                    event.ports[0].postMessage({ size });
                });
                break;
        }
    }
});

// Helper functions for IndexedDB operations (mock implementations)
async function getStoredSubmissions() {
    // Implementation would use IndexedDB
    return JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
}

async function removeStoredSubmission(id) {
    const submissions = await getStoredSubmissions();
    const filtered = submissions.filter(s => s.id !== id);
    localStorage.setItem('pendingSubmissions', JSON.stringify(filtered));
}

async function getStoredProgressData() {
    return JSON.parse(localStorage.getItem('pendingProgress') || '[]');
}

async function clearStoredProgressData() {
    localStorage.removeItem('pendingProgress');
}

async function getContentToDownload() {
    return JSON.parse(localStorage.getItem('downloadQueue') || '[]');
}

async function cacheContent(urls) {
    const cache = await caches.open(DYNAMIC_CACHE);
    return Promise.all(
        urls.map(url => 
            fetch(url).then(response => 
                response.ok ? cache.put(url, response) : null
            )
        )
    );
}

async function clearCache(cacheName) {
    return caches.delete(cacheName || DYNAMIC_CACHE);
}

async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const name of cacheNames) {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }
    
    return totalSize;
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('[ServiceWorker] Periodic sync triggered:', event.tag);
    
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    try {
        // Check for new content and cache it
        const response = await fetch('/api/content/updates');
        if (response.ok) {
            const updates = await response.json();
            await cacheContent(updates.urls);
        }
    } catch (error) {
        console.error('[ServiceWorker] Content sync failed:', error);
    }
}

console.log('[ServiceWorker] Service Worker loaded successfully');