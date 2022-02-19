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
    document.addEventListener('DOMContentLoaded', function () {
        const headerElem = document.getElementById('header');

        let scrTop = 0,
            scrAccUp = 0,
            scrAccDown = 0;

        function fixHeader() {
            if (headerElem) {
                if (window.pageYOffset > 21) {
                    headerElem.classList.add('header_fixed');

                    if (window.pageYOffset > scrTop) {
                        scrAccDown++;
                        scrAccUp = 0;
                    } else {
                        scrAccUp++;
                        scrAccDown = 0;
                    }

                    scrTop = window.pageYOffset;

                    if (scrAccDown > 2 && window.pageYOffset > headerElem.offsetHeight) {
                        headerElem.classList.add('header_hide');
                    } else if (scrAccUp > 1) {
                        headerElem.classList.remove('header_hide');
                    }

                } else if (
                    !document.body.classList.contains('popup-is-opened') &&
                    !document.body.classList.contains('mob-nav-is-opened')
                ) {
                    headerElem.classList.remove('header_fixed');
                    headerElem.classList.remove('header_hide');
                }
            }
        }

        fixHeader();

        window.addEventListener('scroll', fixHeader);
    });

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

            document.addEventListener('click', (e) => {
                const openElem = e.target.closest(options.openBtn);

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