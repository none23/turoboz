"use strict";function sleep(e){return new Promise(function(n){return setTimeout(n,e)})}function mobileNav(){var e=document.getElementById("mobile_nav_toggle"),n=document.getElementById("mobile_nav");e.onclick=function(){e.classList.toggle("is_open"),n.classList.toggle("is_open")}}function activeNavLink(){$(".site_nav__link").on("click",function(){$(".site_nav__link").removeClass("active"),$(this).addClass("active"),$(this).blur()})}function callBackFormToggle(){$(".call_back_form__toggle").on("click","",function(){return $(".call_back_form__toggle, .call_back_form__wrap").toggleClass("is_open"),$("#call_back_form__name").focus(),!1})}function enableCallBackForm(){var e,n,t;e=document.getElementById("call_back_form"),e&&(t="Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.",n=document.getElementById("call_back_form__button"),e.addEventListener("submit",function(o){return iSendAJAX(o,e,n,t)}))}function enableContactForm(){var e,n,t;e=document.getElementById("contact_form"),e&&(t="Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.",n=document.getElementById("contact_form__button"),e.addEventListener("submit",function(o){return iSendAJAX(o,e,n,t)}))}function enableReviewForm(){var e,n,t;e=document.getElementById("review_form"),e&&(t="Спасибо! Отзыв принят и будет опубликован после проверки.",n=document.getElementById("review_form__button"),e.addEventListener("submit",function(o){return iSendAJAX(o,e,n,t)}))}function enableOrderForm(){var e,n,t;e=document.getElementById("order_form"),e&&(t="Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.",n=document.getElementById("order_form__button"),e.addEventListener("submit",function(o){return iSendAJAX(o,e,n,t)}))}function iSendAJAX(e,n,t,o){var a,c,r;return e.preventDefault(),c={},c.loading="Отправка...",c.success=o,c.failure="Возникла ошибка при отправке.",r=new XMLHttpRequest,r.open("POST","//formspree.io/n.anisimov.23@gmail.com",!0),r.setRequestHeader("accept","application/json"),a=new FormData(n),r.send(a),r.onreadystatechange=function(){r.readyState<4?(t.innerHTML=c.loading,t.className="form__button--loading"):4===r.readyState&&(200===r.status&&r.status<300?(t.innerHTML=c.success,t.className="form__button--success"):n.insertAdjacentHTML("beforeend",c.failure))}}$(function(){mobileNav(),callBackFormToggle(),enableCallBackForm(),enableContactForm(),enableReviewForm(),enableOrderForm(),activeNavLink()});