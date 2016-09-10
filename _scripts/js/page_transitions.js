'use strict';

(function () {

    var pageContentWrap = 'page_content_wrap';
    var appcache = window.applicationCache;

    var changePage = function changePage(url) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.responseType = 'document';

        xhr.onload = function () {
            var newPage = this.response.getElementById(pageContentWrap);
            var currentPage = document.getElementById(pageContentWrap);

            var fadeAway = currentPage.animate({
                opacity: [1, 0]
            }, 200);

            fadeAway.onfinish = function () {
                currentPage.parentNode.replaceChild(newPage, currentPage);
            };
        };

        xhr.send();
    };

    function onUpdateReady() {
        appcache.swapCache();
        changePage(document.URL);
    }

    appcache.addEventListener('updateready', onUpdateReady);

    if (appcache.status === appcache.UPDATEREADY) {
        onUpdateReady();
    }
    setInterval(function () {
        appcache.update();
    }, 300000);

    if (history && history.pushState) {

        document.addEventListener('click', function (e) {
            if (e.ctrlKey) {
                return;
            }
            var etarg = e.target;
            while (etarg && !etarg.href) {
                etarg = etarg.parentNode;
            }
            if (etarg) {
                if (etarg.target == '_blank') {
                    return;
                } else if (etarg.href.indexOf("tel:") >= 0) {
                    return;
                } else if (etarg.href.indexOf("mailto:") >= 0) {
                    return;
                } else if (etarg.id === "mobile_nav_toggle") {
                    return;
                }
                e.preventDefault();
                changePage(etarg.href);
                history.pushState(null, null, etarg.href);
                // ga('set', 'page', etarg.href);
                // ga('send', 'pageview');
                return;
            }
        });

        setTimeout(function () {
            window.onpopstate = function () {
                changePage(window.location.href);
            };
        }, 500);
    }
})();