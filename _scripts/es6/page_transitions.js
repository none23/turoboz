
(function(){

    var pageContentWrap = 'page_content_wrap';
    var animateChange = function(newPage, currentPage) {


        fadeAway.onfinish = function() {
            currentPage.parentNode.replaceChild(newPage, currentPage);
        };
    };

    var changePage = function(url) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.responseType = 'document';

        xhr.onload = function() {
            var newPage = this.response.getElementById(pageContentWrap);
            var currentPage = document.getElementById(pageContentWrap);

            var fadeAway = currentPage.animate({
                opacity: [1, 0]
                }, 200);

            fadeAway.onfinish = function() {
                currentPage.parentNode.replaceChild(newPage, currentPage);
            };

        };

        xhr.send();
    };

    function onUpdateReady() {
        var pageContentWrap = 'page_content_wrap';
        console.log('applying changes in cache');
        window.applicationCache.swapCache();
        console.log('updating page');
        changePage(document.URL);
    }

    window.applicationCache.addEventListener('updateready', onUpdateReady);

    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      onUpdateReady();
    }
    window.applicationCache.update();
    setInterval(function () { window.applicationCache.update(); }, 3600000);

    if (history && history.pushState) {

        document.addEventListener('click', function(e) {
            if (e.ctrlKey) {
                    return;
            }
            var etarg = e.target;
            while (etarg && !etarg.href) {
                etarg = etarg.parentNode;
            }
            if (etarg) {
                if (etarg.target == '_blank') {
                } else if (etarg.href.indexOf("tel:") >= 0) {
                } else if (etarg.href.indexOf("mailto:") >= 0) {
                } else if (etarg.id === "mobile_nav_toggle") {
                } else {
                    changePage(etarg.href);
                    history.pushState(null, null, etarg.href);
                    ga('set', 'page', etarg.href);
                    ga('send', 'pageview');
                }
                return;
            }
        });

        setTimeout(function() {
            window.onpopstate = function() {
                changePage(window.location.href);
            };
        }, 500);

    }
}());
