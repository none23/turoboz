(function(){var e,t,n,o,r,a,c;c=function(){$("#mobile_nav_toggle").on("click","",function(){return $("#mobile_nav_toggle, #mobile_nav").toggleClass("is_open")})},e=function(){$(".call_back_form__toggle").on("click","",function(){return $(".call_back_form__toggle, .call_back_form__wrap").toggleClass("is_open")})},t=function(){var e,t;e=document.getElementById("call_back_form"),e&&(t=document.getElementById("call_back_form__button"),e.addEventListener("submit",function(n){return a(n,e,t)}))},n=function(){var e,t;e=document.getElementById("contact_form"),e&&(t=document.getElementById("contact_form__button"),e.addEventListener("submit",function(n){return a(n,e,t)}))},r=function(){var e,t;e=document.getElementById("review_form"),e&&(t=document.getElementById("review_form__button"),e.addEventListener("submit",function(n){return a(n,e,t)}))},o=function(){var e,t;e=document.getElementById("order_form"),e&&(t=document.getElementById("order_form__button"),e.addEventListener("submit",function(n){return a(n,e,t)}))},a=function(e,t,n){var o,r,a;return e.preventDefault(),r={},r.loading="Отправка...",r.success="Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.",r.failure="Возникла ошибка при отправке.",a=new XMLHttpRequest,a.open("POST","//formspree.io/n.anisimov.23@gmail.com",!0),a.setRequestHeader("accept","application/json"),o=new FormData(t),a.send(o),a.onreadystatechange=function(){a.readyState<4?(n.innerHTML=r.loading,n.className="form__button--loading"):4===a.readyState&&(200===a.status&&a.status<300?(n.innerHTML=r.success,n.className="form__button--success"):t.insertAdjacentHTML("beforeend",r.failure))}},$(function(){c(),e(),t(),n(),r(),o()})}).call(this);