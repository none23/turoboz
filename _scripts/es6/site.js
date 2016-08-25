function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
};

// mobileNav{{{
function mobileNav() {
    $('#mobile_nav_toggle').on('click', '', function() {
        return $('#mobile_nav_toggle, #mobile_nav').toggleClass('is_open');
    });
};
// /mobileNav}}}
// activeNavLinkTransition{{{
function activeNavLink() {
    $('.site_nav__link').on('click', function() {
        $('.site_nav__link').removeClass('active');
        $(this).addClass('active');
        $(this).blur();
    });
};
// /activeNavLinkTransition}}}
// forms{{{
// callBackForm{{{
function  callBackFormToggle() {
    $('.call_back_form__toggle').on('click', '', function() {
      $('.call_back_form__toggle, .call_back_form__wrap').toggleClass('is_open');
      $('#call_back_form__name').focus();
      return false;
    });
  };

function enableCallBackForm() {
    var TheForm, sendForm, successCallBack;
    TheForm = document.getElementById('call_back_form');
    if (TheForm) {
      successCallBack = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.';
      sendForm = document.getElementById('call_back_form__button');
      TheForm.addEventListener('submit', function(event) {
        return iSendAJAX(event, TheForm, sendForm, successCallBack);
      });
    } else {

    }
  };
// /callBackForm}}}

function enableContactForm() {
    var TheForm, sendForm, successContact;
    TheForm = document.getElementById('contact_form');
    if (TheForm) {
        successContact = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.';
        sendForm = document.getElementById('contact_form__button');
        TheForm.addEventListener('submit', function(event) {
            return iSendAJAX(event, TheForm, sendForm, successContact);
        });
    } else {

    }
};

function enableReviewForm() {
    var TheForm, sendForm, successReview;
    TheForm = document.getElementById('review_form');
    if (TheForm) {
        successReview = 'Спасибо! Отзыв принят и будет опубликован после проверки.';
        sendForm = document.getElementById('review_form__button');
        TheForm.addEventListener('submit', function(event) {
            return iSendAJAX(event, TheForm, sendForm, successReview);
        });
    } else {

    }
};

function enableOrderForm() {
    var TheForm, sendForm, successOrder;
    TheForm = document.getElementById('order_form');
    if (TheForm) {
        successOrder = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.';
        sendForm = document.getElementById('order_form__button');
        TheForm.addEventListener('submit', function(event) {
            return iSendAJAX(event, TheForm, sendForm, successOrder);
        });
    } else {

    }
};

function iSendAJAX(event, form, sendButton, successMsg) {
    var formData, message, request;
    event.preventDefault();
    message = {};
    message.loading = 'Отправка...';
    message.success = successMsg;
    message.failure = 'Возникла ошибка при отправке.';
    request = new XMLHttpRequest;
    request.open('POST', '//formspree.io/n.anisimov.23@gmail.com', true);
    request.setRequestHeader('accept', 'application/json');
    formData = new FormData(form);
    request.send(formData);
    return request.onreadystatechange = function() {
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
};
// /forms}}}

// animateLogo{{{
function deanimateLogo () {
    $('#site_logo').on('click', function() {
        sleep(2000).then(() => {
            $('site_logo').blur();
        })
    });
};
// /animateLog}}}

$(function() {
    mobileNav();
    callBackFormToggle();
    enableCallBackForm();
    enableContactForm();
    enableReviewForm();
    enableOrderForm();
    activeNavLink();
    deanimateLogo();
});
