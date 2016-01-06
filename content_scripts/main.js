console.log('Phone unlock is supported for this service!');
// waits to hear when the popup is opened and sends the page title once it is
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.opened) {
      chrome.runtime.sendMessage({
        title: document.title.toLowerCase()
      }, function(response) {});
    }
  });