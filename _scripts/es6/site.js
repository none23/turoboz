/*
 * v1.0.3
 */

const mobileNav = document.getElementById('mobile_nav')
const desktopNav = document.getElementById('desktop_nav')

// page transitions {{{
function changePage (url) {
  const xhr = new window.XMLHttpRequest()

  xhr.open('GET', url)
  xhr.responseType = 'document'

  xhr.onload = function () {
    const newDataIn = this.response

    const newPage = newDataIn.getElementById('page_content_wrap')
    const newTitle = newDataIn.querySelector('title')
    const newDescription = newDataIn.getElementById('pageDescription')
    const oldPage = document.getElementById('page_content_wrap')
    const oldTitle = document.querySelector('title')
    const oldDescription = document.getElementById('pageDescription')

    const changePageContent = function () {
      oldPage.parentNode.replaceChild(newPage, oldPage)
      oldTitle.parentNode.replaceChild(newTitle, oldTitle)
      oldDescription.parentNode.replaceChild(newDescription, oldDescription)
      window.scrollTo(0, 0)

      // close mobile nav if open
      if (mobileNav.classList.contains('is_open')) {
        toggleMobileNav()
      }
    }

    const willAnimate = function () {
      newPage.opacity = 0
      oldPage.opacity = 0
      oldPage.animate(
        [
          { opacity: 1 },
          { opacity: 0 }
        ],
        100
      ).onfinish = function () {
        changePageContent()
        newPage.animate([
          { opacity: 0 },
          { opacity: 1 }
        ],
          100
        ).onfinish = function () {
          newPage.opacity = 2
        }
      }
    }

    const anim = new Promise(willAnimate, null)
      .catch(() => changePageContent())

    return anim
  }
  xhr.send()
}

;(function () {
  if (window.history && window.history.pushState) {
    document.addEventListener('click', function (e) {
      if (e.ctrlKey) {
        return
      }
      let etarg = e.target
      while (etarg && !etarg.href) {
        etarg = etarg.parentNode
      }
      if (etarg) {
        if (etarg.target === '_blank') {
          return
        } else if (etarg.href.indexOf('tel:') >= 0) {
          return
        } else if (etarg.href.indexOf('mailto:') >= 0) {
          return
        } else if (etarg.className.indexOf('no_custom_transition') >= 0) {
          return
        }
        e.preventDefault()
        changePage(etarg.href)
        window.history.pushState(null, null, etarg.href)
        if (window.ga) {
          window.ga('set', 'page', etarg.href)
          window.ga('send', 'pageview')
        }
        return
      }
    })

    setTimeout(function () {
      window.onpopstate = function () {
        changePage(window.location.href)
      }
    }, 500)
  }
})()

// activeNavLinkTransition{{{

function switchActiveNavLink (targetLink) {
  // do nothing if the link clicked is already active
  if (targetLink.className.indexOf('active') === -1) {
    // need parentNode to select the right nav (desktop or mobile)
    targetLink.parentNode.querySelector('.site_nav__link.active').classList.remove('active')
    targetLink.classList.add('active')
    document.activeElement.blur()
  }
}

(function () {
  desktopNav.addEventListener('click', function (e) {
    if (e.target.href) {
      switchActiveNavLink(e.target)
    }
  })
  mobileNav.addEventListener('click', function (e) {
    if (e.target.href) {
      switchActiveNavLink(e.target)
    }
  })
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
;(function useAppCache () {
  const appcache = window.applicationCache

  function onUpdateReady () {
    try {
      appcache.swapCache()
      changePage(document.URL)
    } catch (err) {
      setTimeout(changePage(), 2000)
    }
  }
  appcache.addEventListener('updateready', onUpdateReady)

  if (appcache.status === appcache.UPDATEREADY) {
    onUpdateReady()
  }

  setInterval(function () {
    appcache.update()
  }, 300000)
})()

// /appcache }}}
// mobileNav{{{

const mobileNavToggle = document.getElementById('mobile_nav_toggle')
const callFormToggles = document.getElementsByClassName('call-back-form__toggle')
const callFormWrap = document.getElementById('call-back-form__wrap')
const callFormMainToggle = document.querySelector('#site_contacts_wrap .call-back-form__toggle')

function toggleMobileNav () {
  mobileNavToggle.classList.toggle('is_open')
  mobileNav.classList.toggle('is_open')
}

;(function () {
  mobileNavToggle.addEventListener('click', function (event) {
    event.preventDefault()
    toggleMobileNav()
  })
})()

// /mobileNav}}}
// forms{{{
function enableForm (formPrefix, successMsg, callback) {
  const formId = `${formPrefix}-form`
  const formButtonId = `${formPrefix}-form__button`
  const theForm = document.getElementById(formId)
  const sendForm = document.getElementById(formButtonId)
  const iSendAJAX = (event, form, sendButton, successMsg) => {
    sendButton.textContent = successMsg
    sendButton.classList.add('form__button--success')
    sendButton.disabled = true
    const request = new window.XMLHttpRequest()
    request.withCredentials = false
    request.open('POST'
                , 'https://briskforms.com/go/61884eb4d90ed4de433bf106bd0aea9a'
                , true
                )
    request.setRequestHeader('accept'
                            , 'application/json'
                            )
    const formData = new window.FormData(form)
    request.send(formData)
  }

  return function () {
    if (theForm) {
      theForm.addEventListener('submit', function (event) {
        event.preventDefault()
        event.stopPropagation()
        return iSendAJAX(event, theForm, sendForm, successMsg)
      })
    }
  }
}

const enableContactForm = enableForm('contact', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.')
const enableGuideForm = enableForm('guide', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.')
const enableReviewForm = enableForm('review', 'Спасибо! Отзыв принят и будет опубликован после проверки.')
const enableOrderForm = enableForm('order', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.')
const enableCallForm = enableForm('call-back', 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.', function () { return setTimeout(toggleCallFormState, 5000) })

// callFormToggle{{{
function toggleCallFormState (event) {
  // prevent following the '#' href
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // change state of toggle in the desktopNav if such exists
  if (callFormMainToggle) {
    callFormMainToggle.classList.toggle('is_open')
  }

  // show/hide the form
  callFormWrap.classList.toggle('is_open')

  // when the form appears, set focus to its first field
  if (callFormWrap.classList.contains('is_open')) {
    document.getElementById('call-back-form__name').focus()
  }
}

function callFormToggle () {
  for (let i = 0; i < callFormToggles.length; i++) {
    callFormToggles[i].addEventListener('click', toggleCallFormState)
  }
}
// /callFormToggle}}}
// initiate on page load{{{

;(function () {
  window.addEventListener('DOMContentLoaded', function () {
    callFormToggle()
    enableCallForm()
    enableGuideForm()
    enableContactForm()
    enableReviewForm()
    enableOrderForm()
  })
})()

// /initiate on page load}}}
// /forms}}}
// vim:foldmethod=marker
