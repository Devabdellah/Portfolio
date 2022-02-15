async function ScanIt(dataDoc, InputtedASIN) {
    return new Promise(async (resolve, reject) => {
        if (document.URL.includes("amazon.com")) {


            var link = location.href
            InputtedASIN = link.substring(link.indexOf("dp/") + 3, link.indexOf("dp/") + 3 + 10)




            var productTitle = "";

            productTitle = dataDoc.querySelector('#productTitle')

            if (productTitle != null)
                productTitle = productTitle.innerText.trim();


            var BSRdiv = dataDoc.querySelector('#SalesRank');
            var BSR;
            var OfferRank;
            if (BSRdiv == null) {

                BSRdiv = [...dataDoc.querySelectorAll('th')].find(e => e.innerText.includes('Best Sellers Rank'))

                if (BSRdiv == null) {

                } else {
                    BSRdiv = BSRdiv.nextElementSibling
                }
            }
            if (BSRdiv == null) {

                BSRdiv = [...dataDoc.querySelectorAll('ul')].find(e => e.innerText.includes('Best Sellers Rank'))


            }

            if (BSRdiv == null) {

                BSRdiv = [...dataDoc.querySelectorAll('ul')].find(e => e.innerText.includes('Best-sellers rank'))

                if (BSRdiv == null) {
                    OfferRank = 0
                }

            }
            if (OfferRank != 0) {


                BSR = BSRdiv.innerText;

                OfferRank = BSR.substring(BSR.indexOf("#") + 1, BSR.indexOf(" in ")).replace(/,/g, '');

            }











            var BRAND = "";

            BRAND = dataDoc.querySelector('#bylineInfo')

            if (BRAND != null) {
                BRAND = BRAND.innerText.replace('Visit the ', '').replace('Brand: ', '');
                if (BRAND.replace(/\n/g, "").indexOf('by') == 0) {
                    BRAND = BRAND.replace(/\n/g, "").substring(BRAND.replace(/\n/g, "").lastIndexOf(' Author ')).replace(' Author ', "")
                }
            }






            var OfferCat;


            OfferCat = dataDoc.querySelector('div#wayfinding-breadcrumbs_container ul li span.a-list-item a[href]');

            if (OfferCat != null)
                OfferCat = OfferCat.innerText.trim();
            else {

                if (BSR != null) {
                    var kin = BSR.indexOf(" (");

                    if (kin == -1)
                        kin = BSR.indexOf(">")

                    if (kin != -1) {


                        OfferCat = BSR.substring(BSR.indexOf(" in ") + 4, kin).trim();
                    }
                }


                if (OfferCat == null)
                    OfferCat = "undefined"
            }




            var feature_bullets = document.querySelector("#feature-bullets>ul");
            if (feature_bullets) {
                feature_bullets = feature_bullets.innerText
            }
            var productDescription = document.querySelector("#productDescription>p");
            // productDescription && (productDescription = productDescription.innerText), productDescription = feature_bullets, feature_bullets && productDescription && (productDescription += "\n\n"), productDescription += productDescription
            if (productDescription) {
                productDescription = productDescription.innerText
                productDescription += feature_bullets
            }else{
                productDescription = feature_bullets
            }
            var price = document.getElementById("newBuyBoxPrice")
            if (price == null) {
                price = document.getElementById("priceblock_saleprice")
            }
            if (price == null) {
                price = document.getElementById("priceblock_ourprice")
            }
            if (price == null) {
                price = document.querySelector("span.a-color-price[id^='priceblock_'")
            }
            if (price == null)
                price = document.querySelector('.a-lineitem .apexPriceToPay span')
            if (price == null)
                price = document.querySelector(".a-price-whole")
            if (price == null) {

                Price = "0";

            } else {

                try {

                    price = price.innerText.replace(/[^\d\.]+/g, "")

                } catch (e) {

                    price = "0";
                }
            }



            var imageslinksarr
            imageslinksarr = getimages()




            // var ship = document.querySelector("#exports_desktop_qualifiedBuybox_tlc_feature_div, #deliveryBlock_feature_div, #deliveryMessageMirId");
            // (ship = ship.innerText.match(/\$([\d\.]+)\s(Shipp(?:ing|ed)|delivery)/i) && ship) &&
            // ("shipped" == ship[2].toLowerCase() ? ship = -1 : ship = parseFloat(ship[1]))

            var ship = document.querySelector("#exports_desktop_qualifiedBuybox_tlc_feature_div, #deliveryBlock_feature_div, #deliveryMessageMirId");
            (ship = ship && ship.innerText.match(/\$([\d\.]+)\s(Shipp(?:ing|ed)|delivery)/i)) && ("shipped" == ship[2].toLowerCase() ? ship = -1 : ship = parseFloat(ship[1]));


            linktobase64(imageslinksarr, async function (base64) {
                imageslinksarr = base64
                var dataStorage = await PullByKey(null)
                if (dataStorage.activation == true) {
                    if (ship != -1) {
                        price = Number(price) + Number(ship)

                    } else {
                        price = Number(price) + Number(dataStorage.shipping)
                    }
                }
                price = Number(price) + Number(price) * (Number(dataStorage.price) / 100)

                var n = dataStorage.description;
                (n = n.replace(/\[([A-Z]+)\]/g, function (e, t) {
                    switch (t) {
                        case "TITLE":
                            return productTitle;
                        case "PRICE":
                            return price;
                        case "DESCRIPTION":
                            return productDescription;
                        default:
                            return e
                    }
                }))
                productDescription = n;

                var obj = {
                    productDescription,
                    feature_bullets,
                    ASIN: InputtedASIN,
                    imageslinksarr: imageslinksarr,
                    Title: productTitle || "",
                    Price: price,
                    Brand: BRAND,
                    Category: OfferCat,
                    shipping: ship,
                    condition: dataStorage.condition || ""
                }
                // condition
                // description
                // feature_bullets
                // images
                // price
                // shipping
                // title
                console.log(obj)
                resolve(obj);
            })

        } else if (document.URL.includes("walmart.com")) {


            var link = location.href
            InputtedASIN = "-"

            var productTitle = "";

            productTitle = document.querySelector('.prod-ProductTitle , section h1[itemprop="name"]');

            if (productTitle != null)
                productTitle = productTitle.innerText.trim();

            var BRAND = document.querySelector('.prod-brandName , section [itemprop="brand"]');

            if (BRAND) {
                BRAND = BRAND.innerText
            } else {
                BRAND = ""
            }
            var OfferCat;
            OfferCat = document.querySelector('[data-automation-id="breadcrumb-item-0"] , section [itemprop="name"]');
            if (OfferCat != null)
                OfferCat = OfferCat.innerText.trim();
            else {
                OfferCat = "-"
            }
            var feature_bullets = document.querySelector(".about-desc.about-product-description , .about-item-collapsable-features");
            if (feature_bullets) {
                feature_bullets = feature_bullets.innerText
            } else {
                var feature_bullets = document.querySelectorAll('[data-testid="product-description"] span.lh-title');
                if (feature_bullets.length > 0) {
                    var ee = [...document.querySelectorAll('[data-testid="product-description"] span.lh-title')]
                    var rr = ""
                    ee.forEach(e => rr += e.innerText + "\n")
                    rr
                    feature_bullets = rr
                } else {
                    feature_bullets = undefined
                }
            }
            var productDescription = undefined
            var productDescription1 = ""
            var productDescription2 = ""
            productDescription && (productDescription1 = productDescription.innerText), productDescription2 = feature_bullets, feature_bullets && productDescription1 && (productDescription2 += "\n\n"), productDescription2 += productDescription1
            productDescription = productDescription2
            var price = document.querySelector(".price-group , [itemprop='price']")
            if (price) {
                price = price.innerText.replace(/[^\d\.]+/g, "")
            } else {
                price = document.querySelector(".price-characteristic")
                if (price) {
                    price = document.querySelector(".price-characteristic").getAttribute("content")
                } else
                    price = "0"
            }
            if (price != "0") {
                price = Math.ceil(price)
            }

            var imageslinksarr
            imageslinksarr = getimagesWalmart()
            var ship = document.querySelector("#product-overview .fulfillment-shipping-text");
            (ship = ship && ship.innerText.split("\n")[0].match(/([\d\.]+)(\+|\sdelivery)/i)) && ("+" == ship[2] ? ship = -1 : ship = parseFloat(ship[1]));
            if (ship == null) {
                ship = document.querySelector("#product-overview .fulfillment-shipping-text");
                (ship = ship && ship.innerText.split("\n")[0].match(/(Free)/i) && ship.innerText.split("\n")[0].match(/(delivery)/i)) ? ship = -1 : ship = -1;
            }


            linktobase64(imageslinksarr, async function (base64) {
                imageslinksarr = base64
                var dataStorage = await PullByKey(null)
                if (dataStorage.activation == true) {
                    if (ship != -1) {
                        price = Number(price) + Number(ship)

                    } else {
                        price = Number(price) + Number(dataStorage.shipping)
                    }
                }
                price = Number(price) + Number(price) * (Number(dataStorage.price) / 100)

                var n = dataStorage.description;
                (n = n.replace(/\[([A-Z]+)\]/g, function (e, t) {
                    switch (t) {
                        case "TITLE":
                            return productTitle;
                        case "PRICE":
                            return price;
                        case "DESCRIPTION":
                            return productDescription;
                        default:
                            return e
                    }
                }))
                productDescription = n;

                var obj = {
                    productDescription,//
                    feature_bullets,//
                    ASIN: InputtedASIN,//
                    imageslinksarr: imageslinksarr,//
                    Title: productTitle || "",//
                    Price: price,//
                    Brand: BRAND,//
                    Category: OfferCat,//
                    shipping: ship,
                    condition: dataStorage.condition || ""//
                }
                // condition
                // description
                // feature_bullets
                // images
                // price
                // shipping
                // title
                console.log(obj)
                resolve(obj);
            })


        } else if (document.URL.includes("homedepot.com")) {

            var info = parsejson(document.querySelector('[type="application/ld+json"]').innerText)
            if (true) {
                var link = location.href
                InputtedASIN = "-"
                var productTitle = "";
                productTitle = document.querySelector(".grid[name='zone-a'] h1.product-details__title")
                if (productTitle != null)
                    productTitle = productTitle.innerText.trim();

                var BRAND = document.querySelector('.product-details__brand--link')

                if (BRAND) {
                    BRAND = BRAND.innerText
                } else {
                    BRAND = ""
                }
                var OfferCat;
                OfferCat = document.querySelector('[class*="breadcrumb__item"]')
                if (OfferCat != null)
                    OfferCat = OfferCat.innerText.trim();
                else {
                    OfferCat = "-"
                }
                var feature_bullets = document.querySelector('[class*="main-description"]')
                var k = 0
                while (feature_bullets == null) {
                    k += 200
                    window.scroll({
                        top: k,
                        behavior: 'smooth'
                    });
                    await sleep(1000)
                    feature_bullets = document.querySelector('[class*="main-description"]')
                }
                if (feature_bullets) {
                    feature_bullets = feature_bullets.innerText
                } else {
                    feature_bullets = ""
                }
                var productDescription = undefined
                var productDescription1 = ""
                var productDescription2 = ""
                productDescription && (productDescription1 = productDescription.innerText), productDescription2 = feature_bullets, feature_bullets && productDescription1 && (productDescription2 += "\n\n"), productDescription2 += productDescription1
                productDescription = productDescription2
                var price = document.querySelector('[class*="price-detailed__unit-price"]')
                if (price) {
                    price = price.innerText.replace(/[^\d\.]+/g, "")
                } else {
                    price = document.querySelector('[class*="price-format__main-price"]')
                    if (price) {
                        document.querySelector('[class*="price-format__main-price"]').lastElementChild.innerText = "." + document.querySelector('[class*="price-format__main-price"]').lastElementChild.innerText
                        price = price.innerText.replace(/[^\d\.]+/g, "")
                    } else
                        price = "0"
                }
                if (price != "0") {
                    price = Math.ceil(price)
                }

                var imageslinksarr
                if (info) {
                    for (let i = 0; i < info.image.length; i++) {
                        info.image[i] = info.image[i].replace("_100", "_1000")
                    }
                    imageslinksarr = info.image

                } else {
                    document.querySelector(".mediagallery__thumbnailicons--count").click()
                    await sleep(2000)

                    var arr = []
                    var imgarr = document.querySelectorAll("[class*='product-images'] img.thumbnail__image")
                    for (let i = 0; i < imgarr.length; i++) {
                        const element = imgarr[i]
                        var img = element.src.replace("_100", "_1000").replace("_145", "_1000")
                        arr.push(img)
                    }


                    imageslinksarr = arr
                }

                var ship = getElementByXpath(".//div[text()='Ship to Home']/parent::*/parent::*/following-sibling::*//span[contains(text(),'FREE')]");
                (ship = ship ? ship = 0 : ship = -1)

            } else {
                var link = location.href
                InputtedASIN = "-"
                var productTitle = "";
                productTitle = info.name

                var BRAND = info.brand.name

                var OfferCat;
                OfferCat = document.querySelector('[class*="breadcrumbs"] a')
                if (OfferCat != null)
                    OfferCat = OfferCat.innerText.trim();
                else {
                    OfferCat = "-"
                }
                var feature_bullets = info.description
                var productDescription = undefined
                var productDescription1 = ""
                var productDescription2 = ""
                productDescription && (productDescription1 = productDescription.innerText), productDescription2 = feature_bullets, feature_bullets && productDescription1 && (productDescription2 += "\n\n"), productDescription2 += productDescription1
                productDescription = productDescription2
                var price = info.offers.price

                var imageslinksarr
                imageslinksarr = info.image
                for (let i = 0; i < imageslinksarr.length; i++) {
                    imageslinksarr[i] = imageslinksarr[i].replace("_100", "_1000")
                }


                var ship = getElementByXpath(".//div[text()='Ship to Home']/parent::*/parent::*/following-sibling::*//span[contains(text(),'FREE')]");
                (ship = ship ? ship = 0 : ship = -1)
            }

            linktobase64(imageslinksarr, async function (base64) {
                imageslinksarr = base64
                var dataStorage = await PullByKey(null)
                if (dataStorage.activation == true) {
                    if (ship != -1) {
                        price = Number(price) + Number(ship)

                    } else {
                        price = Number(price) + Number(dataStorage.shipping)
                    }
                }
                price = Number(price) + Number(price) * (Number(dataStorage.price) / 100)

                var n = dataStorage.description;
                (n = n.replace(/\[([A-Z]+)\]/g, function (e, t) {
                    switch (t) {
                        case "TITLE":
                            return productTitle;
                        case "PRICE":
                            return price;
                        case "DESCRIPTION":
                            return productDescription;
                        default:
                            return e
                    }
                }))
                productDescription = n;

                var obj = {
                    productDescription,//
                    feature_bullets,//
                    ASIN: InputtedASIN,//
                    imageslinksarr: imageslinksarr,//
                    Title: productTitle || "",//
                    Price: price,//
                    Brand: BRAND,//
                    Category: OfferCat,//
                    shipping: ship,
                    condition: dataStorage.condition || ""//
                }
                // condition
                // description
                // feature_bullets
                // images
                // price
                // shipping
                // title
                console.log(obj)
                resolve(obj);
            })


        } else if (document.URL.includes("autods.com")) {
            PullByKey("autods").then(pulled => {
                pulled = pulled.autods || {}

                var info = pulled[document.querySelector("[data-product-id]").getAttribute("data-product-id")].results[0]

                var link = location.href
                InputtedASIN = "-"

                var productTitle = "";

                productTitle = info.title || ''

                var BRAND = info.manufacturer || ''

                var OfferCat;
                OfferCat = ""
                var feature_bullets = info.description.replace(/<li>/ig, "\n	•").replace(/<\/h2>/ig, `\n`).replace(/<\/p>/ig, `\n`).replace(/<br>/ig, `\n`).replace(/<\/br>/ig, `\n`).replace(/<.*?>/ig, "").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#160;/g, ' ')


                var productDescription = undefined
                var productDescription1 = ""
                var productDescription2 = ""
                productDescription && (productDescription1 = productDescription.innerText), productDescription2 = feature_bullets, feature_bullets && productDescription1 && (productDescription2 += "\n\n"), productDescription2 += productDescription1
                productDescription = productDescription2
                var price = getElementByXpath(`.//span[text()[contains(.,'Price')]]`, dataDoc.parentElement.parentElement)
                if (price) {
                    price = price.innerText.replace(/[^\d\.]+/g, "")
                } else {
                    price = "0"
                }
                if (price != "0") {
                    price = Math.ceil(price)
                }

                var imageslinksarr = []
                for (let i = 0; i < info.images.length; i++) {
                    const element = info.images[i];
                    imageslinksarr.push(element.url)
                }
                var ship = -1

                linktobase64(imageslinksarr, async function (base64) {
                    imageslinksarr = base64
                    var dataStorage = await PullByKey(null)
                    if (dataStorage.activation == true) {
                        if (ship != -1) {
                            price = Number(price) + Number(ship)

                        } else {
                            price = Number(price) + Number(dataStorage.shipping)
                        }
                    }
                    price = Number(price) + Number(price) * (Number(dataStorage.price) / 100)

                    var n = dataStorage.description;
                    (n = n.replace(/\[([A-Z]+)\]/g, function (e, t) {
                        switch (t) {
                            case "TITLE":
                                return productTitle;
                            case "PRICE":
                                return price;
                            case "DESCRIPTION":
                                return productDescription;
                            default:
                                return e
                        }
                    }))
                    productDescription = n;

                    var obj = {
                        productDescription,//
                        feature_bullets,//
                        ASIN: InputtedASIN,//
                        imageslinksarr: imageslinksarr,//
                        Title: productTitle || "",//
                        Price: price,//
                        Brand: BRAND,//
                        Category: OfferCat,//
                        shipping: ship,
                        condition: dataStorage.condition || ""//
                    }
                    // condition
                    // description
                    // feature_bullets
                    // images
                    // price
                    // shipping
                    // title
                    console.log(obj)
                    resolve(obj);
                })
            })
        }
    })
}

