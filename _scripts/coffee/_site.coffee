# mobile_nav {{{#####################################################

mobileNav = ->
    $('#mobile_nav_toggle').on 'click', '', ->
        $('#mobile_nav_toggle, #mobile_nav').toggleClass 'is_open'
    return
# /mobile_nav }}}####################################################
# active link transitions {{{########################################
activeNavLink = ->
    $('.site_nav__link').on 'click', ->
        $('.site_nav__link').removeClass 'active'
        $(this).addClass 'active'
    return
# /active link transitions }}}#######################################
# forms {{{##########################################################

callBackFormToggle = ->
    $('.call_back_form__toggle').on 'click', '', ->
        $('.call_back_form__toggle, .call_back_form__wrap').toggleClass 'is_open'
        false
    return

enableCallBackForm = ->
    TheForm = document.getElementById('call_back_form')
    if TheForm
        successCallBack = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.'
        sendForm = document.getElementById('call_back_form__button')
        TheForm.addEventListener 'submit', (event) ->
            iSendAJAX event, TheForm, sendForm, successCallBack
        return
    else
        return

enableContactForm = ->
    TheForm = document.getElementById('contact_form')
    if TheForm
        successContact = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.'
        sendForm = document.getElementById('contact_form__button')
        TheForm.addEventListener 'submit', (event) ->
            iSendAJAX event, TheForm, sendForm, successContact
        return
    else
        return

enableReviewForm = ->
    TheForm = document.getElementById('review_form')
    if TheForm
        successReview = 'Спасибо! Отзыв принят и будет опубликован после проверки.'
        sendForm = document.getElementById('review_form__button')
        TheForm.addEventListener 'submit', (event) ->
            iSendAJAX event, TheForm, sendForm, successReview
        return
    else
        return

enableOrderForm = ->
    TheForm = document.getElementById('order_form')
    if TheForm
        successOrder = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.'
        sendForm = document.getElementById('order_form__button')
        TheForm.addEventListener 'submit', (event) ->
            iSendAJAX event, TheForm, sendForm, successOrder
        return
    else
        return


iSendAJAX = (event, form, sendButton, successMsg) ->
  event.preventDefault()
  message = {}
  message.loading = 'Отправка...'
  message.success = successMsg
  message.failure = 'Возникла ошибка при отправке.'
  # Set up the AJAX request
  request = new XMLHttpRequest
  request.open 'POST', '//formspree.io/n.anisimov.23@gmail.com', true
  request.setRequestHeader 'accept', 'application/json'
  # Create a new FormData object passing in the form's key value pairs (that was easy!)
  formData = new FormData(form)
  # Send the formData
  request.send formData
  # Watch for changes to request.readyState and update the statusMessage accordingly

  request.onreadystatechange = ->
    # <4 =  waiting on response from server
    if request.readyState < 4
      sendButton.innerHTML = message.loading
      sendButton.className = 'form__button--loading'
    else if request.readyState == 4
      # 200 - 299 = successful
      if request.status == 200 and request.status < 300
        sendButton.innerHTML = message.success
        sendButton.className = 'form__button--success'
      else
        form.insertAdjacentHTML 'beforeend', message.failure
    return
# /forms }}}#########################################################

$ ->
    mobileNav()
    callBackFormToggle()
    enableCallBackForm()
    enableContactForm()
    enableReviewForm()
    enableOrderForm()
    activeNavLink()
    return
