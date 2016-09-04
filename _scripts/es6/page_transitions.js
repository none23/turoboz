/*
// {{{
var cache = {};

// animateLogo{{{
function logoLoading () {
    document.getElementById('site_logo').focus();
    sleep(600).then(() => {
        document.getElementById('site_logo').blur();
    })
};
// /animateLog}}}
//
function loadPage(url) {
    return fetch(url, {
        method: 'GET'
    }).then(function(response) {
        return response.text();
    });
}

var page_wrap = document.querySelector('.page_wrap');

function changePage() {
    var url = window.location.href;

    loadPage(url).then(function(responseText) {
        var wrapper = document.createElement('div');
            wrapper.innerHTML = responseText;

        var oldContent = document.querySelector('.page_content_wrap');
        var newContent = wrapper.querySelector('.page_content_wrap');

        logoLoading();
        page_wrap.appendChild(newContent);
        animate(oldContent, newContent);
        ga('set', 'page', url);
        ga('send', 'pageview');
        
    });
}

function animate(oldContent, newContent) {

    oldContent.animate({
        opacity: [1, 0]
    }, 200);

    var fadeIn = newContent.animate({
        opacity: [0, 1]
    }, 200);

    fadeIn.onfinish = function() {
        oldContent.parentNode.removeChild(oldContent);
    };
}

window.addEventListener('popstate', changePage);

document.addEventListener('click', function(e) {
    if (e.ctrlKey) {
        return;
    }
    var el = e.target;
    while (el && !el.href) {
        el = el.parentNode;
    }

    if (el) {
        if (el.target == '_blank') {
        } else if (el.href.indexOf("tel:") !== -1) {
        } else if (el.href.indexOf("mailto:") !== -1) {
        } else {
            console.log(el.href);
            e.preventDefault();
            history.pushState(null, null, el.href);
            changePage();
        }
        return;
    }
});
$(function(){
    $('.site_nav__link').on('click', '', function(){
        $('#mobile_nav').removeClass('is_open');
        $('#mobile_nav_toggle').removeClass('is_open');
    });
})
// }}}
*/
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
            }

        };

        xhr.send();
    };

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
                } else if (etarg.href.indexOf("tel:") !== -1) {
                } else if (etarg.href.indexOf("mailto:") !== -1) {
                } else {
                    changePage(etarg.href);
                    history.pushState(null, null, etarg.href);
                    ga('set', 'page', url);
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

        var onUpdateReady = function() {
            var currentPage = document.getElementById(pageContentWrap);
            currentPage.parentNode.replaceChild(currentPage, currentPage);
        }

        window.applicationCache.addEventListener('updateready', onUpdateReady);

        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
          onUpdateReady();
        }
    }
}())
