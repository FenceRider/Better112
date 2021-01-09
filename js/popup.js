'use strict';

/**
 * Global variables, visible only inside popup.js
 */
let backgroundJS = chrome.extension.getBackgroundPage();

let currentColorMode;
chrome.storage.sync.get(['colormode'], function (result) {
    removeOutline(result.colormode)
    currentColorMode = result.colormode
});

let light = document.getElementById("light")
light.onclick = () => { color("light") }
let dark = document.getElementById("dark")
dark.onclick = () => { color("dark") }
let night = document.getElementById("night")
night.onclick = () => { color("night") }
let original = document.getElementById("original")
original.onclick = () => { color("original") }

function color(mode) {
    chrome.storage.sync.set({ colormode: mode }, function (e) {

        let refresh = currentColorMode == 'original' || mode=="original"; //outside cuz async or something
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            updateTabs(mode, refresh); //refresh if going to or coming from original
            //chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
        });

        removeOutline(mode)

        switch (currentColorMode) {
            case "light":
                light.classList.add("is-outlined")
                break;
            case "dark":
                dark.classList.add("is-outlined")
                break;
            case "night":
                night.classList.add("is-outlined")
                break;
            default:
                original.classList.add("is-outlined")
        }

        currentColorMode = mode;
    });
}

function removeOutline(colormode) {
    switch (colormode) {
        case "light":
            light.classList.remove("is-outlined")
            break;
        case "dark":
            dark.classList.remove("is-outlined")
            break;
        case "night":
            night.classList.remove("is-outlined")
            break;
        default:
            original.classList.remove("is-outlined")
    }
}


function updateTabs(colormode, refresh=false){
    chrome.tabs.query({url:'https://www2.ucsc.edu/courses/cse112-wm/*'}, function(tabs) {
        tabs.forEach((t)=>{
            //if(refresh)
                chrome.tabs.reload(t.id)
            //else
            //    chrome.tabs.sendMessage(t.id, {colormode: colormode}, function(response) {
            //});
        })
        
    });
}
