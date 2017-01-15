"use strict";function changePage(e){var t=new window.XMLHttpRequest;t.open("GET",e),t.responseType="document",t.onload=function(){var e=this.response,t=e.getElementById("page_content_wrap"),n=e.querySelector("title"),o=e.getElementById("pageDescription"),a=document.getElementById("page_content_wrap"),i=document.querySelector("title"),l=document.getElementById("pageDescription"),r=function(){a.parentNode.replaceChild(t,a),i.parentNode.replaceChild(n,i),l.parentNode.replaceChild(o,l),window.scrollTo(0,0),mobileNav.classList.contains("is_open")&&toggleMobileNav()},c=function(){t.opacity=0,a.opacity=0,a.animate([{opacity:1},{opacity:0}],100).onfinish=function(){r(),t.animate([{opacity:0},{opacity:1}],100).onfinish=function(){t.opacity=2}}},s=new Promise(c,null).catch(function(){return r()});return s},t.send()}function switchActiveNavLink(e){e.className.indexOf("active")===-1&&(e.parentNode.querySelector(".site_nav__link.active").classList.remove("active"),e.classList.add("active"),document.activeElement.blur())}function toggleMobileNav(){mobileNavToggle.classList.toggle("is_open"),mobileNav.classList.toggle("is_open")}function enableForm(e,t,n){var o=e+"-form",a=e+"-form__button",i=document.getElementById(o),l=document.getElementById(a),r=function(e,t,n,o){n.textContent=o,n.className="form__button--success",n.disabled=!0;var a=new window.XMLHttpRequest;a.withCredentials=!1,a.open("POST","https://briskforms.com/go/61884eb4d90ed4de433bf106bd0aea9a",!0),a.setRequestHeader("accept","application/json");var i=new window.FormData(t);a.send(i)};return function(){i&&i.addEventListener("submit",function(e){return e.preventDefault(),e.stopPropagation(),r(e,i,l,t)})}}function toggleCallFormState(e){e&&(e.preventDefault(),e.stopPropagation()),callFormMainToggle&&callFormMainToggle.classList.toggle("is_open"),callFormWrap.classList.toggle("is_open"),callFormWrap.classList.contains("is_open")&&document.getElementById("call-back-form__name").focus()}function callFormToggle(){for(var e=0;e<callFormToggles.length;e++)callFormToggles[e].addEventListener("click",toggleCallFormState)}var mobileNav=document.getElementById("mobile_nav"),desktopNav=document.getElementById("desktop_nav");!function(){window.history&&window.history.pushState&&(document.addEventListener("click",function(e){if(!e.ctrlKey){for(var t=e.target;t&&!t.href;)t=t.parentNode;if(t){if("_blank"===t.target)return;if(t.href.indexOf("tel:")>=0)return;if(t.href.indexOf("mailto:")>=0)return;if(t.className.indexOf("no_custom_transition")>=0)return;return e.preventDefault(),changePage(t.href),window.history.pushState(null,null,t.href),void(window.ga&&(window.ga("set","page",t.href),window.ga("send","pageview")))}}}),setTimeout(function(){window.onpopstate=function(){changePage(window.location.href)}},500))}(),function(){desktopNav.addEventListener("click",function(e){e.target.href&&switchActiveNavLink(e.target)}),mobileNav.addEventListener("click",function(e){e.target.href&&switchActiveNavLink(e.target)})}(),function(){function e(){try{t.swapCache(),changePage(document.URL)}catch(e){setTimeout(changePage(),2e3)}}var t=window.applicationCache;t.addEventListener("updateready",e),t.status===t.UPDATEREADY&&e(),setInterval(function(){t.update()},3e5)}();var mobileNavToggle=document.getElementById("mobile_nav_toggle"),callFormToggles=document.getElementsByClassName("call-back-form__toggle"),callFormWrap=document.getElementById("call-back-form__wrap"),callFormMainToggle=document.querySelector("#site_contacts_wrap .call-back-form__toggle");!function(){mobileNavToggle.addEventListener("click",function(e){e.preventDefault(),toggleMobileNav()})}();var enableContactForm=enableForm("contact","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время."),enableGuideForm=enableForm("guide","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей."),enableReviewForm=enableForm("review","Спасибо! Отзыв принят и будет опубликован после проверки."),enableOrderForm=enableForm("order","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время для уточнения деталей."),enableCallForm=enableForm("call-back","Форма успешно отправлена! Мы свяжемся с Вами в ближайшее время.",function(){return setTimeout(toggleCallFormState,5e3)});!function(){window.addEventListener("DOMContentLoaded",function(){callFormToggle(),enableCallForm(),enableGuideForm(),enableContactForm(),enableReviewForm(),enableOrderForm()})}();