'use strict';

/*
 * v1.0.3
 */

var mobileNavToggle = document.getElementById('mobile_nav_toggle');
var mobileNav = document.getElementById('mobile_nav');
var desktopNav = document.getElementById('desktop_nav');
var callFormToggles = document.getElementsByClassName('call-back-form__toggle');
var callFormWrap = document.getElementById('call-back-form__wrap');
var callFormMainToggle = document.querySelector('#site_contacts_wrap .call-back-form__toggle');

// page transitions {{{
function changePage(url) {
  var xhr = new window.XMLHttpRequest();

  xhr.open('GET', url);
  xhr.responseType = 'document';

  xhr.onload = function () {
    var newDataIn = this.response;

    var newPage = newDataIn.getElementById('page_content_wrap');
    var newTitle = newDataIn.querySelector('title');
    var newDescription = newDataIn.getElementById('pageDescription');
    var oldPage = document.getElementById('page_content_wrap');
    var oldTitle = document.querySelector('title');
    var oldDescription = document.getElementById('pageDescription');

    var changePageContent = function changePageContent() {
      oldPage.parentNode.replaceChild(newPage, oldPage);
      oldTitle.parentNode.replaceChild(newTitle, oldTitle);
      oldDescription.parentNode.replaceChild(newDescription, oldDescription);
      window.scrollTo(0, 0);

      // close mobile nav if open
      if (mobileNav.classList.contains('is_open')) {
        toggleMobileNav();
      }
    };

    var willAnimate = function willAnimate() {
      newPage.opacity = 0;
      oldPage.opacity = 0;
      oldPage.animate([{ opacity: 1 }, { opacity: 0 }], 100).onfinish = function () {
        changePageContent();
        newPage.animate([{ opacity: 0 }, { opacity: 1 }], 100).onfinish = function () {
          newPage.opacity = 2;
        };
      };
    };

    var anim = new Promise(willAnimate, null).catch(function () {
      return changePageContent();
    });

    return anim;
  };
  xhr.send();
}

;(function () {
  if (window.history && window.history.pushState) {
    document.addEventListener('click', function (e) {
      if (e.ctrlKey) {
        return;
      }
      var etarg = e.target;
      while (etarg && !etarg.href) {
        etarg = etarg.parentNode;
      }
      if (etarg) {
        if (etarg.target === '_blank') {
          return;
        } else if (etarg.href.indexOf('tel:') >= 0) {
          return;
        } else if (etarg.href.indexOf('mailto:') >= 0) {
          return;
        } else if (etarg.className.indexOf('no_custom_transition') >= 0) {
          return;
        }
        e.preventDefault();
        changePage(etarg.href);
        window.history.pushState(null, null, etarg.href);
        if (window.ga) {
          window.ga('set', 'page', etarg.href);
          window.ga('send', 'pageview');
        }
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

// activeNavLinkTransition{{{

function switchActiveNavLink(targetLink) {
  // do nothing if the link clicked is already active
  if (targetLink.className.indexOf('active') === -1) {
    // need parentNode to select the right nav (desktop or mobile)
    targetLink.parentNode.querySelector('.site_nav__link.active').classList.remove('active');
    targetLink.classList.add('active');
    document.activeElement.blur();
  }
}

(function () {
  desktopNav.addEventListener('click', function (e) {
    if (e.target.href) {
      switchActiveNavLink(e.target);
    }
  });
  mobileNav.addEventListener('click', function (e) {
    if (e.target.href) {
      switchActiveNavLink(e.target);
    }
  });
})()

// /activeNavLinkTransition}}}
// /page transitions }}}
// (off) service worker {{{
// ;(function() {
//     if ('serviceWorker' in navigator){
//         navigator.serviceWorker.register('/serviceworker.js')
//     } else {
//         html.setAttribute('manifest', '/turoboz.appcache')
//         useAppCache()
//     }
// })()
//  /service worker }}}
//  appcache {{{

// apply only if manifest is set (i.e. no serviseWorker support)
;(function useAppCache() {
  var appcache = window.applicationCache;

  function onUpdateReady() {
    try {
      appcache.swapCache();
      changePage(document.URL);
    } catch (err) {
      setTimeout(changePage(), 2000);
    }
  }
  appcache.addEventListener('updateready', onUpdateReady);

  if (appcache.status === appcache.UPDATEREADY) {
    onUpdateReady();
  }

  setInterval(function () {
    appcache.update();
  }, 300000);
})();

// /appcache }}}
// mobileNav{{{

function toggleMobileNav() {
  mobileNavToggle.classList.toggle('is_open');
  mobileNav.classList.toggle('is_open');
}

;(function () {
  mobileNavToggle.addEventListener('click', function (event) {
    event.preventDefault();
    toggleMobileNav();
  });
})();

// /mobileNav}}}
// forms{{{
function enableForm(formPrefix, successMsg, callback) {
  var formId = formPrefix + '-form';
  var formButtonId = formPrefix + '-form__button';
  var theForm = document.getElementById(formId);
  var sendForm = document.getElementById(formButtonId);
  var iSendAJAX = function iSendAJAX(event, form, sendButton, successMsg) {
    sendButton.textContent = successMsg;
    sendButton.className = 'form__button--success';
    sendButton.disabled = true;
    var request = new window.XMLHttpRequest();
    request.withCredentials = false;
    request.open('POST', 'https://briskforms.com/go/61884eb4d90ed4de433bf106bd0aea9a', true);
    request.setRequestHeader('accept', 'application/json');
    var formData = new window.FormData(form);
    request.send(formData);
  };

  return function () {
    if (theForm) {
      theForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        return iSendAJAX(event, theForm, sendForm, successMsg);
      });
    }
  };
}

var enableContactForm = enableForm('contact', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.');
var enableGuideForm = enableForm('guide', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.');
var enableReviewForm = enableForm('review', 'Спасибо! Отзыв принят и будет опубликован после проверки.');
var enableOrderForm = enableForm('order', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.');
var enableCallForm = enableForm('call-back', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.', function () {
  return setTimeout(toggleCallFormState, 5000);
});

// callFormToggle{{{
function toggleCallFormState(event) {
  // prevent following the '#' href
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // change state of toggle in the desktopNav if such exists
  if (callFormMainToggle) {
    callFormMainToggle.classList.toggle('is_open');
  }

  // show/hide the form
  callFormWrap.classList.toggle('is_open');

  // when the form appears, set focus to its first field
  if (callFormWrap.classList.contains('is_open')) {
    document.getElementById('call-back-form__name').focus();
  }
}

function callFormToggle() {
  for (var i = 0; i < callFormToggles.length; i++) {
    callFormToggles[i].addEventListener('click', toggleCallFormState);
  }
}
// /callFormToggle}}}
// initiate on page load{{{

;(function () {
  window.addEventListener('DOMContentLoaded', function () {
    callFormToggle();
    enableCallForm();
    enableGuideForm();
    enableContactForm();
    enableReviewForm();
    enableOrderForm();
  });
})();

// /initiate on page load}}}
// /forms}}}
// vim:foldmethod=marker