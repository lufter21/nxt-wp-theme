// global variables
; var browser, elemIsHidden, ajax, LocStor;

(function () {
    'use strict';

    // Get useragent
    document.documentElement.setAttribute('data-useragent', navigator.userAgent.toLowerCase());

    // Browser identify
    browser = (function (userAgent) {
        userAgent = userAgent.toLowerCase();

        if (/(msie|rv:11\.0)/.test(userAgent)) {
            return 'ie';
        } else if (/firefox/.test(userAgent)) {
            return 'ff';
        }
    })(navigator.userAgent);

    // Add support CustomEvent constructor for IE
    try {
        new CustomEvent("IE has CustomEvent, but doesn't support constructor");
    } catch (e) {
        window.CustomEvent = function (event, params) {
            var evt = document.createEvent("CustomEvent");

            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };

            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

            return evt;
        }

        CustomEvent.prototype = Object.create(window.Event.prototype);
    }

    // Window Resized Event
    const winResizedEvent = new CustomEvent('winResized'),
        winWidthResizedEvent = new CustomEvent('winWidthResized');

    let rsz = true,
        beginWidth = window.innerWidth;

    window.addEventListener('resize', function () {
        if (rsz) {
            rsz = false;

            setTimeout(function () {
                window.dispatchEvent(winResizedEvent);

                if (beginWidth != window.innerWidth) {
                    window.dispatchEvent(winWidthResizedEvent);

                    beginWidth = window.innerWidth
                }

                rsz = true;
            }, 1021);
        }
    });

    // Closest polyfill
    if (!Element.prototype.closest) {
        (function (ElProto) {
            ElProto.matches = ElProto.matches || ElProto.mozMatchesSelector || ElProto.msMatchesSelector || ElProto.oMatchesSelector || ElProto.webkitMatchesSelector;

            ElProto.closest = ElProto.closest || function closest(selector) {
                if (!this) {
                    return null;
                }

                if (this.matches(selector)) {
                    return this;
                }

                if (!this.parentElement) {
                    return null;
                } else {
                    return this.parentElement.closest(selector);
                }
            };
        })(Element.prototype);
    }

    // Check element for hidden
    elemIsHidden = function (elem, exclude) {
        exclude = exclude || [];

        while (elem) {
            if (!elem) break;

            const compStyle = getComputedStyle(elem);

            if (
                compStyle.display == 'none' ||
                compStyle.visibility == 'hidden' ||
                (!exclude.includes('opacity') && compStyle.opacity == '0')
            ) return true;

            elem = elem.parentElement;
        }

        return false;
    }

    // Ajax
    ajax = function (options) {
        const xhr = new XMLHttpRequest();

        if (options.method == 'GET') {
            xhr.open('GET', options.url);

            options.send = null;
        } else {
            xhr.open('POST', options.url);

            if (typeof options.send == 'string') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (options.success) {
                    options.success(xhr.response);
                }
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                if (options.error) {
                    options.error(xhr.response);
                }
            }
        }

        xhr.send(options.send);
    }



    // Local Storage
    LocStor = {
        set: function (prop, val) {
            window.localStorage.setItem(prop, val);
        },

        get: function (prop) {
            const val = window.localStorage.getItem(prop);

            return (val !== null) ? val : false;
        }
    };

})();
; var isWebpSupport;

