"use strict";function changePage(e){var t=new XMLHttpRequest;t.open("GET",e),t.responseType="document",t.onload=function(){var e=this.response,t=e.getElementById("page_content_wrap"),n=e.querySelector("title"),o=e.getElementById("pageDescription"),a=document.getElementById("page_content_wrap"),i=document.querySelector("title"),c=document.getElementById("pageDescription"),r=function(){a.parentNode.replaceChild(t,a),i.parentNode.replaceChild(n,i),c.parentNode.replaceChild(o,c),window.scrollTo(0,0),mobile_nav.classList.contains("is_open")&&toggleMobileNav()},l=function(){t.opacity=0,a.opacity=0,a.animate([{opacity:1},{opacity:0}],100).onfinish=function(){r(),t.animate([{opacity:0},{opacity:1}],100).onfinish=function(){t.opacity=2}}},s=new Promise(l,null).catch(function(){return r()});return s},t.send()}function switchActiveNavLink(e){e.className.indexOf("active")===-1&&(e.parentNode.querySelector(".site_nav__link.active").classList.remove("active"),e.classList.add("active"),document.activeElement.blur())}function toggleMobileNav(){mobile_nav_toggle.classList.toggle("is_open"),mobile_nav.classList.toggle("is_open")}function callBackFormToggle(){for(var e=document.getElementsByClassName("call_back_form__toggle"),t=document.getElementById("call_back_form__wrap"),n=document.querySelector("#site_contacts_wrap .call_back_form__toggle"),o=0;o<e.length;o++)e[o].addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),n&&n.classList.toggle("is_open"),t.classList.toggle("is_open"),t.classList.contains("is_open")&&document.getElementById("call_back_form__name").focus()})}function enableForm(e,t){var n=e+"_form",o=e+"_form__button",a=document.getElementById(n),i=document.getElementById(o);return function(){a&&a.addEventListener("submit",function(e){return e.preventDefault(),iSendAJAX(e,a,i,t)})}}function iSendAJAX(e,t,n,o){var a,i;return i=new XMLHttpRequest,i.open("POST","//formspree.io/n.anisimov.23@gmail.com",!0),i.setRequestHeader("accept","application/json"),a=new FormData(t),i.send(a),n.className="form__button--loading",n.textContent="Отправка...",i.onreadystatechange=function(){4==i.readyState&&(200==i.status?(n.textContent=o,n.className="form__button--success"):(n.textContent="Возникла ошибка при отправке.",n.className="form__button--failure"))}}var mobile_nav_toggle=document.getElementById("mobile_nav_toggle"),mobile_nav=document.getElementById("mobile_nav"),desktop_nav=document.getElementById("desktop_nav");!function(){history&&history.pushState&&(document.addEventListener("click",function(e){if(!e.ctrlKey){for(var t=e.target;t&&!t.href;)t=t.parentNode;if(t){if("_blank"==t.target)return;if(t.href.indexOf("tel:")>=0)return;if(t.href.indexOf("mailto:")>=0)return;if("mobile_nav_toggle"===t.id)return;return e.preventDefault(),changePage(t.href),history.pushState(null,null,t.href),void(window.ga&&(window.ga("set","page",t.href),window.ga("send","pageview")))}}}),setTimeout(function(){window.onpopstate=function(){changePage(window.location.href)}},500))}(),function(){desktop_nav.addEventListener("click",function(e){e.target.href&&switchActiveNavLink(e.target)}),mobile_nav.addEventListener("click",function(e){e.target.href&&switchActiveNavLink(e.target)})}(),function(){function e(){try{t.swapCache(),changePage(document.URL)}catch(e){setTimeout(changePage(),2e3)}}var t=window.applicationCache;t.addEventListener("updateready",e),t.status===t.UPDATEREADY&&e(),setInterval(function(){t.update()},3e5)}(),function(){mobile_nav_toggle.addEventListener("click",function(e){e.preventDefault(),toggleMobileNav()})}();var enableCallBackForm=enableForm("call_back","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время."),enableContactForm=enableForm("contact","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время."),enableReviewForm=enableForm("review","Спасибо! Отзыв принят и будет опубликован после проверки."),enableOrderForm=enableForm("order","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей.");!function(){window.addEventListener("DOMContentLoaded",function(){callBackFormToggle(),enableCallBackForm(),enableContactForm(),enableReviewForm(),enableOrderForm()})}();