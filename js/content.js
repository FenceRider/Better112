'use strict';


var port = chrome.runtime.connect();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      let colormode = request.colormode;
      setCss(colormode);
      
    }
            
  );


  /*
window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        port.postMessage(event.data.text);
    }
}, false);
*/

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};


/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 */
function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}



function addCss(fileName) {

    var head = document.head;
    var link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;

    head.appendChild(link);
}



function setCss(mode) {
    //clear all css
    document.querySelectorAll('style,link[rel="stylesheet"]').forEach(item => item.remove());
    delete document.bgColor;
    document.body.removeAttribute('bgcolor')
    document.querySelectorAll('[bgcolor]').forEach((e)=>{e.removeAttribute('bgcolor')});
    let css;
    switch (mode) {
        case "light":
            css = chrome.extension.getURL('css/bluma.css');
            break;
        case "dark":
            css = chrome.extension.getURL('css/dark.css');
            break;
        case "night":
            css = chrome.extension.getURL('css/night.css');
            break;
    }
    addCss(css);

    addCss(chrome.extension.getURL('css/content.css'));
}



function init(colormode) {


    setCss(colormode)

    if (location.href.toLowerCase().endsWith(".pdf")) {
        return;
    }


    //inject into section.container
    let section = document.createElement("div");
    let container = document.createElement("div");

    section.classList.add("section");
    container.classList.add("container");
    section.append(container);
    container.innerHTML = document.body.innerHTML;;
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    document.body.append(section);


    //fix tables
    document.querySelectorAll("table").forEach((e) => { 
        if(e.border == '0' ) return; //some tables were used to get things next to each other https://www2.ucsc.edu/courses/cse112-wm/:/Languages/ocaml/matuszek-concise-ocaml.html
        e.className = "table is-bordered is-striped is-narrow is-fullwidth"; e.style.tableLayout = "fixed"; })


    //fix lists
    document.querySelectorAll('ul').forEach((e)=>{
        let list_string = e.outerHTML;
        let content = document.createElement('div');
        content.classList.add('content');
        content.innerHTML = list_string;
        e.parentElement.replaceChild(content, e);
    })


    //move pwd
    let pwd = document.querySelector(".PWD_URL");
    if (pwd) {
        pwd = pwd.innerHTML;
        document.querySelector(".PWD_URL").remove();
        pwd = pwd.split("\n")[1].split("PWD: ")[1];
        let newpwd = document.createElement("div");
        let copy_interval = 0;
        //newpwd.style.cursor = "pointer";
        newpwd.classList = "level";
        newpwd.innerHTML = `<div class="level-left">
                              <div class="level-item">
                                <span class="is-size-4 tag is-success" style="border-top-right-radius:0;border-bottom-right-radius:0">PWD:</span>
                                <span id="pwd_text" class="flash is-size-4 tag is-black has-text-success" style="cursor:pointer; border-top-left-radius:0;border-bottom-left-radius:0;">${pwd}</span>
                                <div id="copypwd" style="margin-left: 10px; position: relative; display: none;">
                                  <span class="tag ${colormode=='light' ? 'is-dark popupDark' : 'is-light popupLight'}">Copied!</span>
                                </div>
                              </div>
                            </div>`;
        newpwd.innerHTML += ``
        container.prepend(newpwd);
        

        document.getElementById('pwd_text').onclick = () => {
            document.getElementById('copypwd').style.display = "block"
            clearTimeout(copy_interval);
            copy_interval = setTimeout(() => {
                document.getElementById('copypwd').style.display = "none"
            }, 2000)
            copyToClipboard(pwd);
        };
    }

    //insert nav 
    let nav = document.createElement('div');
    nav.innerHTML = `
        <div class="level">
            <div class="level-left">
                <a href="https://www2.ucsc.edu/courses/cse112-wm/:/" class="level-item" style="margin-left:25px;margin-right:25px">Home</a>
                <a href="https://www2.ucsc.edu/courses/cse112-wm/:/Syllabus/syllabus-cse112.pdf" class="level-item" style="margin-left:25px;margin-right:25px">Syllabus</a>
                

                <a href="https://www2.ucsc.edu/courses/cse112-wm/:/Assignments/" class="level-item" style="margin-left:25px;margin-right:25px">Assignments</a>
                <a href="https://www2.ucsc.edu/courses/cse112-wm/:/Old-Exams/" class="level-item" style="margin-left:25px;margin-right:25px">Old Exams</a>
                <a href="https://www2.ucsc.edu/courses/cse112-wm/:/Lecture-notes/" class="level-item" style="margin-left:25px;margin-right:25px">Lecture Notes</a>
                <a href="https://www2.ucsc.edu/courses/cse112-wm/:/Languages/" class="level-item" style="margin-left:25px;margin-right:25px">Languages</a>
            
                <a href="https://www2.ucsc.edu/courses/cse112-wm/:/Syllabus/submit-checklist/submit-checklist.pdf" class="level-item" style="margin-left:25px;margin-right:25px">Checklist</a>
                <a href="https://www2.ucsc.edu/courses/cse112-wm/:/Syllabus/pair-programming/pair-programming.pdf" class="level-item" style="margin-left:25px;margin-right:25px">Pair Programming</a>
                
            </div>
        
        </div>
        <hr>
    
    `;

    container.prepend(nav)





    if (document.location.href == "https://www2.ucsc.edu/courses/cse112-wm/:/") {

        container.prepend(document.createElement('br'));
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

        document.querySelectorAll(".TITLE").forEach((e) => { e.remove() })
        container.prepend(outer_div);

        document.querySelectorAll(".TITLE").forEach((e) => { e.classList.add("level-item") })

        //remove sep
        document.querySelectorAll(".SEPARATOR").forEach((e) => { e.remove(); })
        for (let i = 0; i < 12; i++) {
            document.querySelector(".level").nextSibling.nextSibling.nextSibling.nextSibling.remove();
        }


        //add space first pre
        container.insertBefore(document.createElement('br'), document.querySelector("pre").nextSibling);
        container.insertBefore(document.createElement('br'), document.querySelectorAll("pre")[1]);

        //fix table title
        document.querySelectorAll(".MONTH").forEach((e) => {
            e.parentElement.classList.add("title")

        })


        //assignment summary
        let string_assignment_summary = '<table class="table is-striped is-fullwidth"><tr><th>Due</th><th>Type</th><th>Link</th><th>Original</th></tr>'
        let due_things = document.querySelector('pre').innerText.split('\n').map((s) => s.split("DUE."));
        let due_things_lines = document.querySelector('pre').innerText.split('\n');
        due_things.forEach((t, i) => {
            try {
                if (!t[0]) return;
                let parts = t[0].split('.');
                let date = parts[1];
                let type = parts[2];
                let link = t[1];

                let danger = type.includes("EXAM");
                let warning = type.includes("ASG") || type.includes("LAB");
                let highlight = (danger ? "has-background-danger" : warning ? "has-background-warning" : "")  + " " +  (colormode=='dark'? 'has-text-light' : "");

                string_assignment_summary += `<tr><td>${date}</td><td class="${highlight}">${type}</td><td><a href="${link ? link : "#"}">${link ? link : ""}</a></td><td>${due_things_lines[i]}</td></tr>`
            } catch (e) {
                string_assignment_summary += `<tr><td>.</td><td>.</td><td><a href="#">.</a></td><td>${due_things_lines[i]}</td></tr>`
            }
        });
        let assignment_summary = document.createElement('div');
        assignment_summary.innerHTML = string_assignment_summary;

        let due_things_content = document.querySelector('pre').innerHTML;
        document.querySelector('pre').replaceWith(assignment_summary);
        document.querySelector('pre').remove();

        
        //fix calendars
        document.querySelectorAll('.month').forEach((e)=>{
            let table = e.nextElementSibling;
            table.classList.add("b112calendar");
            table.classList.remove('is-narrow');
            table.classList.remove('is-fullwidth');

            let header = document.createElement("tr");
            header.innerHTML = `<thead>
                                  <tr class="calHeader">
                                    <th class="is-primary has-text-centered">S</th>
                                    <th class="is-primary has-text-centered">M</th>
                                    <th class="is-primary has-text-centered">T</th>
                                    <th class="is-primary has-text-centered">W</th>
                                    <th class="is-primary has-text-centered">T</th>
                                    <th class="is-primary has-text-centered">F</th>
                                    <th class="is-primary has-text-centered">S</th>
                                  </tr>
                                </thead>`;
            table.insertBefore(header, table.firstChild);
            table.querySelectorAll("td").forEach((day) => {
              const a = day.innerHTML.split(";");
              if (a.length == 3) {
                day.innerHTML = a[2];
              } else if (a.length == 4) {
                if (a[2].search("Holiday") > -1 || a[2].search("Grades") > -1 || a[2].search("End") > -1) {
                  day.innerHTML = `${a[2]}${a[3]}`;
                } else if (a[3].search("EXAM") > -1 || a[2].search("MIDTERM") > -1) {
                  day.innerHTML = `${a[2]}  ${a[3]}`;
                } else {
                  day.innerHTML = a[3];
                }
              } else if (a.length == 5) {
                day.innerHTML = `${a[2]}${a[3]}${a[4]}`;
              } else if (a.length == 6) {
                day.innerHTML = `${a[3]}${a[4]}${a[5]}`;
              }
            })
        })




    } else {

    }

    window.evilEmpire = () => {
        document.getElementById('evil_empire').innerHTML += `
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/OS-Wars.gif">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/bmw-wo-windows.gif">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/browser-error.gif">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/browser-options.gif">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/drag-and-drop.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/error95.gif">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/freebugs.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/microcd.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/microshit.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/missing-doze-key.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/monopoly.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/ms-dialog-boxes.gif">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/ms-tech-support.txt">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/mskey.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/secret-w98.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/win1900-1.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/win1900.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/windows-firewall.jpg">
        <img src="https://www2.ucsc.edu/courses/cse112-wm/:/etc/evil-empire/windozent.jpg">
        `
    }

    let footer = document.createElement("div");
    footer.onclick = window.evilEmpire;
    footer.innerHTML = `
        <br>
        <div style="cursor:help">Evil Empire</div>
        <div id="evil_empire"><div>
    `;
    container.append(footer);




    //set listeners


}


chrome.runtime.sendMessage("ready", function (response) {
    console.log(response)
    if (response.colormode == "original") return;



    if (!response.colormode) {
        init("night");

    } else {
        init(response.colormode);
    }
});




