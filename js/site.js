"use strict";function mobileNav(){var e=document.getElementById("mobile_nav_toggle"),t=document.getElementById("mobile_nav");e.addEventListener("click",function(n){n.preventDefault(),e.classList.toggle("is_open"),t.classList.toggle("is_open")})}function activeNavLink(){for(var e=document.getElementById("site_header").getElementsByClassName("site_nav__link"),t=0;t<e.length;t++)e[t].addEventListener("click",function(e){document.querySelector(".site_nav__link.active").classList.remove("active"),e.target.classList.add("active"),document.activeElement.blur()})}function callBackFormToggle(){for(var e=document.getElementsByClassName("call_back_form__toggle"),t=document.getElementById("call_back_form__wrap"),n=document.querySelector("#site_contacts_wrap .call_back_form__toggle"),a=0;a<e.length;a++)e[a].addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),n&&n.classList.toggle("is_open"),t.classList.toggle("is_open"),t.classList.contains("is_open")&&document.getElementById("call_back_form__name").focus()})}function enableForm(e,t){var n=e+"_form",a=e+"_form__button",o=document.getElementById(n),r=document.getElementById(a);return function(){o&&o.addEventListener("submit",function(e){return e.preventDefault(),iSendAJAX(e,o,r,t)})}}function iSendAJAX(e,t,n,a){var o,r;return r=new XMLHttpRequest,r.open("POST","//formspree.io/n.anisimov.23@gmail.com",!0),r.setRequestHeader("accept","application/json"),o=new FormData(t),r.send(o),n.className="form__button--loading",n.textContent="Отправка...",r.onreadystatechange=function(){4==r.readyState&&(200==r.status?(n.textContent=a,n.className="form__button--success"):(n.textContent="Возникла ошибка при отправке.",n.className="form__button--failure"))}}!function(){function e(){n.swapCache(),a(document.URL)}var t="page_content_wrap",n=window.applicationCache,a=function(e){var n=new XMLHttpRequest;n.open("GET",e),n.responseType="document",n.onload=function(){var e=this.response.getElementById(t),n=document.getElementById(t),a=this.response.querySelector("title"),o=document.querySelector("title"),r=this.response.getElementById("pageDescription"),i=document.getElementById("pageDescription");if(n.animate){var l=n.animate({opacity:[1,0]},200);l.onfinish=function(){n.parentNode.replaceChild(e,n),o.parentNode.replaceChild(a,o),i.parentNode.replaceChild(r,i)}}else n.parentNode.replaceChild(e,n),o.parentNode.replaceChild(a,o),i.parentNode.replaceChild(r,i)},n.send()};n.addEventListener("updateready",e),n.status===n.UPDATEREADY&&e(),setInterval(function(){n.update()},3e5),history&&history.pushState&&(document.addEventListener("click",function(e){if(!e.ctrlKey){for(var t=e.target;t&&!t.href;)t=t.parentNode;if(t){if("_blank"==t.target)return;if(t.href.indexOf("tel:")>=0)return;if(t.href.indexOf("mailto:")>=0)return;if("mobile_nav_toggle"===t.id)return;return e.preventDefault(),a(t.href),history.pushState(null,null,t.href),ga("set","page",t.href),void ga("send","pageview")}}}),setTimeout(function(){window.onpopstate=function(){a(window.location.href)}},500))}();var enableCallBackForm=enableForm("call_back","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время."),enableContactForm=enableForm("contact","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время."),enableReviewForm=enableForm("review","Спасибо! Отзыв принят и будет опубликован после проверки."),enableOrderForm=enableForm("order"," Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.");!function(){window.addEventListener("DOMContentLoaded",function(){mobileNav(),callBackFormToggle(),enableCallBackForm(),enableContactForm(),enableReviewForm(),enableOrderForm(),activeNavLink()})}();