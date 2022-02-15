

function makeAlertDiv() {
    var url = document.URL
    var el3 = document.createElement("div");
    el3.className = makeid(25) + " resizable";
    el3.id = 'OmitedPar';
    el3.style.cssText += `display:none;position: fixed;bottom: 10px;right: 10px;z-index: 9999999;width: 350px;height: 520px;    min-width: 350px;    min-height: 520px;`;
    el3.innerHTML += `
    
      <div class='resizer top'></div>
      <div class='resizer right'></div>
      <div class='resizer bottom'></div>
      <div class='resizer left'></div>
    
  <div id="minimize" style="width: 11%;height: 30px;cursor: pointer;position: absolute;top: 0;right: 0;margin: 0;display: flex;align-items: center;justify-content: center;z-index: 2;"><img  src="${chrome.runtime.getURL("Rectangle.svg")}" alt="Avatar" style=""></div><div id="logodrag" style="    width: 100%;    height: 50px;    cursor: move;    position: absolute;    top: 0;"></div><iframe id="Omited" minim="false" src="${chrome.runtime.getURL("index.html")}?url=${encodeURIComponent(url)}" frameborder="0" scrolling="no" style="width: 100%;height: 100%;max-height: 100%;max-width: 100%;transition-duration: 200ms;transition-delay: 1ms;transition: position 1s, left 1s, top 1s, width 1s, height 1s, max-width 1s, max-height 1s;transition-timing-function: ease;border-radius: 6px !important;"></iframe>`;
    // append the iframe to the document
    document.querySelector('body').appendChild(el3);
    // on minimize click
    document.querySelector("#minimize").addEventListener("click", function (event) {
        if (document.querySelector("#Omited").getAttribute("minim") == "true") {
            // document.querySelector("#Omited").style.height = "520px"
            document.querySelector("#OmitedPar").style.height = "520px"
            document.querySelector("#OmitedPar").style.minHeight = "520px"
            document.querySelector("#OmitedPar").style.maxHeight = ""

            document.querySelector("#Omited").setAttribute("minim", "false")
        } else {
            // document.querySelector("#Omited").style.height = "50px"
            document.querySelector("#OmitedPar").style.height = "50px"
            document.querySelector("#OmitedPar").style.minHeight = "50px"
            document.querySelector("#OmitedPar").style.maxHeight = "50px"
            document.querySelector("#OmitedPar").style.top = ""
            document.querySelector("#OmitedPar").style.botton = "10px"
            document.querySelector("#OmitedPar").style.right = "10px"
            document.querySelector("#OmitedPar").style.left = ""
            document.querySelector("#Omited").setAttribute("minim", "true")
        }

    })
    document.querySelector("#OmitedPar").addEventListener("mouseenter", function () {
        chrome.runtime.sendMessage({
            message: "removeOutline",
        });
    })
    document.querySelector("#OmitedPar").addEventListener("mouseleave", function (e) {
        //xpath
        // let arr = document.querySelectorAll("[class*='seq-showing']")
        // putBackOutline(arr);
        chrome.runtime.sendMessage({
            message: "putBackOutline",
        });

    })

}
if (window.top == window.self) {
    // insert the iframe into the top window
    makeAlertDiv()
    // make the iframe draggable
    dragElement(document.getElementById("OmitedPar"));
    // make the iframe resizable
    makeResizableDiv('.resizable')
}
var el4 = document.createElement("style");
el4.innerHTML += `.seq-Hover * {    cursor: crosshair;}.seq-Hover {    position: relative;}.seq-Hover a {    // pointer-events: none;}.seq-HoverNoStyle {}.seq-HoverNoStyle2 {    outline: 5px solid #faef8988 !important;    outline-offset: -5px;}.seq-HoverNoStyle3 {    outline: 5px solid #5248F988 !important;    outline-offset: -5px;}.seq-Hoverdisplaynone {    display: none !important;;}.seq-Hover .seq-border {    /*opacity:0.4 !important;    background-color: red !important;*/}.seq-Hover #seq-Hover-btn {    cursor: pointer;}.resizable {  }    .resizable .resizers{    width: 100%;    height: 100%;    border: 3px solid #4286f4;    box-sizing: border-box;  }    .resizable .resizers .resizer{    border-radius: 0%; /*magic to turn square into circle*/    background: white;    border: 0px solid #4286f4;    position: absolute;  }    .resizer.top {    height: 5px;    width: 100%;    left:0%;    top: 0px;    cursor: ns-resize;    transform: translate(0px, 0px);    position: absolute;    z-index: 2;  }    .resizer.right {    width: 5px;    height: 100%;    right: 0px;    bottom: 0%;    cursor: ew-resize;    transform: translate(0px, 0px);    position: absolute;  }    .resizer.bottom {    height: 5px;    width: 100%;    left: 0%;    bottom: 0px;    cursor: ns-resize;    transform: translate(0px, 0px);    position: absolute;  }    .resizer.left {    width: 5px;    height: 100%;    left: 0px;    bottom: 0%;    cursor: ew-resize;    transform: translate(0px, 0px);    position: absolute;  }`;


