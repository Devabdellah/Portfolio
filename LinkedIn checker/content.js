function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


docReady(function () {
    Start()
});




Start()
function Start() {
    var y = setInterval(() => {
        if (document.head) {
            clearInterval(y)
            var insertionQ = function () { "use strict"; var m = 100, t = !1, u = "animationName", d = "", n = "Webkit Moz O ms Khtml".split(" "), e = "", i = document.createElement("div"), s = { strictlyNew: !0, timeout: 20, addImportant: !1 }; if (i.style.animationName && (t = !0), !1 === t) for (var o = 0; o < n.length; o++)if (void 0 !== i.style[n[o] + "AnimationName"]) { e = n[o], u = e + "AnimationName", d = "-" + e.toLowerCase() + "-", t = !0; break } function c(t) { return s.strictlyNew && !0 === t.QinsQ } function r(t, n) { function e(t) { t.animationName !== o && t[u] !== o || c(t.target) || n(t.target) } var i, o = "insQ_" + m++, r = s.addImportant ? " !important" : ""; (i = document.createElement("style")).innerHTML = "@" + d + "keyframes " + o + " {  from {  outline: 1px solid transparent  } to {  outline: 0px solid transparent }  }\n" + t + " { animation-duration: 0.001s" + r + "; animation-name: " + o + r + "; " + d + "animation-duration: 0.001s" + r + "; " + d + "animation-name: " + o + r + ";  } ", document.head.appendChild(i); var a = setTimeout(function () { document.addEventListener("animationstart", e, !1), document.addEventListener("MSAnimationStart", e, !1), document.addEventListener("webkitAnimationStart", e, !1) }, s.timeout); return { destroy: function () { clearTimeout(a), i && (document.head.removeChild(i), i = null), document.removeEventListener("animationstart", e), document.removeEventListener("MSAnimationStart", e), document.removeEventListener("webkitAnimationStart", e) } } } function a(t) { t.QinsQ = !0 } function f(t) { if (t) for (a(t), t = t.firstChild; t; t = t.nextSibling)void 0 !== t && 1 === t.nodeType && f(t) } function l(t, n) { var e, i = [], o = function () { clearTimeout(e), e = setTimeout(function () { i.forEach(f), n(i), i = [] }, 10) }; return r(t, function (t) { if (!c(t)) { a(t); var n = function t(n) { return c(n.parentNode) || "BODY" === n.nodeName ? n : t(n.parentNode) }(t); i.indexOf(n) < 0 && i.push(n), o() } }) } function v(n) { return !(!t || !n.match(/[^{}]/)) && (s.strictlyNew && f(document.body), { every: function (t) { return r(n, t) }, summary: function (t) { return l(n, t) } }) } return v.config = function (t) { for (var n in t) t.hasOwnProperty(n) && (s[n] = t[n]) }, v }(); "undefined" != typeof module && void 0 !== module.exports && (module.exports = insertionQ);

            //lookupProfile
            var x = document.querySelectorAll(".entity-result__item .entity-result__title-line .app-aware-link");
            for (let i = 0; i < x.length; i++) {
                const element = x[i];
                lookupProfile(element);
            }
            //lookupJob
            var x = document.querySelectorAll(".job-card-container a.job-card-list__title");
            for (let i = 0; i < x.length; i++) {
                const element = x[i];
                lookupJob(element);
            }
            insertionQ('.entity-result__item .entity-result__title-line a.app-aware-link').every(function (el) {
                lookupProfile(el);
            });
            insertionQ('.job-card-container a.job-card-list__title').every(function (el) {
                lookupJob(el);
            });
        }
    }, 100);
}


function lookupProfile(element) {
    var y = element.href;
    if (document.querySelector(`[profileid="${y.substring(y.indexOf("in/") + 3, y.indexOf("?"))}"]`)) {
        return
    }
    if (y.indexOf("in/") != -1) {
        var profile = btoa(y.substring(y.indexOf("in/") + 3, y.indexOf("?")))
        // var profile = btoa(y.substring(0, y.indexOf("?"))+"/");
        var tempid = `exist${makeid(10)}`;
        element.parentElement.insertAdjacentHTML('beforeend', `<span class="${tempid}" profileid="${y.substring(y.indexOf("in/") + 3, y.indexOf("?"))}" style="margin-left: 30px;color: cyan;text-shadow: 0 0 5px lime;display:none"></span>`);
        chrome.runtime.sendMessage({
            message: "CheckThisProfile",
            id: tempid,
            profile: profile
        }, function (data) {
            if (data.response) {
                var a = document.createElement("a")
                a.target = "_blank"
                a.innerHTML = `<button class="artdeco-button artdeco-button--2 ember-view" style="border-radius: 0px !important;background-color: #2eae3e;color: white;"><span class="artdeco-button__text">View OptimHire Profile</span></button>`
                a.href = data.response
                document.querySelector("." + data.id).appendChild(a)
                document.querySelector("." + data.id).style.display = "inline";
            } else {
            }
        });
    }
}
function lookupJob(element) {
    var y = element.href;
    if (document.querySelector(`[job="${y.substr(y.indexOf("view/") + 5, 10)}"]`)) {
        return
    }
    if (y.indexOf("jobs/view/") != -1) {
        var par = element.parentElement.parentElement
        if (!par.querySelector('[data-control-name="job_card_company_link"],.job-card-container__company-name')) {
            return
        }
        var companyName = par.querySelector('[data-control-name="job_card_company_link"] , .job-card-container__company-name').innerText
        companyName = btoa(companyName.trim().replace(/[^a-zA-Z0-9 ]/g, ''))
        var jobName = element.innerText.trim().replace(/[^a-zA-Z0-9 ]/g, '')
        jobName = btoa(jobName)
        var job = btoa(y.substr(y.indexOf("view/") + 5, 10))
        // var profile = btoa(y.substring(0, y.indexOf("?"))+"/");
        var tempid = `exist${makeid(10)}`;
        element.parentElement.insertAdjacentHTML('beforeend', `<span class="${tempid}" job="${y.substr(y.indexOf("view/") + 5, 10)}" style="margin-left: 30px;color: cyan;text-shadow: 0 0 5px lime;display:none"></span>`);

        chrome.runtime.sendMessage({
            message: "CheckThisJob",
            id: tempid,
            companyName: companyName,
            jobName: jobName,
            job: job
        }, function (data) {
            if (data.response) {
                var a = document.createElement("a")
                a.target = "_blank"
                a.innerHTML = `<button dataid="${data.id}" class="artdeco-button artdeco-button--2 ember-view" style="border-radius: 0px !important;background-color: #2eae3e;color: white;padding: 0 !important;min-width: 90px;"><span style="font-size: 10px;" class="artdeco-button__text">Add this job</span></button>`
                a.href = data.response
                element.parentElement.querySelector("." + data.id).appendChild(a)
                element.parentElement.querySelector("." + data.id).style.display = "inline";
            } else {
            }

        });
    }
}

function makeid(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


