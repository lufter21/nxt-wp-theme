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