document.querySelector('head').appendChild(el4);


var eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent"
    ? "onmessage"
    : "message";
var counter = 0;
// message listener
if (window.top == window.self)
    eventer(messageEvent, function (e) {
        console.log(e.data.message);
        // get the appropriate attributes for the selected element
        if (e.data.message === "getAttributesList") {
            let x = getElementByXpath(e.data.xpath, document)
            if (!x) {
                return
            }
            if (window.top == window.self)
                document.querySelector("#OmitedPar iframe").contentWindow.window.postMessage(
                    {
                        message: "attributesList",
                        data: GetFriendlyAttributeNames(x)
                    },
                    "*"
                );

        }
        // a variable to check if we are over an iframe or not
        if (e.data.message === "hoveringOverIframe=0") {
            document.querySelector(".seq-overlay").style.display = "none"
            window.hoveringOverIframe = 1
        }
        // on "+" click
        if (e.data.message === "hidepopup") {
            if (window.top == window.self)
                document.querySelector("#OmitedPar").style.display = "none"
            let arr = document.querySelectorAll("[class*='seq-showing']")
            for (let i = 0; i < arr.length; i++) {
                arr[i].remove();
            }
        }

        if (e.data.message === "close()") {
            window.close()
        }
    });
var lastSaved

chrome.runtime.onMessage.addListener(function (request, sender, RSP) {

    if (request.message == "openit") {
        if (window.top == window.self)
            document.querySelector("#OmitedPar").style.display = "block"
    }
    if (request.message == "openItFromPopup") {
        if (window.top == window.self)
            document.querySelector("#OmitedPar iframe").contentWindow.window.postMessage({
                message: "openItFromPopup",
                obj: request.obj,
            }, "*")
        if (window.top == window.self)
            document.querySelector("#OmitedPar").style.display = "block"
    }
    if (request.message == "startPick") {
        if (request.hide != false)
            if (window.top == window.self)
                document.querySelector("#OmitedPar").style.display = "none"
        //inject the overlay into all the iframes and shadow elements
        var x = document.querySelectorAll("body , body *")
        // inject in the current document
        startPickingGlob(x, request);
        //check for any shadow elements
        startPickingF(request, document);


    }
    if (request.message == "removeSeqShowing") {
        var allelems2 = document.querySelectorAll("body,body *");
        removeSeqShowing(allelems2);
        chrome.runtime.sendMessage({
            message: "doneRevomeOverlay",
        });

    }
    if (request.message == "displaySelected") {
        let arr = document.querySelectorAll("[class*='seq-showing']")
        for (let i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
        let isshadow = false
        lastSaved = request.data
        // console.log(request.data);
        arr = document.querySelectorAll(".seq-HoverNoStyle3.seq-HoverNoStyle")
        for (let i = 0; i < arr.length; i++) {
            arr[i].classList.remove("seq-HoverNoStyle3")
            arr[i].classList.remove("seq-HoverNoStyle")
        }

        for (let i = 0; i < request.data.length; i++) {
            const el = request.data[i];
            var arrlist = []
            let x = getElementByXpath(el.xpath, document)
            if (!x) {
                x = queryShadow(splitSelector(el.xpath))
                if (x) {
                    arrlist.push(x)
                    isshadow = true
                }
            }
            var nodesSnapshot = document.evaluate(el.xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var j = 0; j < nodesSnapshot.snapshotLength; j++) {

                arrlist.push((nodesSnapshot.snapshotItem(j)))
            }
            if (x) {
                for (let j = 0; j < arrlist.length; j++) {
                    const element = arrlist[j];
                    x = element
                    var doc = document
                    if (isshadow == true) {
                        doc = element.getRootNode()
                        element.setAttribute("isshadow", "true")
                    }

                    let elOverlay = document.createElement("div");
                    elOverlay.className = "seq-showing" + i;
                    elOverlay.setAttribute("xpath", el.xpath)
                    elOverlay.setAttribute("isshadowo", isshadow)
                    elOverlay.setAttribute("isExclude", el.isExclude)
                    var dims = x.getBoundingClientRect()
                    var topp = dims.top + window.scrollY
                    var leftt = dims.left + window.scrollX
                    if (isshadow) {
                        var doc = element.getRootNode()

                        let rel = getRelative(doc.host || doc.getRootNode().host)
                        if (rel.result) {
                            topp -= rel.top
                            leftt -= rel.left
                        }
                    }

                    let obj = `                
                height: ${dims.height}px;
                top: ${topp}px;
                left: ${leftt}px;
                width: ${dims.width}px;
                bottom: ${dims.bottom}px;       
                z-index: 9999980;
                position: absolute;  
                opacity:0.4 !important;
                background-color: ${el.isExclude ? "#faef89" : " #5248F9"} !important;   
            `
                    elOverlay.style.cssText = obj
                    if (window.top == window.self)
                        document.querySelector("#OmitedPar").addEventListener("mouseenter", function () {
                            let arr = document.querySelectorAll("[class*='seq-showing']")
                            for (let i = 0; i < arr.length; i++) {
                                arr[i].classList.remove("seq-Hoverdisplaynone")
                                var arrlist = []
                                if (arr[i].getAttribute("isshadowo") == "true") {
                                    var shadowSelected = queryShadow(splitSelector(arr[i].getAttribute("xpath")))
                                    if (shadowSelected) {
                                        arrlist.push(shadowSelected)
                                    }
                                }
                                var nodesSnapshot = document.evaluate(arr[i].getAttribute("xpath"), document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                                for (var j = 0; j < nodesSnapshot.snapshotLength; j++) {
                                    arrlist.push((nodesSnapshot.snapshotItem(j)))
                                }
                                for (let j = 0; j < arrlist.length; j++) {
                                    const element = arrlist[j];
                                    element.classList.remove("seq-HoverNoStyle")
                                }
                            }
                        })
                    if (window.top == window.self)
                        document.querySelector("#OmitedPar").addEventListener("mouseleave", function (e) {
                            //xpath
                            let arr = document.querySelectorAll("[class*='seq-showing']")
                            for (let i = 0; i < arr.length; i++) {
                                arr[i].classList.add("seq-Hoverdisplaynone")
                                var arrlist = []
                                if (arr[i].getAttribute("isshadowo") == "true") {
                                    var shadowSelected = queryShadow(splitSelector(arr[i].getAttribute("xpath")))
                                    if (shadowSelected) {
                                        arrlist.push(shadowSelected)
                                    }
                                }
                                var nodesSnapshot = document.evaluate(arr[i].getAttribute("xpath"), document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                                for (var j = 0; j < nodesSnapshot.snapshotLength; j++) {
                                    arrlist.push((nodesSnapshot.snapshotItem(j)))
                                }
                                for (let j = 0; j < arrlist.length; j++) {
                                    const element = arrlist[j];
                                    element.classList.add("seq-HoverNoStyle")
                                }

                            }

                        })



                    document.querySelector("body").appendChild(elOverlay);

                }
            }

        }
        try {


            let obj = `                
    height: ${0}px;
    left: ${0}px;
    right: ${0}px;
    top: ${0}px;
    width: ${0}px;
    bottom: ${0}px;       
    z-index: -1;
    position: absolute;  
    opacity:0.4 !important;
    background-color: ${document.querySelector(".seq-overlay").getAttribute("color")} !important;   
    `
            document.querySelector(".seq-overlay").style.cssText = obj
        } catch (error) {
            // console.log(1);
            return
        }



    }
    if (request.message == "previewelem") {
        var a = getElementByXpath(request.data, document)
        if (!a) {
            return
        }
        let cloned = document.cloneNode(true)

        for (let i = 0; i < request.xparr.length; i++) {
            const element = request.xparr[i];
            getElementByXpath(element.xpath, cloned)?.remove()
        }

        a = getElementByXpath(request.data, cloned)
        let x = a.querySelectorAll("*")
        for (let i = 0; i < x.length; i++) {
            const element = x[i];
            let y = getSelector(element)
            var ELL
            try {
                ELL = document.querySelector(y)
            } catch (error) {
                console.log(error);
                continue
            }
            if (request.selectedAttribute == "Text" && y.indexOf("=") == -1 && getComputedStyle(ELL).display === "none") {
                element.remove()
            }
        }
        if (a && cloned) {
            let returned
            if (request.selectedAttribute == "Text") {
                returned = a.innerText?.trim()
            }
            else if (request.selectedAttribute == "Inner HTML") {
                returned = a.innerHTML?.trim()
            }
            else if (request.selectedAttribute == "HTML") {
                returned = a.outerHTML?.trim()
            }
            else if (request.selectedAttribute == "Unique ID") {
                returned = a.id
            }
            else if (request.selectedAttribute == "Image URL") {
                returned = a.src
            }
            else if (request.selectedAttribute == "URL") {
                returned = a.href
            }
            else if (request.selectedAttribute == "Default URL") {
                returned = a.href
            }
            else if (request.selectedAttribute == "URAudio URLL") {
                returned = a.src
            }
            else if (request.selectedAttribute == "URAudio URLL") {
                returned = a.src
            }
            else {
                returned = a.getAttribute(request.selectedAttribute)
            }
            // if (window.top == window.self)
            chrome.runtime.sendMessage({
                message: "previewelemseque",
                data: returned
            });

            // document.querySelector("#OmitedPar iframe").contentWindow.window.postMessage(
            //     ,
            //     "*"
            // );

        }



    }
    if (request.message == "doneRevomeOverlay") {

        var allelems2 = document.querySelectorAll("body,body *");
        removeAllOverlays(allelems2);

        // document.querySelector(".seq-overlay").remove()
        // var allelems1 = document.querySelectorAll("*")
        // for (let i = 0; i < allelems1.length; i++) {
        //     const element = allelems1[i];
        //     element.classList.remove("seq-border")
        // }
        // document.querySelector(".seq-Hover").classList.remove("seq-Hover")
        // document.querySelector(".seq-HoverNoStyle").classList.remove("seq-HoverNoStyle")

    }
    if (request.message == "removeOutline") {

        let arr = document.querySelectorAll("[class*='seq-showing']")
        removeOutline(arr);

    }
    if (request.message == "putBackOutline") {

        let arr = document.querySelectorAll("[class*='seq-showing']")
        putBackOutline(arr);

    }
    return true;
})

window.addEventListener("scroll", function () {
    window.postMessage(
        {
            message: "displaySelected",
            data: lastSaved
        },
        "*"
    );
});
window.addEventListener("resize", function () {
    window.postMessage(
        {
            message: "displaySelected",
            data: lastSaved
        },
        "*"
    );
});

// setInterval(() => {
//     dragElement(document.getElementById("OmitedPar"));
// }, 1000);
var xy1 = setInterval(() => {
    if (document.querySelector("#ExtensionOmitedBox , .ExtensionOmitedBox")) {
        // clearInterval(xy1)
        // var xy2 = setInterval(() => {
        if (document.querySelector("#addMonitor , .addMonitor")) {
            let el = document.querySelector("#addMonitor , .addMonitor")
            let obj = {
                action: "addMonitor",
                collection: el.getAttribute("collection"),
                url: el.getAttribute("url")
            }
            el.remove()
            chrome.runtime.sendMessage({ message: "openurl", obj: obj })
        }
        // }, 500);
        // var xy3 = setInterval(() => {
        if (document.querySelector("#editMonitor , .editMonitor")) {
            let el = document.querySelector("#editMonitor , .editMonitor")
            let obj = {
                action: "editMonitor",
                monitorId: el.innerText,
                collection: el.getAttribute("collection"),
                url: el.getAttribute("url")
            }
            el.remove()
            chrome.runtime.sendMessage({ message: "openurl", obj: obj })
        }
        // }, 500);
        document.querySelector("#ExtensionOmitedBox , .ExtensionOmitedBox").remove()
    }
}, 500);




function startPickingGlob(x, request) {
    for (let i = 0; i < x.length; i++) {
        const element = x[i];
        if (element.shadowRoot) {
            var y = element.shadowRoot.querySelectorAll("*")
            startPickingGlob(y, request)
            startPickingF(request, element.shadowRoot, true);
        }
    }

}

function startPickingF(request, doc, isshadow) {
    var a;
    if (String(request.isExclude) == "true") {
        if (isshadow) {
            a = queryShadow(splitSelector(request.main))
        } else {
            a = getElementByXpath(request.main, doc);
        }

    } else {
        a = doc.body;
    }

    //remove any existing overlay
    doc.querySelector(".seq-Hover")?.classList?.remove("seq-Hover");
    doc.querySelector(".seq-HoverNoStyle")?.classList?.remove("seq-HoverNoStyle");
    doc.querySelector(".seq-border")?.classList?.remove("seq-border");

    (doc?.body || doc)?.classList?.add("seq-Hover");
    a?.classList?.add("seq-HoverNoStyle");
    a?.classList?.add("seq-border");
    ///
    doc.querySelector(".seq-overlay")?.remove();
    let el3 = document.createElement("div");
    el3.className = "seq-overlay";
    (doc?.body || doc)?.appendChild(el3);
    doc.querySelector(".seq-overlay").setAttribute("color", request.color);
    doc.querySelector(".seq-overlay").setAttribute("isexclude", request.isExclude);
    doc.querySelector(".seq-overlay").setAttribute("new", request.new);
    doc.querySelector(".seq-overlay").setAttribute("oldxpath", request.oldxpath);
    doc.querySelector(".seq-overlay").setAttribute("main", request.main);
    var gxpath1 = "";
    var gxpath2 = "";
    // selecting a list function
    function getlist(doc) {
        var el = doc.querySelector(".seq-border");
        //first element xpath
        gxpath1 = getXPathForElementList(el);

        doc.querySelector(".seq-overlay").removeEventListener("click", yes, true);

        doc.querySelector(".seq-overlay").addEventListener("click", function () {
            var el = doc.querySelector(".seq-border");
            gxpath2 = getXPathForElementList(el);
        }, true);
        var xinterval1 = setInterval(() => {
            if (gxpath2 != "" && gxpath1 != "") {
                clearInterval(xinterval1);

                console.log(gxpath1);
                console.log(gxpath2);
                //get difference between two selected xpaths and generate the xpath that matches both elements
                var x = patienceDiff(gxpath1.split(""), gxpath2.split(""));
                var xpath = x.lines.filter(e => e.bIndex != -1 && e.aIndex != -1).map(e => e.line).join("").replace("[]", "");
                console.log(xpath);
                // send a message to open the popup
                chrome.runtime.sendMessage({
                    message: 'openit',
                });
                var el = doc.querySelector(".seq-border");
                var ele = el;
                //generate a name for the selected element
                var newGeneratedName = generateAName(ele, request);

                // check if an element is static
                var stat = getElementByXpath(getXPathForElement(el), initialDoc).outerHTML == el.outerHTML.replaceAll(' Omitedhoveron="true"', "").replaceAll(' class="seq-border"', "").replaceAll('seq-border ', "").replaceAll(' seq-border', "") ? true : false
                // var stat = el.outerHTML == el.outerHTML.replaceAll(' Omitedhoveron="true"', "").replaceAll(' class="seq-border"', "").replaceAll('seq-border ', "").replaceAll(' seq-border', "") ? true : false;
                

                chrome.runtime.sendMessage({
                    message: "picked",
                    xpath: xpath,
                    isList: true,
                    name1: ele.innerText.trim() != "" ? ele.innerText.substr(0, 20).trim() : (ele.tagName.toLowerCase() + " " + ele.alt).replace(" undefined", ""),
                    name: newGeneratedName,
                    isExclude: doc.querySelector(".seq-overlay").getAttribute("isexclude"),
                    new: doc.querySelector(".seq-overlay").getAttribute("new"),
                    oldxpath: doc.querySelector(".seq-overlay").getAttribute("oldxpath"),
                    static: stat,
                });

                // doc.querySelector("#OmitedPar iframe").contentWindow.window.postMessage(, "*")
                chrome.runtime.sendMessage({
                    message: "doneRevomeOverlay",
                });
                chrome.runtime.sendMessage({
                    message: "displaySelected",
                    data: [
                        {
                            "name": "RandomIDForDisplay595165",
                            "xpath": xpath,
                            "isExclude": doc.querySelector(".seq-overlay").getAttribute("isexclude") == "true"
                        }
                    ],
                });

            }
        }, 200);

    }
    function yes() { getlist(doc) }
    if (request.type == "list") {

        doc.querySelector(".seq-overlay").addEventListener("click", yes, true);



    } else {



        doc.querySelector(".seq-overlay").addEventListener("click", function (e) {
            if (e.shiftKey == true) {
                getlist(doc);
                return;
            }
            if (gxpath1 != "") {
                return;
            }

            // event.stopPropagation();
            // doc.querySelector("#OmitedPar").style.display = "block"
            chrome.runtime.sendMessage({
                message: 'openit',
            });

            var el = doc.querySelector(".seq-border");
            var link
            var clickToDownload
            if (request.download) {
            // document download is selected
                link = el.href
                try {
                    // check if the selected element has a static link
                    clickToDownload = checkFile(link) ? false : true
                } catch (error) {
                    while (el.parentElement) {
                        // check if the selected element's parent has a static link
                        link = el.parentElement.href
                        try {
                            clickToDownload = checkFile(link) ? false : true
                            el = el.parentElement
                            break
                        } catch (error) {
                            el = el.parentElement
                            clickToDownload = true
                        }
                    }
                    clickToDownload = true
                }
            }
            var ele = el;
            //generate a name for the selected element 
            var newGeneratedName = generateAName(ele, request);

            // check if an element is static
            var stat = getElementByXpath(getXPathForElement(el), initialDoc).outerHTML == el.outerHTML.replaceAll(' Omitedhoveron="true"', "").replaceAll(' class="seq-border"', "").replaceAll('seq-border ', "").replaceAll(' seq-border', "") ? true : false
            // var stat = el.outerHTML == el.outerHTML.replaceAll(' Omitedhoveron="true"', "").replaceAll(' class="seq-border"', "").replaceAll('seq-border ', "").replaceAll(' seq-border', "") ? true : false;


            var xpath = getXPathForElement(el)


            chrome.runtime.sendMessage({
                message: "picked",
                xpath: xpath,
                name1: ele.innerText.trim() != "" ? ele.innerText.substr(0, 20).trim() : (ele.tagName.toLowerCase() + " " + ele.alt).replace(" undefined", ""),
                name: newGeneratedName,
                isExclude: this.getAttribute("isexclude"),
                new: this.getAttribute("new"),
                oldxpath: this.getAttribute("oldxpath"),
                static: stat,
                download: request.download,
                clickToDownload
            });

            // doc.querySelector("#OmitedPar iframe").contentWindow.window.postMessage(, "*")

            // remove overlays from all elements
            chrome.runtime.sendMessage({
                message: "doneRevomeOverlay",
            });
            //display the recent selected element
            chrome.runtime.sendMessage({
                message: "displaySelected",
                data: [
                    {
                        "name": "RandomIDForDisplay595165",
                        "xpath": xpath,
                        "isExclude": this.getAttribute("isexclude") == "true"
                    }
                ],
            });

        }, true);
    }
    // a parameter to delete the overlays
    if (request.deleteIt) {
    } else {
        let arr = doc.querySelectorAll("[class*='seq-showing']");
        for (let i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
    }
    var allelems = doc.querySelectorAll(".seq-Hover *:not([Omitedhoveron])");
    // inject the event in all elements
    placeEvent(allelems, isshadow);
}


function placeEvent(allelems, isshadow) {
    for (let i = 0; i < allelems.length; i++) {
        const element = allelems[i];
        var doc = document
        //if element is a shadow element, append an attribute to identify it
        if (isshadow == true) {
            doc = element.getRootNode()
            element.setAttribute("isshadow", "true")
        }
        //if element has a shadow root, reexecute the function inside the shadow root
        if (element.shadowRoot) {
            let el5 = document.createElement("style");
            el5.innerHTML += `.seq-Hover {    cursor: crosshair;}.seq-Hover {}.seq-Hover a {    // pointer-events: none;}a.seq-Hover {    // pointer-events: none;}.seq-HoverNoStyle {}.seq-HoverNoStyle2 {    outline: 5px solid #faef8988 !important;    outline-offset: -5px;}.seq-HoverNoStyle3 {    outline: 5px solid #5248F988 !important;    outline-offset: -5px;}.seq-Hoverdisplaynone {    display: none !important;;}.seq-Hover .seq-border {    /*opacity:0.4 !important;    background-color: red !important;*/}.seq-Hover #seq-Hover-btn {    cursor: pointer;}.resizable {  }    .resizable .resizers{    width: 100%;    height: 100%;    border: 3px solid #4286f4;    box-sizing: border-box;  }    .resizable .resizers .resizer{    border-radius: 0%; /*magic to turn square into circle*/    background: white;    border: 0px solid #4286f4;    position: absolute;  }    .resizer.top {    height: 5px;    width: 100%;    left:0%;    top: 0px;    cursor: ns-resize;    transform: translate(0px, 0px);    position: absolute;    z-index: 2;  }    .resizer.right {    width: 5px;    height: 100%;    right: 0px;    bottom: 0%;    cursor: ew-resize;    transform: translate(0px, 0px);    position: absolute;  }    .resizer.bottom {    height: 5px;    width: 100%;    left: 0%;    bottom: 0px;    cursor: ns-resize;    transform: translate(0px, 0px);    position: absolute;  }    .resizer.left {    width: 5px;    height: 100%;    left: 0px;    bottom: 0%;    cursor: ew-resize;    transform: translate(0px, 0px);    position: absolute;  }`;
            element.shadowRoot.appendChild(el5)
            var x = element.shadowRoot.querySelectorAll("*")
            placeEvent(x, true)

        }

        element.setAttribute("Omitedhoveron", "true");
        // mouse is hovering on an element
        element.addEventListener("mousemove", function Sekk(event) {
            //inject styles in shadow elements
            event.stopPropagation();
            if (!event.target.getRootNode().querySelector("style")) {
                let el5 = document.createElement("style");
                el5.innerHTML += `.seq-Hover {    cursor: crosshair;}seq-Hover {}.seq-Hover a {    // pointer-events: none;}a.seq-Hover {    // pointer-events: none;}.seq-HoverNoStyle {}.seq-HoverNoStyle2 {    outline: 5px solid #faef8988 !important;    outline-offset: -5px;}.seq-HoverNoStyle3 {    outline: 5px solid #5248F988 !important;    outline-offset: -5px;}.seq-Hoverdisplaynone {    display: none !important;;}.seq-Hover .seq-border {    /*opacity:0.4 !important;    background-color: red !important;*/}.seq-Hover #seq-Hover-btn {    cursor: pointer;}.resizable {  }    .resizable .resizers{    width: 100%;    height: 100%;    border: 3px solid #4286f4;    box-sizing: border-box;  }    .resizable .resizers .resizer{    border-radius: 0%; /*magic to turn square into circle*/    background: white;    border: 0px solid #4286f4;    position: absolute;  }    .resizer.top {    height: 5px;    width: 100%;    left:0%;    top: 0px;    cursor: ns-resize;    transform: translate(0px, 0px);    position: absolute;    z-index: 2;  }    .resizer.right {    width: 5px;    height: 100%;    right: 0px;    bottom: 0%;    cursor: ew-resize;    transform: translate(0px, 0px);    position: absolute;  }    .resizer.bottom {    height: 5px;    width: 100%;    left: 0%;    bottom: 0px;    cursor: ns-resize;    transform: translate(0px, 0px);    position: absolute;  }    .resizer.left {    width: 5px;    height: 100%;    left: 0px;    bottom: 0%;    cursor: ew-resize;    transform: translate(0px, 0px);    position: absolute;  }`;
                event.target.getRootNode().appendChild(el5)
            }

            //shadow roots dont have a body element, so we add these classes manually
            if (event.target.ownerDocument.querySelector("body.seq-Hover.seq-HoverNoStyle")) {
                if (event.target.getAttribute("isshadow") == "true") {
                    if (event.target.parentElement) {
                        event.target.parentElement.classList.add("seq-Hover")
                        event.target.parentElement.classList.add("seq-HoverNoStyle")

                    } else {
                        event.target.classList.add("seq-Hover")
                        event.target.classList.add("seq-HoverNoStyle")

                    }

                }
            }
            if (!doc.querySelector(".seq-Hover") || this.tagName == "IFRAME") {
                return;
            }
            let x = checkParentsClass(this, "seq-HoverNoStyle");
            if (x == false) {
                return;
            }

            // a counter when one hovers over an iframe
            if (window.top == window.self) {
                if (window.hoveringOverIframe) {
                    window.hoveringOverIframe++;
                    if (window.hoveringOverIframe < 20) {
                        return;
                    }
                }
            }
            if (window.top != window.self) {
                window.top.postMessage(
                    {
                        message: "hoveringOverIframe=0",
                    },
                    "*"
                );

            }
            doc.querySelector(".seq-overlay").style.display = "block";

            // a counter when one hovers over the overlay
            counter++;
            var el = doc.querySelector(".seq-border");
            if (this.className.indexOf("seq-overlay") != -1) {
                if (counter < 20) {
                    return;
                }
                counter = 0;
                doc.querySelector(".seq-overlay").style.zIndex = "-1";

            } else {
                var allelems2 = document.querySelectorAll("body,body *");
                // remove the class from other elements and append it to the selected element
                removeclassforall(allelems2, "seq-border");
                this.classList.add('seq-border');

                // get the dimentions of the element
                var dims = this.getBoundingClientRect();
                var topp = dims.top + window.scrollY
                var leftt = dims.left + window.scrollX
                if (isshadow) {
                    let rel = getRelative(doc.host || doc.getRootNode().host)
                    if (rel.result) {
                        topp -= rel.top
                        leftt -= rel.left
                    }
                }

                let obj = `                
                            height: ${dims.height}px;
                            top: ${topp}px;
                            left: ${leftt}px;
                            width: ${dims.width}px;
                            z-index: 9999980;
                            position: absolute;  
                            opacity:0.4 !important;
                            background-color: ${doc.querySelector(".seq-overlay").getAttribute("color")} !important;   
                        `;
                doc.querySelector(".seq-overlay").setAttribute("thisxpath", getXPathForElement(el));

                // this allows the overlay to be placed above the element
                doc.querySelector(".seq-overlay").style.cssText = obj;


            }
            // return false;
        }, false);

    }
}

// select inside shadow element
function queryShadow(selectors) {
    var x
    var doc = document
    selectors[0] = "/" + selectors[0]
    selectors.forEach(e => {
        x = getElementByXpath("./" + e, doc)
        if (x) {
            doc = x
        } else if (doc.shadowRoot) {
            doc = doc.shadowRoot
            x = doc.querySelector(xPathToCss("./" + e))
            if (x) {
                doc = x
            } else {
                return null
            }
        } else {
            return null
        }
    });
    return x
}