'use strict';

function sleep(time) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, time);
    });
}

// mobileNav{{{
function mobileNav() {
    var mobile_nav_toggle = document.getElementById('mobile_nav_toggle');
    var mobile_nav = document.getElementById('mobile_nav');

    mobile_nav_toggle.addEventListener('click', function (event) {
        event.preventDefault();
        mobile_nav_toggle.classList.toggle('is_open');
        mobile_nav.classList.toggle('is_open');
    });
}
// /mobileNav}}}
// activeNavLinkTransition{{{
function activeNavLink() {
    var site_nav_Links = document.getElementById('site_header').getElementsByClassName('site_nav__link');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = site_nav_Links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var site_nav_link = _step.value;

            site_nav_link.addEventListener('click', function (e) {
                document.querySelector(".site_nav__link.active").classList.remove('active');
                e.target.classList.add('active');
                document.activeElement.blur();
            });
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
// /activeNavLinkTransition}}}
// forms{{{
// callBackForm{{{
function callBackFormToggle() {
    var call_back_form_Toggles = document.getElementsByClassName('call_back_form__toggle');
    var call_back_form_wrap = document.getElementById('call_back_form__wrap');
    var call_back_form_maintoggle = document.querySelector('#site_contacts_wrap .call_back_form__toggle');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = call_back_form_Toggles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var call_back_form_toggle = _step2.value;

            call_back_form_toggle.addEventListener('click', function (ev) {
                // dont follow the '#' href
                ev.preventDefault();

                // change state of toggle in the desktop_nav if such exists
                if (call_back_form_maintoggle) {
                    call_back_form_maintoggle.classList.toggle('is_open');
                }

                // show/hide the form 
                call_back_form_wrap.classList.toggle('is_open');

                // when the form appears, set focus to its first field 
                if (call_back_form_wrap.classList.indexOf('is_open') >= 0) {
                    call_back_form_wrap.getElementById('call_back_form__name').focus();
                }
            });
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
}

function enableCallBackForm() {
    var TheForm, sendForm, successCallBack;
    TheForm = document.getElementById('call_back_form');
    if (TheForm) {
        successCallBack = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.';
        sendForm = document.getElementById('call_back_form__button');
        TheForm.addEventListener('submit', function (event) {
            return iSendAJAX(event, TheForm, sendForm, successCallBack);
        });
    } else {}
}
// /callBackForm}}}

function enableContactForm() {
    var TheForm, sendForm, successContact;
    TheForm = document.getElementById('contact_form');
    if (TheForm) {
        successContact = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.';
        sendForm = document.getElementById('contact_form__button');
        TheForm.addEventListener('submit', function (event) {
            return iSendAJAX(event, TheForm, sendForm, successContact);
        });
    } else {}
}

function enableReviewForm() {
    var TheForm, sendForm, successReview;
    TheForm = document.getElementById('review_form');
    if (TheForm) {
        successReview = 'Спасибо! Отзыв принят и будет опубликован после проверки.';
        sendForm = document.getElementById('review_form__button');
        TheForm.addEventListener('submit', function (event) {
            return iSendAJAX(event, TheForm, sendForm, successReview);
        });
    } else {}
}

function enableOrderForm() {
    var TheForm, sendForm, successOrder;
    TheForm = document.getElementById('order_form');
    if (TheForm) {
        successOrder = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.';
        sendForm = document.getElementById('order_form__button');
        TheForm.addEventListener('submit', function (event) {
            return iSendAJAX(event, TheForm, sendForm, successOrder);
        });
    } else {}
}

function iSendAJAX(event, form, sendButton, successMsg) {
    var formData, message, request;
    event.preventDefault();
    message = {};
    message.loading = 'Отправка...';
    message.success = successMsg;
    message.failure = 'Возникла ошибка при отправке.';
    request = new XMLHttpRequest();
    request.open('POST', '//formspree.io/n.anisimov.23@gmail.com', true);
    request.setRequestHeader('accept', 'application/json');
    formData = new FormData(form);
    request.send(formData);
    return request.onreadystatechange = function () {
        if (request.readyState < 4) {
            sendButton.innerHTML = message.loading;
            sendButton.className = 'form__button--loading';
        } else if (request.readyState === 4) {
            if (request.status === 200 && request.status < 300) {
                sendButton.innerHTML = message.success;
                sendButton.className = 'form__button--success';
            } else {
                form.insertAdjacentHTML('beforeend', message.failure);
            }
        }
    };
}
// /forms}}}
(function main() {
    window.addEventListener("DOMContentLoaded", function (Ev) {
        mobileNav();
        callBackFormToggle();
        enableCallBackForm();
        enableContactForm();
        enableReviewForm();
        enableOrderForm();
        activeNavLink();
    });
})();