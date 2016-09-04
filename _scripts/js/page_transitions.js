'use strict';

(function () {
    var pageContentWrap = 'page_content_wrap';

    var animateChange = function animateChange(newPage, currentPage) {

        fadeAway.onfinish = function () {
            currentPage.parentNode.replaceChild(newPage, currentPage);
        };
    };

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
                if (etarg.target == '_blank') {} else if (etarg.href.indexOf("tel:") !== -1) {} else if (etarg.href.indexOf("mailto:") !== -1) {} else {
                    changePage(etarg.href);
                    history.pushState(null, null, etarg.href);
                    ga('set', 'page', url);
                    ga('send', 'pageview');
                }
                return;
            }
        });

        setTimeout(function () {
            window.onpopstate = function () {
                changePage(window.location.href);
            };
        }, 500);

        var onUpdateReady = function onUpdateReady() {
            var currentPage = document.getElementById(pageContentWrap);
            currentPage.parentNode.replaceChild(currentPage, currentPage);
        };

        window.applicationCache.addEventListener('updateready', onUpdateReady);

        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            onUpdateReady();
        }
    }
})();