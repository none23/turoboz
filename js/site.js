"use strict";function changePage(e){var t=new window.XMLHttpRequest;t.open("GET",e),t.responseType="document",t.onload=function(){var e=this.response,t=e.getElementById("page_content_wrap"),n=e.querySelector("title"),o=e.getElementById("pageDescription"),a=document.getElementById("page_content_wrap"),i=document.querySelector("title"),l=document.getElementById("pageDescription"),r=function(){a.parentNode.replaceChild(t,a),i.parentNode.replaceChild(n,i),l.parentNode.replaceChild(o,l),window.scrollTo(0,0),mobileNav.classList.contains("is_open")&&toggleMobileNav()},c=function(){t.opacity=0,a.opacity=0,a.animate([{opacity:1},{opacity:0}],100).onfinish=function(){r(),t.animate([{opacity:0},{opacity:1}],100).onfinish=function(){t.opacity=2}}},s=new Promise(c,null).catch(function(){return r()});return s},t.send()}function switchActiveNavLink(e){e.className.indexOf("active")===-1&&(e.parentNode.querySelector(".site_nav__link.active").classList.remove("active"),e.classList.add("active"),document.activeElement.blur())}function toggleMobileNav(){mobileNavToggle.classList.toggle("is_open"),mobileNav.classList.toggle("is_open")}function enableForm(e,t,n){var o=e+"_form",a=e+"_form__button",i=document.getElementById(o),l=document.getElementById(a),r=function(e,t,o,a){var i=new window.XMLHttpRequest;i.open("POST","//formspree.io/info@turoboz.com",!0),i.setRequestHeader("accept","application/json");var l=new window.FormData(t);i.send(l),o.className="form__button--loading",o.textContent="Отправка...",i.onreadystatechange=function(){4===i.readyState&&(200===i.status?(o.textContent=a,o.className="form__button--success",n&&setTimeout(n,5e3)):(o.textContent="Возникла ошибка при отправке. Нажмите еще раз, чтобы отправить по email",o.className="form__button--failure"),t.removeEventListener("submit",c))}},c=function(e){return e.preventDefault(),e.stopPropagation(),r(e,i,l,t)};return function(){i&&i.addEventListener("submit",c)}}function toggleCallFormState(e){e&&(e.preventDefault(),e.stopPropagation()),callFormMainToggle&&callFormMainToggle.classList.toggle("is_open"),callFormWrap.classList.toggle("is_open"),callFormWrap.classList.contains("is_open")&&document.getElementById("call_back_form__name").focus()}function callFormToggle(){for(var e=0;e<callFormToggles.length;e++)callFormToggles[e].addEventListener("click",toggleCallFormState)}var mobileNavToggle=document.getElementById("mobile_nav_toggle"),mobileNav=document.getElementById("mobile_nav"),desktopNav=document.getElementById("desktop_nav"),callFormToggles=document.getElementsByClassName("call_back_form__toggle"),callFormWrap=document.getElementById("call_back_form__wrap"),callFormMainToggle=document.querySelector("#site_contacts_wrap .call_back_form__toggle");!function(){window.history&&window.history.pushState&&(document.addEventListener("click",function(e){if(!e.ctrlKey){for(var t=e.target;t&&!t.href;)t=t.parentNode;if(t){if("_blank"===t.target)return;if(t.href.indexOf("tel:")>=0)return;if(t.href.indexOf("mailto:")>=0)return;if("mobile_nav_toggle"===t.id)return;return e.preventDefault(),changePage(t.href),window.history.pushState(null,null,t.href),void(window.ga&&(window.ga("set","page",t.href),window.ga("send","pageview")))}}}),setTimeout(function(){window.onpopstate=function(){changePage(window.location.href)}},500))}(),function(){desktopNav.addEventListener("click",function(e){e.target.href&&switchActiveNavLink(e.target)}),mobileNav.addEventListener("click",function(e){e.target.href&&switchActiveNavLink(e.target)})}(),function(){function e(){try{t.swapCache(),changePage(document.URL)}catch(e){setTimeout(changePage(),2e3)}}var t=window.applicationCache;t.addEventListener("updateready",e),t.status===t.UPDATEREADY&&e(),setInterval(function(){t.update()},3e5)}(),function(){mobileNavToggle.addEventListener("click",function(e){e.preventDefault(),toggleMobileNav()})}();var enableContactForm=enableForm("contact","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время."),enableReviewForm=enableForm("review","Спасибо! Отзыв принят и будет опубликован после проверки."),enableOrderForm=enableForm("order","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей."),enableCallForm=enableForm("call_back","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.",toggleCallFormState);!function(){window.addEventListener("DOMContentLoaded",function(){callFormToggle(),enableCallForm(),enableContactForm(),enableReviewForm(),enableOrderForm()})}();