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

                var fadeAway = currentPage.animate({
                    opacity: [1, 0]
                    }, 200);

                fadeAway.onfinish = function() {
                    currentPage.parentNode.replaceChild(newPage, currentPage);
                    currentTitle.parentNode.replaceChild(newTitle, currentTitle);
                    currentDescription.parentNode.replaceChild(newDescription, currentDescription);
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
                    // ga('set', 'page', etarg.href);
                    // ga('send', 'pageview');
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
// callBackForm{{{

function  callBackFormToggle() {
    var call_back_form_Toggles = document.getElementsByClassName('call_back_form__toggle');
    var call_back_form_wrap = document.getElementById('call_back_form__wrap');
    var call_back_form_maintoggle = document.querySelector('#site_contacts_wrap .call_back_form__toggle');
    for (var call_back_form_toggle of call_back_form_Toggles) {
         call_back_form_toggle.addEventListener('click', function(ev) {

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

             // dont follow the '#' href
             ev.preventDefault();

         });
    }
        
}

function enableCallBackForm() {
    var TheForm, sendForm, successCallBack;
    TheForm = document.getElementById('call_back_form');
    if (TheForm) {
      successCallBack = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.';
      sendForm = document.getElementById('call_back_form__button');
      TheForm.addEventListener('submit', function(event) {
        return iSendAJAX(event, TheForm, sendForm, successCallBack);
      });
    }
  }
// /callBackForm}}}
// contactForm{{{

function enableContactForm() {
    var TheForm, sendForm, successContact;
    TheForm = document.getElementById('contact_form');
    if (TheForm) {
        successContact = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.';
        sendForm = document.getElementById('contact_form__button');
        TheForm.addEventListener('submit', function(event) {
            return iSendAJAX(event, TheForm, sendForm, successContact);
        });
    }
}

// /contactForm}}}
// reviewForm{{{

function enableReviewForm() {
    var TheForm, sendForm, successReview;
    TheForm = document.getElementById('review_form');
    if (TheForm) {
        successReview = 'Спасибо! Отзыв принят и будет опубликован после проверки.';
        sendForm = document.getElementById('review_form__button');
        TheForm.addEventListener('submit', function(event) {
            return iSendAJAX(event, TheForm, sendForm, successReview);
        });
    }
}

// /reviewForm}}}
// orderForm{{{

function enableOrderForm() {
    var TheForm, sendForm, successOrder;
    TheForm = document.getElementById('order_form');
    if (TheForm) {
        successOrder = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.';
        sendForm = document.getElementById('order_form__button');
        TheForm.addEventListener('submit', function(event) {
            return iSendAJAX(event, TheForm, sendForm, successOrder);
        });
    }
}

// /orderForm}}}

function iSendAJAX(event, form, sendButton, successMsg) {
    var formData, request;
    var message = {};
        message.loading = 'Отправка...';
        message.success = successMsg;
        message.failure = 'Возникла ошибка при отправке.';

    request = new XMLHttpRequest();
    request.open('POST', '//formspree.io/n.anisimov.23@gmail.com', true);
        request.setRequestHeader('accept', 'application/json');
        formData = new FormData(form);
        request.send(formData);
        sendButton.innerText = message.loading;
        sendButton.className = 'form__button--loading';
        return request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200 && request.status < 300) {
                sendButton.innerText = message.success;
                sendButton.className = 'form__button--success';
            } else {
                form.insertAdjacentHTML('beforeend', message.failure);
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