(function () {
    'use strict';

    // WebP Support Checkout
    !function (e, n, A) { function o(e, n) { return typeof e === n } function t() { var e, n, A, t, a, i, l; for (var f in r) if (r.hasOwnProperty(f)) { if (e = [], n = r[f], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length)) for (A = 0; A < n.options.aliases.length; A++)e.push(n.options.aliases[A].toLowerCase()); for (t = o(n.fn, "function") ? n.fn() : n.fn, a = 0; a < e.length; a++)i = e[a], l = i.split("."), 1 === l.length ? Modernizr[l[0]] = t : (!Modernizr[l[0]] || Modernizr[l[0]] instanceof Boolean || (Modernizr[l[0]] = new Boolean(Modernizr[l[0]])), Modernizr[l[0]][l[1]] = t), s.push((t ? "" : "no-") + l.join("-")) } } function a(e) { var n = u.className, A = Modernizr._config.classPrefix || ""; if (c && (n = n.baseVal), Modernizr._config.enableJSClass) { var o = new RegExp("(^|\\s)" + A + "no-js(\\s|$)"); n = n.replace(o, "$1" + A + "js$2") } Modernizr._config.enableClasses && (n += " " + A + e.join(" " + A), c ? u.className.baseVal = n : u.className = n) } function i(e, n) { if ("object" == typeof e) for (var A in e) f(e, A) && i(A, e[A]); else { e = e.toLowerCase(); var o = e.split("."), t = Modernizr[o[0]]; if (2 == o.length && (t = t[o[1]]), "undefined" != typeof t) return Modernizr; n = "function" == typeof n ? n() : n, 1 == o.length ? Modernizr[o[0]] = n : (!Modernizr[o[0]] || Modernizr[o[0]] instanceof Boolean || (Modernizr[o[0]] = new Boolean(Modernizr[o[0]])), Modernizr[o[0]][o[1]] = n), a([(n && 0 != n ? "" : "no-") + o.join("-")]), Modernizr._trigger(e, n) } return Modernizr } var s = [], r = [], l = { _version: "3.6.0", _config: { classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0 }, _q: [], on: function (e, n) { var A = this; setTimeout(function () { n(A[e]) }, 0) }, addTest: function (e, n, A) { r.push({ name: e, fn: n, options: A }) }, addAsyncTest: function (e) { r.push({ name: null, fn: e }) } }, Modernizr = function () { }; Modernizr.prototype = l, Modernizr = new Modernizr; var f, u = n.documentElement, c = "svg" === u.nodeName.toLowerCase(); !function () { var e = {}.hasOwnProperty; f = o(e, "undefined") || o(e.call, "undefined") ? function (e, n) { return n in e && o(e.constructor.prototype[n], "undefined") } : function (n, A) { return e.call(n, A) } }(), l._l = {}, l.on = function (e, n) { this._l[e] || (this._l[e] = []), this._l[e].push(n), Modernizr.hasOwnProperty(e) && setTimeout(function () { Modernizr._trigger(e, Modernizr[e]) }, 0) }, l._trigger = function (e, n) { if (this._l[e]) { var A = this._l[e]; setTimeout(function () { var e, o; for (e = 0; e < A.length; e++)(o = A[e])(n) }, 0), delete this._l[e] } }, Modernizr._q.push(function () { l.addTest = i }), Modernizr.addAsyncTest(function () { function e(e, n, A) { function o(n) { var o = n && "load" === n.type ? 1 == t.width : !1, a = "webp" === e; i(e, a && o ? new Boolean(o) : o), A && A(n) } var t = new Image; t.onerror = o, t.onload = o, t.src = n } var n = [{ uri: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=", name: "webp" }, { uri: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==", name: "webp.alpha" }, { uri: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA", name: "webp.animation" }, { uri: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=", name: "webp.lossless" }], A = n.shift(); e(A.name, A.uri, function (A) { if (A && "load" === A.type) for (var o = 0; o < n.length; o++)e(n[o].name, n[o].uri) }) }), t(), a(s), delete l.addTest, delete l.addAsyncTest; for (var p = 0; p < Modernizr._q.length; p++)Modernizr._q[p](); e.Modernizr = Modernizr }(window, document);

    let wasWepbChecked = false,
        webpCheckResult;

    isWebpSupport = function (callback) {
        if (wasWepbChecked) {
            callback(webpCheckResult);
        } else {
            Modernizr.on('webp', (result) => {
                webpCheckResult = result;
                wasWepbChecked = true;
                callback(result);
            });
        }
    }

})();
/* 
    MobNav.init({
        openBtn: '.js-open-menu',
        closeBtn: '.js-close-menu',
        headerId: 'header',
        closeLink: '.menu a.js-anchor'
    });
*/

; var MobNav;

