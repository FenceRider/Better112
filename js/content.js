'use strict';


/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 */
function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}


document.querySelectorAll('style,link[rel="stylesheet"]').forEach(item => item.remove())



function addCss(fileName) {

    var head = document.head;
    var link = document.createElement("link");
  
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;
  
    head.appendChild(link);
  }
  
  let css = chrome.extension.getURL('css/bluma.css');
  addCss(css);


addStyle(`
table, th, td {
    border: 1px solid black;
  }
td {
    padding:5px;
}

body {
    padding-top:30px;
    margin-left:30px;
    margin-right:30px;
}
  `
)

if(document.location.href == "https://www2.ucsc.edu/courses/cse112-wm/:/"){

    //fix title
    let ileft = document.querySelectorAll(".TITLE")[0].outerHTML
    let iright = document.querySelectorAll(".TITLE")[1].outerHTML

    let outer_div = document.createElement('div');
    outer_div.classList.add("level")

    let left = document.createElement('div');
    left.classList.add("level-left")
    
    let right = document.createElement('div');
    right.classList.add("level-right")
    right.append();
    left.append();
    
    left.innerHTML = iright;
    right.innerHTML = ileft;
    
    outer_div.append(left);
    outer_div.append(right);

    document.querySelectorAll(".TITLE").forEach((e)=>{e.remove()})
    document.body.prepend(outer_div);
    
    document.querySelectorAll(".TITLE").forEach((e)=>{e.classList.add("level-item")})

    //remove sep
    document.querySelectorAll(".SEPARATOR").forEach((e)=>{e.remove();})

    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    document.querySelector(".level").nextSibling.remove();
    

    //add space first pre
    document.body.insertBefore(document.createElement('br'),document.querySelector("pre").nextSibling);
    document.body.insertBefore(document.createElement('br'),document.querySelectorAll("pre")[1]);

}


