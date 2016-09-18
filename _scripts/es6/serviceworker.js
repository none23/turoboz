var version = 'v0.0.3';
var cache_name = `${version}-cache`;

self.addEventListener("install", function(event) {
    event.waitUntil(

        caches.open(cache_name).then(function(cache) {
            return cache.addAll([
                '/',
                '/css/site.css',
                '/js/site.js'
            ]);
        })
    );
});

self.addEventListener("fetch", function(event) {

    var request = event.request;

    // do not cache POST,etc.
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(queriedCache)
    );

    function queriedCache(cached) {

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
