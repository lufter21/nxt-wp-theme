'use strict';

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
    Menu.init('.menu__item_has-children', '.menu__sub-menu', 1200);
} catch (error) {
    console.log(error);
}

// mobile nav
try {
    MobNav.init({
        openBtn: '.js-open-menu',
        closeBtn: '.js-close-menu',
        headerId: 'nxt-header',
        closeLink: '.menu a.js-anchor'
    });
} catch (error) {
    console.log(error);
}