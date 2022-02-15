if (((document.querySelector("html").outerHTML.indexOf("shopify") != -1 || document.URL.indexOf("shopify") != -1) && result.activated == true && result.shopifyONOFF == "true") || (document.querySelector("html").outerHTML.indexOf("shopify") != -1 && document.querySelector("html").outerHTML.indexOf("paypal") != -1 && result.activated == true && document.querySelector("html").outerHTML.indexOf("stripe") == -1 && document.querySelector("html").outerHTML.indexOf("supreme") == -1 && document.querySelector("html").outerHTML.indexOf("off---white") == -1 && result.shopifyONOFF == "true")) {
    var data122So
    chrome.runtime.sendMessage({
        message: "getfillinfoshopi"
    }, async function (response) {
        if (response.msg == "Licence Not Correct") {
            alert("Log in first to use the autofill Extension")
        } else if (response.msg == "success") {
            data122So = response.data
            var MinPriceAM = await PullByKey('MinPriceAM')
            var MaxPriceAM = await PullByKey('MaxPriceAM')
            var MinPriceGP = await PullByKey('MinPriceGP')
            var MaxPriceGP = await PullByKey('MaxPriceGP')
            var keywordsAM = await PullByKey('keywordsAM') || ""
            var keywordsGP = await PullByKey('keywordsGP') || ""
            if (keywordsGP == "") {
                keywordsGP = []
            } else {
                keywordsGP = keywordsGP.split(",")
            }
            if (keywordsAM == "") {
                keywordsAM = []
            } else {
                keywordsAM = keywordsAM.split(",")
            }



            fetch(location.origin + "/products.json?limit=250", {
            }).then(function (response) {
                // When the page is loaded convert it to text
                return response.json()
            }).then(async function (Rsp) {
                var productId2 = ''
                Rsp.products.sort(function (a, b) {
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                if (result['Settings']['sho']['Options']['productmenu'][0] == true) {
                    if (window.location.origin + '/' == window.location.href || window.location.origin + '/collections/all' == window.location.href) {


                        var divs = document.createElement('div');
                        divs.innerHTML = `<div class="wupaszhthqolpxsagkrtrxgjk" id="miIdContent"    style="bottom: 20px;left: 20px;box-sizing: border-box;color: rgb(71, 64, 79);background-color: #2B2C3F;display: block;font-family: Popping;font-size: 18px;font-weight: 400;height: 420px;line-height: 27px;position: fixed;text-align: left;text-size-adjust: 100%;width: 400px;border-radius: 10px;z-index: 500;">    <div class="row" style="/* padding: 1rem; */">        <div class="col-12 hidescroll" style="overflow: auto;">            <div>                <div style="padding-top: 0px !important;">                    <div class="card col-md-12"                        style="padding: 15px;background-color: #262738;border: none;border-radius: 10px;">                        <div class="">                            <div class="row" style="margin: 0;">                                <div class="col-6" style="padding-right: 10px;padding-left: 10px;">                                    <div class="input-group">                                        <div class="input-group-prepend" style="width: 97%;"><span                                                class="input-group-text" id="basic-addon3"                                                style="position: relative;color: white;background-color: rgb(49 50 73 / 0%);border: 1px solid rgba(39, 46, 53, 0);width: 100%;opacity: 1;text-align: left;padding: .375rem 0rem;"><span                                                    style="width: 100%;font-size: large;font-weight: 500;">Product Menu</span></span> </div>                                    </div>                                </div>                                <div class="col-6" style="padding-right: 10px;padding-left: 10px;">                                    <div class="input-group">                                        <div class="input-group-prepend" style="width: 97%;"><span                                                class="input-group-text" id="basic-addon3"                                                style="position: relative;color: white;background-color: rgb(49 50 73 / 0%);border: 1px solid rgba(39, 46, 53, 0);width: 100%;opacity: 1;text-align: right;padding: .375rem 0rem;"><span                                                    style="width: 100%;font-size: large;font-weight: 500;">Product                                                    Count :</span><span                                                    style="font-weight: 500;margin-left: 5px;color: #c49cfd;">${Rsp.products.length}</span></span>                                        </div>                                    </div>                                </div>                            </div>                        </div>                    </div>                </div>            </div>        </div>    </div>    <div class="row" style="padding: 1rem;">        <div class="col-12 hidescroll" style="height: 100vh;overflow: auto;">            <div>                <div id="injectHereCols" style="padding-top: 0px !important;overflow: auto;height: 330px;" class="hidescroll">                                    </div>            </div>        </div>    </div></div>`;
                        document.body.appendChild(divs);

                        Rsp.products = Rsp.products.slice(0, 200);

                        for (let i = 0; i < Rsp.products.length; i++) {
                            const element = Rsp.products[i];
                            var price
                            var productId
                            var link
                            var image
                            var stock
                            var title
                            var perfectproduct = element.variants.filter((e) => e.available == true && e.title == result.Settings.sho.Options.addtocart[1].replace('small', 's').replace('large', 'l').replace('medium', 'm'))
                            var goodproduct = element.variants.filter((e) => e.available == true)
                            if (perfectproduct.length != 0) {
                                goodproduct = perfectproduct
                            } else {
                                // result.Settings.sho.Options.addtocart[1] = 'any'

                            }

                            var classstock = ''
                            var disabledvar = ''
                            if (goodproduct.length == 0) {
                                stock = false
                                price = element.variants[0].price
                                productId = ""
                                disabledvar = 'disabled'
                                classstock = 'outofstockclass'
                            } else {
                                stock = true
                                price = goodproduct[0].price
                                productId = goodproduct[0].id
                            }
                            stock = ((stock == true) ? 'In Stock' : 'Out Of Stock')
                            link = 'collections/frontpage/products/' + element.handle
                            var noImagemenu = ""
                            var noImagemenu2 = ""

                            try {
                                image = element.images[0].src
                            } catch (error) {
                                image = chrome.runtime.getURL("../assets/picstouse/not-found.svg")
                                var noImagemenu = "background-color: #2B2C3F;border-radius: 5px;"
                                var noImagemenu2 = "height: 50%;"
                            }

                            title = element.title
                            var el2 = document.createElement("div")
                            el2.className = classstock + ' card col-md-12'
                            el2.style.cssText += `margin-bottom: 3%;padding: 15px;background-color: #34354A;border-radius: 10px;box-shadow: 0 10px 16px rgba(0,0,0,.2);`
                            var bigString = `
                    <div class="">
                        <div class="row" style="margin: 0;">
                            <div class="col-3" style="padding: 0;margin-right: 10px;">
                                <div class="input-group">
                                    <div class="input-group-prepend" > <span class="input-group-text"
                                            id="basic-addon3"
                                            style="position: relative;color: white;background-color: rgb(49, 50, 73);border: 1px solid rgba(39, 46, 53, 0);width: 78%;cursor: pointer;padding: 0;${noImagemenu}"><img
                                                enabled="false"
                                                src="${image}"
                                                alt=""
                                                style="float: right;cursor: pointer;width: 100%;height: 100%;margin: 0 !important;padding: 0 !important;border-radius: 5px;${noImagemenu2}">
                                        </span> </div>
                                </div>
                            </div>
                            <div class="col-9 row" style="padding: 0;">
                                <div class="col-12" style="padding: 0;">
                                    <div class="input-group">
                                        <div class="input-group-prepend" style="width: 97%;"> <span
                                                class="input-group-text" id="basic-addon3"
                                                style="position: relative;color: white;background-color: rgb(49 50 73 / 0%);border: 1px solid rgba(39, 46, 53, 0);width: 100%;height: 25px;opacity: 1;padding: unset;text-align: left;"><span
                                                    style="width: 100%;font-size: large;font-weight: 500;">${title}</span> </span> </div>
                                    </div>
                                </div>
                                <div class="col-4" style="padding: 0;">
                                    <div class="input-group">
                                        <div class="input-group-prepend" style="width: 97%;"><span
                                                class="input-group-text" id="basic-addon3"
                                                style="position: relative;color: white;background-color: rgb(49 50 73 / 0%);border: 1px solid rgba(39, 46, 53, 0);width: 100%;opacity: 1;text-align: left;padding: .375rem 0rem;"><a href='${link}' target='_blank'><img
                                                    enabled="false"
                                                    src="${chrome.runtime.getURL("../assets/picstouse/product-link.svg")}"
                                                    alt=""
                                                    style="float: right;cursor: pointer;width: 17px;height: 20px;margin: 0px !important;padding: 0 !important;margin-right: 5px !important;"></a><a href='${link}' style='text-decoration: none !important;' target='_blank'><span
                                                    style="width: 100%;font-weight: 500;color: #c49cfd;">Product</span></a></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4" style="padding: 0;">
                                    <div class="input-group">
                                        <div class="input-group-prepend" style="width: 97%;"><span
                                                class="input-group-text" id="basic-addon3"
                                                style="position: relative;color: white;background-color: rgb(49 50 73 / 0%);border: 1px solid rgba(39, 46, 53, 0);width: 100%;opacity: 1;text-align: left;padding: .375rem 0rem;"><img
                                                    enabled="false"
                                                    src="${chrome.runtime.getURL("../assets/picstouse/stock-icon.svg")}"
                                                    alt=""
                                                    style="float: right;cursor: pointer;width: 20px;height: 20px;margin: 0px !important;padding: 0 !important;margin-right: 5px !important;"><span
                                                    class='stockclass' style="width: 100%;font-weight: 500;color: #5bed95;">${stock}</span></span> </div>
                                    </div>
                                </div>
                                <div class="col-4" style="padding: 0;">
                                    <div class="input-group">
                                        <div class="input-group-prepend" style="width: 97%;"><span
                                                class="input-group-text" id="basic-addon3"
                                                style="padding-left: 20px; padding-right: 0;position: relative;color: white;background-color: rgb(49 50 73 / 0%);border: 1px solid rgba(39, 46, 53, 0);width: 100%;opacity: 1;text-align: left;"><img
                                                    enabled="false"
                                                    src="${chrome.runtime.getURL("../assets/picstouse/price-icon.svg")}"
                                                    alt=""
                                                    style="float: right;cursor: pointer;width: 33px;height: 20px;margin: 0px !important;padding: 0 !important;margin-right: 5px !important;"><span
                                                    style="width: 100%;font-weight: 500;color: #6b6d91;">$${price}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12" style="position: relative;margin-top: 20px;padding: 0;">
                                <button ${disabledvar} id="menuAttackModeButtom" class="menuAttackModeButtom fontpopping form-control form-control-rounded"
                                    type="text" placeholder="Email" data-id="${productId}" data-image="${image}" data-title="${title}" data-price="${price}" 
                                    style="cursor: pointer;color: white !important;text-align: center;border: 0px !important;position: relative;background-image: url(${chrome.runtime.getURL("../assets/picstouse/verbackground.png")});background-size: cover;width: 100% !important;margin: 0 !important;float: left;font-family: 'Poppins';font-size: 12px;">
                                    <img src="${chrome.runtime.getURL("../assets/picstouse/attack-mode.svg")}"
                                        style="height: 19px;width: 7.5%;margin-right: 10px !important;">Attack
                                    Mode</button>
                            </div>
                        </div>
                    </div>`
                            el2.innerHTML = bigString
                            document.querySelector("#injectHereCols").appendChild(el2)
                            el2.querySelector('.menuAttackModeButtom').addEventListener("click", function () {
                                var clicked = this

                                var newResult = JSON.parse(JSON.stringify(result))
                                newResult.Settings.sho.Options.AttackMode[0] = true
                                if (newResult.Settings.sho.Options.addtocart[1] == '') {
                                    newResult.Settings.sho.Options.addtocart[1] = 'any'
                                }
                                addToCart(clicked.getAttribute('data-id'), newResult, data122So);

                            })
                        }
                    }
                }



                if (result['Settings']['sho']['Options']['pricerange'][0] == true) {

                    if (MinPriceAM != undefined && MaxPriceAM != undefined && MinPriceAM != '' && MaxPriceAM != '') {
                        if (result['Settings']['sho']['Options']['keywords'][0] == true) {
                            for (let i = 0; i < keywordsAM.length; i++) {
                                const element = keywordsAM[i];
                                if (element.trim().indexOf('+') == 0) {
                                    Rsp.products = Rsp.products.filter((e) => e.title.toLowerCase().indexOf(element.trim().toLowerCase().replace('+', '')) != -1)
                                }
                                if (element.trim().indexOf('-') == 0) {
                                    Rsp.products = Rsp.products.filter((e) => e.title.toLowerCase().indexOf(element.trim().toLowerCase().replace('-', '')) == -1)
                                }
                            }

                        }
                        var title = ""
                        for (let i = 0; i < Rsp.products.length; i++) {
                            const element = Rsp.products[i];
                            var goodproduct = element.variants.filter((e) => e.available == true && e.price >= Number(MinPriceAM) && e.price <= Number(MaxPriceAM))

                            if (goodproduct.length != 0) {
                                productId2 = goodproduct[0].id
                                title = element.title
                                break
                            }
                        }
                        if (productId2 != '') {
                            SetByKey('MinPriceAM', '')
                            SetByKey('MaxPriceAM', '')
                            SetByKey('keywordsAM', '')

                            var foundIt = productId2
                            productId2 = ''
                            var newResult = JSON.parse(JSON.stringify(result))
                            newResult.Settings.sho.Options.AttackMode[0] = true
                            newResult.Settings.sho.Options.addtocart[1] = 'any'
                            newNotification(`Success! "${title}" has been detected!`, 'linear-gradient(to right, #945be5 , #c59efe)', 'Notifsuccess.svg')
                            addToCart(foundIt, newResult, data122So);

                        } else {
                            newNotification(`Error! No products have been detected!`, 'linear-gradient(to right, #ff4f74 , #ff7975)', 'Notiferror.svg')

                        }
                    } else if (MinPriceGP != undefined && MaxPriceGP != undefined && MinPriceGP != '' && MaxPriceGP != '') {
                        if (result['Settings']['sho']['Options']['keywords'][0] == true) {

                            for (let i = 0; i < keywordsGP.length; i++) {
                                const element = keywordsGP[i];
                                if (element.trim().indexOf('+') == 0) {
                                    Rsp.products = Rsp.products.filter((e) => e.title.toLowerCase().indexOf(element.trim().toLowerCase().replace('+', '')) != -1)
                                }
                                if (element.trim().indexOf('-') == 0) {
                                    Rsp.products = Rsp.products.filter((e) => e.title.toLowerCase().indexOf(element.trim().toLowerCase().replace('-', '')) == -1)
                                }
                            }
                        }
                        var title = ""



                        for (let i = 0; i < Rsp.products.length; i++) {
                            const element = Rsp.products[i];
                            var goodproduct = element.variants.filter((e) => e.available == true && e.price >= Number(MinPriceGP) && e.price <= Number(MaxPriceGP))

                            if (goodproduct.length != 0) {
                                productId2 = 'collections/frontpage/products/' + element.handle
                                title = element.title
                                break
                            }
                        }
                        if (productId2 != '') {
                            SetByKey('MinPriceGP', '')
                            SetByKey('MaxPriceGP', '')
                            SetByKey('keywordsGP', '')

                            var foundIt = productId2
                            productId2 = ''
                            newNotification(`Success! "${title}" has been detected!`, 'linear-gradient(to right, #945be5 , #c59efe)', 'Notifsuccess.svg')
                            window.open(foundIt)

                        } else {
                            newNotification(`Error! No products have been detected!`, 'linear-gradient(to right, #ff4f74 , #ff7975)', 'Notiferror.svg')
                        }
                    }

                }
                if (result['Settings']['sho']['Options']['keywords'][0] == true) {



                    if (keywordsAM.length != 0) {
                        for (let i = 0; i < keywordsAM.length; i++) {
                            const element = keywordsAM[i];
                            if (element.trim().indexOf('+') == 0) {
                                Rsp.products = Rsp.products.filter((e) => e.title.toLowerCase().indexOf(element.trim().toLowerCase().replace('+', '')) != -1)
                            }
                            if (element.trim().indexOf('-') == 0) {
                                Rsp.products = Rsp.products.filter((e) => e.title.toLowerCase().indexOf(element.trim().toLowerCase().replace('-', '')) == -1)
                            }
                        }
                        var title = ""
                        if (MinPriceAM != undefined && MaxPriceAM != undefined && MinPriceAM != '' && MaxPriceAM != '') {
                            if (result['Settings']['sho']['Options']['pricerange'][0] == true) {
                                for (let i = 0; i < Rsp.products.length; i++) {
                                    const element = Rsp.products[i];
                                    Rsp.products = element.variants.filter((e) => e.available == true && e.price >= Number(MinPriceAM) && e.price <= Number(MaxPriceAM))
                                    if (Rsp.products.length != 0) {
                                        productId2 = Rsp.products[0].id
                                        title = element.title
                                        break
                                    }
                                }
                            }
                        }
                        for (let i = 0; i < Rsp.products.length; i++) {
                            const element = Rsp.products[i];
                            var goodproduct = element.variants.filter((e) => e.available == true)
                            if (goodproduct.length != 0) {
                                productId2 = goodproduct[0].id
                                title = element.title
                                break
                            }
                        }
                        if (productId2 != '') {
                            SetByKey('MinPriceAM', '')
                            SetByKey('MaxPriceAM', '')
                            SetByKey('keywordsAM', '')

                            var foundIt = productId2
                            productId2 = ''
                            var newResult = JSON.parse(JSON.stringify(result))
                            newResult.Settings.sho.Options.AttackMode[0] = true
                            newResult.Settings.sho.Options.addtocart[1] = 'any'
                            newNotification(`Success! "${title}" has been detected!`, 'linear-gradient(to right, #945be5 , #c59efe)', 'Notifsuccess.svg')
                            addToCart(foundIt, newResult, data122So);

                        } else {
                            newNotification(`Error! No products have been detected!`, 'linear-gradient(to right, #ff4f74 , #ff7975)', 'Notiferror.svg')
                        }
                    } else if (keywordsGP.length != 0) {
                        for (let i = 0; i < keywordsGP.length; i++) {
                            const element = keywordsGP[i];
                            if (element.trim().indexOf('+') == 0) {
                                Rsp.products = Rsp.products.filter((e) => e.title.toLowerCase().indexOf(element.trim().toLowerCase().replace('+', '')) != -1)
                            }
                            if (element.trim().indexOf('-') == 0) {
                                Rsp.products = Rsp.products.filter((e) => e.title.toLowerCase().indexOf(element.trim().toLowerCase().replace('-', '')) == -1)
                            }
                        }
                        var title = ""
                        if (MinPriceGP != undefined && MaxPriceGP != undefined && MinPriceGP != '' && MaxPriceGP != '') {


                            if (result['Settings']['sho']['Options']['pricerange'][0] == true) {
                                for (let i = 0; i < Rsp.products.length; i++) {
                                    const element = Rsp.products[i];
                                    Rsp.products = element.variants.filter((e) => e.available == true && e.price >= Number(MinPriceGP) && e.price <= Number(MaxPriceGP))

                                    if (Rsp.products.length != 0) {
                                        productId2 = 'collections/frontpage/products/' + element.handle
                                        title = element.title
                                        break
                                    }
                                }

                            }
                        }
                        for (let i = 0; i < Rsp.products.length; i++) {
                            const element = Rsp.products[i];
                            var goodproduct = element.variants.filter((e) => e.available == true)
                            if (goodproduct.length != 0) {
                                productId2 = 'collections/frontpage/products/' + element.handle
                                title = element.title
                                break
                            }
                        }

                        if (productId2 != '') {
                            SetByKey('MinPriceGP', '')
                            SetByKey('MaxPriceGP', '')
                            SetByKey('keywordsGP', '')

                            var foundIt = productId2
                            productId2 = ''
                            newNotification(`Success! "${title}" has been detected!`, 'linear-gradient(to right, #945be5 , #c59efe)', 'Notifsuccess.svg')
                            window.open(foundIt)

                        } else {
                            newNotification(`Error! No products have been detected!`, 'linear-gradient(to right, #ff4f74 , #ff7975)', 'Notiferror.svg')
                        }

                    }
                }


            }).catch(function (err) {
                console.log('Failed to fetch page: ', err);
            });



            var dataStruct = [{
                fieldType: "email",
                col: "b3",
                Selectors: ["#CheckoutData_Email", "#checkout_email", "#customer_email", "[name='checkout[email_or_phone]']",
                    //  "input[id*='email']", "input[id*='Email']",
                    //   "input[name*='email']", "input[name*='Email']","input[placeholder*='email']", "input[placeholder*='Email']",
                    "[autocomplete*='email']", "[data-backup='email_or_phone']"
                ]
            },
            {
                fieldType: "FirstName",
                col: "b4",
                Selectors: ["#CheckoutData_BillingFirstName", "#checkout_shipping_address_first_name", "input[id*='FirstName']", "input[id*='First']", "input[id*='first_name']"]
            },

            {
                fieldType: "LastName",
                col: "b5",
                Selectors: ["#CheckoutData_BillingLastName", "#checkout_shipping_address_last_name", "input[id*='LastName']", "input[id*='last']", "input[id*='last_name']"]
            },
            {
                fieldType: "BillingAddress1",
                col: "b6",
                Selectors: ["#CheckoutData_BillingAddress1", "#checkout_shipping_address_address1", "input[id*='address1']", "input[id*='Address1']",
                    //  "input[placeholder*='address']", "input[placeholder*='Address']",
                    "[autocomplete='address-line1']"
                ]
            },
            {
                fieldType: "BillingAddress2",
                col: "b7",
                Selectors: ["#CheckoutData_BillingAddress2", "#checkout_shipping_address_address2", "input[id*='address2']", "input[id*='Address2']", "input[placeholder*='apt']"]
            },
            {
                fieldType: "City",
                col: "b8",
                Selectors: ["#BillingCity", "#checkout_shipping_address_city", "input[id*='city']", "input[name*='city']", "input[name*='City']", "input[id*='City']", "[autocomplete='address-level2']"]
            },
            // {
            //     fieldType: "Countrycode",
            //     col: "b2",
            //     Selectors: ["[autocomplete='billing country']", "select[name*='country']"]
            // },
            {
                fieldType: "Country",
                col: "b9_1",
                Selectors: ["#billingCountry", "#BillingCountryID", "input[id*='Country']", "input[id*='country']", "[id*='country']", "[id*='Country']"]
            },
            {
                fieldType: "State",
                col: "b10_3",
                Selectors: ["#checkout_shipping_address_province", "input[id*='province']", "input[id*='Province']", "input[name*='State']", "input[name*='state']", "input[id*='State']", "input[id*='state']", "[placeholder*='State']", "[autocomplete='address-level1']", "select[id*='province']"]
            },
            {
                fieldType: "ZIP",
                col: "b11",
                Selectors: ["#BillingZIP", "#checkout_shipping_address_zip", "input[id*='zip']", "input[id*='Zip']", "input[id*='postal']", "input[name*='postal_code']", "[autocomplete='postal-code']", "[autocomplete='billing postal-code']"]
            },
            {
                fieldType: "cardExpiry",
                col: "b25_1",
                Selectors: ["[placeholder*='MM / YY']", "[placeholder*='MM/YY']", "[placeholder*='mm / yy']", "[placeholder*='mm/yy']", "[placeholder*='MM / YYYY']", "[placeholder*='MM/YYYY']", "[placeholder*='mm / yyyy']", "[placeholder*='mm/yyyy']"]
            },
            {
                fieldType: "cardExpiryDate",
                col: "b25",
                Selectors: ["[autocomplete='cc-exp']" //, "[id*='Date']", "[id*='date']"
                ]
            },
            {
                fieldType: "cardExpiryMonth",
                col: "b14",
                Selectors: ["#cardExpiryMonth", "[id*='Month']", "[id*='month']"]
            },
            {
                fieldType: "cardExpiryYear",
                col: "b24",
                Selectors: ["#cardExpiryYear", "[id*='Year']", "[id*='year']", "[placeholder*='YYYY']", "[placeholder*='yyyy']"]
            },
            {
                fieldType: "cardExpiryYear",
                col: "b24_1",
                Selectors: ["#cardExpiryYear", "[id*='Year']", "[id*='year']"]
            },
            {
                fieldType: "cardNum",
                col: "b12",
                Selectors: ["input[name*='cardnumber']", "[autocomplete='cc-number']", "input[id*='-cc']", "input[id*='cc-']", "input[id='cc']", "input[id*='cnb']", "[placeholder*='Card number']"]
            },
            {
                fieldType: "cardName",
                col: "b13",
                Selectors: ["[autocomplete='cc-name']", "input[id*='cc-name']"]
            },
            {
                fieldType: "cvdNumber",
                col: "b15",
                Selectors: ["[autocomplete='cc-csc']", "[placeholder*='CVV']", "[placeholder*='cvv']", "[placeholder*='cvc']", "[placeholder*='CVC']"]
            },
            {
                fieldType: "PhoneNumber",
                col: "bPhone",
                Selectors: ["#checkout_shipping_address_phone", "input[id*='phone']", "input[id*='Phone']", "input[placeholder*='tel']", "[autocomplete='tel']"]
            },
            {
                fieldType: "fulname",
                col: "b4_1",
                Selectors: ["#name", "input[placeholder*='name']", "input[name*='name']", "input[name*='Name']", "input[id*='name']", "[autocomplete='name']", "[autocomplete='ccname']"]
            },
            {
                fieldType: "AutoCheckout",
                col: "b31",
                Selectors: ["[value='Add to cart']", "[aria-label='Add to cart']", "[data-label='Add to cart']", "[name='add']", "[id='AddToCart']", "[data-action='add-to-cart']", "[id='addToCart']", "[name='addToCart']", "[id='add-to-cart']"]
            },
            {
                fieldType: "continue",
                col: "b16",
                Selectors: ["#recaptcha-anchor", "[id*='recaptcha-anchor-label']", "[value*='Check Out']", "[value*='Check out']", "[data-trekkie-id*='complete']", "[class*='payment']", "[id*='payment']", "[class*='Payment']", "[id*='Payment']", "[id*='continue']", "[class*='continue']", "[class*='Continue']"]
            }, {
                fieldType: "Paypal",
                col: "b28",
                Selectors: ["[alt*='PayPal']"]
            }, {
                fieldType: "shippingprice1",
                col: "b18",
                Selectors: [".content-box__row"]
            }, {
                fieldType: "shippingprice2",
                col: "b22",
                Selectors: [".content-box__row"]
            }, {
                fieldType: "different_billing_address_true",
                col: "b99",
                Selectors: ["[data-backup='different_billing_address_true']"]
            }, {
                fieldType: "different_billing_address_false",
                col: "b99",
                Selectors: ["[data-backup='different_billing_address_false']"]
            }, {
                fieldType: "size",
                col: "b99",
                Selectors: ["[id='product-select']", "[id*='product-select']", "select[id*='ProductSelect-product-template']", "select[id*='ProductSelect']", 'select[data-product-select]',
                    , "[id*='ProductSelect']", "[id*='product'][id*='select']", "[id*='Product'][id*='Select']", "[id*='product'][id*='Select']", "[id*='Product'][id*='select']"]
            },
            {
                fieldType: "addToCart",
                col: "b38",
                Selectors: ["[value='Add to cart']", "[aria-label='Add to cart']", "[data-label='Add to cart']", "[name='add']", "[id='AddToCart']", "[data-action='add-to-cart']", "[id='addToCart']", "[name='addToCart']", "[id='add-to-cart']"]
            },
            ]
            if (document.title.indexOf("Checkout queue") == 0) {
                newNotification(`you are waiting in line to purchase!`, 'linear-gradient(to right, #945be5 , #c59efe)', 'Notifsuccess.svg')
                return
            }

            var intervaldelay = 0
            var si1 = setInterval(() => {
                if (intervaldelay == 0) {
                    intervaldelay = 500
                }
                data122So.b24_1 = data122So.b24.toString().replace("20", "")
                data122So.b25_1 = data122So.b25.toString().replace("20", "")
                data122So.b4_1 = data122So.b4 + " " + data122So.b5

                async function fillIt(Selector, Col, type) {
                    // document.querySelector("[alt*='PayPal']").parentElement.parentElement.previousElementSibling.querySelector("input").click()

                    var el = document.querySelector(Selector)
                    if (el != null && el.getAttribute("AlreadyFilled") != "true" && el.getAttribute("hidden") != "hidden") {


                        if (type == "cardExpiry" || type == "cardExpiryDate" || type == "cardExpiryMonth" || type == "cardExpiryYear" || type == "cardExpiryYear" || type == "cardNum" || type == "cardName" || type == "cvdNumber") {
                            if (result['Settings']['sho']['Options']['PPID'][0] == true || document.querySelector("[alt*='PayPal']") == null) {
                                if (isVisible(el) != false) {

                                    if (el.className.indexOf("hidden") == -1) {
                                        if (!(type == "cardNum" || type == "cardName" || type == "cvdNumber")) {
                                            el.value = data122So[Col]
                                            el.setAttribute("AlreadyFilled", "true")
                                            ClickSomthing(el)
                                        } else {
                                            // copyToClipboard(data122So[Col]);
                                            // await sleep(100)
                                            // el.focus();
                                            // await sleep(100)
                                            el.value = data122So[Col]
                                            // await sleep(100)
                                            // document.execCommand("paste");
                                            el.setAttribute("AlreadyFilled", "true")
                                            ClickSomthing(el)
                                        }
                                    }
                                }
                            }
                        } else if (type == "continue") {
                            if (result['Settings']['sho']['Options']['autosubmit'][0] == true) {
                                if (el.tagName == "BUTTON" || el.tagName == "INPUT" && el.type != "radio" || el.tagName == "SPAN") {
                                    var delay = 0
                                    if (result['Settings']['sho']['Options']['Delay'][0] == true) {
                                        delay = parseInt(result['Settings']['sho']['Options']['Delay'][1]) || 0
                                    }
                                    if (document.querySelector("[id*='g-recaptcha']") != null) {

                                        setTimeout(() => {
                                            if (document.querySelector("[title*='recaptcha challenge']").parentElement.parentElement.style.visibility == "hidden") {
                                                if (el.getAttribute("AlreadyFilled") != "true") {
                                                    el.setAttribute("AlreadyFilled", "true")
                                                    el.click()
                                                }
                                            }

                                        }, 7000 + delay);
                                    } else {
                                        // setTimeout(() => {
                                        if (el.getAttribute("AlreadyFilled") != "true") {
                                            await sleep(100)
                                            el.setAttribute("AlreadyFilled", "true")
                                            await sleep(100)
                                            el.click()
                                        }

                                        // }, 0 + delay);
                                    }
                                } else
                                    el.setAttribute("AlreadyFilled", "true")
                            }
                        } else if (type == "custom") {
                            el.value = data122So[Col]
                            el.setAttribute("AlreadyFilled", "true")
                            ClickSomthing(el)
                        } else if (type == "Paypal") {
                            if (result['Settings']['sho']['Options']['PPID'][0] == true) {
                                if (el.parentElement.parentElement.previousElementSibling.querySelector("input").getAttribute("aria-expanded") == "false") {
                                    el.parentElement.parentElement.previousElementSibling.querySelector("input").click()

                                }
                                // el.setAttribute("AlreadyFilled", "true")
                            }
                        } else if (type == "addToCart") {
                        } else if (type == "State") {

                            setTimeout(() => {
                                el.value = data122So[Col]
                                if (el.selectedOptions.length == 0 || el.selectedOptions[0].value != data122So[Col]) {
                                    el.value = data122So['b10_1']
                                }
                                el.setAttribute("AlreadyFilled", "true")
                                ClickSomthing(el)
                            }, 500);


                        } else if (type == "different_billing_address_true") {
                        } else if (type == "different_billing_address_false") {
                        } else if (type == "AutoCheckout") {
                        } else if (type == "size") {
                        } else {
                            if (isVisible(el) != false || (document.querySelector("[data-backup='different_billing_address_true']") != null && document.querySelector("[data-backup='different_billing_address_true']").checked == true)) {
                                if (document.querySelector("[data-backup='different_billing_address_true']") != null && document.querySelector("[data-backup='different_billing_address_true']").checked == true) {
                                    if (hasClass(el, 'visually-hidden')) {

                                    } else {
                                        el.value = data122So[Col.replace('b', 'c')]
                                        el.setAttribute("AlreadyFilled", "true")
                                        ClickSomthing(el)
                                    }

                                } else {
                                    el.value = data122So[Col]
                                    el.setAttribute("AlreadyFilled", "true")
                                    ClickSomthing(el)
                                }

                            }

                        }

                    }
                }
                var delay = 0
                if (result['Settings']['sho']['Options']['Delay2'][0] == true) {
                    delay = parseInt(result['Settings']['sho']['Options']['Delay2'][1]) || 0
                }
                var productId = ''
                var sizecheck = true

                dataStruct.forEach(b => {
                    b.Selectors.forEach(elSelector => {

                        var el = document.querySelector(elSelector)
                        // if (el != null && el.getAttribute("AlreadyFilled2") != "true") {
                        // if (b.fieldType == "addToCart") {
                        //     if ((result['Settings']['sho']['Options']['addtocart'][0] == true && result['Settings']['sho']['Options']['addtocart'][2] == true) || (result['Settings']['sho']['Options']['addtocart'][0] == true && result['Settings']['sho']['Options']['addtocart'][1] == 'any')) {
                        //         if (el.getAttribute('aria-disabled') == 'true') {
                        //             newNotification(`Error! Size ${result['Settings']['sho']['Options']['addtocart'][3]} not found or OOS!`, 'linear-gradient(to right, #ff4f74 , #ff7975)', 'Notiferror.svg')
                        //         }else{
                        //             el.click()
                        //             newNotification(`Successfully added size ${result['Settings']['sho']['Options']['addtocart'][3]} to cart!`, 'linear-gradient(to right, #945be5 , #c59efe)', 'Notifsuccess.svg')
                        //         }
                        //     } else if(result['Settings']['sho']['Options']['addtocart'][0] == false) {

                        //     } else {
                        //         newNotification(`Error! Size ${result['Settings']['sho']['Options']['addtocart'][3]} not found or OOS!`, 'linear-gradient(to right, #ff4f74 , #ff7975)', 'Notiferror.svg')
                        //     }
                        //     el.setAttribute("AlreadyFilled2", "true")
                        // }
                        // }

                        if (el != null && el.getAttribute("AlreadyFilled2") != "true") {
                            if (result['Settings']['sho']['Options']['AttackModeWait'][0] == true) {
                                if (b.fieldType == "addToCart") {
                                    newNotification(`Waiting for user to cart!`, 'linear-gradient(to right, #945be5 , #c59efe)', 'Notifsuccess.svg')

                                    el.setAttribute("AlreadyFilled2", "true")
                                    el.addEventListener("click", function (e) {
                                        setTimeout(() => {
                                            attackmod(data122So)
                                        }, 1000);
                                    })
                                }
                            }
                        }
                        if (el != null && el.getAttribute("AlreadyFilled2") != "true") {
                            if (result['Settings']['sho']['Options']['addtocart'][0] == true) {
                                if (b.fieldType == "size") {
                                    if (sizecheck == true) {
                                        if (result['Settings']['sho']['Options']['addtocart'][1] == 'any') {
                                            var k = 0
                                            while (el.options[k].innerText.indexOf('Sold out') != -1 || el.options[k].getAttribute('disabled') == 'disabled') {
                                                k++
                                                if (k == el.options.length) {
                                                    newNotification(`Error! Size '${result['Settings']['sho']['Options']['addtocart'][1]}' not found or OOS!`, 'linear-gradient(to right, #ff4f74 , #ff7975)', 'Notiferror.svg')
                                                    return
                                                }
                                            }
                                            productId = el.options[k].value
                                            sizecheck = false
                                        } else {
                                            var search = containsValueSizeV2(el, result['Settings']['sho']['Options']['addtocart'][1].replace('small', 's').replace('large', 'l').replace('medium', 'm').replace('.0', ''))
                                            if (search.length == 0) {
                                                search = containsValueSizeV2(el, result['Settings']['sho']['Options']['addtocart'][1])
                                            }
                                            if (search.length == 0) {
                                                newNotification(`Error! Size '${result['Settings']['sho']['Options']['addtocart'][1]}' not found or OOS!`, 'linear-gradient(to right, #ff4f74 , #ff7975)', 'Notiferror.svg')
                                            } else {
                                                productId = search[0].value
                                                sizecheck = false
                                            }
                                        }
                                    }
                                    el.setAttribute("AlreadyFilled2", "true")
                                }
                                if (productId != '') {

                                    var foundIt = productId
                                    productId = ''
                                    addToCart(foundIt, result, data122So);
                                }
                            }
                        }
                        if (el != null && el.getAttribute("AlreadyFilled") != "true") {

                            if (b.fieldType == "different_billing_address_true") {
                                if (data122So[b.col] == false) {
                                    el.setAttribute("AlreadyFilled", "true")
                                    el.click()
                                }
                            }
                        }
                        if (el != null && el.getAttribute("AlreadyFilled") != "true") {

                            if (b.fieldType == "different_billing_address_false") {
                                if (data122So[b.col] == true) {
                                    el.setAttribute("AlreadyFilled", "true")
                                    el.click()
                                }
                            }
                        }
                        if (el != null && el.getAttribute("AlreadyFilled3") != "true") {

                            if (b.fieldType == "AutoCheckout") {
                                if (result['Settings']['sho']['Options']['CheckoutAfterCarted'][0] == true) {
                                    el.setAttribute("AlreadyFilled3", "true")
                                    el.addEventListener("click", function (e) {
                                        location.href = location.origin + '/checkout'
                                    })
                                }

                                // if (result['Settings']['sho']['Options']['autocheckout'][0] == true) {
                                //     if (isVisible(el) != false) {
                                //         el.setAttribute("AlreadyFilled", "true")
                                //         var s = document.createElement('script');
                                //         s.text = 'document.querySelector("' + Selector + '").click()'
                                //         document.getElementsByTagName('head')[0].appendChild(s)
                                //     }
                                // }
                            }
                        }


                    })
                })

                setTimeout(() => {
                    dataStruct.forEach(b => {

                        b.Selectors.forEach(elSelector => {

                            fillIt(elSelector, b.col, b.fieldType)
                        })
                    })

                }, 0 + delay);

                // }
            }, intervaldelay);

        }
    })





}
