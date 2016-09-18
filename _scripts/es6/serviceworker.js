var version = 'v0.0.3';
var cache_name = `${version}-cache`;

self.addEventListener("install", function(event) {
    event.waitUntil(

        caches.open(cache_name).then(function(cache) {
            return cache.addAll([
                '/css/site.css',
                '/js/site.js'
            ]);
        })
    );
});

self.addEventListener("fetch", function(event) {

    var request = event.request;
    var requestURL = new URL(request.url);

    // do not cache POST,etc.
    if (request.method !== 'GET') {
        return;
    }

    // match main
    if (requestURL.pathname === '/')  {
        event.respondWith(
            caches.match(request)
                .then(queryNetworkFirst)
        );
        return;
    }

    // match tours, but not full_tours
    if (requestURL.pathname.indexOf('/tours') !== -1 && requestURL.pathname.indexOf('/tours/1') === -1) {
        event.respondWith(
            caches.match(request)
                .then(queryNetworkFirst)
        );
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(queryCacheFirst)
    );

    function queryNetworkFirst(cached) {
        var networked = fetch(request)
            .then(fetchedFromNetwork, unableToResolve)
                .catch(unableToResolve);
        return networked || cached;
    }

    function queryCacheFirst(cached) {
        var networked = fetch(request)
            .then(fetchedFromNetwork, unableToResolve)
                .catch(unableToResolve);
        return cached || networked;
    }

    function fetchedFromNetwork(response) {
        var responseCopy = response.clone();
        caches.open(cache_name)
            .then(function add(cache) {
                cache.put(request, responseCopy);
            });
        return response;
    }

    function unableToResolve() {
        // example: matching images and returning imageFallback {{{
        // var accepts = request.headers.get('Accept');
        // if (accepts.indexOf('image') !== -1) {
        //     return imageFallback;
        // }
        // /example }}}

        // if nothing matched
        return new Response('', {
            headers: new Headers({
                'Content-Type': 'text/html'
            }),
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys()
            .then( function(keys) {
                return Promise.all(
                    keys.filter(function(key) {
                        return caches.delete(key);
                    })
                );
            }
    )
    );
});
