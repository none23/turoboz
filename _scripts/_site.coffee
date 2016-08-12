# mobile_nav {{{#####################################################

mobileNav = ->
    $('#mobile_nav_toggle').on 'click', '', ->
        $('#mobile_nav_toggle, #mobile_nav').toggleClass 'is_open'
    return
# /mobile_nav }}}####################################################
# forms {{{##########################################################
callBackFormOpen = ->
    $('.call_back_form__toggle').on 'click', '', ->
        $('.call_back_form__toggle, .call_back_form__wrap').toggleClass 'is_open'
    return

enableCallBackForm = ->
    TheForm = document.getElementById('call_back_form')
    if TheForm
        sendForm = document.getElementById('call_back_form__button')
        TheForm.addEventListener 'submit', (event) ->
            iSendAJAX event, TheForm, sendForm
        return
    else
        return

enableContactForm = ->
    TheForm = document.getElementById('contact_form')
    if TheForm
        sendForm = document.getElementById('contact_form__button')
        TheForm.addEventListener 'submit', (event) ->
            iSendAJAX event, TheForm, sendForm
        return
    else
        return

enableReviewForm = ->
    TheForm = document.getElementById('review_form')
    if TheForm
        sendForm = document.getElementById('review_form__button')
        TheForm.addEventListener 'submit', (event) ->
            iSendAJAX event, TheForm, sendForm
        return
    else
        return

enableOrderForm = ->
    TheForm = document.getElementById('order_form')
    if TheForm
        sendForm = document.getElementById('order_form__button')
        TheForm.addEventListener 'submit', (event) ->
            iSendAJAX event, TheForm, sendForm
        return
    else
        return


iSendAJAX = (event, form, sendButton) ->
  event.preventDefault()
  message = {}
  message.loading = 'Отправка...'
  message.success = 'Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.'
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
  callBackFormOpen()
  enableCallBackForm()
  enableContactForm()
  enableReviewForm()
  enableOrderForm()
  return
