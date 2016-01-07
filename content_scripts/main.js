// waits to hear when the popup is opened and sends the page title once it is
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.opened) {
      chrome.runtime.sendMessage({
        title: document.title.toLowerCase()
      }, function(response) {});
    } else if (request.redirect) {
      console.log('creating a new tab now');
      chrome.tabs.getCurrent(function(tab) {
        var openerId = tab.id;
        chrome.tabs.create({
          openerTabId: openerId,
          url: request.redirect
        }, function(tab) {
          window.createdTab = tab
        });
      });
    } else if (request.ping) {
      console.log('incoming ping from tab ' + sender.id);
      console.log(sender.id == window.createdTab.id)
      if (sender.id == window.createdTab.id) {
        var tabId = window.createdTab.id;
        chrome.tabs.sendMessage(tabId, {
          pong: {
            username: window.login.username,
            password: window.login.password
          }
        }, function() {});
      }
    } else if (request.pong) {
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

        // execute a specific login pattern
        if (account === 'facebook') {
          // run facebook script
          chrome.tabs.executeScript(null, {
            file: 'popup/facebook.js'
          }, function(resp) {
            console.log(resp);
          });
        } else if (account === 'google') {
          // run google script
          chrome.tabs.executeScript(null, {
            file: 'popup/google.js'
          }, function(resp) {
            console.log(resp);
          });
        }
      }
    }
  });

// send ping on every new tab
chrome.tabs.getCurrent(function(tab) {
  var openerId = tab.openerTabId;
  console.log('sending ping to tab ' + openerId);
  chrome.tabs.sendMessage({
    ping: true
  }, function(response) {});
});