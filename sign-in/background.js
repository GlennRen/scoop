/*chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log(details);
    return {
      cancel: details.url.indexOf(document.location.href) > -1
    };
  }, { }, ["blocking"]);
console.log("injected");*/