function linktobase64(t, a) {
    chrome.runtime.sendMessage({
        message: "linktobase64",
        data: t
    }, function (e) {
        a(e)
    })

}

chrome.runtime.sendMessage({
    message: "login"
}, async function (e) {
    if (e == true) {

        if (document.URL.includes("autods.com")) {
            while (true) {
                await sleep(1000)
                if (document.querySelector("[id*='autofillAMAZON']")) {
                    continue
                }
                var appendin1 = document.querySelector("[alt='variant-pic']")?.parentElement?.parentElement?.querySelector("button")?.parentElement
                while (appendin1 == undefined) {
                    await sleep(1000)
                    appendin1 = document.querySelector("[alt='variant-pic']")?.parentElement?.parentElement?.querySelector("button")?.parentElement
                }
                if (appendin1) {
                    var array = document.querySelectorAll("[alt='variant-pic']")
                    for (let i = 0; i < array.length; i++) {
                        var appendin = array[i]?.parentElement?.parentElement?.querySelector("button")?.parentElement
                        appendin.insertAdjacentHTML('afterbegin', `<select id="autofillAMAZON${i}" type="button" class="ant-btn ghost global dstitanshelper"></select>`)
                        var select = document.querySelector("#autofillAMAZON" + i)
                        var option1 = document.createElement("option")
                        var option2 = document.createElement("option")
                        option1.value = ""
                        option2.value = "new"
                        option1.innerText = "Select Tab To Copy"
                        option2.innerText = "Copy To New FB Tab"
                        select.appendChild(option1)
                        select.appendChild(option2)
                        select.addEventListener("change", function () {
                            var selectedSelect = this
                            if (this.value == "new") {
                                chrome.runtime.sendMessage({
                                    message: "newTabFacebook"
                                }, function (results) {
                                    ScanIt(selectedSelect, "").then(data => {
                                        chrome.runtime.sendMessage({
                                            message: "sendToFacebook",
                                            data: data,
                                            id: results.data.id
                                        });
                                        select.value = ""

                                    })
                                });
                            } else if (this.value == "") {

                            } else {
                                var clicked = this.value
                                ScanIt(selectedSelect, "").then(data => {
                                    if (select.selectedOptions[0].getAttribute("site") == "facebook") {
                                        chrome.runtime.sendMessage({
                                            message: "sendToFacebook",
                                            data: data,
                                            id: Number(clicked)
                                        });
                                        select.value = ""
                                    } else {
                                        chrome.runtime.sendMessage({
                                            message: "sendToEbay",
                                            data: data,
                                            id: Number(clicked)
                                        });
                                        select.value = ""
                                    }
                                })


                            }

                        })
                        chrome.runtime.sendMessage({
                            message: "getTabs",
                        }, function (response) {
                            response = response.list
                            for (let i = 0; i < response.length; i++) {
                                const element = response[i];
                                var option3 = document.createElement("option")
                                option3.innerText = `Tab#${i + 1} > ${element.url.indexOf("facebook") != -1 ? "facebook.com" : "ebay.com"}`
                                option3.setAttribute("site", element.url.indexOf("facebook") != -1 ? "facebook" : "ebay")
                                option3.value = element.id
                                select.appendChild(option3)
                            }
                        })
                    }
                }
                setInterval(() => {

                    refreshlist()
                }, 2000);
            }
        } else {
            var appendin = document.querySelector("#leftCol .a-fixed-left-grid-inner , .prod-hero-image:not(.visuallyhidden) , .mediagallery__mainimage div , section[data-testid='vertical-hero-carousel'] .self-center")
            while (appendin == null) {
                await sleep(1000)
                appendin = document.querySelector("#leftCol .a-fixed-left-grid-inner , .prod-hero-image:not(.visuallyhidden) , .mediagallery__mainimage div , section[data-testid='vertical-hero-carousel'] .self-center")
            }
            if (appendin) {
                var div = document.createElement("div")
                div.id = "dstitanshelper"
                div.style.cssText = "display: block;"
                var select = document.createElement("select")
                select.id = "autofillAMAZON"
                select.style.cssText = "margin: auto;width: 200px;display: block;margin-top: 10px;margin-bottom: 10px;"
                div.appendChild(select)
                appendin.prepend(div)
                var option1 = document.createElement("option")
                var option2 = document.createElement("option")
                option1.value = ""
                option2.value = "new"
                option1.innerText = "Select Tab To Copy"
                option2.innerText = "Copy To New FB Tab"
                select.appendChild(option1)
                select.appendChild(option2)
                select.addEventListener("change", function () {
                    if (this.value == "new") {
                        chrome.runtime.sendMessage({
                            message: "newTabFacebook"
                        }, function (results) {
                            ScanIt(document, "").then(data => {
                                chrome.runtime.sendMessage({
                                    message: "sendToFacebook",
                                    data: data,
                                    id: results.data.id
                                });
                                select.value = ""

                            })
                        });
                    } else if (this.value == "") {

                    } else {
                        var clicked = this.value
                        ScanIt(document, "").then(data => {
                            if (select.selectedOptions[0].getAttribute("site") == "facebook") {
                                chrome.runtime.sendMessage({
                                    message: "sendToFacebook",
                                    data: data,
                                    id: Number(clicked)
                                });
                                select.value = ""
                            } else {
                                chrome.runtime.sendMessage({
                                    message: "sendToEbay",
                                    data: data,
                                    id: Number(clicked)
                                });
                                select.value = ""
                            }
                        })


                    }

                })
                chrome.runtime.sendMessage({
                    message: "getTabs",
                }, function (response) {
                    response = response.list
                    for (let i = 0; i < response.length; i++) {
                        const element = response[i];
                        var option3 = document.createElement("option")
                        option3.innerText = `Tab#${i + 1} > ${element.url.indexOf("facebook") != -1 ? "facebook.com" : "ebay.com"}`
                        option3.setAttribute("site", element.url.indexOf("facebook") != -1 ? "facebook" : "ebay")
                        option3.value = element.id
                        select.appendChild(option3)
                    }
                })
            }
            setInterval(() => {
                refreshlist()
            }, 2000);
        }
    } else {

    }
});

