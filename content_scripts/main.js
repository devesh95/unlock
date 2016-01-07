// waits to hear when the popup is opened and sends the page title once it is
console.log('Unlock scripts ready to run.');
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.opened) {
      document.title += ' | unlock';
      chrome.runtime.sendMessage({
        title: document.title.toLowerCase()
      }, function(response) {});
    } else if (request.redirect) {
      console.log('Logging in through a new tab...')
      window.login = request.login;
      chrome.runtime.sendMessage({
        url: request.redirect
      });
    } else if (request.ping) {
      sendResponse(window.login);
    } else if (request.pong) {
      console.log('Logging in!');
      window.login = request.pong;
      if (window.location.href.indexOf('accounts.google') > -1 || window.location.href.indexOf('facebook') > -1) {
        var title = document.title.toLowerCase().trim();
        var account = '';

        if (title.indexOf('facebook') > -1) {
          account = 'facebook';
        } else if (title.indexOf('google') > -1) {
          account = 'google';
        } else {
          account = 'N/A';
        }
        var execute = '';
        // execute a specific login pattern
        if (account === 'facebook') {
          // run facebook script
          execute = 'popup/facebook.js'
        } else if (account === 'google') {
          // run google script
          execute = 'popup/google.js';
        }
        chrome.runtime.sendMessage({
          execute: execute,
          tabId: request.tabId
        });
      }
    }
  });