(function () {
    'use strict';

    // fix header
    const headerElem = document.getElementById('nxt-header');

    let scrTop = 0,
        scrAccUp = 0,
        scrAccDown = 0;

    function fixHeader() {
        if (headerElem) {
            if (window.pageYOffset > 21) {
                headerElem.classList.add('nxt-header_fixed');

                if (window.pageYOffset > scrTop) {
                    scrAccDown++;
                    scrAccUp = 0;
                } else {
                    scrAccUp++;
                    scrAccDown = 0;
                }

                scrTop = window.pageYOffset;

                if (scrAccDown > 2 && window.pageYOffset > headerElem.offsetHeight) {
                    headerElem.classList.add('nxt-header_hide');
                } else if (scrAccUp > 1) {
                    headerElem.classList.remove('nxt-header_hide');
                }

            } else if (
                !document.body.classList.contains('popup-is-opened') &&
                !document.body.classList.contains('mob-nav-is-opened')
            ) {
                headerElem.classList.remove('nxt-header_fixed');
                headerElem.classList.remove('nxt-header_hide');
            }
        }
    }

    fixHeader();

    window.addEventListener('scroll', fixHeader);

    //mob menu
    MobNav = {
        options: null,
        winScrollTop: 0,

        fixBody: function (st) {
            if (st) {
                this.winScrollTop = window.pageYOffset;

                document.body.classList.add('mob-nav-is-opened');
                document.body.style.top = -this.winScrollTop + 'px';
            } else {
                document.body.classList.remove('mob-nav-is-opened');

                if (this.winScrollTop > 0) {
                    window.scrollTo(0, this.winScrollTop);
                }
            }
        },

        open: function (btnElem) {
            var headerElem = document.getElementById(this.options.headerId);

            if (!headerElem) return;

            if (btnElem.classList.contains('opened')) {
                this.close();
            } else {
                btnElem.classList.add('opened');
                headerElem.classList.add('opened');
                this.fixBody(true);
            }
        },

        close: function () {
            var headerElem = document.getElementById(this.options.headerId);

            if (!headerElem) return;

            headerElem.classList.remove('opened');

            var openBtnElements = document.querySelectorAll(this.options.openBtn);

            for (var i = 0; i < openBtnElements.length; i++) {
                openBtnElements[i].classList.remove('opened');
            }

            this.fixBody(false);
        },

        init: function (options) {
            this.options = options;
console.log('fff');
            document.addEventListener('click', (e) => {
                const openElem = e.target.closest(options.openBtn);
console.log(openElem);
                if (openElem) {
                    e.preventDefault();
                    this.open(openElem);
                } else if (e.target.closest(options.closeBtn)) {
                    e.preventDefault();
                    this.close();
                } else if (e.target.closest(options.closeLink)) {
                    this.close();
                }
            });
        }
    };
})();
/*
* call Menu.init(Str menu item selector, Str sub menu selector);
*/
var Menu;

(function () {
    'use strict';

    Menu = {
        toggle: function (elem, elementStr, subMenuStr) {
            var subMenuElem = elem.querySelector(subMenuStr);

            if (!subMenuElem) {
                return;
            }

            if (elem.classList.contains('active')) {
                subMenuElem.style.height = 0;

                elem.classList.remove('active');
            } else {
                var mainElem = elem.closest('.menu'),
                    itemElements = mainElem.querySelectorAll(elementStr),
                    subMenuElements = mainElem.querySelectorAll(subMenuStr);

                for (var i = 0; i < itemElements.length; i++) {
                    itemElements[i].classList.remove('accord__button_active');
                    subMenuElements[i].style.height = 0;
                }

                subMenuElem.style.height = subMenuElem.scrollHeight + 'px';

                elem.classList.add('active');
            }
        },

        init: function (elementStr, subMenuStr, viewport) {
            document.addEventListener('click', (e) => {
                var elem = e.target.closest(elementStr);

                if (!elem || window.innerWidth > viewport) return;

                if (e.target.getAttribute('href') == '#') e.preventDefault();

                this.toggle(elem, elementStr, subMenuStr);
            });
        }
    };
})();
//# sourceMappingURL=script.head.js.map
