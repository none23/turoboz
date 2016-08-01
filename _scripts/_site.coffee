questionFormModalOpen = ->
    $('#question_form_opener').on 'click', ->
        $('#question_modal').addClass 'is_open'
    return

callBackFormModalOpen = ->
    $('#call_back_form_opener').on 'click', ->
        $('#call_back_modal').addClass 'is_open'
    return

formModalClose = ->
    $('.modal_form__wrap').on 'click', ->
        $(this).removeClass 'is_open'
    return

mobileNav = ->
    $('#mobile_nav_toggle').on 'click', '', ->
        $('#mobile_nav_toggle, #mobile_nav').toggleClass 'is_open'
    return

smoothScroll = (duration) ->
  $('a[href^="#"]').on 'click', (event) ->
    target = $($(this).attr('href'))
    if target.length
      event.preventDefault()
      $('html, body').animate { scrollTop: target.offset().top }, duration
    return
  return

enableCallBackForm = ->
  TheForm = document.getElementById('call_back_form')
  sendForm = document.getElementById('call_back_form__button')
  TheForm.addEventListener 'submit', (event) ->
    iSendAJAX event, TheForm, sendForm
    return
  return

enableQuestionForm = ->
  TheForm = document.getElementById('question_form')
  sendForm = document.getElementById('question_form__button')
  TheForm.addEventListener 'submit', (event) ->
    iSendAJAX event, TheForm, sendForm
    return
  return

iSendAJAX = (event, form, sendButton) ->
  event.preventDefault()
  message = {}
  message.loading = 'Отправка...'
  message.success = 'Спасибо! Мы свяжемся с Вами в ближайшее время.'
  message.failure = 'Whoops! There was a problem sending your message.'
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
      sendButton.className = 'form-control btn btnFormLoad'
    else if request.readyState == 4
      # 200 - 299 = successful
      if request.status == 200 and request.status < 300
        sendButton.innerHTML = message.success
        sendButton.className = 'form-control btn btnFormSent'
      else
        form.insertAdjacentHTML 'beforeend', message.failure
    return

  return

$ ->
  mobileNav()
  callBackFormModalOpen()
  questionFormModalOpen()
  formModalClose()
  enableCallBackForm()
  enableQuestionForm()
  return
