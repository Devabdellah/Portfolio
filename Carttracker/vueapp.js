var myServer = 'https://www.savyor.co/'
var appVue = new Vue({
    el: '#app',
    data: {
        items: [],
        itemslist: [],
        filteredElements: [],
        user: { username: "", token: "" },
        tab: "settings",
        loggedin: false,
        loginvar: true,
        shopnamevar: '',
        searchvar: '',
        archivve: "api/product/active",
        whistle: "nowhistle"
    },
    mounted() {
        document.querySelector("#messagelogo span").innerText = ""
        getInfo('cart')

    },
    computed: {
        filteredRess: function () {
            if (this.searchvar.toLowerCase() == "target") {
                return this.itemslist.filter(e => e.ProductURL.toLowerCase().indexOf("target.") != -1)
            }
            if (this.searchvar.toLowerCase() == "amazon") {
                return this.itemslist.filter(e => e.ProductURL.toLowerCase().indexOf("amazon.") != -1)
            }
            if (this.searchvar.toLowerCase() == "nike") {
                return this.itemslist.filter(e => e.ProductURL.toLowerCase().indexOf("nike.") != -1)
            }
            return this.itemslist.filter(e => e.ProductName.toLowerCase().indexOf(this.searchvar.toLowerCase()) != -1)
        },
    },

    methods: {
        inputchange1: function (e, asin, item) {
            item.TargetPeriod = e.value
        },
        inputchange2: function (e, asin, item) {
            item.TargetPrice = e.value

        },
        inputchangeList1: function (e, asin, item) {
            e.parentElement.parentElement.querySelector('#track').setAttribute('nochange', 'true')
            item.TargetPeriod = e.value
            // appVue.trackUpdate(item, undefined, e)
        },
        inputchangeList2: function (e, asin, item) {
            e.parentElement.parentElement.querySelector('#track').setAttribute('nochange', 'true')
            item.TargetPrice = e.value
            // appVue.trackUpdate(item, undefined, e)
        },
        inputonkeypress: function (event, message) {
            if (event.key.replace(/\D+/g, "") != "") {

            } else if (event.key == '.') {


            } else {

                event.preventDefault();
            }
        },
        inputonkeypress2: function (event, message) {
            if (event.key.replace(/\D+/g, "") != "") {
                if (Number(event.target.value + event.key) > 180) {
                    event.preventDefault();
                }
            } else {
                event.preventDefault();
            }
        },
        enterlogin: function (event, message) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.querySelector(".loginbuttonsubmit").click();
            }
        },
        entersignup: function (event, message) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.querySelector(".signupbuttonsubmit").click();
            }
        },
        newaccount: function () {
            if (document.querySelector("#emailSignIn").value != "") {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("username", document.querySelector("#emailSignIn").value);
                urlencoded.append("password", document.querySelector("#passwordSignIn").value);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                fetch(myServer + "api/user/create", requestOptions)
                    .then(response => response.json())
                    .then(function (Rsp) {
                        if (Rsp.msg == 'User created') {
                            Swal.fire({
                                title: '<p>User Created</p>',
                                timer: 1000, showConfirmButton: false,
                            })
                            setTimeout(() => {
                                appVue.login()
                            }, 1000);
                        }
                        if (Rsp.msg == 'User already exists') {
                            Swal.fire({
                                title: '<p>User Already Exists</p>',
                                timer: 1000, showConfirmButton: false,
                            })
                        }
                    }).catch(function (err) {
                        console.log('Failed to fetch page: ', err);
                    });

            } else {
                Swal.fire({
                    title: '<p>Please insert the data</p>',
                    timer: 1000, showConfirmButton: false,
                })
            }
        },
        login: function () {
            if (document.querySelector("#emailSignIn").value != "") {

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("username", document.querySelector("#emailSignIn").value);
                urlencoded.append("password", document.querySelector("#passwordSignIn").value);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                fetch(myServer + "api/user/login", requestOptions)
                    .then(response => response.json())
                    .then(function (Rsp) {
                        if (Rsp.auth == true) {
                            SetByKey('Token', Rsp.token)
                            SetByKey('User', document.querySelector("#emailSignIn").value)
                            appVue.loginuser = { username: document.querySelector("#emailSignIn").value, token: Rsp.token }
                            appVue.loggedin = true
                            getInfo('cart')
                            Swal.fire({
                                title: '<p>Logged in</p>',
                                timer: 1000, showConfirmButton: false,
                            })
                        }
                        if (Rsp.msg == 'Incorrect password') {
                            Swal.fire({
                                title: '<p>Incorrect password</p>',
                                timer: 1000, showConfirmButton: false,
                            })
                        }
                        if (Rsp.msg == 'No user found with this email') {
                            Swal.fire({
                                title: '<p>No user found with this email</p>',
                                timer: 1000, showConfirmButton: false,
                            })
                        }
                    }).catch(function (err) {
                        console.log('Failed to fetch page: ', err);
                    });



            } else {
                Swal.fire({
                    title: '<p>Please insert the data</p>',
                    timer: 1000, showConfirmButton: false,
                })
            }
        },
        logout: function (item) {
            SetByKey('Token', '')
            SetByKey('User', '')
            appVue.loginuser = { username: '', token: '' }
            document.querySelector('#settingsUser').style.display = 'none'
            document.querySelector('#buycoffee').style.display = 'none'

            document.querySelector("#footer").style.display = 'none'
            appVue.loggedin = false
            appVue.designChange('settings')
            Swal.fire({
                title: '<p>Logged out</p>',
                timer: 1000, showConfirmButton: false,
            })


        },
        archivechange: function (e) {
            if (!e.checked) {
                appVue.archivve = "api/product/active"
            } else {
                appVue.archivve = "api/product/inactive"
            }
            getInfo('list')
        },
        resetpasss: function () {
            if (document.querySelector("#emailSignIn").value != "") {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("username", document.querySelector("#emailSignIn").value);

                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                fetch(myServer + "api/password/reset", requestOptions)
                    .then(response => response.json())
                    .then(function (Rsp) {
                        if (Rsp.msg == 'Password resed link sent to ' + document.querySelector("#emailSignIn").value) {
                            Swal.fire({
                                title: '<p>Please check your email for a password reset link</p>',
                                timer: 1000, showConfirmButton: false,
                            })
                        }
                    }).catch(function (err) {
                        console.log('Failed to fetch page: ', err);

                    });
            } else {
                Swal.fire({
                    title: '<p>Please insert the data</p>',
                    timer: 1000, showConfirmButton: false,
                })
            }
        },

        track: function (item, e) {
            e.parentElement.parentElement.querySelector('#track').setAttribute('nochange', 'true')
            var thiss = e.parentElement.parentElement.querySelector('#track')
            PullByKey('Token').then(Token => {
                if (String(item.TargetPrice) == '' || String(item.TargetPeriod) == '') {
                    Swal.fire({
                        title: '<p>Please fill Target Price and Target Period</p>',
                        timer: 1000, showConfirmButton: false,
                    })
                    e.parentElement.parentElement.querySelector('#track').setAttribute('nochange', 'false')
                } else {
                    if (Token != undefined) {
                        var myHeaders = new Headers();
                        myHeaders.append("x-access-token", Token);
                        var formdata = new FormData();
                        // if (item.TrackActive == "N") {
                        //     item.TrackActive = "y"
                        // } else if (item.TrackActive == "Y") {
                        //     item.TrackActive = "n"
                        // } else if (item.TrackActive == "n") {
                        //     item.TrackActive = "Y"
                        // } else if (item.TrackActive == "y") {
                        //     item.TrackActive = "N"
                        // }
                        formdata.append("p_url", item.ProductURL);
                        formdata.append("p_name", item.ProductName);
                        formdata.append("p_qty", item.Qty);
                        formdata.append("root_cat", item.root_cat);
                        formdata.append("sub_cat", item.sub_cat);
                        formdata.append("current_price", Number(String(item.CurrentPrice).replace('$', '').replace(',', '')));
                        formdata.append("pay_card_name", item.pay_card_name);
                        formdata.append("pay_card_num", item.pay_card_num);
                        formdata.append("pay_card_cvv", item.pay_card_cvv);
                        formdata.append("pay_card_exp", item.pay_card_exp);
                        formdata.append("ship_add_name", item.ShipAdd_Name);
                        formdata.append("ship_add_1", item.ShipAdd_Line1);
                        formdata.append("ship_add_2", item.ShipAdd_Line2);
                        formdata.append("ship_add_city", item.ShipAdd_City);
                        formdata.append("ship_add_zip", item.ShipAdd_ZIP);
                        formdata.append("ship_add_state", item.ShipAdd_State);
                        formdata.append("target_price", String(item.TargetPrice));
                        formdata.append("target_period", String(item.TargetPeriod));
                        formdata.append("tract_active", item.TrackActive);
                        formdata.append("pic_url", item.Currentimage);

                        // formdata.append("image", item.Currentimage);
                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: formdata,
                            redirect: 'follow'
                        };
                        fetch(myServer + "api/user/userinput", requestOptions)
                            .then(response => response.json())
                            .then(function (Rsp) {
                                if (Rsp.msg == 'Data inserted') {
                                    getInfo('cart', e)
                                    // Swal.fire({
                                    //     title: '<p>Tracked</p>',
                                    // })
                                    if (e) {
                                        e.parentElement.parentElement.querySelector('#track').setAttribute('nochange', 'done')
                                    }

                                }
                                if (Rsp.msg == 'Data not inserted') {
                                    Swal.fire({
                                        title: '<p>Data not inserted</p>',
                                        timer: 1000, showConfirmButton: false,
                                    })
                                }
                                if (Rsp.msg == 'Error inserting user data') {
                                    Swal.fire({
                                        title: '<p>Error inserting user data</p>',
                                        timer: 1000, showConfirmButton: false,
                                    })
                                }

                                if (Rsp.errorCode == "001") {
                                    Swal.fire({
                                        title: '<p>' + Rsp.msg + '</p>',
                                        showConfirmButton: true,
                                    })
                                    if (e) {
                                        thiss.setAttribute('nochange', 'done')
                                    }
                                    item.TrackActive = "N"
                                }
                                if (Rsp.msg == 'Product already exists') {
                                    // if (item.TrackActive == "N") {
                                    //     item.TrackActive = "y"
                                    // } else if (item.TrackActive == "Y") {
                                    //     item.TrackActive = "n"
                                    // } else if (item.TrackActive == "n") {
                                    //     item.TrackActive = "Y"
                                    // } else if (item.TrackActive == "y") {
                                    //     item.TrackActive = "N"
                                    // }            
                                    appVue.trackUpdate(item, 'cart', e)
                                    // Swal.fire({
                                    //     title: '<p>Tracked</p>',
                                    // })
                                    if (e) {
                                        e.parentElement.parentElement.querySelector('#track').setAttribute('nochange', 'done')
                                    }

                                }
                            }).catch(function (err) {
                                console.log('Failed to fetch page: ', err);
                            });
                    }
                }
            })
        },
        trackUpdate: function (item, towhere, clicked) {
            if (clicked.tagName == "IMG") {
                if (clicked.src.indexOf("update.png") != -1) {
                    clicked.src = "icons/Check(Y).png"
                }
            }

            PullByKey('Token').then(Token => {
                if (String(item.TargetPrice) == '' || String(item.TargetPeriod) == '') {
                    Swal.fire({
                        title: '<p>Please fill Target Price and Target Period</p>',
                        timer: 1000, showConfirmButton: false,
                    })

                } else {
                    if (Token != undefined) {
                        // if (item.TrackActive == "N") {
                        //     item.TrackActive = "y"
                        // } else if (item.TrackActive == "Y") {
                        //     item.TrackActive = "n"
                        // } else if (item.TrackActive == "n") {
                        //     item.TrackActive = "Y"
                        // } else if (item.TrackActive == "y") {
                        //     item.TrackActive = "N"
                        // }
                        var myHeaders = new Headers();
                        myHeaders.append("x-access-token", Token);
                        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                        var urlencoded = new URLSearchParams();
                        urlencoded.append("target_price", Number(item.TargetPrice));
                        urlencoded.append("target_period", Number(item.TargetPeriod));
                        urlencoded.append("track_active", item.TrackActive);
                        urlencoded.append("product_url", item.ProductURL);

                        var requestOptions = {
                            method: 'PUT',
                            headers: myHeaders,
                            body: urlencoded,
                            redirect: 'follow'
                        };
                        if (towhere == undefined) {
                            towhere = 'list'
                        }
                        fetch(myServer + "api/user/userinput", requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                if (result.errorCode == "001") {
                                    Swal.fire({
                                        title: '<p>' + result.msg + '</p>',
                                        showConfirmButton: true,
                                    })
                                    if (e) {
                                        thiss.setAttribute('nochange', 'done')
                                    }
                                    item.TrackActive = "N"
                                }

                                getInfo(towhere, clicked)
                            })
                            .catch(error => console.log('error', error));
                    }
                }
            })
        },
        designChange: function (where) {
            document.querySelector('#settingsUser').style.display = 'none'
            document.querySelector('#buycoffee').style.display = 'none'
            if (where == 'cart' || where == 'list') {
                document.body.style.backgroundImage = "url('icons/background (3).svg')";
                // document.body.style.backgroundRepeat = "no-repeat";
                // document.body.style.backgroundSize = "contain";

                document.querySelector('#imagelogo').style.cssText = 'position: fixed;top: 30px;left: -60px;';
                document.querySelector('#imagelogo').querySelector('img').style.cssText = 'padding-right: 13px;padding-left: 13px;width: 180px;';
                document.querySelector('#messagelogo').style.cssText = 'position: absolute; top: 106px; left: 50%; transform: translate(-50%, -50%); width: 100%;';

                if (where == 'cart') {
                    document.querySelector("#messagelogo span").innerText = 'Shop Products';
                    document.querySelector("#messagelogo").style.cssText = 'position: absolute; top: 106px; left: 50%; transform: translate(-50%, -50%); width: 100%;'

                    document.body.style.backgroundImage = "url('icons/background (3).svg')";
                    // document.body.style.backgroundRepeat = "no-repeat";
                    // document.body.style.backgroundSize = "contain";

                    document.querySelector("#search").style.display = 'none '
                } else if (where == 'list') {

                    document.querySelector("#messagelogo span").innerText = 'My List';
                    document.querySelector("#messagelogo").style.cssText = 'position: absolute;top: 144px;left: 50%;transform: translate(-50%, -50%);width: 100%;'

                    document.body.style.backgroundImage = "url('icons/background (4).svg')";
                    document.querySelector("#search").style.display = 'inline-flex '
                }
            } else if (where == 'settings') {
                if (this.loggedin == true) {
                    document.body.style.backgroundImage = "url('icons/background (5).svg')";
                    // document.body.style.backgroundRepeat = "no-repeat";
                    // document.body.style.backgroundSize = "contain";

                    document.querySelector('#imagelogo').style.cssText = 'position: fixed;top: 25px;left: 30px;';
                    document.querySelector('#imagelogo').querySelector('img').style.cssText = 'padding-right: 13px; padding-left: 13px; width: 250px;';
                    document.querySelector('#settingsUser').style.display = ''
                    document.querySelector('#buycoffee').style.display = ''

                    document.querySelector('#currentUser').innerText = this.loginuser.username
                } else {
                    document.body.style.backgroundImage = "url('icons/background (2).svg')";
                    document.querySelector('#imagelogo').style.cssText = 'position: fixed; top: 62px; left: 30px;';
                    document.querySelector('#imagelogo').querySelector('img').style.cssText = 'padding-right: 13px; padding-left: 13px; width: 250px;';
                }
                document.querySelector("#search").style.display = 'none '
                document.querySelector('#messagelogo').style.display = 'none';

            }
        }
    },
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
    var activeTab = tabs[0];
    var redy = "not complete"
    while (redy != "complete") {
        await sleep(200)
        chrome.tabs.get(activeTab.id, function (wantedTab) {
            redy = wantedTab.status
        })
    }


    if (activeTab.url.indexOf("https://www.amazon.com") == 0) {
        if (activeTab.url.indexOf("https://www.amazon.com/gp/cart/view.html") != -1) {

            chrome.tabs.sendMessage(activeTab.id, { "msg": "start" }, function (response) {
                // appVue.user = response.usercsvdata || [{ username: "", password: "" }]
                if (!response || !response.data || response.data.length == 0) {
                    return
                }
                var x = appVue.itemslist.filter(e => e.ProductURL == response.data[0].ProductURL)
                if (x.length != 0) {
                    x = x[0]
                    response.data[0].TargetPrice = x.TargetPrice
                    response.data[0].TargetPeriod = x.TargetPeriod
                    response.data[0].TrackActive = x.TrackActive
                }
                appVue.items = response.data
            });
        } else if (activeTab.url.indexOf("/dp/") != -1 || activeTab.url.indexOf("gp/product") != -1) {

            chrome.tabs.sendMessage(activeTab.id, { "msg": "start" }, function (response) {
                // appVue.user = response.usercsvdata || [{ username: "", password: "" }]
                if (!response || !response.data || response.data.length == 0) {
                    return
                }

                var x = appVue.itemslist.filter(e => e.ProductURL == response.data[0].ProductURL)
                if (x.length != 0) {
                    x = x[0]
                    response.data[0].TargetPrice = x.TargetPrice
                    response.data[0].TargetPeriod = x.TargetPeriod
                    response.data[0].TrackActive = x.TrackActive
                }

                appVue.items = response.data
            });
        } else if (activeTab.url.indexOf("s?k=") != -1) {
            chrome.tabs.sendMessage(activeTab.id, { "msg": "start" }, function (response) {
                if (!response || !response.data || response.data.length == 0) {
                    return
                }

                var x = appVue.itemslist.filter(e => e.ProductURL == response.data[0].ProductURL)
                if (x.length != 0) {
                    x = x[0]
                    response.data[0].TargetPrice = x.TargetPrice
                    response.data[0].TargetPeriod = x.TargetPeriod
                    response.data[0].TrackActive = x.TrackActive
                }

                appVue.items = response.data
            });
        }
    } else if (activeTab.url.indexOf("https://www.nike.com") == 0) {
        if (activeTab.url.indexOf("https://www.nike.com/cart") != -1 || activeTab.url.indexOf("https://www.nike.com/t/") != -1 || activeTab.url.indexOf("https://www.nike.com/w/") != -1 || activeTab.url.indexOf("https://www.nike.com/checkout") != -1) {

            chrome.tabs.sendMessage(activeTab.id, { "msg": "start" }, function (response) {
                // appVue.user = response.usercsvdata || [{ username: "", password: "" }]
                if (!response || !response.data || response.data.length == 0) {
                    return
                }

                var x = appVue.itemslist.filter(e => e.ProductURL == response.data[0].ProductURL)
                if (x.length != 0) {
                    x = x[0]
                    response.data[0].TargetPrice = x.TargetPrice
                    response.data[0].TargetPeriod = x.TargetPeriod
                    response.data[0].TrackActive = x.TrackActive
                }

                appVue.items = response.data
            });

        }
    } else if (activeTab.url.indexOf("https://www.target.com") == 0) {
        if (activeTab.url.indexOf("https://www.target.com/s?") != -1 || activeTab.url.indexOf("https://www.target.com/p/") != -1) {

            chrome.tabs.sendMessage(activeTab.id, { "msg": "start" }, function (response) {
                // appVue.user = response.usercsvdata || [{ username: "", password: "" }]
                if (!response || !response.data || response.data.length == 0) {
                    return
                }

                var x = appVue.itemslist.filter(e => e.ProductURL == response.data[0].ProductURL)
                if (x.length != 0) {
                    x = x[0]
                    response.data[0].TargetPrice = x.TargetPrice
                    response.data[0].TargetPeriod = x.TargetPeriod
                    response.data[0].TrackActive = x.TrackActive
                }

                appVue.items = response.data
            });

        }
    } else {
        appVue.whistle = "whistle"


    }
});