function refreshlist() {
    chrome.runtime.sendMessage({
        message: "getTabs",
    }, function (response) {
        var select = document.querySelectorAll("[id*='autofillAMAZON']")
        response = response.list
        for (let j = 0; j < select.length; j++) {
            const element = select[j];
            while (element.options[2]) {
                element.options[2].remove()
            }
            for (let i = 0; i < response.length; i++) {
                const element1 = response[i];
                var option3 = document.createElement("option")
                option3.innerText = `Tab#${i + 1} > ${element1.url.indexOf("facebook") != -1 ? "facebook.com" : "ebay.com"}`
                option3.setAttribute("site", element1.url.indexOf("facebook") != -1 ? "facebook" : "ebay")
                option3.value = element1.id
                element.appendChild(option3)
            }

        }

    })


}

function getElementByXpath(path, elem) {
    return document.evaluate(path, elem ? elem : document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function getimages() {
    var arr = []
    var str = getElementByXpath(`.//script[text()[contains(.,'{"hiRes":"https://m.media')]]`).innerText
    str = str.substring(str.indexOf(`'colorImages': { 'initial': `) + 28, str.indexOf(`'colorToAsin': `))
    str = str.substring(0, str.lastIndexOf(`}`))
    var imgarr = JSON.parse(str)
    for (let i = 0; i < imgarr.length; i++) {
        const element = imgarr[i];
        arr.push(element.large)
    }
    return arr
}
function getimagesWalmart() {
    var arr = []
    var imgarr = document.querySelectorAll(".prod-alt-image-wrapper .slider-list img , section button img[loading='lazy']")
    for (let i = 0; i < imgarr.length; i++) {
        const element = document.querySelectorAll(".prod-alt-image-wrapper .slider-list img , section button img[loading='lazy']")[i]
        var img = element.src.substr(0, element.src.indexOf("?")) + "?odnWidth=612&odnHeight=612&odnBg=ffffff"
        arr.push(img)
    }
    return arr
}
// function homedepot() {
//     var arr = []
//     var imgarr = document.querySelectorAll("[class*='product-images'] img.thumbnail__image")
//     for (let i = 0; i < imgarr.length; i++) {
//         const element = document.querySelectorAll("[class*='product-images'] img.thumbnail__image")[i]
//         var img = element.src.replace("_100", "_1000")
//         arr.push(img)
//     }
//     return arr
// }
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "contextclickednew") {
            chrome.runtime.sendMessage({
                message: "newTabFacebook"
            }, function (results) {
                ScanIt(document, "").then(async data => {

                    chrome.runtime.sendMessage({
                        message: "sendToFacebook",
                        data: data,
                        id: results.data.id
                    });

                })
            });
        }
        if (request.message == "contextclickedtab") {
            ScanIt(document, "").then(data => {

                chrome.runtime.sendMessage({
                    message: "sendToFacebook",
                    data: data,
                    id: request.id
                });
            })
        }
        return true;
    }
);
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

// ScanIt(document, "B0113UZJE2")

function parsejson(str) {
    try {
        return JSON.parse(str)
    } catch (error) {
        return null
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
