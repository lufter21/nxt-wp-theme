document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const scrEl = document.createElement('script');
    scrEl.src = headScript;
    scrEl.onload = function () {

        const firstScreenEl = document.getElementById('first-screen');

        (function initFun() {
            if (firstScreenEl) {
                firstScreenEl.style.height = '';

                if (firstScreenEl.offsetHeight < window.innerHeight) {
                    firstScreenEl.style.height = window.innerHeight + 'px';
                }
            }

            // resize events
            window.removeEventListener('winResized', initFun);
            window.removeEventListener('winWidthResized', initFun);

            if (window.innerWidth > 1200) {
                window.addEventListener('winResized', initFun);
            } else {
                window.addEventListener('winWidthResized', initFun);
            }
        })();

        // menu
        try {
            Menu.init('.menu__item_has-children', '.menu__sub-menu', 1000);
        } catch (error) {
            console.log(error);
        }

        // mobile nav
        try {
            MobNav.init({
                openBtn: '.js-open-menu',
                closeBtn: '.js-close-menu',
                headerId: 'header',
                closeLink: '.menu a.js-anchor'
            });
        } catch (error) {
            console.log(error);
        }

    }

    document.body.appendChild(scrEl);

    // defer scripts
    let loading = false;

    function initLoad() {
        if (loading) {
            document.removeEventListener('mousemove', initLoad);
            document.removeEventListener('touchstart', initLoad);
            window.removeEventListener('scroll', initLoad);
            return;
        }

        if (deferScriptsStartLoading) {
            deferScriptsStartLoading();
        }

        loading = true;

        let i = 0;

        deferScripts.forEach(function (src) {
            const scrEl = document.createElement('script');
            scrEl.async = false;
            scrEl.defer = true;
            scrEl.src = src;
            scrEl.onload = function() {
                i++;

                if (i === deferScripts.length) {
                    if (deferScriptsHaveBeenLoaded) {
                        deferScriptsHaveBeenLoaded();
                    }
                }
            }
            document.body.appendChild(scrEl);
        });
    }

    document.addEventListener('mousemove', initLoad);
    document.addEventListener('touchstart', initLoad);
    window.addEventListener('scroll', initLoad);
});