function getInfo(where, clicked) {

    PullByKey('User').then(User => {
        if (User == undefined || User == '') {
            appVue.loggedin = false
            for (let i = 0; i < document.querySelectorAll("#idtodisable").length; i++) {
                const element = document.querySelectorAll("#idtodisable")[i];
                element.style.pointerEvents = 'none'
                element.style.opacity = '0.5'
            }
            document.querySelector("#footer").style.display = 'none'
        } else {
            document.querySelector("#footer").style.display = 'inline-flex'
            appVue.loggedin = true
            PullByKey('Token').then(Token => {
                appVue.loginuser = { username: User, token: Token }
                var myHeaders = new Headers()
                myHeaders.append("x-access-token", appVue.loginuser.token)
                // var urlencoded = new URLSearchParams();
                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    // body: urlencoded,
                    redirect: 'follow'
                }
                fetch(myServer + appVue.archivve, requestOptions)
                    .then(response => response.json())
                    .then(function (result) {
                        if (result.msg == "Invalid token") {
                            SetByKey('Token', '')
                            SetByKey('User', '')
                            appVue.loginuser = { username: '', token: '' }
                            appVue.loggedin = false
                            if (clicked) {
                                clicked.parentElement.parentElement.querySelector('#track').setAttribute('nochange', 'done')
                            }


                        } else {
                            appVue.itemslist = result
                            for (let i = 0; i < appVue.items.length; i++) {
                                const element = appVue.items[i];
                                var alpha = appVue.itemslist.filter(e => element.ProductURL == e.ProductURL)
                                if (alpha.length != 0) {
                                    element.TrackActive = (appVue.archivve == "api/product/active") ? 'Y' : 'N'
                                    element.TargetPeriod = alpha[0].TargetPeriod
                                    element.TargetPrice = alpha[0].TargetPrice
                                } else {
                                    element.TrackActive = 'N'

                                }
                            }
                            if (clicked) {
                                clicked.parentElement.parentElement.querySelector('#track').setAttribute('nochange', 'done')
                            }
                            for (let i = 0; i < document.querySelectorAll("#idtodisable").length; i++) {
                                const element = document.querySelectorAll("#idtodisable")[i];
                                element.style.pointerEvents = ''
                                element.style.opacity = '1'
                            }

                            appVue.tab = where
                            appVue.designChange(where);
                        }
                    })
                    .catch(error => console.log('error', error))
            })
        }
    })
}


function PullByKey(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, data => {
            resolve(data[key])
        })

    })
}
function SetByKey(key, data) {
    chrome.storage.local.set({
        [key]: data
    })
}



chrome.runtime.onMessage.addListener(function (request, sender, RSP) {


    if (request.type == "addproduct") {
        var x = appVue.itemslist.filter(e => e.ProductURL == request.data.ProductURL)
        if (x.length != 0) {
            x = x[0]
            request.data.TargetPrice = x.TargetPrice
            request.data.TargetPeriod = x.TargetPeriod
            request.data.TrackActive = x.TrackActive
        }
        appVue.items.push(request.data)

    }

    return true;
})

