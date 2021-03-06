$(function() {
  // tells the content script that the popup was opened
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      opened: true
    }, function(response) {});
  });

  // receives the page title from the content script and calls init
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.title) {
        sendResponse({
          message: request.title
        });
        document.title = request.title;
        window.init();
      }
    });

  window.init = function() {
    // QR Code generator code for the page
    var qrcode = new QRCode(document.getElementById("qrcode"), {
      width: 200,
      height: 200
    });

    // Generate a unique ID for the login pairing
    var generateID = function(bits, base) {
      if (!base) base = 16;
      if (bits === undefined) bits = 128;
      if (bits <= 0) return '0';

      var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
      for (var i = 2; digits === Infinity; i *= 2) {
        digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
      }

      var rem = digits - Math.floor(digits);

      var res = '';

      for (var i = 0; i < Math.floor(digits); i++) {
        var x = Math.floor(Math.random() * base).toString(base);
        res = x + res;
      }

      if (rem) {
        var b = Math.pow(base, rem);
        var x = Math.floor(Math.random() * b).toString(base);
        res = x + res;
      }

      var parsed = parseInt(res, base);
      if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
        return generateID(bits, base)
      } else return res;
    };

    var session_id = generateID();
    var title = document.title.toLowerCase().trim();
    var account = '';

    if (title.indexOf('facebook') > -1) {
      account = 'facebook';
    } else if (title.indexOf('google') > -1) {
      account = 'google';
    } else {
      account = 'N/A';
    }

    // make the QR code with the account and the code
    qrcode.makeCode(session_id);

    var socket = io('https://phone-unlock.herokuapp.com/');
    socket.emit('knock', session_id);

    var username = 'details.username';
    var password = 'details.password';
    account = 'google';
    var details = {
      username: username,
      password: password,
      account: account
    }
    chrome.tabs.executeScript(null, {
      code: 'window.login = {}; window.login.username="' + username + '"; window.login.password="' + password + '";'
    }, function() {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        var redirect = ''
        if (account == 'facebook') {
          redirect = 'https://www.facebook.com'
        } else if (account == 'google') {
          redirect = 'https://accounts.google.com'
        }
        chrome.tabs.sendMessage(tabs[0].id, {
          redirect: redirect,
          login: details
        }, function(response) {});
      });
    });

    // socket.on('login', function(details) {
    //   var username = details.username;
    //   var password = details.password;
    //   var account = details.account.trim();
    //   chrome.tabs.executeScript(null, {
    //     code: 'window.login = {}; window.login.username="' + username + '"; window.login.password="' + password + '";'
    //   }, function() {
    //     chrome.tabs.query({
    //       active: true,
    //       currentWindow: true
    //     }, function(tabs) {
    //       var redirect = ''
    //       if (account == 'facebook') {
    //         redirect = 'https://www.facebook.com'
    //       } else if (account == 'google') {
    //         redirect = 'https://accounts.google.com'
    //       }
    //       chrome.tabs.sendMessage(tabs[0].id, {
    //         redirect: redirect,
    //         login: details
    //       }, function(response) {});
    //     });
    //   });
    // });
  };
});