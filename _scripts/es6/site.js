// page transitions {{{

(function(){

        var pageContentWrap = 'page_content_wrap';
        var appcache = window.applicationCache;

        var changePage = function(url) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', url);
            xhr.responseType = 'document';

            xhr.onload = function() {
                var newPage = this.response.getElementById(pageContentWrap);
                var currentPage = document.getElementById(pageContentWrap);

                var newTitle = this.response.querySelector('title');
                var currentTitle = document.querySelector('title');

                var newDescription = this.response.getElementById('pageDescription');
                var currentDescription = document.getElementById('pageDescription');
                var changePageContent = function() {
                    currentPage.parentNode.replaceChild(newPage, currentPage);
                    currentTitle.parentNode.replaceChild(newTitle, currentTitle);
                    currentDescription.parentNode.replaceChild(newDescription, currentDescription);
                    window.scrollTo(0, 0);
                };

                if (currentPage.animate) {
                    var fadeAway = currentPage.animate({
                        opacity: [1, 0]
                        }, 200);

                    fadeAway.onfinish = changePageContent();
                } else {
                    changePageContent();
                }
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
        setInterval(function () { appcache.update(); }, 300000);

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
                    ga('set', 'page', etarg.href);
                    ga('send', 'pageview');
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

// page transitions }}}

// mobileNav{{{

function mobileNav() {
    var mobile_nav_toggle = document.getElementById('mobile_nav_toggle');
    var mobile_nav = document.getElementById('mobile_nav');

    mobile_nav_toggle.addEventListener('click', function(event) {
        event.preventDefault();
        mobile_nav_toggle.classList.toggle('is_open');
        mobile_nav.classList.toggle('is_open');
    });
}

// /mobileNav}}}

// activeNavLinkTransition{{{

function activeNavLink() {
    var site_nav_Links = document.getElementById('site_header').getElementsByClassName('site_nav__link');
    for (var linkno = 0; linkno < site_nav_Links.length; linkno++ ) {
        site_nav_Links[linkno].addEventListener('click', function(e) {
            document.querySelector(".site_nav__link.active").classList.remove('active');
            e.target.classList.add('active');
            document.activeElement.blur();
        });
    }
}

// /activeNavLinkTransition}}}

// forms{{{
// callBackFormToggle{{{

function  callBackFormToggle() {
    var call_back_form_Toggles = document.getElementsByClassName('call_back_form__toggle');
    var call_back_form_wrap = document.getElementById('call_back_form__wrap');
    var call_back_form_maintoggle = document.querySelector('#site_contacts_wrap .call_back_form__toggle');
    for (var i = 0; i < call_back_form_Toggles.length; i++) {
         call_back_form_Toggles[i].addEventListener('click', function(ev) {

             // prevent following the '#' href
             ev.preventDefault();
             ev.stopPropagation();

             // change state of toggle in the desktop_nav if such exists
             if (call_back_form_maintoggle) {
                 call_back_form_maintoggle.classList.toggle('is_open');
             }

             // show/hide the form 
             call_back_form_wrap.classList.toggle('is_open');

             // when the form appears, set focus to its first field 
             if (call_back_form_wrap.classList.contains('is_open')) {
                 document.getElementById('call_back_form__name').focus();
             }


         });
    }
        
}
// /callBackFormToggle}}}
// enableForms{{{
function enableForm(form_prefix, success_msg) {
    var form_id = `${form_prefix}_form`;
    var form_button_id = `${form_prefix}_form__button`;
    var TheForm = document.getElementById(form_id);
    var sendForm = document.getElementById(form_button_id);
    return function(){
        if (TheForm) {
            TheForm.addEventListener('submit', function(event) {
                event.preventDefault();
                return iSendAJAX(event, TheForm, sendForm, success_msg);
            });
        }
    };
}
var enableCallBackForm = enableForm('call_back', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.');
var enableContactForm = enableForm('contact', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.');
var enableReviewForm = enableForm('review', 'Спасибо! Отзыв принят и будет опубликован после проверки.');
var enableOrderForm = enableForm('order', ' Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.');

// /enableForms}}}

function iSendAJAX(event, form, sendButton, successMsg) {
    var formData, request;

    request = new XMLHttpRequest();
    request.open('POST', '//formspree.io/n.anisimov.23@gmail.com', true);
        request.setRequestHeader('accept', 'application/json');
        formData = new FormData(form);
        request.send(formData);
        sendButton.className = 'form__button--loading';
        sendButton.textContent = 'Отправка...';
        return request.onreadystatechange = function() {
        if (request.readyState == 4) {
            if (request.status == 200) {
                sendButton.textContent = successMsg;
                sendButton.className = 'form__button--success';
            } else {
                sendButton.textContent = 'Возникла ошибка при отправке.';
                sendButton.className = 'form__button--failure';
            }
        }
    };
}
// /forms}}}

// initiate on page load{{{

(function main(){
    window.addEventListener("DOMContentLoaded", function() {
        mobileNav();
        callBackFormToggle();
        enableCallBackForm();
        enableContactForm();
        enableReviewForm();
        enableOrderForm();
        activeNavLink();
    });
})();

// /initiate on page load}}}
