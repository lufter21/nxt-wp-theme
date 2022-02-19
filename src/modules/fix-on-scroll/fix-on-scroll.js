var FixOnScroll;

(function () {
    'use strict';

    FixOnScroll = function (elSel, options) {
        this.opt = options || {};

        this.opt.bottomPosition = this.opt.bottomPosition !== undefined ? this.opt.bottomPosition : null;

        this.opt.hideOnTop = window.innerHeight;

        const elem = document.querySelector(elSel);

        if (!elem) {
            return;
        }

        this.init = () => {
            if (typeof this.opt.bottomPosition === 'function') {
                this.opt.botPos = this.opt.bottomPosition();
            } else {
                this.opt.botPos = this.opt.bottomPosition;
            }

            const initElBound = elem.getBoundingClientRect();

            elem.parentElement.style.width = elem.offsetWidth + 'px';
            elem.parentElement.style.height = elem.offsetHeight + 'px';

            this.hide(elem);

            if (initElBound.top > window.innerHeight) {
                elem.style.position = 'fixed';
                elem.style.left = initElBound.left + 'px';
                elem.style.bottom = this.opt.botPos + 'px';
            }
        }

        this.init();

        window.addEventListener('scroll', () => {
            const parentElBound = elem.parentElement.getBoundingClientRect();

            this.hide(elem);

            if (window.innerHeight - parentElBound.bottom <= this.opt.botPos) {
                elem.style.position = 'fixed';
                elem.style.left = parentElBound.left + 'px';
                elem.style.bottom = this.opt.botPos + 'px';
            } else {
                elem.style.position = '';
                elem.style.left = '';
                elem.style.bottom = '';
            }
        });
    }

    FixOnScroll.prototype.hide = function (elem) {
        if (this.opt.hideOnTop && this.opt.hideOnTop > window.scrollY) {
            elem.style.visibility = 'hidden';
            elem.style.opacity = '0';
        } else {
            elem.style.visibility = 'visible';
            elem.style.opacity = '1';
        }
    }

    FixOnScroll.prototype.reInit = function () {
        if (this.init) {
            this.init();
        }
    }
})();