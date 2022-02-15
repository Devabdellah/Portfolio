function fillValue(element, value) {
    (element = getElementByXpath(element)) && (dispatchev(element, "focus", false, false), element.value = value, dispatchev(element, "change", true, false), dispatchev(element, "blur", false, false))
}
function dispatchev(element, event, state1, state2) {
    var ev = element.ownerDocument.createEvent("Event");
    ev.initEvent(event, state1, state2), element.dispatchEvent(ev)
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function fillSelect(elem1, elem2, callback) {
    var elem = getElementByXpath(elem1);
    if (elem == null) {
        "function" == typeof callback && setTimeout(callback, 500)
        return
    }
    elem.scrollIntoView(), elem.click();
    var counter = 0,
        temp = setInterval(function () {
            counter++, (elem = getElementByXpath(elem2)) && elem.click(), (elem || 5 < counter) && (clearInterval(temp), "function" == typeof callback && setTimeout(callback, 500))
        }, 100)
}
function fillBrand() {
    fillValue(".//div[@role='form']//label//span[text()='Brand']/following-sibling::input", globalfacebookfill.Brand)
}
function fillCondition() {
    fillSelect(".//div[@role='form']//label//span[text()='Condition']//ancestor::span/following-sibling::div[@id]/div", ".//div[@role='menu']//div[@data-visualcompletion and ancestor-or-self::div[@role='menuitemradio']//span[text()='" + globalfacebookfill.condition + "']]", fillBrand)
}
fillSelect2 = function (e) {
    var n = getElementByXpath(e.select);
    if (n) {
        if ((n.scrollIntoView(), e.value)) n.value = e.value;
        else if (e.option)
            for (var i = new RegExp(e.option, "i"), o = 0; o < n.length; o++)
                if (i.test(n[o].innerText)) {
                    n.selectedIndex = o;
                    break;
                }
        s(n, "change", !0, !1);
    }

}
function addImages(images) {
    var e = document.querySelector('input[type="file"]#upl-fileInp');
    if (!(images.length < 1) && e) {
        for (var t = new DataTransfer, n = 0; n < images.length; n++) {
            for (var o = images[n], r = atob(o.substr(o.indexOf(",") + 1)), i = new Array(r.length), a = 0; a < i.length; a++) i[a] = r.charCodeAt(a);
            var l = new Uint8Array(i),
                c = new Blob([l], {
                    type: "image/jpeg"
                }),
                o = {
                    type: c.type,
                    size: c.size
                },
                l = "f-" + c.size + "-" + n + ".jpg";
            t.items.add(new File([c], l, o))
        }
        e.files = t.files,
            dispatchev(e, "change", true, false)
    }
}
var globalfacebookfill = undefined
function fillEbay(obj) {

    globalfacebookfill = obj
    addImages(globalfacebookfill.imageslinksarr)
    fillValue("(id('editpane_title'))[1]", globalfacebookfill.Title.substr(0, 99))
    fillValue("(id('upc'))[1]", "Does not apply")
    fillValue("id('binPrice')", globalfacebookfill.Price)
    var i = document.querySelector("[id$=_switchLnk] > a.std-lnk")
    var o = document.querySelector("[id$=_switchLnk] > a.htm-lnk")
    var e = document.querySelector("iframe[id$='txtEdit_ht']")
    o && i && e && (i.click(), (e.contentWindow.document.body.innerText = globalfacebookfill.productDescription.replace(/\n/g, "<br/>")), o.click())
    fillSelect2({ "select": "(id('itemCondition'))[1]", "option": globalfacebookfill.condition })
    fillSelect2({"select": "id('format')","value": "FixedPrice"})
}
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "fillEbay") {
            fillEbay(request.data)
        }
        if (request.message == "unhidetools") {
            if (document.querySelector("body").querySelector("#dstitanshelper")) {
                document.querySelector("body").querySelector("#dstitanshelper").style.display = "block"
            }
        }

    }
);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function PullByKey(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, data => {
            resolve(data)
        })

    })
}
function SetByKey(key, data) {
    chrome.storage.local.set({
        [key]: data
    })
}



function getJsonFromString(str1) {
    if (str1 == undefined) {
        return str1
    }
    var errore = true
    var str3 = str1.substr(str1.indexOf('{"require"'))
    var str2 = str3.substr(0, str3.lastIndexOf('}') + 1)
    while (errore) {


        try {
            errore = false
            JSON.parse(str3.substring(0, str2.length + 1))
        } catch (error) {
            str2 = str2.substr(0, str2.lastIndexOf('}'))
            errore = true
            if (str2.length == 0) {
                errore = false
            }
        }
    }

    return str2.length == 0 ? undefined : JSON.parse(str3.substring(0, str2.length + 1))
}


function getElementByXpath(path, elem) {
    return document.evaluate(path, elem ? elem : document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}




// getJsonFromString(getElementByXpath(`.//script[text()[contains(.,'shippedOrderSummaries')]]`, document)?.innerText)?.require[0][3][1]?.__bbox?.result?.data?.viewer?.order_management