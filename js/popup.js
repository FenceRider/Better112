'use strict';

/**
 * Global variables, visible only inside popup.js
 */
let backgroundJS = chrome.extension.getBackgroundPage();

document.getElementById("light").onclick = ()=>{color("light")}
document.getElementById("dark").onclick  = ()=>{color("dark")}
document.getElementById("night").onclick = ()=>{color("night")}
document.getElementById("original").onclick = ()=>{color("original")}


function color(mode) {
    chrome.storage.sync.set({ colormode: mode }, function (e) {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
        });
        
    });
}




