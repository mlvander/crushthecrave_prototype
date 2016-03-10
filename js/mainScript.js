/*global $, buildChart*/
/*jslint plusplus: true */

function loadJSON(fileName) {
    "use strict";
    var xmlHttp;
    
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "data/" + fileName + ".json", false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.response);
}

function parseURL(url) {
    "use strict";
    var i, baseURL, baseParams, parsedUrl;
    
    baseURL = url.split("?")[0];
    baseParams = url.split("?")[1];
    
    parsedUrl = { base: url, currentPage: baseURL.split("/")[baseURL.split("/").length - 1].split('.')[0]};
    
    if (baseParams) {
        for (i = 0; i < baseParams.split("&").length; i++) {
            parsedUrl[baseParams.split("&")[i].split("=")[0]] = baseParams.split("&")[i].split("=")[1];
        }
    }
    
    return parsedUrl;
}

function buildNavigation() {
    "use strict";
    
    var nav, i, thisButton;
    
    nav = document.getElementById('navigation').getElementsByTagName('div');
    
    for (i = 0; i < nav.length; i++) {
        thisButton = document.applicationJSON.navigation[nav[i].id];
        
        if (nav[i].id.toLowerCase() === document.currentPage) {
            nav[i].innerHTML = "<img src='icons/" + thisButton.icon_active + "' /> <br />" + thisButton.text;
            nav[i].className = "active";
        } else {
            nav[i].innerHTML = "<img src='icons/" + thisButton.icon + "' /> <br />" + thisButton.text;
        }
        
    }
}

function navSwitch(el, state) {
    "use strict";
    var thisNav;
    
    thisNav = document.applicationJSON.navigation[el.id];
    
    if (el.id.toLowerCase() === document.currentPage) {
        el.firstChild.src = "icons/" + thisNav.icon_active;
    } else if (state === "active") {
        el.firstChild.src = "icons/" + thisNav.icon_active;
    } else {
        el.firstChild.src = "icons/" + thisNav.icon;
    }
}

function loadProgress() {
    "use strict";
    
    var i, URL, progressData, days, startDt, prevDt, thisPrevDate, nextDt, thisNextDate;
    
    URL = parseURL(window.location.href);
    
    if (URL.startDt) {
        startDt = URL.startDt;
    } else {
        startDt = "2016-01-10";
    }
    
    progressData = loadJSON('progress').progress;
    
    document.progressDates = [];
    document.progressSmoked = [];
    document.progressAllowance = [];
        
    days = 0;
    for (i = 0; i < progressData.date.length; i++) {
        if (progressData.date[i] >= startDt && days < 7) {
                        
            document.progressDates.push(progressData.date[i]);
            document.progressSmoked.push(progressData.smoked[i]);
            document.progressAllowance.push(progressData.allowance[i]);
            days++;
        }
        if (days === 7) {
            nextDt = progressData.date[i];
        }
    }
    
    buildChart();

    nextDt = new Date(startDt);
    prevDt = new Date(startDt);
    
    nextDt.setDate(nextDt.getDate() + 7);
    prevDt.setDate(prevDt.getDate() - 7);
    
    thisNextDate = nextDt.getFullYear() + "-" + (((nextDt.getMonth() + 1) < 10) ? "0" : "") + (nextDt.getMonth() + 1) + "-" + (((nextDt.getDate() + 1) < 10) ? "0" : "") + (nextDt.getDate() + 1);
    
    thisPrevDate = prevDt.getFullYear() + "-" + (((prevDt.getMonth() + 1) < 10) ? "0" : "") + (prevDt.getMonth() + 1) + "-" + (((prevDt.getDate() + 1) < 10) ? "0" : "") + (prevDt.getDate() + 1);
    
    document.getElementById('nextArrow').onclick = function () { window.location.href = "?startDt=" + thisNextDate; };
    document.getElementById('prevArrow').onclick = function () { window.location.href = "?startDt=" + thisPrevDate; };
    
    //Control if the chart navigation arrows should display.
    if (days === 0) {
        document.getElementById('nextArrow').style.display = "none";
    }
    if (startDt <= progressData.date[1]) {
        document.getElementById('prevArrow').style.display = "none";
    }
}

