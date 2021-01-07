'use strict';


var port = chrome.runtime.connect();

window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        port.postMessage(event.data.text);
    }
}, false);



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
    document.querySelectorAll('style,link[rel="stylesheet"]').forEach(item => item.remove())
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
}



function init(colormode) {


    setCss(colormode)

    if (location.href.endsWith(".pdf")) {
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
    document.querySelectorAll("table").forEach((e) => { e.className = "table is-bordered is-striped is-narrow is-hoverable is-fullwidth"; e.style.tableLayout = "fixed"; })


    //move pwd
    let pwd = document.querySelector(".PWD_URL").innerHTML;
    document.querySelector(".PWD_URL").remove();
    pwd = pwd.split("\n")[1].split("PWD: ")[1];
    let newpwd = document.createElement("div");
    newpwd.classList = "level"
    newpwd.innerHTML = `<div class="container"><span class="is-size-4 tag is-success" style="border-top-right-radius:0;border-bottom-right-radius:0">PWD:</span><span class="is-size-4 tag is-black has-text-success" style="border-top-left-radius:0;border-bottom-left-radius:0">${pwd}</span></div>`
    container.prepend(newpwd)


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
        let string_assignment_summary = '<table class="table is-striped is-hoverable is-fullwidth"><tr><th>Due</th><th>Type</th><th>Link</th><th>Original</th></tr>'
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
                let highlight = danger?"has-background-danger":warning?"has-background-warning":"";

                string_assignment_summary += `<tr><td>${date}</td><td class="${highlight}">${type}</td><td><a href="${link ? link : "#"}">${link ? link : ""}</a></td><td>${due_things_lines[i]}</td></tr>`
            } catch (e) { 
                string_assignment_summary += `<tr><td>.</td><td>.</td><td><a href="#">.</a></td><td>${due_things_lines[i]}</td></tr>`
            }
        });
        let assignment_summary = document.createElement('div');
        assignment_summary.innerHTML = string_assignment_summary;
        //container.append(assignment_summary);

        let due_things_content = document.querySelector('pre').innerHTML;
        document.querySelector('pre').replaceWith(assignment_summary);
        document.querySelector('pre').remove();

    } else {

    }


}


chrome.runtime.sendMessage("ready", function (response) {
    console.log(response)
    if(response.colormode == "original") return;
    init("light");
    
    if(!response.colormode){
        setCss("night");
    }else{
        setCss(response.colormode);
    }
});




