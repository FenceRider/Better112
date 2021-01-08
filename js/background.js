'use strict';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("got " + message + " from " + sender);
    if (message == "ready" && sender.tab) {


        chrome.storage.sync.get(['colormode'], function (result) {
            sendResponse({ colormode: result.colormode });
        });
        return true;
    }
});