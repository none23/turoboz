"use strict";!function(){function e(){console.log("applying changes in cache"),window.applicationCache.swapCache(),console.log("updating page"),t(document.URL)}var n="page_content_wrap",t=function(e){var t=new XMLHttpRequest;t.open("GET",e),t.responseType="document",t.onload=function(){var e=this.response.getElementById(n),t=document.getElementById(n),a=t.animate({opacity:[1,0]},200);a.onfinish=function(){t.parentNode.replaceChild(e,t)}},t.send()};window.applicationCache.addEventListener("updateready",e),window.applicationCache.status===window.applicationCache.UPDATEREADY&&e(),window.applicationCache.update(),setInterval(function(){window.applicationCache.update()},36e5),history&&history.pushState&&(document.addEventListener("click",function(e){if(!e.ctrlKey){for(var n=e.target;n&&!n.href;)n=n.parentNode;return n?void("_blank"==n.target||n.href.indexOf("tel:")>=0||n.href.indexOf("mailto:")>=0||"mobile_nav_toggle"===n.id||(e.preventDefault(),t(n.href),history.pushState(null,null,n.href),ga("set","page",n.href),ga("send","pageview"))):void 0}}),setTimeout(function(){window.onpopstate=function(){t(window.location.href)}},500))}();