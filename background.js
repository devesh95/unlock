// when the extension is installed... 
chrome.runtime.onInstalled.addListener(function() {

    // replace all existing rules...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {

        // with these new rules:
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({

                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// message listeners for eah tab
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.url) {
            var openerId = sender.tab.id;
            chrome.tabs.create({
                openerTabId: openerId,
                url: request.url
            }, function(tab) {
                sendResponse(tab);
            });
        } else if (request.execute && request.tabId) {
            chrome.tabs.executeScript(request.tabId, {
                file: request.execute
            }, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                }
            });
        }
    }
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (window.newTab) {
        var newTab = window.newTab;
        if (newTab.id == tabId && changeInfo.status && changeInfo.status == 'complete') {
            window.newTab = null;
            console.log('new tab done loading.');
            chrome.tabs.query({
                title: '*| unlock*'
            }, function(tabs) {
                if (tabs.length > 0) {
                    var tab = tabs[0];
                    chrome.tabs.sendMessage(tab.id, {
                        ping: 1,
                        createdTab: newTab
                    }, function(login) {
                        chrome.tabs.sendMessage(newTab.id, {
                            pong: login,
                            tabId: newTab.id
                        });
                    });
                }
            });
        }
    }
});

chrome.tabs.onCreated.addListener(function callback(newTab) {
    window.newTab = newTab;
    // console.log(newTab);
    // // send ping on every new tab
    // chrome.tabs.query({
    //     title: '*| unlock*'
    // }, function(tabs) {
    //     if (tabs.length > 0) {
    //         var tab = tabs[0];
    //         chrome.tabs.sendMessage(tab.id, {
    //             ping: 1,
    //             createdTab: newTab
    //         }, function(login) {
    //             console.log(login);
    //             chrome.tabs.sendMessage(newTabId, {
    //                 pong: login
    //             });
    //         });
    //     }
    // });
});