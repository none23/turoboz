"use strict";var version="v0.0.3",cache_name=version+"-cache";self.addEventListener("install",function(e){e.waitUntil(caches.open(cache_name).then(function(e){return e.addAll(["/css/site.css","/js/site.js"])}))}),self.addEventListener("fetch",function(e){function t(e){var t=e.clone();return caches.open(cache_name).then(function(e){e.put(c,t)}),e}function n(){return new Response("",{headers:new Headers({"Content-Type":"text/html"}),status:503,statusText:"Service Unavailable"})}var c=e.request;"GET"===c.method&&e.respondWith(caches.match(c).then(function(e){var s=fetch(c).then(t,n).catch(n);return e||s}))}),self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.filter(function(e){return caches.delete(e)}))}))});