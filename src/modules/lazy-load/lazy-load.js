/* 
new LazyLoad({
   selector: @Str,
   onEvent: 'scrollTo',  // def: false
   flexible: true, // def: false
   onDemand: true // def: false
});
*/

; var LazyLoad;

(function () {
    'use strict';

    LazyLoad = function (opt) {
        opt = opt || {};

        opt.event = opt.event || false;
        opt.flexible = opt.flexible || false;
        opt.onDemand = opt.onDemand || false;

        this.opt = opt;
        this.initialized = false;
        this.suff = '';

        const scrollHandler = () => {
            if (this.scrollHandlerLocked) {
                return;
            }

            for (let i = 0; i < this.elements.length; i++) {
                const el = this.elements[i];

                const elOffset = el.getBoundingClientRect();

                if (elOffset.width !== 0 || elOffset.height !== 0) {
                    if (elOffset.top < window.innerHeight + 100 && elOffset.bottom > -100) {
                        isWebpSupport((result) => {
                            let suff = '';

                            if (result) {
                                suff = '-webp';
                            }

                            this.doLoad(el, suff);
                        });
                    }
                }
            }
        }

        const init = () => {
            this.elements = document.querySelectorAll(opt.selector);
            
            this.scrollHandlerLocked = false;

            if (this.elements) {
                if (opt.onEvent) {
                    if (opt.onEvent == 'scrollTo') {
                        window.removeEventListener('scroll', scrollHandler);
                        window.addEventListener('scroll', scrollHandler);

                        scrollHandler();

                        this.initialized = true;
                    }
                } else if (!opt.onDemand) {
                    window.addEventListener('load', () => {
                        isWebpSupport((result) => {
                            if (result) {
                                this.suff = '-webp';
                            }

                            this.initialized = true;

                            this.doLoad();
                        });
                    });
                }
            }
        }

        init();

        this.reInit = function () {
            if (this.initialized) {
                init();
            }
        }

        this.disable = function () {
            this.scrollHandlerLocked = true;
        }
    }

    LazyLoad.prototype.doLoad = function (el, suff) {
        const elements = el ? [el] : this.elements;

        for (let i = 0; i < elements.length; i++) {
            const elem = elements[i];

            suff = (suff !== undefined) ? suff : this.suff;

            if (!elem.hasAttribute('data-src' + suff) && !elem.hasAttribute('data-bg-url' + suff)) {
                suff = '';
            }

            if (this.opt.flexible) {
                if (elem.hasAttribute('data-src' + suff)) {
                    const arr = elem.getAttribute('data-src' + suff).split(',');

                    let resultImg;

                    arr.forEach(function (arrItem) {
                        const props = arrItem.split('->');

                        if (window.innerWidth < (+props[0])) {
                            resultImg = props[1];
                        }
                    });

                    this.draw(elem, resultImg, true);

                } else if (elem.hasAttribute('data-bg-url' + suff)) {
                    const arr = elem.getAttribute('data-bg-url' + suff).split(',');

                    let resultImg;

                    arr.forEach(function (arrItem) {
                        const props = arrItem.split('->');

                        if (window.innerWidth < (+props[0])) {
                            resultImg = props[1];
                        }
                    });

                    this.draw(elem, resultImg);
                }

            } else {
                if (elem.hasAttribute('data-src' + suff)) {
                    this.draw(elem, elem.getAttribute('data-src' + suff), true);
                } else if (elem.hasAttribute('data-bg-url' + suff)) {
                    this.draw(elem, elem.getAttribute('data-bg-url' + suff));
                }
            }
        }
    }

    LazyLoad.prototype.draw = function (elem, src, isImg) {
        if (isImg) {
            if (src !== elem.getAttribute('src')) {
                elem.src = src;
            }
        } else {
            elem.style.backgroundImage = 'url(' + src + ')';
        }
    }

    LazyLoad.prototype.load = function () {
        if (this.opt.onDemand) {
            this.elements = document.querySelectorAll(this.opt.selector);

            isWebpSupport((result) => {
                if (result) {
                    this.suff = '-webp';
                }

                this.initialized = true;

                this.doLoad();
            });
        }
    }
})();