var cache = {};

function loadPage(url) {
  if (cache[url]) {
    return new Promise(function(resolve) {
      resolve(cache[url]);
    });
  }

  return fetch(url, {
    method: 'GET'
  }).then(function(response) {
    cache[url] = response.text();
    return cache[url];
  });
}

var page_wrap = document.querySelector('.page_wrap');

function changePage() {
  var url = window.location.href;

  loadPage(url).then(function(responseText) {
    var wrapper = document.createElement('div');
        wrapper.innerHTML = responseText;

    var oldContent = document.querySelector('.page_content_wrap');
    var newContent = wrapper.querySelector('.page_content_wrap');

    page_wrap.appendChild(newContent);
    animate(oldContent, newContent);
  });
}

function animate(oldContent, newContent) {

  oldContent.animate({
    opacity: [1, 0]
  }, 300);

  var fadeIn = newContent.animate({
    opacity: [0, 1]
  }, 300);

  fadeIn.onfinish = function() {
    oldContent.parentNode.removeChild(oldContent);
  };
}

window.addEventListener('popstate', changePage);

document.addEventListener('click', function(e) {
  var el = e.target;
  while (el && !el.href) {
    el = el.parentNode;
  }

  if (el) {
    if (el.target == '_blank') {
    } else if (el.href.indexOf("tel:") !== -1) {
    } else if (el.href.indexOf("mailto:") !== -1) {
    } else {
      e.preventDefault();
      history.pushState(null, null, el.href);
      changePage();
    }
    return;
  }
});