function loadAward(id) {
    "use strict";
    var container, award, newElement, newNode;
    
    container = document.getElementById('screenContent');
    award = document.applicationJSON.awards[id.split(".")[0]].data[id.split(".")[1]];
    
    newElement = document.createElement('h1');
    newNode = document.createTextNode(award.title);
    
    newElement.appendChild(newNode);
    container.appendChild(newElement);
    
    newElement = document.createElement('img');
    if (award.id === "0.0" || award.id === "0.1" || award.id === "0.2") {
        newElement.src = "icons/" + award.icon_achieved;
    } else {
        newElement.src = "icons/" + award.icon;
    }

    container.appendChild(newElement);
    
    newElement = document.createElement('p');
    newNode = document.createTextNode(award.description);
    
    newElement.appendChild(newNode);
    container.appendChild(newElement);
}

function loadAwards() {
    "use strict";
    var a, b, container, awardCategories, awards, newContainer, newElement, newNode, onclickFunction;
    
    container = document.getElementById('screenContent');
    awardCategories = document.applicationJSON.awards;
    
    for (a = 0; a < awardCategories.length; a++) {
        newContainer = document.createElement('div');
        newContainer.className = "awardContainer";
        container.appendChild(newContainer);
            
        newElement = document.createElement('h1');
        newNode = document.createTextNode(awardCategories[a].title);
        
        newElement.appendChild(newNode);
        newContainer.appendChild(newElement);
        
        awards = awardCategories[a].data;
        
        for (b = 0; b < awards.length; b++) {
            newElement = document.createElement('a');
            newElement.className = "awardBox";
            newElement.href = "award.html?award=" + awards[b].id;
            
            newNode = document.createElement('img');
            if (awards[b].id === "0.0" || awards[b].id === "0.1" || awards[b].id === "0.2") {
                newNode.src = "icons/" + awards[b].icon_achieved;
            } else {
                newNode.src = "icons/" + awards[b].icon;
            }
            
            
            newElement.appendChild(newNode);
            
            newNode = document.createElement('br');
            newElement.appendChild(newNode);
            
            newNode = document.createTextNode(awards[b].text);
            newElement.appendChild(newNode);
            
            newContainer.appendChild(newElement);
        }
    }
}

function loadQuitHelp(id) {
    "use strict";
    var container, help, newElement, newNode;
    
    container = document.getElementById('screenContent');
    help = document.applicationJSON.quithelps[id];
    
    newElement = document.createElement('img');
    newElement.src = "logos/" + help.logo;
    container.appendChild(newElement);
    
    newElement = document.createElement('h1');
    newNode = document.createTextNode(help.title);
    newElement.appendChild(newNode);
    container.appendChild(newElement);
    
    newElement = document.createElement('p');
    newNode = document.createTextNode(help.description);
    newElement.appendChild(newNode);
    container.appendChild(newElement);
    
    newElement = document.createElement('a');
    newElement.href = help.website;
    newElement.className = "button";
    newNode = document.createTextNode(help.website);
    newElement.appendChild(newNode);
    container.appendChild(newElement);
}

function loadQuitHelps() {
    "use strict";
    var i, container, quitHelps, newElement, newNode;
    
    container = document.getElementById('screenContent');
    quitHelps = document.applicationJSON.quithelps;
    
    for (i = 0; i < quitHelps.length; i++) {
            
        newElement = document.createElement('a');
        newElement.className = "button";
        newElement.href = "quitHelp.html?quitHelp=" + quitHelps[i].id;
        newNode = document.createTextNode(quitHelps[i].title);
        
        newElement.appendChild(newNode);
        container.appendChild(newElement);
    }
}
function loadPage(el) {
    "use strict";
    window.location.href = el.id + ".html";
}

function initilize() {
    "use strict";
    
    var URL, language;
    
    URL = parseURL(window.location.href);
  
    if (URL.language) {
        language = URL.language;
    } else {
        language = "english";
    }
    
    document.currentPage = URL.currentPage.toLowerCase();
    document.applicationJSON = loadJSON(language);
    
    if (document.currentPage === "award") {
        loadAward(URL.award);
    } else if (document.currentPage === "quithelp") {
        loadQuitHelp(URL.quitHelp);
    } else {
        buildNavigation();
    }
    
    if (document.currentPage === "awards") {
        loadAwards();
    } else if (document.currentPage === "progress") {
        loadProgress();
    } else if (document.currentPage === "quithelps") {
        loadQuitHelps();
    }
}

window.onload = function () {
    "use strict";
    initilize();
};
