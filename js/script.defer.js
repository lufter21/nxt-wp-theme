/*
animate(function(takes 0...1) {}, Int duration in ms[, Str easing[, Fun animation complete]]);
*/

; var animate;

(function () {
    'use strict';

    animate = function (draw, duration, ease, complete) {
        const start = performance.now();

        requestAnimationFrame(function anim(time) {
            let timeFraction = (time - start) / duration;

            if (timeFraction > 1) {
                timeFraction = 1;
            }

            draw((ease) ? easing(timeFraction, ease) : timeFraction);

            if (timeFraction < 1) {
                requestAnimationFrame(anim);
            } else {
                if (complete !== undefined) {
                    complete();
                }
            }
        });
    }

    function easing(timeFraction, ease) {
        switch (ease) {
            case 'easeInQuad':
                return quad(timeFraction);

            case 'easeOutQuad':
                return 1 - quad(1 - timeFraction);

            case 'easeInOutQuad':
                if (timeFraction <= 0.5) {
                    return quad(2 * timeFraction) / 2;
                } else {
                    return (2 - quad(2 * (1 - timeFraction))) / 2;
                }
        }
    }

    function quad(timeFraction) {
        return Math.pow(timeFraction, 2)
    }
})();
; var template;

(function () {
    'use strict';

    template = function (data, template, sign) {
        const s = sign || '%',
            tplEl = document.getElementById(template);

        if (tplEl) {
            template = tplEl.innerHTML;
        }

        let result = template;

        result = result.replace(new RegExp('<' + s + 'for (\\w+) as (\\w+)' + s + '>(.*?)<' + s + 'endfor' + s + '>', 'gs'), function (match, p1, p2, p3, offset, input) {

            if (!data[p1]) return '';

            return data[p1].map(function (item) {
                let res = p3;

                if (typeof item === 'object') {
                    for (const key in item) {
                        if (item.hasOwnProperty(key)) {
                            res = res.replace(new RegExp('<' + s + p2 + '.' + key + s + '>', 'g'), item[key]);
                        }
                    }
                } else {
                    res = res.replace(new RegExp('<' + s + p2 + s + '>', 'g'), item);
                }

                return res;
            }).join('');
        });

        result = result.replace(new RegExp('<' + s + 'if (\\w+)' + s + '>(.*?)<' + s + 'endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            const m = data[p1];

            if (
                m === '' || m === false || m == undefined || m == null ||
                (Array.isArray(m) && !m.length)
            ) {
                return '';
            } else {
                return p2;
            }
        });

        result = result.replace(new RegExp('<' + s + '{2}if (\\w+)' + s + '>(.*?)<' + s + '{2}endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            const m = data[p1];

            if (
                m === '' || m === false || m == undefined || m == null ||
                (Array.isArray(m) && !m.length)
            ) {
                return '';
            } else {
                return p2;
            }
        });

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                result = result.replace(new RegExp('<' + s + key + s + '>', 'g'), data[key]);
            }
        }

        return result;
    }
})();
/*
Toggle.init({
    button: '.js-tgl-btn',
    offButton: '.js-tgl-off',
    toggledClass: 'some-class' // def: toggled,
    targetsToggledClass: 'some-class' // def: toggled
});

Toggle.onChange(function (btnEl, targetElems, state) {
    // code...
});
*/

; var Toggle;

(function () {
    'use strict';

    Toggle = {
        toggledClass: 'toggled',
        targetsToggledClass: 'toggled',
        onChangeSubscribers: [],

        init: function (opt) {
            if (opt.toggledClass) {
                this.toggledClass = opt.toggledClass;
            }

            if (opt.targetsToggledClass) {
                this.targetsToggledClass = opt.targetsToggledClass;
            }

            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(opt.button),
                    offBtnEl = e.target.closest(opt.offButton);

                if (btnEl) {
                    e.preventDefault();

                    if (btnEl.hasAttribute('data-switch')) {
                        this.switchBtns(btnEl);
                    } else {
                        this.toggle(btnEl);
                    }
                } else if (offBtnEl) {
                    e.preventDefault();

                    this.toggleOff(offBtnEl);
                }

                this.onDocClickOff(e, btnEl);
            });
        },

        toggle: function (toggleElem, off) {
            let state;

            if (toggleElem.classList.contains(this.toggledClass)) {
                toggleElem.classList.remove(this.toggledClass);

                state = false;

                if (toggleElem.hasAttribute('data-first-text')) {
                    toggleElem.innerHTML = toggleElem.getAttribute('data-first-text');
                }
            } else if (!off) {
                if (toggleElem.getAttribute('data-type') != 'button') {
                    toggleElem.classList.add(this.toggledClass);
                }

                state = true;

                if (toggleElem.hasAttribute('data-second-text')) {
                    toggleElem.setAttribute('data-first-text', toggleElem.innerHTML);

                    toggleElem.innerHTML = toggleElem.getAttribute('data-second-text');
                }
            }

            //target
            if (toggleElem.hasAttribute('data-target-elements')) {
                this.target(toggleElem, state);
            }

            if (!state) {
                return;
            }

            //dependence elements
            if (toggleElem.hasAttribute('data-dependence-target-elements')) {
                const dependenceTargetElements = document.querySelectorAll(toggleElem.getAttribute('data-dependence-target-elements'));

                for (let i = 0; i < dependenceTargetElements.length; i++) {
                    const el = dependenceTargetElements[i];

                    dependenceTargetElements[i].classList.remove(this.toggledClass);

                    if (el.hasAttribute('data-target-elements')) {
                        this.target(el, false);
                    }
                }
            }
        },

        switchBtns: function (btnEl) {
            if (btnEl.classList.contains(this.toggledClass)) {
                return;
            }

            const btnElems = document.querySelectorAll('[data-switch="' + btnEl.getAttribute('data-switch') + '"]');

            for (let i = 0; i < btnElems.length; i++) {
                const bEl = btnElems[i];

                bEl.classList.remove(this.toggledClass);

                if (bEl.hasAttribute('data-target-elements')) {
                    this.target(bEl, false);
                }
            }

            btnEl.classList.add(this.toggledClass);

            if (btnEl.hasAttribute('data-target-elements')) {
                this.target(btnEl, true);
            }
        },

        target: function (btnEl, state) {
            const target = btnEl.getAttribute('data-target-elements');

            let targetElements;

            if (target.indexOf('->') !== -1) {
                const selArr = target.split('->');

                targetElements = btnEl.closest(selArr[0]).querySelectorAll(selArr[1]);

            } else {
                targetElements = document.querySelectorAll(target);
            }

            if (!targetElements.length) return;

            if (state) {
                for (let i = 0; i < targetElements.length; i++) {
                    targetElements[i].classList.add(this.targetsToggledClass);
                }
            } else {
                for (let i = 0; i < targetElements.length; i++) {
                    targetElements[i].classList.remove(this.targetsToggledClass);
                }
            }

            //call onChange
            if (this.onChangeSubscribers.length) {
                this.onChangeSubscribers.forEach(function (item) {
                    item(btnEl, targetElements, state);
                });
            }
        },

        toggleOff: function (btnEl) {
            const targetEls = btnEl.getAttribute('data-target-elements'),
                toggleBtnEls = document.querySelectorAll('.' + this.toggledClass +
                    '[data-target-elements*="' + targetEls + '"]');

            this.target(btnEl, false);

            for (let i = 0; i < toggleBtnEls.length; i++) {
                toggleBtnEls[i].classList.remove(this.toggledClass);
            }
        },

        onDocClickOff: function (e, targetBtnEl) {
            const toggleElements = document.querySelectorAll('[data-toggle-off="document"].' + this.toggledClass);

            for (let i = 0; i < toggleElements.length; i++) {
                const elem = toggleElements[i];

                if (targetBtnEl === elem) continue;

                if (elem.hasAttribute('data-target-elements')) {
                    const targetSelectors = elem.getAttribute('data-target-elements');

                    if (!e.target.closest(targetSelectors)) {
                        this.toggle(elem, true);
                    }
                } else {
                    this.toggle(elem, true);
                }
            }
        },

        onChange: function (fun) {
            if (typeof fun === 'function') {
                this.onChangeSubscribers.push(fun);
            }
        }
    };
})();
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
var Popup;

(function () {
    'use strict';

    Popup = {
        winScrollTop: 0,
        onClose: null,
        _onclose: null,
        onOpenSubscribers: [],
        headerSelector: '.header',
        delay: 300,

        init: function (elementStr) {
            document.addEventListener('click', (e) => {
                var btnElem = e.target.closest(elementStr),
                    closeBtnElem = e.target.closest('.js-popup-close');

                if (btnElem) {
                    e.preventDefault();
                    this.open(btnElem.getAttribute('data-popup') || btnElem.getAttribute('href'), false, btnElem);
                } else if (
                    closeBtnElem ||
                    (
                        !e.target.closest('.popup__window') &&
                        e.target.closest('.popup') &&
                        !e.target.closest('.popup[data-btn-close-only="true"]')
                    )
                ) {
                    this.close('closeButton');
                }
            });

            if (window.location.hash) {
                this.open(window.location.hash);
            }
        },

        open: function (elementStr, callback, btnElem) {
            const winEl = document.querySelector(elementStr);

            if (!winEl || !winEl.classList.contains('popup__window')) return;

            this.close('openPopup', winEl);

            const elemParent = winEl.parentElement;

            elemParent.style.display = 'block';

            setTimeout(function () {
                elemParent.style.opacity = '1';
            }, 121);

            elemParent.scrollTop = 0;

            setTimeout(function () {
                winEl.style.display = 'inline-block';

                if (winEl.offsetHeight < window.innerHeight) {
                    winEl.style.top = ((window.innerHeight - winEl.offsetHeight) / 2) + 'px';
                }

                winEl.style.opacity = '1';

                setTimeout(() => {
                    winEl.classList.add('popup__window_visible');
                }, this.delay);
            }, this.delay);


            if (callback) this._onclose = callback;

            this.fixBody(true);

            this.onOpenSubscribers.forEach(function (item) {
                item(elementStr, btnElem);
            });

            return winEl;
        },

        onOpen: function (fun) {
            if (typeof fun === 'function') {
                this.onOpenSubscribers.push(fun);
            }

            if (window.location.hash) {
                this.open(window.location.hash);
            }
        },

        message: function (msg, winSel, callback) {
            const winEl = this.open(winSel || '#message-popup', callback);

            winEl.querySelector('.popup__message').innerHTML = msg.replace(/\[(\/?\w+)\]/gi, '<$1>');
        },

        close: function (evInit, openedWinEl) {
            const visWinElems = document.querySelectorAll('.popup__window_visible');

            if (!visWinElems.length) return;

            for (let i = 0; i < visWinElems.length; i++) {
                const winEl = visWinElems[i];

                if (!winEl.classList.contains('popup__window_visible')) continue;

                winEl.style.opacity = '0';

                const samePop = openedWinEl ? winEl.parentElement === openedWinEl.parentElement : false;

                setTimeout(() => {
                    winEl.classList.remove('popup__window_visible');
                    winEl.style.display = 'none';

                    if (evInit !== 'openPopup' || !samePop) winEl.parentElement.style.opacity = '0';

                    setTimeout(() => {
                        if (evInit !== 'openPopup' || !samePop) winEl.parentElement.style.display = 'none';

                        if (evInit == 'closeButton') this.fixBody(false);
                    }, this.delay);
                }, this.delay);
            }

            if (this._onclose) {
                this._onclose();
                this._onclose = null;
            } else if (this.onClose) {
                this.onClose();
            }
        },

        fixBody: function (st) {
            const headerElem = document.querySelector(this.headerSelector);

            if (st && !document.body.classList.contains('popup-is-opened')) {
                this.winScrollTop = window.pageYOffset;

                const offset = window.innerWidth - document.documentElement.clientWidth;

                document.body.classList.add('popup-is-opened');

                if (headerElem) {
                    headerElem.style.transition = '0s';
                    headerElem.style.right = offset + 'px';
                }

                document.body.style.right = offset + 'px';

                document.body.style.top = (-this.winScrollTop) + 'px';

            } else if (!st) {
                if (headerElem) {
                    headerElem.style.right = '';
                    setTimeout(function () {
                        headerElem.style.transition = '';
                    }, 321);
                }

                document.body.classList.remove('popup-is-opened');

                window.scrollTo(0, this.winScrollTop);
            }
        }
    };
})();
var MediaPopup;

(function () {
    'use strict';

    MediaPopup = {
        groupBtnElems: null,
        curGroupBtnIndex: null,
        popupEl: null,

        init: function (btnSel) {
            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(btnSel),
                    arrBtnEl = e.target.closest('.popup-media__arr'),
                    dotBtnEl = e.target.closest('.popup-media__dots-btn');

                if (btnEl) {
                    e.preventDefault();

                    this.popupEl = Popup.open(btnEl.getAttribute('data-popup') || '#media-popup', null, btnEl);

                    this.show(btnEl);
                    this.group(btnEl);

                } else if (arrBtnEl) {
                    this.next(arrBtnEl.getAttribute('data-dir'));
                } else if (dotBtnEl) {
                    if (!dotBtnEl.classList.contains('active')) {
                        const dotBtnElems = document.querySelectorAll('.popup-media__dots-btn');

                        for (let i = 0; i < dotBtnElems.length; i++) {
                            dotBtnElems[i].classList.remove('active');
                        }

                        dotBtnEl.classList.add('active');

                        this.goTo(+dotBtnEl.getAttribute('data-ind'));
                    }
                }
            });
        },

        show: function (btnEl) {
            const type = btnEl.getAttribute('data-type'),
                caption = btnEl.getAttribute('data-caption'),
                args = {
                    href: btnEl.href,
                    preview: btnEl.getAttribute('data-preview')
                },
                captEl = this.popupEl.querySelector('.popup-media__caption');

            if (caption) {
                captEl.innerHTML = caption.replace(/\[(\/?\w+)\]/gi, '<$1>');
                captEl.style.display = '';

            } else {
                captEl.style.display = 'none';
            }

            if (type == 'image') {
                this.image(args);
            } else if (type == 'video') {
                this.video(args);
            }
        },

        image: function (args) {
            const elemImg = this.popupEl.querySelector('.popup-media__image');

            Popup.onClose = function () {
                elemImg.src = '#';
                elemImg.classList.remove('popup-media__image_visible');
            }

            elemImg.src = args.href;
            elemImg.classList.add('popup-media__image_visible');

        },

        video: function (args) {
            const videoEl = this.popupEl.querySelector('.popup-media__video'),
                previewEl = videoEl.querySelector('.popup-media__preview'),
                btnPlayEl = videoEl.querySelector('.popup-media__btn-play');

            Popup.onClose = function () {
                Video.stop();
                previewEl.src = '#';
                videoEl.classList.remove('popup-media__video_visible');
            }

            previewEl.src = args.preview;
            btnPlayEl.setAttribute('data-src', args.href);
            videoEl.classList.add('popup-media__video_visible');
        },

        group: function (elem) {
            const group = elem.getAttribute('data-group'),
                arrBtnElems = document.querySelectorAll('.popup-media__arr'),
                dotsEl = this.popupEl.querySelector('.popup-media__dots');

            if (!group) {
                this.groupBtnElems = null;
                this.curGroupBtnIndex = null;

                for (let i = 0; i < arrBtnElems.length; i++) {
                    arrBtnElems[i].style.display = 'none';
                }

                dotsEl.style.display = 'none';

                return;
            }

            this.groupBtnElems = document.querySelectorAll('[data-group="' + group + '"]');
            this.curGroupBtnIndex = [].slice.call(this.groupBtnElems).indexOf(elem);

            if (this.groupBtnElems.length) {
                for (let i = 0; i < arrBtnElems.length; i++) {
                    arrBtnElems[i].style.display = '';
                }

                dotsEl.style.display = '';
                dotsEl.innerHTML = '';

                for (let i = 0; i < this.groupBtnElems.length; i++) {
                    const dot = document.createElement('li');
                    dot.innerHTML = '<button class="popup-media__dots-btn' + (i == this.curGroupBtnIndex ? ' active' : '') + '" data-ind="' + i + '"></button>';

                    dotsEl.appendChild(dot);
                }

            } else {
                for (let i = 0; i < arrBtnElems.length; i++) {
                    arrBtnElems[i].style.display = 'none';
                }

                dotsEl.style.display = 'none';
            }
        },

        next: function (dir) {
            let btnEl;

            const dotBtnEls = this.popupEl.querySelectorAll('.popup-media__dots-btn');

            for (let i = 0; i < dotBtnEls.length; i++) {
                dotBtnEls[i].classList.remove('active');
            }

            if (dir == 'next') {
                this.curGroupBtnIndex++;

                if (this.groupBtnElems[this.curGroupBtnIndex]) {
                    btnEl = this.groupBtnElems[this.curGroupBtnIndex];

                } else {
                    this.curGroupBtnIndex = 0;
                    btnEl = this.groupBtnElems[0];
                }

            } else {
                this.curGroupBtnIndex--;

                if (this.groupBtnElems[this.curGroupBtnIndex]) {
                    btnEl = this.groupBtnElems[this.curGroupBtnIndex];

                } else {
                    this.curGroupBtnIndex = this.groupBtnElems.length - 1;
                    btnEl = this.groupBtnElems[this.curGroupBtnIndex];
                }
            }

            dotBtnEls[this.curGroupBtnIndex].classList.add('active');

            this.show(btnEl);
        },

        goTo: function (ind) {
            this.curGroupBtnIndex = ind;

            let btnEl = this.groupBtnElems[ind];

            this.show(btnEl);
        }
    };
})();
var ValidateForm;

(function () {
    'use strict';

    ValidateForm = {
        input: null,
        formSelector: null,

        init: function (formSelector) {
            this.formSelector = formSelector;

            document.removeEventListener('input', this.inpH);
            document.removeEventListener('change', this.chH);

            this.inpH = this.inpH.bind(this);
            this.chH = this.chH.bind(this);

            document.addEventListener('input', this.inpH);
            document.addEventListener('change', this.chH);
        },

        inpH: function (e) {
            const elem = e.target.closest(this.formSelector + ' input[type="text"],' + this.formSelector + ' input[type="password"],' + this.formSelector + ' input[type="number"],' + this.formSelector + ' input[type="tel"],' + this.formSelector + ' textarea, input[type="text"][form]');

            if (elem /* && elem.hasAttribute('data-tested') */) {
                setTimeout(() => {
                    this.validateOnInput(elem);
                }, 121);
            }
        },

        chH: function (e) {
            const elem = e.target.closest(this.formSelector + ' input[type="radio"],' + this.formSelector + ' input[type="checkbox"]');

            if (elem) {
                this[elem.type](elem);
            }
        },

        validateOnInput: function (elem) {
            this.input = elem;

            const dataType = elem.getAttribute('data-type');

            if (elem.hasAttribute('data-tested')) {
                this.formError(elem.closest('form'), false);

                if (
                    elem.getAttribute('data-required') === 'true' &&
                    (!elem.value.length || /^\s+$/.test(elem.value))
                ) {
                    this.successTip(false);
                    this.errorTip(true);
                } else if (elem.value.length) {
                    if (dataType) {
                        try {
                            const tE = this[dataType]();

                            if (tE) {
                                this.successTip(false);
                                this.errorTip(true, tE);
                                err++;
                                errElems.push(elem);
                            } else {
                                this.errorTip(false);
                                this.successTip(true);
                            }
                        } catch (error) {
                            console.log('Error while process', dataType)
                        }
                    } else {
                        this.errorTip(false);
                        this.successTip(true);
                    }
                } else {
                    this.errorTip(false);
                    this.successTip(false);
                }

            } else {
                if ((!elem.value.length || /^\s+$/.test(elem.value))) {
                    this.successTip(false);
                } else if (elem.value.length) {
                    if (dataType) {
                        try {
                            if (this[dataType]() === null) {
                                this.successTip(true);
                            } else {
                                this.successTip(false);
                            }
                        } catch (error) {
                            console.log('Error while process', dataType)
                        }
                    } else {
                        this.successTip(true);
                    }
                }
            }
        },

        validate: function (formElem) {
            const errElems = [];

            let err = 0;

            // text, password, textarea
            const elements = formElem.querySelectorAll('input[type="text"], input[type="password"], input[type="number"], input[type="tel"], textarea');

            const checkElems = (elements) => {
                for (let i = 0; i < elements.length; i++) {
                    const elem = elements[i];

                    if (elemIsHidden(elem)) {
                        continue;
                    }

                    this.input = elem;

                    elem.setAttribute('data-tested', 'true');

                    const dataType = elem.getAttribute('data-type');

                    if (
                        elem.getAttribute('data-required') === 'true' &&
                        (!elem.value.length || /^\s+$/.test(elem.value))
                    ) {
                        this.errorTip(true);
                        err++;
                        errElems.push(elem);
                    } else if (elem.value.length) {
                        if (elem.hasAttribute('data-custom-error')) {
                            err++;
                            errElems.push(elem);
                        } else if (dataType) {
                            try {
                                const tE = this[dataType]();

                                if (tE) {
                                    this.errorTip(true, tE);
                                    err++;
                                    errElems.push(elem);
                                } else {
                                    this.errorTip(false);
                                }
                            } catch (error) {
                                console.log('Error while process', dataType)
                            }
                        } else {
                            this.errorTip(false);
                        }
                    } else {
                        this.errorTip(false);
                    }
                }
            }

            checkElems(elements);

            if (formElem.id) {
                const elements = document.querySelectorAll('input[form="' + formElem.id + '"]');

                checkElems(elements);
            }

            // select
            const selectElements = formElem.querySelectorAll('.select__input');

            for (let i = 0; i < selectElements.length; i++) {
                const selectElem = selectElements[i];

                if (elemIsHidden(selectElem.parentElement)) continue;

                if (this.select(selectElem)) {
                    err++;
                    errElems.push(selectElem.parentElement);
                }
            }

            // checkboxes
            const chboxEls = formElem.querySelectorAll('input[type="checkbox"]');

            for (let i = 0; i < chboxEls.length; i++) {
                const elem = chboxEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                elem.setAttribute('data-tested', 'true');

                if (elem.getAttribute('data-required') === 'true' && !elem.checked) {
                    this.errorTip(true);
                    err++;
                    errElems.push(elem);
                } else {
                    this.errorTip(false);
                }
            }

            // checkbox group
            const chboxGrEls = formElem.querySelectorAll('.form__chbox-group');

            for (let i = 0; i < chboxGrEls.length; i++) {
                var group = chboxGrEls[i],
                    checkedElements = 0;

                if (elemIsHidden(group)) {
                    continue;
                }

                group.setAttribute('data-tested', 'true');

                const chboxInGrEls = group.querySelectorAll('input[type="checkbox"]');

                for (let i = 0; i < chboxInGrEls.length; i++) {
                    if (chboxInGrEls[i].checked) {
                        checkedElements++;
                    }
                }

                if (checkedElements < group.getAttribute('data-min')) {
                    group.classList.add('form__chbox-group_error');
                    err++;
                    errElems.push(group);
                } else {
                    group.classList.remove('form__chbox-group_error');
                }
            }

            // radio group
            const radGrEls = formElem.querySelectorAll('.form__radio-group');

            for (let i = 0; i < radGrEls.length; i++) {
                var group = radGrEls[i],
                    checkedElement = false;

                if (elemIsHidden(group)) {
                    continue;
                }

                group.setAttribute('data-tested', 'true');

                const radInGrEls = group.querySelectorAll('input[type="radio"]');

                for (let i = 0; i < radInGrEls.length; i++) {
                    if (radInGrEls[i].checked) {
                        checkedElement = true;
                    }
                }

                if (!checkedElement) {
                    group.classList.add('form__radio-group_error');
                    err++;
                    errElems.push(group);
                } else {
                    group.classList.remove('form__radio-group_error');
                }
            }

            // file
            const fileEls = formElem.querySelectorAll('input[type="file"]');

            for (var i = 0; i < fileEls.length; i++) {
                var elem = fileEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                if (CustomFile.inputFiles(elem).length) {
                    if (this.file(elem, CustomFile.inputFiles(elem))) {
                        err++;
                        errElems.push(elem);
                    }
                } else if (elem.getAttribute('data-required') === 'true') {
                    this.errorTip(true);
                    err++;
                    errElems.push(elem);
                } else {
                    this.errorTip(false);
                }
            }

            // passwords compare
            const pwdCompEls = formElem.querySelectorAll('input[data-pass-compare-input]');

            for (var i = 0; i < pwdCompEls.length; i++) {
                var elem = pwdCompEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                var val = elem.value;

                if (val.length) {
                    var compElemVal = formElem.querySelector(elem.getAttribute('data-pass-compare-input')).value;

                    if (val !== compElemVal) {
                        this.errorTip(true, 2);
                        err++;
                        errElems.push(elem);
                    } else {
                        this.errorTip(false);
                    }
                }
            }

            this.formError(formElem, err);

            if (err) {
                this.scrollToErrElem(errElems);
            }

            return (err) ? false : true;
        },

        successTip: function (state) {
            const field = this.input.closest('.form__field') || this.input.parentElement;

            if (state) {
                field.classList.add('field-success');
            } else {
                field.classList.remove('field-success');
            }
        },

        errorTip: function (err, errInd, errorTxt) {
            const field = this.input.closest('.form__field') || this.input.parentElement,
                tipEl = field.querySelector('.field-error-tip');

            if (err) {
                this.successTip(false);

                field.classList.add('field-error');

                if (errInd) {
                    if (tipEl) {
                        if (!tipEl.hasAttribute('data-error-text')) {
                            tipEl.setAttribute('data-error-text', tipEl.innerHTML);
                        }
                        tipEl.innerHTML = (errInd != 'custom') ? tipEl.getAttribute('data-error-text-' + errInd) : errorTxt;
                    }

                    field.setAttribute('data-error-index', errInd);

                } else {
                    if (tipEl && tipEl.hasAttribute('data-error-text')) {
                        tipEl.innerHTML = tipEl.getAttribute('data-error-text');
                    }

                    field.removeAttribute('data-error-index');
                }

            } else {
                field.classList.remove('field-error');
                field.removeAttribute('data-error-index');
            }
        },

        customErrorTip: function (input, errorTxt, isLockForm) {
            if (!input) return;

            this.input = input;

            if (errorTxt) {
                this.errorTip(true, 'custom', errorTxt);

                if (isLockForm) {
                    input.setAttribute('data-custom-error', 'true');
                }
            } else {
                this.errorTip(false);
                input.removeAttribute('data-custom-error');

                this.validate(input.closest('form'));
            }
        },

        formError: function (formElem, err, errTxt) {
            const errTipElem = formElem.querySelector('.form-error-tip');

            if (err) {
                formElem.classList.add('form-error');

                if (!errTipElem) return;

                if (errTxt) {
                    if (!errTipElem.hasAttribute('data-error-text')) {
                        errTipElem.setAttribute('data-error-text', errTipElem.innerHTML);
                    }

                    errTipElem.innerHTML = errTxt;
                } else if (errTipElem.hasAttribute('data-error-text')) {
                    errTipElem.innerHTML = errTipElem.getAttribute('data-error-text');
                }
            } else {
                formElem.classList.remove('form-error');
            }
        },

        customFormErrorTip: function (formElem, errorTxt) {
            if (!formElem) return;

            if (errorTxt) {
                this.formError(formElem, true, errorTxt);
            } else {
                this.formError(formElem, false);
            }
        },

        scrollToErrElem: function (elems) {
            let offsetTop = 99999;

            const headerHeight = document.querySelector('.header').offsetHeight;

            for (let i = 0; i < elems.length; i++) {
                const el = elems[i],
                    epOffsetTop = el.getBoundingClientRect().top;

                if (epOffsetTop < headerHeight && epOffsetTop < offsetTop) {
                    offsetTop = epOffsetTop;
                }
            }

            if (offsetTop != 99999) {
                const scrTo = offsetTop + window.scrollY - headerHeight;

                animate(function (progress) {
                    window.scrollTo(0, scrTo * progress + (1 - progress) * window.scrollY);
                }, 1000, 'easeInOutQuad');
            }
        },

        txt: function () {
            if (!/^[0-9a-zа-яё_,.:;@-\s]*$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        num: function () {
            if (!/^[0-9.,-]*$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        int: function () {
            if (!/^[0-9]*$/.test(this.input.value)) {
                return 2;
            }

            if (this.input.hasAttribute('data-min')) {
                if (+this.input.value < +this.input.getAttribute('data-min')) {
                    return 3;
                }
            }

            return null;
        },

        cardNumber: function () {
            if (!/^\d{4}\-\d{4}\-\d{4}\-\d{4}$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        name: function () {
            if (!/^[a-zа-яё'\s-]{2,21}(\s[a-zа-яё'\s-]{2,21})?(\s[a-zа-яё'\s-]{2,21})?$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        date: function () {
            let errDate = false,
                matches = this.input.value.match(/^(\d{2}).(\d{2}).(\d{4})$/);

            if (!matches) {
                errDate = 1;
            } else {
                var compDate = new Date(matches[3], (matches[2] - 1), matches[1]),
                    curDate = new Date();

                if (this.input.hasAttribute('data-min-years-passed')) {
                    var interval = curDate.valueOf() - new Date(curDate.getFullYear() - (+this.input.getAttribute('data-min-years-passed')), curDate.getMonth(), curDate.getDate()).valueOf();

                    if (curDate.valueOf() < compDate.valueOf() || (curDate.getFullYear() - matches[3]) > 100) {
                        errDate = 1;
                    } else if ((curDate.valueOf() - compDate.valueOf()) < interval) {
                        errDate = 2;
                    }
                }

                if (compDate.getFullYear() != matches[3] || compDate.getMonth() != (matches[2] - 1) || compDate.getDate() != matches[1]) {
                    errDate = 1;
                }
            }

            if (errDate == 1) {
                return 2;
            } else if (errDate == 2) {
                return 3;
            }

            return null;
        },

        time: function () {
            const matches = this.input.value.match(/^(\d{1,2}):(\d{1,2})$/);

            if (!matches || Number(matches[1]) > 23 || Number(matches[2]) > 59) {
                return 2;
            }

            return null;
        },

        email: function () {
            if (!/^[a-z0-9]+[\w\-\.]*@([\w\-]{2,}\.)+[a-z]{2,}$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        url: function () {
            if (!/^(https?\:\/\/)?[а-я\w-.]+\.[a-zа-я]{2,11}[/?а-я\w/=-]+$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        tel: function () {
            if (!/^\+?[\d)(\s-]+$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        tel_RU: function () {
            if (!/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        pass: function () {
            let err = false,
                minLng = this.input.getAttribute('data-min-length');

            if (minLng && this.input.value.length < minLng) {
                return 2;
            }

            return null;
        },

        checkbox: function (elem) {
            this.input = elem;

            var group = elem.closest('.form__chbox-group');

            if (group && group.getAttribute('data-tested')) {
                var checkedElements = 0,
                    elements = group.querySelectorAll('input[type="checkbox"]');

                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].checked) {
                        checkedElements++;
                    }
                }

                if (checkedElements < group.getAttribute('data-min')) {
                    group.classList.add('form__chbox-group_error');
                } else {
                    group.classList.remove('form__chbox-group_error');
                }

            } else if (elem.getAttribute('data-tested')) {
                if (elem.getAttribute('data-required') === 'true' && !elem.checked) {
                    this.errorTip(true);
                } else {
                    this.errorTip(false);
                }
            }
        },

        radio: function (elem) {
            this.input = elem;

            var checkedElement = false,
                group = elem.closest('.form__radio-group');

            if (!group) return;

            var elements = group.querySelectorAll('input[type="radio"]');

            for (var i = 0; i < elements.length; i++) {
                if (elements[i].checked) {
                    checkedElement = true;
                }
            }

            if (!checkedElement) {
                group.classList.add('form__radio-group_error');
            } else {
                group.classList.remove('form__radio-group_error');
            }
        },

        select: function (elem) {
            let err = false;

            this.input = elem;

            if (elem.getAttribute('data-required') === 'true' && !elem.value.length) {
                this.errorTip(true);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        file: function (elem, filesArr) {
            this.input = elem;

            let err = false,
                errCount = { ext: 0, size: 0 },
                maxFiles = +this.input.getAttribute('data-max-files'),
                extRegExp = new RegExp('(?:\\.' + this.input.getAttribute('data-ext').replace(/,/g, '|\\.') + ')$', 'i'),
                maxSize = +this.input.getAttribute('data-max-size'),
                fileItemElements = this.input.closest('.custom-file').querySelectorAll('.custom-file__item');;

            for (var i = 0; i < filesArr.length; i++) {
                var file = filesArr[i];

                if (!file.name.match(extRegExp)) {
                    errCount.ext++;

                    if (fileItemElements[i]) {
                        fileItemElements[i].classList.add('file-error');
                    }

                    continue;
                }

                if (file.size > maxSize) {
                    errCount.size++;

                    if (fileItemElements[i]) {
                        fileItemElements[i].classList.add('file-error');
                    }
                }
            }

            if (maxFiles && filesArr.length > maxFiles) {
                this.errorTip(true, 4);
                err = true;
            } else if (errCount.ext) {
                this.errorTip(true, 2);
                err = true;
            } else if (errCount.size) {
                this.errorTip(true, 3);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        }
    };
})();
/* 
*   Checkbox.onChange(function(el, state) {
*       // body
*   }); 
*/

var Checkbox;

(function () {
    'use strict';

    Checkbox = {
        hideCssClass: 'hidden',
        opt: {},
        onChangeSubscribers: [],

        init: function (options) {
            options = options || {};

            this.opt.focusOnTarget = (options.focusOnTarget !== undefined) ? options.focusOnTarget : false;

            const elems = document.querySelectorAll('input[type="checkbox"]');

            for (let i = 0; i < elems.length; i++) {
                this.change(elems[i], true);
            }

            // change event
            document.removeEventListener('change', this.changeHandler);

            this.changeHandler = this.changeHandler.bind(this);
            document.addEventListener('change', this.changeHandler);
        },

        changeHandler: function (e) {
            const elem = e.target.closest('input[type="checkbox"]');

            if (elem) {
                this.change(elem);
            }
        },

        change: function (elem, onInit) {
            if (!onInit) {
                this.onChangeSubscribers.forEach(function (item) {
                    item(elem, elem.checked);
                });
            }

            const targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

            if (!targetElements.length) return;

            for (let i = 0; i < targetElements.length; i++) {
                const targetElem = targetElements[i];

                targetElem.style.display = (elem.checked) ? 'block' : 'none';

                if (elem.checked) {
                    targetElem.classList.remove(this.hideCssClass);

                    const inpEls = targetElem.querySelectorAll('input[type="text"]');

                    for (var j = 0; j < inpEls.length; j++) {
                        var inpEl = inpEls[j];

                        inpEl.focus();
                    }

                } else {
                    targetElem.classList.add(this.hideCssClass);
                }
            }
        },

        onChange: function (fun) {
            if (typeof fun === 'function') {
                this.onChangeSubscribers.push(fun);
            }
        }
    };
})();
(function () {
	'use strict';

	//show element on radio button change
	var ChangeRadio = {
		hideCssClass: 'hidden',

		change: function (checkedElem) {
			var elements = document.querySelectorAll('input[type="radio"][name="' + checkedElem.name + '"]');

			if (!elements.length) {
				return;
			}

			for (let i = 0; i < elements.length; i++) {
				const elem = elements[i],
					targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : [],
					hideElems = (elem.hasAttribute('data-hide-elements')) ? document.querySelectorAll(elem.getAttribute('data-hide-elements')) : [];

				if (!targetElements.length && !hideElems.length) continue;

				for (let i = 0; i < targetElements.length; i++) {
					const targetElem = targetElements[i];

					targetElem.style.display = (elem.checked) ? 'block' : 'none';

					if (elem.checked) {
						targetElem.classList.remove(this.hideCssClass);
					} else {
						targetElem.classList.add(this.hideCssClass);
					}
				}

				for (let i = 0; i < hideElems.length; i++) {
					const hideEl = hideElems[i];

					hideEl.style.display = (elem.checked) ? 'none' : 'block';

					if (elem.checked) {
						hideEl.classList.add(this.hideCssClass);
					} else {
						hideEl.classList.remove(this.hideCssClass);
					}
				}

			}
		},

		init: function () {
			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="radio"]');

				if (elem) {
					this.change(elem);
				}
			});
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function () {
		ChangeRadio.init();
	});
})();
; var Select;

(function () {
    'use strict';

    // custom select
    Select = {
        field: null,
        hideCssClass: 'hidden',
        onSelectSubscribers: [],
        focusBlurIsDisabled: false,
        st: null,

        reset: function (parentElem) {
            const parElem = parentElem || document,
                fieldElements = parElem.querySelectorAll('.select'),
                buttonElements = parElem.querySelectorAll('.select__button'),
                inputElements = parElem.querySelectorAll('.select__input'),
                valueElements = parElem.querySelectorAll('.select__val');

            for (let i = 0; i < fieldElements.length; i++) {
                fieldElements[i].classList.remove('select_changed');
            }

            for (let i = 0; i < buttonElements.length; i++) {
                buttonElements[i].children[0].innerHTML = buttonElements[i].getAttribute('data-placeholder');
            }

            for (let i = 0; i < inputElements.length; i++) {
                inputElements[i].value = '';
                inputElements[i].blur();
            }

            for (let i = 0; i < valueElements.length; i++) {
                valueElements[i].classList.remove('select__val_checked');
                valueElements[i].disabled = false;
            }
        },

        closeAll: function () {
            const fieldElements = document.querySelectorAll('.select'),
                optionsElements = document.querySelectorAll('.select__options');

            for (let i = 0; i < fieldElements.length; i++) {
                fieldElements[i].classList.remove('select_opened');

                optionsElements[i].classList.remove('ovfauto');
                optionsElements[i].style.height = 0;

                const listItemElements = optionsElements[i].querySelectorAll('li');

                for (let i = 0; i < listItemElements.length; i++) {
                    listItemElements[i].classList.remove('hover');
                }
            }
        },

        close: function (fieldEl) {
            fieldEl = fieldEl || this.field;

            setTimeout(function () {
                fieldEl.classList.remove('select_opened');
            }, 210);

            const optionsElem = fieldEl.querySelector('.select__options'),
                listItemElements = optionsElem.querySelectorAll('li');

            optionsElem.classList.remove('ovfauto');
            optionsElem.style.height = 0;

            for (let i = 0; i < listItemElements.length; i++) {
                listItemElements[i].classList.remove('hover');
            }
        },

        open: function () {
            this.field.classList.add('select_opened');

            const optionsElem = this.field.querySelector('.select__options');

            setTimeout(function () {
                optionsElem.style.height = ((optionsElem.scrollHeight > window.innerHeight - optionsElem.getBoundingClientRect().top) ? window.innerHeight - optionsElem.getBoundingClientRect().top : (optionsElem.scrollHeight + 2)) + 'px';
                optionsElem.scrollTop = 0;

                setTimeout(function () {
                    optionsElem.classList.add('ovfauto');
                }, 621);
            }, 21);
        },

        selectMultipleVal: function (elem, button, input) {
            const toButtonValue = [],
                toInputValue = [],
                inputsBlock = this.field.querySelector('.select__multiple-inputs');

            elem.classList.toggle('select__val_checked');

            const checkedElements = this.field.querySelectorAll('.select__val_checked');

            for (let i = 0; i < checkedElements.length; i++) {
                const elem = checkedElements[i];

                toButtonValue[i] = elem.innerHTML;
                toInputValue[i] = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;
            }

            if (toButtonValue.length) {
                button.children[0].innerHTML = toButtonValue.join(', ');

                input.value = toInputValue[0];

                inputsBlock.innerHTML = '';

                if (toInputValue.length > 1) {
                    for (let i = 1; i < toInputValue.length; i++) {
                        const yetInput = document.createElement('input');

                        yetInput.type = 'hidden';
                        yetInput.name = input.name;
                        yetInput.value = toInputValue[i];

                        inputsBlock.appendChild(yetInput);
                    }
                }
            } else {
                button.children[0].innerHTML = button.getAttribute('data-placeholder');
                input.value = '';
                this.close();
            }
        },

        targetAction: function () {
            const valEls = this.field.querySelectorAll('.select__val');

            for (let i = 0; i < valEls.length; i++) {
                const vEl = valEls[i];

                if (vEl.hasAttribute('data-show-elements')) {
                    const showEls = document.querySelectorAll(vEl.getAttribute('data-show-elements'));

                    for (let i = 0; i < showEls.length; i++) {
                        const sEl = showEls[i];

                        sEl.style.display = 'none';
                        sEl.classList.add(this.hideCssClass);
                    }
                }

                if (vEl.hasAttribute('data-hide-elements')) {
                    const hideEls = document.querySelectorAll(vEl.getAttribute('data-hide-elements'));

                    for (let i = 0; i < hideEls.length; i++) {
                        const hEl = hideEls[i];

                        hEl.style.display = 'block';
                        hEl.classList.remove(this.hideCssClass);
                    }
                }
            }

            for (let i = 0; i < valEls.length; i++) {
                const vEl = valEls[i];

                if (vEl.hasAttribute('data-show-elements')) {
                    const showEls = document.querySelectorAll(vEl.getAttribute('data-show-elements'));

                    for (let i = 0; i < showEls.length; i++) {
                        const sEl = showEls[i];

                        if (vEl.classList.contains('select__val_checked')) {
                            sEl.style.display = 'block';
                            sEl.classList.remove(this.hideCssClass);

                            // focus on input
                            const txtInpEl = sEl.querySelector('input[type="text"]');

                            if (txtInpEl) {
                                txtInpEl.focus();
                            }
                        }
                    }
                }

                if (vEl.hasAttribute('data-hide-elements')) {
                    const hideEls = document.querySelectorAll(vEl.getAttribute('data-hide-elements'));

                    for (let i = 0; i < hideEls.length; i++) {
                        const hEl = hideEls[i];

                        if (vEl.classList.contains('select__val_checked')) {
                            hEl.style.display = 'none';
                            hEl.classList.add(this.hideCssClass);
                        }
                    }
                }
            }
        },

        selectVal: function (elem) {
            const button = this.field.querySelector('.select__button'),
                input = this.field.querySelector('.select__input');

            if (this.field.classList.contains('select_multiple')) {
                this.selectMultipleVal(elem, button, input);
            } else {
                const toButtonValue = elem.innerHTML,
                    toInputValue = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;

                const valueElements = this.field.querySelectorAll('.select__val');

                for (let i = 0; i < valueElements.length; i++) {
                    const valElem = valueElements[i];

                    valElem.classList.remove('select__val_checked');
                    valElem.disabled = false;
                    
                    valElem.parentElement.classList.remove('hidden');
                }

                elem.classList.add('select__val_checked');
                elem.disabled = true;

                if (this.field.classList.contains('select_hide-selected-option')) {
                    elem.parentElement.classList.add('hidden');
                }

                if (button) {
                    button.children[0].innerHTML = toButtonValue;
                }

                input.value = toInputValue;

                this.close();

                if (window.Placeholder) {
                    Placeholder.hide(input, true);
                }

                if (input.getAttribute('data-submit-form-onchange')) {
                    Form.submitForm(input.closest('form'));
                }

                this.onSelectSubscribers.forEach(item => {
                    item(input, toButtonValue, toInputValue, elem.getAttribute('data-second-value'));
                });
            }

            this.targetAction();

            if (input.classList.contains('var-height-textarea__textarea')) {
                varHeightTextarea.setHeight(input);
            }

            this.field.classList.add('select_changed');

            ValidateForm.select(input);
        },

        onSelect: function (fun) {
            if (typeof fun === 'function') {
                this.onSelectSubscribers.push(fun);
            }
        },

        setOptions: function (fieldSelector, optObj, nameKey, valKey, secValKey) {
            const fieldElements = document.querySelectorAll(fieldSelector + ' .select');

            for (let i = 0; i < fieldElements.length; i++) {
                const optionsElem = fieldElements[i].querySelector('.select__options');

                optionsElem.innerHTML = '';

                for (let i = 0; i < optObj.length; i++) {
                    let li = document.createElement('li'),
                        secValAttr = (secValKey != undefined) ? ' data-second-value="' + optObj[i][secValKey] + '"' : '';

                    li.innerHTML = '<button type="button" class="select__val" data-value="' + optObj[i][valKey] + '"' + secValAttr + '>' + optObj[i][nameKey] + '</button>';

                    optionsElem.appendChild(li);
                }
            }
        },

        keyboard: function (key) {
            const options = this.field.querySelector('.select__options'),
                hoverItem = options.querySelector('li.hover');

            switch (key) {
                case 40:
                    if (hoverItem) {
                        const nextItem = function (item) {
                            let elem = item.nextElementSibling;

                            while (elem) {
                                if (!elem) break;

                                if (!elemIsHidden(elem)) {
                                    return elem;
                                } else {
                                    elem = elem.nextElementSibling;
                                }
                            }
                        }(hoverItem);

                        if (nextItem) {
                            hoverItem.classList.remove('hover');
                            nextItem.classList.add('hover');

                            options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
                        }
                    } else {
                        let elem = options.firstElementChild;

                        while (elem) {
                            if (!elem) break;

                            if (!elemIsHidden(elem)) {
                                elem.classList.add('hover');
                                break;
                            } else {
                                elem = elem.nextElementSibling;
                            }
                        }
                    }
                    break;

                case 38:
                    if (hoverItem) {
                        const nextItem = function (item) {
                            let elem = item.previousElementSibling;

                            while (elem) {
                                if (!elem) break;

                                if (!elemIsHidden(elem)) {
                                    return elem;
                                } else {
                                    elem = elem.previousElementSibling;
                                }
                            }
                        }(hoverItem);

                        if (nextItem) {
                            hoverItem.classList.remove('hover');
                            nextItem.classList.add('hover');

                            options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
                        }
                    } else {
                        let elem = options.lastElementChild;

                        while (elem) {
                            if (!elem) break;

                            if (!elemIsHidden(elem)) {
                                elem.classList.add('hover');
                                options.scrollTop = 9999;
                                break;
                            } else {
                                elem = elem.previousElementSibling;
                            }
                        }
                    }
                    break;

                case 13:
                    this.selectVal(hoverItem.querySelector('.select__val'));
            }
        },

        build: function (elementStr) {
            const elements = document.querySelectorAll(elementStr);

            if (!elements.length) return;

            for (let i = 0; i < elements.length; i++) {
                const elem = elements[i],
                    options = elem.querySelectorAll('option'),
                    parent = elem.parentElement;

                let optionsList = '',
                    selectedOption = null;

                // option list
                for (let i = 0; i < options.length; i++) {
                    const opt = options[i];

                    let liClass = '';

                    if (opt.hasAttribute('selected')) {
                        selectedOption = opt;

                        if (elem.getAttribute('data-hide-selected-option') == 'true') {
                            liClass = 'hidden';
                        }
                    }

                    optionsList += '<li' + (liClass ? ' class="' + liClass + '"' : '') + '><button type="button" tabindex="-1" class="select__val' + ((opt.hasAttribute('selected')) ? ' select__val_checked' : '') + '"' + ((opt.hasAttribute('value')) ? ' data-value="' + opt.value + '"' : '') + ((opt.hasAttribute('data-second-value')) ? ' data-second-value="' + opt.getAttribute('data-second-value') + '"' : '') + ((opt.hasAttribute('data-show-elements')) ? ' data-show-elements="' + opt.getAttribute('data-show-elements') + '"' : '') + ((opt.hasAttribute('data-hide-elements')) ? ' data-hide-elements="' + opt.getAttribute('data-hide-elements') + '"' : '') + '>' + opt.innerHTML + '</button></li>';
                }

                const require = (elem.hasAttribute('data-required')) ? ' data-required="' + elem.getAttribute('data-required') + '" ' : '';

                const placeholder = elem.getAttribute('data-placeholder');

                const submitOnChange = (elem.hasAttribute('data-submit-form-onchange')) ? ' data-submit-form-onchange="' + elem.getAttribute('data-submit-form-onchange') + '" ' : '';

                const head = '<button type="button"' + ((placeholder) ? ' data-placeholder="' + placeholder + '"' : '') + ' class="select__button"><span>' + ((selectedOption) ? selectedOption.innerHTML : (placeholder) ? placeholder : '') + '</span></button>';

                const multiple = {
                    class: (elem.multiple) ? ' select_multiple' : '',
                    inpDiv: (elem.multiple) ? '<div class="select__multiple-inputs"></div>' : ''
                };

                const hiddenInp = '<input type="hidden" name="' + elem.name + '"' + require + submitOnChange + 'class="select__input" value="' + ((selectedOption) ? selectedOption.value : '') + '">';

                if (elem.hasAttribute('data-empty-text')) {
                    optionsList = '<li class="select__options-empty">' + elem.getAttribute('data-empty-text') + '</li>';
                }

                // output select
                const customElem = document.createElement('div');

                customElem.className = 'select' + multiple.class + ((selectedOption) ? ' select_changed' : '') + (elem.getAttribute('data-hide-selected-option') == 'true' ? ' select_hide-selected-option' : '');

                customElem.innerHTML = head + '<div class="select__options-wrap"><ul class="select__options">' + optionsList + '</ul></div>' + hiddenInp + multiple.inpDiv;

                parent.replaceChild(customElem, elem);
            }
        },

        init: function (elementStr) {
            if (document.querySelector(elementStr)) this.build(elementStr);

            // click event
            document.removeEventListener('click', this.clickHandler);

            this.clickHandler = this.clickHandler.bind(this);
            document.addEventListener('click', this.clickHandler);

            // focus event
            document.removeEventListener('focus', this.focusHandler, true);

            this.focusHandler = this.focusHandler.bind(this);
            document.addEventListener('focus', this.focusHandler, true);

            // blur event
            document.removeEventListener('blur', this.blurHandler, true);

            this.blurHandler = this.blurHandler.bind(this);
            document.addEventListener('blur', this.blurHandler, true);

            // keydown event
            document.removeEventListener('keydown', this.keydownHandler);

            this.keydownHandler = this.keydownHandler.bind(this);
            document.addEventListener('keydown', this.keydownHandler);

            // close all
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.select')) {
                    this.closeAll();
                }
            });
        },

        clickHandler: function (e) {
            clearTimeout(this.st);

            const btnElem = e.target.closest('.select__button'),
                valElem = e.target.closest('.select__val');

            if (btnElem) {
                this.focusBlurIsDisabled = true;

                this.field = btnElem.closest('.select');

                if (this.field.classList.contains('select_opened')) {
                    this.close();
                } else {
                    this.closeAll();
                    this.open();
                }
            } else if (valElem) {
                this.focusBlurIsDisabled = true;

                this.field = valElem.closest('.select');
                this.selectVal(valElem);
            }

            this.st = setTimeout(function () {
                this.focusBlurIsDisabled = false;
            }, 521);
        },

        focusHandler: function (e) {
            const inpElem = e.target.closest('.select__button');

            if (inpElem) {
                setTimeout(() => {
                    if (this.focusBlurIsDisabled) return;

                    this.field = inpElem.closest('.select');

                    if (!this.field.classList.contains('select_opened')) {
                        this.closeAll();
                        this.open();
                    }
                }, 321);
            }
        },

        blurHandler: function (e) {
            const inpElem = e.target.closest('.select__button');

            if (inpElem) {
                setTimeout(() => {
                    if (this.focusBlurIsDisabled) return;

                    const fieldEl = inpElem.closest('.select');

                    if (fieldEl.classList.contains('select_opened')) {
                        this.close(fieldEl);
                    }
                }, 321);
            }
        },

        keydownHandler: function (e) {
            const elem = e.target.closest('.select_opened');

            if (!elem) return;

            this.field = elem.closest('.select');

            const key = e.which || e.keyCode || 0;

            if (key == 40 || key == 38 || key == 13) {
                e.preventDefault();
                this.keyboard(key);
            }
        }
    };
})();
var FormSlider;

(function () {
    'use strict';

    FormSlider = {
        mM: null,
        mU: null,
        dragElemObj: {},
        formsliderObj: {},
        track: null,
        edge: {},
        input: null,
        valUnit: 0,
        dragElemDistance: 0,
        dragSubscribers: [],
        dragEndSubscribers: [],
        formaters: {},

        init: function () {
            const sliders = document.querySelectorAll('.formslider');

            for (let i = 0; i < sliders.length; i++) {
                const sliderEl = sliders[i],
                    isRange = sliders[i].getAttribute('data-range');

                let dragElem;

                if (isRange == 'true') {
                    dragElem = '<button type="button" class="formslider__drag" data-index="0" data-input="' + sliderEl.getAttribute('data-first-input') + '"></button><button type="button" class="formslider__drag" data-index="1" data-input="' + sliderEl.getAttribute('data-second-input') + '"></button>';
                } else {
                    dragElem = '<button type="button" class="formslider__drag" data-input="' + sliderEl.getAttribute('data-input') + '"></button>';
                }

                sliderEl.innerHTML = '<div class="formslider__bar"><div class="formslider__track"></div>' + dragElem + '</div>';

                this.setInitState(sliderEl);
            }

            document.addEventListener('mousedown', this.mouseDown.bind(this));
            document.addEventListener('touchstart', this.mouseDown.bind(this));
        },

        reInit: function () {
            const sliders = document.querySelectorAll('.formslider');

            for (var i = 0; i < sliders.length; i++) {
                this.setInitState(sliders[i]);
            }
        },

        setInitState: function (slider) {
            const dragElems = slider.querySelectorAll('.formslider__drag'),
                trackEl = slider.querySelector('.formslider__track'),
                dragWidth = dragElems[0].offsetWidth,
                sliderW = slider.offsetWidth,
                min = +slider.getAttribute('data-min'),
                max = +slider.getAttribute('data-max'),
                isRange = slider.getAttribute('data-range'),
                isVertical = slider.getAttribute('data-vertical');

            if (isRange == 'true') {
                for (let i = 0; i < dragElems.length; i++) {
                    const dragEl = dragElems[i],
                        inpEl = document.getElementById(dragEl.getAttribute('data-input'));

                    let inpVal = inpEl.hasAttribute('data-value') ? +inpEl.getAttribute('data-value') : +inpEl.value;

                    if (inpVal > max) {
                        inpVal = max;
                    }

                    const left = ((inpVal - min) / ((max - min) / 100)) * ((sliderW - dragWidth) / 100);

                    dragEl.style.left = left + 'px';

                    if (i == 0) {
                        trackEl.style.left = (left + dragWidth / 2) + 'px';
                    } else {
                        trackEl.style.right = (sliderW - left - dragWidth / 2) + 'px';
                    }
                }

            } else {
                const dragEl = dragElems[0],
                    inpEl = document.getElementById(dragEl.getAttribute('data-input'));

                let inpVal = inpEl.hasAttribute('data-value') ? +inpEl.getAttribute('data-value') : +inpEl.value;

                if (inpVal > max) {
                    inpVal = max;
                }

                if (isVertical) {

                } else {
                    const left = ((inpVal - min) / ((max - min) / 100)) * ((sliderW - dragWidth) / 100);

                    dragEl.style.left = left + 'px';
                }
            }
        },

        // on mouse down
        mouseDown: function (e) {
            if (e.type == 'mousedown' && e.which != 1) {
                return;
            }

            var elem = e.target.closest('.formslider__drag');

            if (!elem) {
                return;
            }

            this.mM = this.mouseMove.bind(this);
            this.mU = this.mouseUp.bind(this);

            document.addEventListener('mousemove', this.mM);
            document.addEventListener('touchmove', this.mM, {passive: false});

            document.addEventListener('mouseup', this.mU);
            document.addEventListener('touchend', this.mU);

            const clientX = (e.type == 'touchstart') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

            // formslider options
            var formslider = elem.closest('.formslider');
            this.formsliderObj.X = formslider.getBoundingClientRect().left;
            this.formsliderObj.Y = formslider.getBoundingClientRect().bottom;
            this.formsliderObj.width = formslider.offsetWidth;
            this.formsliderObj.height = formslider.offsetHeight;
            this.formsliderObj.isRange = formslider.getAttribute('data-range');
            this.formsliderObj.isVertical = formslider.getAttribute('data-vertical') === 'true' || false;
            this.formsliderObj.min = +formslider.getAttribute('data-min');

            // dragable options
            this.dragElemObj.elem = elem;
            this.dragElemObj.X = elem.getBoundingClientRect().left;
            this.dragElemObj.Y = elem.getBoundingClientRect().bottom;
            this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
            this.dragElemObj.shiftY = this.dragElemObj.Y - clientY;
            this.dragElemObj.index = elem.getAttribute('data-index');
            this.dragElemObj.width = elem.offsetWidth;
            this.dragElemObj.height = elem.offsetHeight;
            elem.setAttribute('data-active', 'true');

            // one unit of value
            if (this.formsliderObj.isVertical) {
                this.valUnit = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / (formslider.offsetHeight - elem.offsetHeight);
            } else {
                this.valUnit = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / (formslider.offsetWidth - elem.offsetWidth);
            }


            this.oneValPerc = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / 100;

            // track
            this.track = formslider.querySelector('.formslider__track');

            // get parameters of slider
            if (this.formsliderObj.isRange) {

                if (this.dragElemObj.index == 0) {

                    var siblElem = formslider.querySelector('.formslider__drag[data-index="1"]');

                    this.edge.L = 0;

                    this.edge.R = siblElem.getBoundingClientRect().left - this.formsliderObj.X - siblElem.offsetWidth;

                } else if (this.dragElemObj.index == 1) {

                    var siblElem = formslider.querySelector('.formslider__drag[data-index="0"]');

                    this.edge.L = siblElem.getBoundingClientRect().left - this.formsliderObj.X + siblElem.offsetWidth;

                    this.edge.R = this.formsliderObj.width - elem.offsetWidth;
                }

            } else {
                this.edge.L = 0;

                if (this.formsliderObj.isVertical) {
                    this.edge.R = this.formsliderObj.height - elem.offsetHeight;
                } else {
                    this.edge.R = this.formsliderObj.width - elem.offsetWidth;
                }
            }

            this.input = document.getElementById(elem.getAttribute('data-input'));
        },

        // on mouse move
        mouseMove: function (e) {
            if (!this.dragElemObj.elem) {
                return;
            }

            e.preventDefault();

            const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchmove') ? e.targetTouches[0].clientY : e.clientY;

            let dragElemDistance = 0;

            if (this.formsliderObj.isVertical) {
                dragElemDistance = this.formsliderObj.Y - clientY - this.dragElemObj.shiftY;
            } else {
                dragElemDistance = clientX - this.dragElemObj.shiftX - this.formsliderObj.X;
            }

            if (dragElemDistance < this.edge.L) {
                dragElemDistance = this.edge.L;

            } else if (dragElemDistance > this.edge.R) {
                dragElemDistance = this.edge.R;
            }

            if (this.formsliderObj.isRange) {

                if (this.dragElemObj.index == 0) {
                    this.track.style.left = (dragElemDistance + 5) + 'px';
                } else if (this.dragElemObj.index == 1) {
                    this.track.style.right = (this.formsliderObj.width - dragElemDistance - 5) + 'px';
                }

            } else {
                if (this.formsliderObj.isVertical) {
                    this.track.style.height = (dragElemDistance + 5) + 'px';
                } else {
                    this.track.style.width = (dragElemDistance + 5) + 'px';
                }
            }

            if (this.formsliderObj.isVertical) {
                this.dragElemObj.elem.style.bottom = dragElemDistance + 'px';
            } else {
                this.dragElemObj.elem.style.left = dragElemDistance + 'px';
            }

            this.dragElemDistance = dragElemDistance;

            this.setInputVal();
        },

        // end drag
        mouseUp: function () {
            document.removeEventListener('mousemove', this.mM);
            document.removeEventListener('touchmove', this.mM);

            document.removeEventListener('mouseup', this.mU);
            document.removeEventListener('touchend', this.mU);

            this.setInputVal();

            this.dragElemObj.elem.setAttribute('data-active', 'false');

            this.dragEndSubscribers.forEach(item => {
                item();
            });

            // reset properties
            this.dragElemObj = {};
            this.formsliderObj = {};
            this.track = null;
            this.edge = {};
            this.input = null;
            this.valUnit = 0;
            this.dragElemDistance = 0;
        },

        onDrag: function (fun) {
            if (typeof fun === 'function') {
                this.dragSubscribers.push(fun);
            }
        },

        onDragEnd: function (fun) {
            if (typeof fun === 'function') {
                this.dragEndSubscribers.push(fun);
            }
        },

        // set hidden input value
        setInputVal: function () {
            let val;

            if (this.formsliderObj.isRange) {
                if (this.dragElemObj.index == 0) {
                    val = Math.round((this.dragElemDistance / ((this.formsliderObj.width - this.dragElemObj.width * 2) / 100)) * this.oneValPerc);
                } else {
                    val = Math.round(((this.dragElemDistance - this.dragElemObj.width) / ((this.formsliderObj.width - this.dragElemObj.width * 2) / 100)) * this.oneValPerc);
                }
            } else {
                if (this.formsliderObj.isVertical) {
                    val = Math.round((this.dragElemDistance / ((this.formsliderObj.height - this.dragElemObj.height) / 100)) * this.oneValPerc);
                } else {
                    val = Math.round((this.dragElemDistance / ((this.formsliderObj.width - this.dragElemObj.width) / 100)) * this.oneValPerc);
                }
            }

            let inpVal = val + this.formsliderObj.min,
                labelVal = val + this.formsliderObj.min;

            const formatId = this.input.getAttribute('data-format');

            if (formatId !== null && this.formaters[formatId]) {
                inpVal = this.formaters[formatId](inpVal);
            }

            this.input.value = inpVal;

            if (this.dragSubscribers.length) {
                this.dragSubscribers.forEach(item => {
                    item(this.input, inpVal);
                });
            }

            const labelId = this.input.getAttribute('data-label-id');

            if (labelId) {
                const labelEl = document.getElementById(labelId),
                    formatId = labelEl.getAttribute('data-format');

                if (formatId !== null && this.formaters[formatId]) {
                    labelVal = this.formaters[formatId](labelVal);
                }

                labelEl.innerHTML = labelVal;
            }
        },

        format: function (id, fun) {
            this.formaters[id] = fun;
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        FormSlider.init();

        window.addEventListener('winResized', function () {
            FormSlider.reInit();
        });
    });

})();
; var AutoComplete;

(function () {
    'use strict';

    AutoComplete = {
        fieldElem: null,
        inputElem: null,
        optionsElem: null,
        setValues: null,
        opt: {},
        onSelectSubscribers: [],

        open: function (optH) {
            this.fieldElem.classList.add('autocomplete_opened');

            const optionsHeight = optH || 185;

            this.optionsElem.style.height = (optionsHeight + 2) + 'px';
            this.optionsElem.scrollTop = 0;

            setTimeout(() => {
                this.optionsElem.classList.add('ovfauto');
            }, 550);
        },

        close: function (inputElem) {
            const inpElem = inputElem || this.inputElem,
                fieldElem = inpElem.closest('.autocomplete'),
                optionsElem = fieldElem.querySelector('.autocomplete__options');

            fieldElem.classList.remove('autocomplete_opened');

            optionsElem.classList.remove('ovfauto');
            optionsElem.style.height = 0;
        },

        searchValue: function () {
            if (!this.setValues) return;

            const permOpened = this.inputElem.getAttribute('data-perm-opened') === 'true';

            let values = '';

            if (this.inputElem.value.length) {
                const preReg = new RegExp('(' + this.inputElem.value.replace(/(\(|\))/g,'\\$1') + ')', 'i');

                this.setValues(this.inputElem, (valuesData, nameKey, valKey, secValKey, searchMode = true) => {
                    if (valuesData) {
                        for (let i = 0; i < valuesData.length; i++) {
                            const valData = valuesData[i];

                            if (!permOpened) {
                                if (nameKey !== undefined) {
                                    if (valData[nameKey].match(preReg) || !searchMode) {
                                        values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey].replace(preReg, '<span>$1</span>') + '</button></li>';
                                    } else {
                                        this.optionsElem.innerHTML = '';
                                        this.close();
                                    }
                                } else {
                                    if (valData.match(preReg)) {
                                        values += '<li><button type="button" class="autocomplete__val">' + valData.replace(preReg, '<span>$1</span>') + '</button></li>';
                                    } else {
                                        this.optionsElem.innerHTML = '';
                                        this.close();
                                    }
                                }

                            } else {
                                values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey].replace(preReg, '<span>$1</span>') + '</button></li>';
                            }
                        }
                    }

                    if (values == '') {
                        if (!valuesData || !valuesData.length) {
                            values = '<li class="autocomplete__options-empty">' + this.inputElem.getAttribute('data-empty-text') + '</li>';

                            this.optionsElem.innerHTML = values;

                            this.open(this.optionsElem.querySelector('.autocomplete__options-empty').offsetHeight);

                        } else if (this.inputElem.hasAttribute('data-other-value')) {
                            values = '<li class="autocomplete__options-other"><button type="button" class="autocomplete__val">' + this.inputElem.getAttribute('data-other-value') + '</button></li>';

                            this.optionsElem.innerHTML = values;

                            this.open(this.optionsElem.querySelector('.autocomplete__options-other').offsetHeight);

                        } else if (this.inputElem.hasAttribute('data-nf-text')) {
                            values = '<li class="autocomplete__options-empty">' + this.inputElem.getAttribute('data-nf-text') + '</li>';

                            this.optionsElem.innerHTML = values;

                            this.open(this.optionsElem.querySelector('.autocomplete__options-empty').offsetHeight);
                        }


                    } else {
                        this.optionsElem.innerHTML = values;
                        this.open();
                    }
                });

            } else {
                if (this.opt.getAllValuesIfEmpty) {
                    this.setValues(this.inputElem, (valuesData, nameKey, valKey, secValKey) => {
                        if (valuesData) {
                            for (let i = 0; i < valuesData.length; i++) {
                                const valData = valuesData[i];

                                if (nameKey !== undefined) {
                                    values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey] + '</button></li>';
                                } else {
                                    values += '<li><button type="button" class="autocomplete__val">' + valData + '</button></li>';
                                }
                            }

                            this.optionsElem.innerHTML = values;
                            this.open();
                        }
                    });

                } else {
                    this.optionsElem.innerHTML = '';
                    this.close();
                }
            }
        },

        selectVal: function (itemElem, ev) {
            const valueElem = itemElem.querySelector('.autocomplete__val');

            if (!valueElem) {
                return;
            }

            if (window.Placeholder) {
                Placeholder.hide(this.inputElem, true);
            }

            const inpVal = valueElem.innerHTML.replace(/<\/?span>/g, '');

            this.inputElem.value = inpVal;

            if (ev == 'click' || ev == 'enter') {
                this.onSelectSubscribers.forEach(item => {
                    item(this.inputElem, inpVal, valueElem.getAttribute('data-value'), valueElem.getAttribute('data-second-value'));
                });
            }
        },

        onSelect: function (fun) {
            if (typeof fun === 'function') {
                this.onSelectSubscribers.push(fun);
            }
        },

        keybinding: function (e) {
            const key = e.which || e.keyCode || 0;

            if (key != 40 && key != 38 && key != 13) return;

            e.preventDefault();

            const optionsElem = this.optionsElem,
                hoverItem = optionsElem.querySelector('li.hover');

            switch (key) {
                case 40:
                    if (hoverItem) {
                        var nextItem = hoverItem.nextElementSibling;

                        if (nextItem) {
                            hoverItem.classList.remove('hover');
                            nextItem.classList.add('hover');

                            optionsElem.scrollTop = optionsElem.scrollTop + (nextItem.getBoundingClientRect().top - optionsElem.getBoundingClientRect().top);

                            this.selectVal(nextItem);
                        }
                    } else {
                        var nextItem = optionsElem.firstElementChild;

                        if (nextItem) {
                            nextItem.classList.add('hover');

                            this.selectVal(nextItem);
                        }
                    }
                    break;

                case 38:
                    if (hoverItem) {
                        var nextItem = hoverItem.previousElementSibling;

                        if (nextItem) {
                            hoverItem.classList.remove('hover');
                            nextItem.classList.add('hover');

                            optionsElem.scrollTop = optionsElem.scrollTop + (nextItem.getBoundingClientRect().top - optionsElem.getBoundingClientRect().top);

                            this.selectVal(nextItem);
                        }
                    } else {
                        var nextItem = optionsElem.lastElementChild;

                        if (nextItem) {
                            nextItem.classList.add('hover');

                            optionsElem.scrollTop = 9999;

                            this.selectVal(nextItem);
                        }
                    }
                    break;

                case 13:
                    if (hoverItem) {
                        this.selectVal(hoverItem, 'enter');

                        this.inputElem.blur();
                    }
            }
        },

        init: function (options) {
            options = options || {};

            this.opt.getAllValuesIfEmpty = (options.getAllValuesIfEmpty !== undefined) ? options.getAllValuesIfEmpty : true;

            const acElems = document.querySelectorAll('.autocomplete');

            for (let i = 0; i < acElems.length; i++) {
                const acEl = acElems[i],
                    inputElem = acEl.querySelector('.autocomplete__input');

                this.setValues(inputElem, (valuesData, nameKey, valKey, secValKey, permOpened) => {
                    if (!permOpened) return;

                    inputElem.setAttribute('data-perm-opened', true);

                    const optionsElem = acEl.querySelector('.autocomplete__options');

                    let values = '';

                    for (let i = 0; i < valuesData.length; i++) {
                        const valData = valuesData[i];

                        if (nameKey !== undefined) {
                            values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey] + '</button></li>';
                        } else {
                            values += '<li><button type="button" class="autocomplete__val">' + valData + '</button></li>';
                        }
                    }

                    optionsElem.innerHTML = values;
                });
            }

            // focus event
            document.addEventListener('focus', (e) => {
                var elem = e.target.closest('.autocomplete__input');

                if (!elem) return;

                this.fieldElem = elem.closest('.autocomplete');
                this.inputElem = elem;
                this.optionsElem = this.fieldElem.querySelector('.autocomplete__options');

                this.searchValue();
            }, true);

            // blur event
            document.addEventListener('blur', (e) => {
                const inpElem = e.target.closest('.autocomplete__input');

                if (inpElem) {
                    setTimeout(() => {
                        this.close(inpElem);
                    }, 321);
                }
            }, true);

            // input event
            document.addEventListener('input', (e) => {
                if (e.target.closest('.autocomplete__input')) {
                    this.searchValue();
                }
            });

            // click event
            document.addEventListener('click', (e) => {
                const valElem = e.target.closest('.autocomplete__val'),
                    arrElem = e.target.closest('.autocomplete__arr');


                if (valElem) {
                    this.inputElem = valElem.closest('.autocomplete').querySelector('.autocomplete__input');

                    this.selectVal(valElem.parentElement, 'click');
                } else if (arrElem) {
                    if (!arrElem.closest('.autocomplete_opened')) {
                        arrElem.closest('.autocomplete').querySelector('.autocomplete__input').focus();
                    } else {
                        this.close();
                    }
                }
            });

            // keyboard events
            document.addEventListener('keydown', (e) => {
                if (e.target.closest('.autocomplete_opened')) {
                    this.keybinding(e);
                }
            });
        }
    };
})();
; var CustomFile;

(function () {
    'use strict';

    //custom file
    CustomFile = {
        input: null,
        filesObj: {},
        filesArrayObj: {},
        filesIsReady: null,

        init: function () {
            document.addEventListener('change', (e) => {
                const elem = e.target.closest('input[type="file"]');

                if (!elem) return;

                this.input = elem;

                this.changeInput(elem);
            });

            document.addEventListener('click', (e) => {
                const delBtnElem = e.target.closest('.custom-file__del-btn'),
                    clearBtnElem = e.target.closest('.custom-file__clear-btn'),
                    inputElem = e.target.closest('input[type="file"]');

                if (inputElem && inputElem.multiple) inputElem.value = null;

                if (delBtnElem) {
                    this.input = delBtnElem.closest('.custom-file').querySelector('.custom-file__input');

                    this.input.value = null;

                    delBtnElem.closest('.custom-file__items').removeChild(delBtnElem.closest('.custom-file__item'));

                    this.setFilesObj(false, delBtnElem.getAttribute('data-ind'));

                    if (this.filesDeleted) this.filesDeleted(this.input);
                }

                if (clearBtnElem) {
                    const inputElem = clearBtnElem.closest('.custom-file').querySelector('.custom-file__input');

                    inputElem.value = null;

                    this.clear(inputElem);
                }
            });
        },

        clear: function (inpEl, resetVal) {
            if (inpEl.hasAttribute('data-preview-elem')) {
                document.querySelector(inpEl.getAttribute('data-preview-elem')).innerHTML = '';
            }

            const itemsEl = inpEl.closest('.custom-file').querySelector('.custom-file__items');

            if (itemsEl) {
                itemsEl.innerHTML = '';
            }

            if (resetVal !== false) inpEl.value = null;

            this.filesObj[inpEl.id] = {};
            this.filesArrayObj[inpEl.id] = [];

            this.labelText(inpEl);
        },

        fieldClass: function (inputElem) {
            const fieldElem = inputElem.closest('.custom-file');

            if (this.filesArrayObj[inputElem.id].length) {
                fieldElem.classList.add('custom-file_loaded');

                if (this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
                    fieldElem.classList.add('custom-file_max-loaded');
                } else {
                    fieldElem.classList.remove('custom-file_max-loaded');
                }
            } else {
                fieldElem.classList.remove('custom-file_loaded');
                fieldElem.classList.remove('custom-file_max-loaded');
            }
        },

        lockUpload: function (inputElem) {
            if (inputElem.classList.contains('custom-file__input_lock') && inputElem.multiple && inputElem.hasAttribute('data-max-files') && this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
                inputElem.setAttribute('disabled', 'disable');
            } else {
                inputElem.removeAttribute('disabled');
            }
        },

        labelText: function (inputElem) {
            const labTxtElem = inputElem.closest('.custom-file').querySelector('.custom-file__label-text');

            if (!labTxtElem || !labTxtElem.hasAttribute('data-label-text-2')) {
                return;
            }

            const maxFiles = (inputElem.multiple) ? (+this.input.getAttribute('data-max-files')) : 1;

            if (this.filesArrayObj[inputElem.id].length >= maxFiles) {
                if (!labTxtElem.hasAttribute('data-label-text')) {
                    labTxtElem.setAttribute('data-label-text', labTxtElem.innerHTML);
                }

                if (labTxtElem.getAttribute('data-label-text-2') == '%filename%') {
                    labTxtElem.innerHTML = inputElem.files[0].name;
                } else {
                    labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text-2');
                }

            } else if (labTxtElem.hasAttribute('data-label-text')) {
                labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text');
            }
        },

        loadPreview: function (file, fileItem) {
            var reader = new FileReader(),
                previewDiv;

            if (this.input.hasAttribute('data-preview-elem')) {
                previewDiv = document.querySelector(this.input.getAttribute('data-preview-elem'));
            } else {
                previewDiv = document.createElement('div');

                previewDiv.className = 'custom-file__preview';

                fileItem.insertBefore(previewDiv, fileItem.firstChild);
            }

            reader.onload = function (e) {
                setTimeout(function () {
                    var imgDiv = document.createElement('div');

                    imgDiv.innerHTML = (file.type.match(/image.*/)) ? '<img src="' + e.target.result + '">' : '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMzAwcHgiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDAgMzAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxyZWN0IGZpbGw9IiNCOEQ4RkYiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIi8+DQo8cG9seWdvbiBmaWxsPSIjN0M3QzdDIiBwb2ludHM9IjUxLDI2Ny42NjY5OTIyIDExMSwxOTcgMTUxLDI0My42NjY5OTIyIDI4OC4zMzMwMDc4LDEyMSAzMDAuMTY2OTkyMiwxMzQuMTY2NTAzOSAzMDAsMzAwIDAsMzAwIA0KCTAsMjA4LjgzMzk4NDQgIi8+DQo8cG9seWdvbiBmaWxsPSIjQUZBRkFGIiBwb2ludHM9IjAuMTI1LDI2Ny4xMjUgNDguODMzNDk2MSwxNzQuNjY2OTkyMiAxMDMuNSwyNjQuNSAyMDMuODc1LDY1LjMzMzAwNzggMzAwLjE2Njk5MjIsMjU0LjUgMzAwLDMwMCANCgkwLDMwMCAiLz4NCjxjaXJjbGUgZmlsbD0iI0VBRUFFQSIgY3g9Ijc3LjAwMDI0NDEiIGN5PSI3MSIgcj0iMzYuNjY2NzQ4Ii8+DQo8L3N2Zz4NCg==">';

                    previewDiv.appendChild(imgDiv);

                    previewDiv.classList.add('custom-file__preview_loaded');
                }, 121);
            }

            reader.readAsDataURL(file);
        },

        changeInput: function (elem) {
            var fileItems = elem.closest('.custom-file').querySelector('.custom-file__items');

            if (elem.getAttribute('data-action') == 'clear' || !elem.multiple) {
                this.clear(elem, false);
            }

            for (var i = 0; i < elem.files.length; i++) {
                var file = elem.files[i];

                if (this.filesObj[elem.id] && this.filesObj[elem.id][file.name] != undefined) continue;

                var fileItem = document.createElement('div');

                fileItem.className = 'custom-file__item';
                fileItem.innerHTML = '<div class="custom-file__name">' + file.name + '</div><button type="button" class="custom-file__del-btn" data-ind="' + file.name + '"></button>';

                if (fileItems) {
                    fileItems.appendChild(fileItem);
                }

                this.loadPreview(file, fileItem);
            }

            this.setFilesObj(elem.files);

            if (this.filesIsReady) {
                this.filesIsReady(elem);
            }
        },

        setFilesObj: function (filesList, objKey) {
            var inputElem = this.input;

            if (!inputElem.id.length) {
                inputElem.id = 'custom-file-input-' + new Date().valueOf();
            }

            if (filesList) {
                this.filesObj[inputElem.id] = this.filesObj[inputElem.id] || {};

                for (var i = 0; i < filesList.length; i++) {
                    this.filesObj[inputElem.id][filesList[i].name] = filesList[i];
                }
            } else {
                delete this.filesObj[inputElem.id][objKey];
            }

            this.filesArrayObj[inputElem.id] = [];

            for (var key in this.filesObj[inputElem.id]) {
                this.filesArrayObj[inputElem.id].push(this.filesObj[inputElem.id][key]);
            }

            this.fieldClass(inputElem);

            this.labelText(inputElem);

            this.lockUpload(inputElem);

            ValidateForm.file(inputElem, this.filesArrayObj[inputElem.id]);
        },

        inputFiles: function (inputElem) {
            return this.filesArrayObj[inputElem.id] || [];
        },

        getFiles: function (formElem) {
            var inputFileElements = formElem.querySelectorAll('.custom-file__input'),
                filesArr = [];

            if (inputFileElements.length == 1) {
                filesArr = this.filesArrayObj[inputFileElements[0].id];
            } else {
                for (var i = 0; i < inputFileElements.length; i++) {
                    if (this.filesArrayObj[inputFileElements[i].id]) {
                        filesArr.push({ name: inputFileElements[i].name, files: this.filesArrayObj[inputFileElements[i].id] });
                    }
                }
            }

            return filesArr;
        }
    };

    //init script
    document.addEventListener('DOMContentLoaded', function () {
        CustomFile.init();
    });
})();
; var Placeholder;

(function () {
    'use strict';

    Placeholder = {
        elementsStr: null,

        init: function (elementsStr) {
            const elements = document.querySelectorAll(elementsStr);

            if (!elements.length) {
                return;
            }

            this.elementsStr = elementsStr;

            for (let i = 0; i < elements.length; i++) {
                const elem = elements[i];

                if (elem.placeholder) {

                    const elemFor = (elem.id) ? elem.id : 'placeholder-index-' + i,
                        label = document.createElement('label');

                    label.htmlFor = elemFor;
                    label.className = 'placeholder';
                    label.innerHTML = elem.placeholder;

                    if (elem.hasAttribute('data-hide-placeholder')) {
                        label.setAttribute('data-hide-placeholder', elem.getAttribute('data-hide-placeholder'));
                    }

                    elem.parentElement.insertBefore(label, elem);

                    elem.removeAttribute('placeholder');
                    elem.removeAttribute('data-hide-placeholder');

                    if (!elem.id) {
                        elem.id = elemFor;
                    }

                }

                if (elem.value.length) {
                    this.hide(elem, true);
                }
            }

            //events
            document.removeEventListener('input', this.iH);
            document.removeEventListener('focus', this.fH, true);
            document.removeEventListener('blur', this.bH, true);

            this.iH = this.iH.bind(this);
            this.fH = this.fH.bind(this);
            this.bH = this.bH.bind(this);

            document.addEventListener('input', this.iH);
            document.addEventListener('focus', this.fH, true);
            document.addEventListener('blur', this.bH, true);
        },

        iH: function (e) {
            const elem = e.target.closest(this.elementsStr);

            if (!elem) return;

            if (elem.value.length > 0) {
                this.hide(elem, true, 'input');
            } else {
                this.hide(elem, false, 'input');
            }
        },

        fH: function (e) {
            const elem = e.target.closest(this.elementsStr);

            if (elem) {
                this.hide(elem, true, 'focus');
            }
        },

        bH: function (e) {
            const elem = e.target.closest(this.elementsStr);

            if (elem) {
                this.hide(elem, false);
            }
        },

        hide: function (elem, hide, ev) {
            const label = document.querySelector('label.placeholder[for="' + elem.id + '"]');

            if (!label) {
                return;
            }

            if (hide) {
                if (ev == 'focus' && label.getAttribute('data-hide-placeholder') == 'input') return;

                label.style.display = 'none';

            } else if (!elem.value.length) {
                label.style.display = '';
            }
        },

        reInit: function () {
            this.init(this.elementsStr);
        }
    };
})();
var Maskinput;

(function () {
    'use strict';

    Maskinput = function (inputSel, type, opt) {
        opt = opt || {};

        let defValue = '';

        this.inputElem = null;

        document.addEventListener('input', (e) => {
            const inpEl = e.target.closest(inputSel);

            if (inpEl) {
                this.inputElem = inpEl;

                try {
                    this[type]();
                } catch (error) {
                    console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
                }
            }
        });

        document.addEventListener('focus', (e) => {
            const inpEl = e.target.closest(inputSel);

            if (inpEl) {
                this.inputElem = inpEl;

                defValue = inpEl.value;

                try {
                    this[type]('focus');
                } catch (error) {
                    console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
                }
            }
        }, true);

        this.tel = function (ev) {
            if (ev == 'focus' && !this.inputElem.value.length) {
                this.inputElem.value = '+';
            } else if (ev == 'focus') {
                const val = this.inputElem.value.replace(/\D/ig, '');
                this.inputElem.value = val.replace(/(\d*)/, '+$1');
                defValue = this.inputElem.value;
            }

            if (!/[\+\d]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                const reg = /^\+\d*$/;
                console.log('else', this.inputElem.value, reg.test(this.inputElem.value));

                if (!reg.test(this.inputElem.value) && this.inputElem.value.length) {
                    const val = this.inputElem.value.replace(/\D/ig, '');
                    this.inputElem.value = val.replace(/(\d*)/, '+$1');
                }

                if (!reg.test(this.inputElem.value) && this.inputElem.value.length) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.tel_RU = function (ev) {
            if (ev == 'focus' && !this.inputElem.value.length) {
                this.inputElem.value = '+7(';
            }

            if (!/[\+\d\(\)\-]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                var reg = /^(\+7?)?(\(\d{0,3})?(\)\d{0,3})?(\-\d{0,2}){0,2}$/,
                    cursPos = this.inputElem.selectionStart;

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = this.inputElem.value.replace(/^(?:\+7?)?\(?(\d{0,3})\)?(\d{0,3})\-?(\d{0,2})\-?(\d{0,2})$/, function (str, p1, p2, p3, p4) {
                        var res = '';

                        if (p4 != '') {
                            res = '+7(' + p1 + ')' + p2 + '-' + p3 + '-' + p4;
                        } else if (p3 != '') {
                            res = '+7(' + p1 + ')' + p2 + '-' + p3;
                        } else if (p2 != '') {
                            res = '+7(' + p1 + ')' + p2;
                        } else if (p1 != '') {
                            res = '+7(' + p1;
                        }

                        return res;
                    });
                }

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.date = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[\d\.]*$/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                if (this.inputElem.value.length > defValue.length) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,2})\.?(\d{0,2})\.?(\d{0,4})$/, function (str, p1, p2, p3) {
                        let res;

                        if (+p1[0] > 3 || Number(p1) > 31) return defValue;

                        if (p3 != '') {
                            res = p1 + '.' + p2 + '.' + p3;
                        } else if (p2 != '') {
                            if (+p2[0] > 1 || Number(p2) > 12) return defValue;

                            if (p2.length == 2) {
                                res = p1 + '.' + p2 + '.';
                            } else {
                                res = p1 + '.' + p2;
                            }
                        } else if (p1.length == 2) {
                            res = p1 + '.';
                        } else {
                            res = p1;
                        }

                        return res;
                    });
                }

                if (!/^\d{0,2}(\.\d{0,2}(\.\d{0,4})?)?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.time = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[\d\:]*$/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                const reg = /^\d{0,2}(\:\d{0,2})?$/;

                if (this.inputElem.value.length > defValue.length) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,2})\:?(\d{0,2})$/, function (str, p1, p2) {
                        let res;

                        if (p2 != '') {
                            if (+p2[0] > 5 || Number(p2) > 59) return defValue;

                            res = p1 + ':' + p2;

                        } else {
                            if (+p1[0] > 2 || Number(p1) > 23) return defValue;

                            res = p1;

                            if (p1.length == 2) res += ':';
                        }

                        return res;
                    });
                }

                if (!/^\d{0,2}(\:\d{0,2})?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.gmail = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/[@\w.-]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                const reg = /^[\w.-]*(@gmail\.com)?$/;

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = this.inputElem.value.replace(/^([\w.-]*)@(?:gmail\.com)?$/, '$1@gmail.com');
                }

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.int = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (opt.maxLength && this.inputElem.value.length > opt.maxLength) {
                this.inputElem.value = defValue;
            } else if (opt.maxValue && Number(this.inputElem.value) > Number(opt.maxValue)) {
                this.inputElem.value = defValue;
            } else {
                if (!/^\d*$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.float = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (opt.maxLength && this.inputElem.value.length > opt.maxLength) {
                this.inputElem.value = defValue;
            } else {
                if (!/^\d?[\d.,]*?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.cyr = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[а-я\s]*$/i.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                defValue = this.inputElem.value;
            }
        }

        this.cardNumber = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[\d\-]*$/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                if (this.inputElem.value.length > defValue.length) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,4})\-?(\d{0,4})\-?(\d{0,4})\-?(\d{0,4})$/, function (str, p1, p2, p3, p4) {
                        let res;

                        if (p4 != '') {
                            res = p1 + '-' + p2 + '-' + p3 + '-' + p4;

                        } else if (p3 != '') {
                            res = p1 + '-' + p2 + '-' + p3;

                            if (p3.length == 4) res += '-';

                        } else if (p2 != '') {
                            res = p1 + '-' + p2;

                            if (p2.length == 4) res += '-';

                        } else {
                            res = p1;

                            if (p1.length == 4) res += '-'
                        }

                        return res;
                    });
                }

                if (!/^\d{0,4}(\-\d{0,4}(\-\d{0,4}(\-\d{0,4})?)?)?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }
    }
})();
// NextFieldset.init(...params);

var NextFieldset;

(function () {
    'use strict';

    NextFieldset = {
        onChange: null,
        opt: {},

        next: function (btnElem, fwd) {
            const currentFieldset = btnElem.closest('.fieldset__item');

            let nextFieldset = null;

            if (fwd) {
                if (this.opt.nextPending) {
                    let nextEl = currentFieldset.nextElementSibling;

                    if (!nextEl.classList.contains('pending')) {
                        while (nextEl && !nextEl.classList.contains('pending')) {
                            if (nextEl.nextElementSibling.classList.contains('pending')) {
                                nextFieldset = nextEl.nextElementSibling;
                            }

                            nextEl = nextEl.nextElementSibling;
                        }

                    } else {
                        nextFieldset = nextEl;
                    }

                } else {
                    nextFieldset = currentFieldset.nextElementSibling;
                }

            } else {
                nextFieldset = currentFieldset.previousElementSibling;
            }

            if (!nextFieldset) return;

            const goTo = (fwd) ? ValidateForm.validate(currentFieldset) : true;

            if (goTo) {
                currentFieldset.classList.add('fieldset__item_hidden');
                currentFieldset.classList.remove('pending');
                currentFieldset.classList.add('success');
                nextFieldset.classList.remove('fieldset__item_hidden');

                if (this.opt.focusInput) {
					const inpEl = nextFieldset.querySelector('input[type="text"]');

					if (inpEl) inpEl.focus();
				}

                $('html,body').stop().animate({
                    scrollTop: $(currentFieldset).closest('.fieldset').offset().top - $('.header').innerHeight() - 35
                }, 210);

                if (this.onChange) {
                    this.onChange(currentFieldset, nextFieldset);
                }
            }
        },

        /**
         * @param {string} nextBtnSelector
         * @param {string} prevBtnSelector
         * @param {object} options
         */
        init: function (nextBtnSelector, prevBtnSelector, options) {
            const fsEls = document.querySelectorAll('.fieldset'),
                fsItemEls = document.querySelectorAll('.fieldset__item');

            for (let i = 0; i < fsItemEls.length; i++) {
                const itEl = fsItemEls[i];
                itEl.classList.add('pending');

                if (i > 0) {
                    itEl.classList.add('fieldset__item_hidden');
                }
            }

            for (let i = 0; i < fsEls.length; i++) {
                const fEl = fsEls[i];
                fEl.classList.add('initialized');
            }

            options = options || {};

            this.opt.nextPending = (options.nextPending !== undefined) ? options.nextPending : false;
            this.opt.focusInput = (options.focusInput !== undefined) ? options.focusInput : false;

            document.addEventListener('click', (e) => {
                var nextBtnElem = e.target.closest(nextBtnSelector),
                    prevBtnElem = e.target.closest(prevBtnSelector);

                if (nextBtnElem) {
                    this.next(nextBtnElem, true);
                } else if (prevBtnElem) {
                    this.next(prevBtnElem, false);
                }
            });
        }
    };
})();
(function () {
    'use strict';

    const Number = {
        contEl: null,
        inputEl: null,
        defValue: 0,

        init: function () {
            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest('.number__btn');

                if (btnEl) this.clickHandler(btnEl);
            });

            document.addEventListener('input', (e) => {
                const inpEl = e.target.closest('.number__input');

                if (inpEl) this.inputHandler(inpEl);
            });

            document.addEventListener('blur', (e) => {
                const inpEl = e.target.closest('.number__input');

                if (inpEl) this.blurHandler(inpEl);
            }, true);
        },

        clickHandler: function (btnEl) {
            this.contEl = btnEl.closest('.number');
            this.inputEl = this.contEl.querySelector('.number__input');

            const action = +btnEl.getAttribute('data-action');

            let val;

            if (action > 0) {
                val = +this.inputEl.value + 1;
            } else {
                val = +this.inputEl.value - 1;

                if (val < 0) {
                    val = 0;
                }
            }

            this.inputEl.value = val;
            this.defValue = val;
        },

        inputHandler: function (inpEl) {
            this.inputEl = inpEl;

            if (!/^\d*$/.test(this.inputEl.value)) {
                this.inputEl.value = this.defValue;
            } else {
                if (/^0+$/.test(this.inputEl.value)) {
                    this.inputEl.value = 0;
                }

                this.defValue = this.inputEl.value;
            }
        },

        blurHandler: function(inpEl) {
            this.inputEl = inpEl;

            if (!this.inputEl.value.length) {
                this.inputEl.value = 0;
                this.defValue = 0;
            }
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        Number.init();
    });

})();
var Form, DuplicateForm;

(function () {
    'use strict';

    // variable height textarea
    var varHeightTextarea = {
        setHeight: function (elem) {
            var mirror = elem.parentElement.querySelector('.var-height-textarea__mirror'),
                mirrorOutput = elem.value.replace(/\n/g, '<br>');

            mirror.innerHTML = mirrorOutput + '&nbsp;';
        },

        init: function () {
            document.addEventListener('input', (e) => {
                var elem = e.target.closest('.var-height-textarea__textarea');

                if (!elem) {
                    return;
                }

                this.setHeight(elem);
            });
        }
    };

    // form
    Form = {
        formSelector: null,
        onSubmitSubscribers: [],

        init: function (formSelector) {
            if (!document.querySelector(formSelector)) return;

            this.formSelector = formSelector;

            initFormScripst();

            ValidateForm.init(formSelector);

            // submit event
            document.removeEventListener('submit', this.sH);

            this.sH = this.sH.bind(this);
            document.addEventListener('submit', this.sH);

            // keyboard event
            document.removeEventListener('keydown', this.kH);

            this.kH = this.kH.bind(this);
            document.addEventListener('keydown', this.kH);
        },

        sH: function (e) {
            const formElem = e.target.closest(this.formSelector);

            if (formElem) {
                this.submitForm(formElem, e);
            }
        },

        kH: function (e) {
            const formElem = e.target.closest(this.formSelector);

            if (!formElem) return;

            const key = e.code;

            if (e.target.closest('.fieldset__item') && key == 'Enter') {
                e.preventDefault();
                e.target.closest('.fieldset__item').querySelector('.js-next-fieldset-btn').click();

            } else if (e.ctrlKey && key == 'Enter') {
                e.preventDefault();
                this.submitForm(formElem, e);
            }
        },

        submitForm: function (formElem, e) {
            if (this.beforeSubmit) {
                this.beforeSubmit(formElem);
            }
            
            if (!ValidateForm.validate(formElem)) {
                if (e) e.preventDefault();

                const errFieldEl = formElem.querySelector('.field-error');

                if (errFieldEl.hasAttribute('data-error-index')) {
                    ValidateForm.customFormErrorTip(formElem, errFieldEl.getAttribute('data-form-error-text-' + errFieldEl.getAttribute('data-error-index')));
                } else if (errFieldEl.hasAttribute('data-form-error-text')) {
                    ValidateForm.customFormErrorTip(formElem, errFieldEl.getAttribute('data-form-error-text'));
                }

                return;
            }

            formElem.classList.add('form_sending');

            if (!this.onSubmitSubscribers.length) {
                formElem.submit();
                return;
            }

            let fReturn;

            this.onSubmitSubscribers.forEach(item => {
                fReturn = item(formElem, (obj) => {
                    obj = obj || {};

                    setTimeout(() => {
                        this.actSubmitBtn(obj.unlockSubmitButton, formElem);
                    }, 321);

                    formElem.classList.remove('form_sending');

                    if (obj.clearForm == true) {
                        this.clearForm(formElem);
                    }
                });
            });

            if (fReturn === true) {
                formElem.submit();
            } else {
                if (e) e.preventDefault();
                this.actSubmitBtn(false, formElem);
            }
        },

        onSubmit: function (fun) {
            if (typeof fun === 'function') {
                this.onSubmitSubscribers.push(fun);
            }
        },

        clearForm: function (formElem) {
            const elements = formElem.querySelectorAll('input[type="text"], input[type="number"],input[type="tel"], input[type="password"], textarea');

            for (let i = 0; i < elements.length; i++) {
                const elem = elements[i];
                elem.value = '';

                if (window.Placeholder) {
                    Placeholder.hide(elem, false);
                }
            }

            const checkboxEls = formElem.querySelectorAll('input[type="checkbox"]');

            for (let i = 0; i < checkboxEls.length; i++) {
                checkboxEls[i].checked = false;
            }

            if (window.Select) {
                Select.reset();
            }

            if (window.CustomFile) {
                const inpFileEls = formElem.querySelectorAll('.custom-file__input');

                for (let i = 0; i < inpFileEls.length; i++) {
                    CustomFile.clear(inpFileEls[i]);
                }
            }

            const textareaMirrors = formElem.querySelectorAll('.var-height-textarea__mirror');

            for (var i = 0; i < textareaMirrors.length; i++) {
                textareaMirrors[i].innerHTML = '';
            }
        },

        actSubmitBtn: function (state, formElem) {
            var elements = formElem.querySelectorAll('button[type="submit"], input[type="submit"]');

            for (var i = 0; i < elements.length; i++) {
                var elem = elements[i];

                if (state) {
                    elem.removeAttribute('disabled');
                } else {
                    elem.setAttribute('disabled', 'disable');
                }
            }
        }
    };

    // bind labels
    function BindLabels(elementsStr) {
        var elements = document.querySelectorAll(elementsStr);

        for (var i = 0; i < elements.length; i++) {
            var elem = elements[i],
                label = elem.parentElement.querySelector('label'),
                forID = (elem.hasAttribute('id')) ? elem.id : 'keylabel-' + i;

            if (label && !label.hasAttribute('for')) {
                label.htmlFor = forID;
                elem.id = forID;
            }
        }
    }

    // duplicate form
    DuplicateForm = {
        add: function (btnElem) {
            var modelElem = (btnElem.hasAttribute('data-form-model')) ? document.querySelector(btnElem.getAttribute('data-form-model')) : null,
                destElem = (btnElem.hasAttribute('data-duplicated-dest')) ? document.querySelector(btnElem.getAttribute('data-duplicated-dest')) : null;

            if (!modelElem || !destElem) return;

            var duplicatedDiv = document.createElement('div');

            duplicatedDiv.className = 'duplicated';

            duplicatedDiv.innerHTML = modelElem.innerHTML;

            destElem.appendChild(duplicatedDiv);

            var dupicatedElements = destElem.querySelectorAll('.duplicated');

            for (var i = 0; i < dupicatedElements.length; i++) {
                var dupicatedElem = dupicatedElements[i],
                    labelElements = dupicatedElem.querySelectorAll('label'),
                    inputElements = dupicatedElem.querySelectorAll('input');

                for (var j = 0; j < labelElements.length; j++) {
                    var elem = labelElements[j];

                    if (elem.htmlFor != '') {
                        elem.htmlFor += '-' + i + '-' + j;
                    }
                }

                for (var j = 0; j < inputElements.length; j++) {
                    var elem = inputElements[j];

                    if (elem.id != '') {
                        elem.id += '-' + i + '-' + j;
                    }
                }
            }

            if (window.Select) Select.init('.custom-select');

            if (this.onChange) this.onChange();
        },

        remove: function (btnElem) {
            var duplElem = btnElem.closest('.duplicated');

            if (duplElem) {
                duplElem.innerHTML = '';
            }

            if (this.onChange) this.onChange();
        },

        init: function (addBtnSelector, removeBtnSelector) {
            this.addBtnSelector = addBtnSelector;
            this.removeBtnSelector = removeBtnSelector;

            // click event
            document.removeEventListener('click', this.clickHandler);

            this.clickHandler = this.clickHandler.bind(this);
            document.addEventListener('click', this.clickHandler);
        },

        clickHandler: function (e) {
            const addBtnElem = e.target.closest(this.addBtnSelector),
                removeBtnElem = e.target.closest(this.removeBtnSelector);

            if (addBtnElem) {
                this.add(addBtnElem);
            } else if (removeBtnElem) {
                this.remove(removeBtnElem);
            }
        }
    };

    // set tabindex
    /*function SetTabindex(elementsStr) {
        var elements = document.querySelectorAll(elementsStr);
    	
        for (let i = 0; i < elements.length; i++) {
            var elem = elements[i];
        	
            if (!elemIsHidden(elem)) {
                elem.setAttribute('tabindex', i + 1);
            }
        }
    }*/

    // init scripts
    function initFormScripst() {
        BindLabels('input[type="text"], input[type="number"], input[type="tel"], input[type="checkbox"], input[type="radio"]');
        if (window.Placeholder) Placeholder.init('input[type="text"], input[type="number"], input[type="tel"], input[type="password"], textarea');
        // SetTabindex('input[type="text"], input[type="password"], textarea');
        varHeightTextarea.init();
        DuplicateForm.init('.js-dupicate-form-btn', '.js-remove-dupicated-form-btn');
        if (window.Select) Select.init('.custom-select');
        if (window.Checkbox) Checkbox.init({ focusOnTarget: true });
    }
})();
/*
new Accord({
    btnSelector: '.accord__button',
    autoScrollOnViewport: 700, // def: false
    maxViewport: 1000, // def: false
    collapseSiblings: false // def: true
});
*/
var Accord;

(function () {
    'use strict';

    Accord = function (options) {
        const opt = options || {};

        this.btnSel = opt.btnSelector;
        this.autoScroll = opt.autoScrollOnViewport || false;
        this.collapseSiblings = opt.collapseSiblings !== undefined ? opt.collapseSiblings : true;

        opt.maxViewport = opt.maxViewport || false;

        this.initialized = false;

        if (!this.initialized && document.querySelectorAll('.accord').length) {
            this.initialized = true;

            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(this.btnSel);

                if (
                    !btnEl ||
                    btnEl.closest('.accord_closed') ||
                    (opt.maxViewport && window.innerWidth > opt.maxViewport)
                ) {
                    return;
                }

                e.preventDefault();

                this.toggle(btnEl);
            });
        }

        this.toggle = function (elem) {
            const contentElem = elem.closest('.accord__item').querySelector('.accord__content');

            if (elem.classList.contains('active')) {
                contentElem.style.height = contentElem.offsetHeight + 'px';

                setTimeout(function () {
                    contentElem.style.height = '0';
                }, 21);

                elem.classList.remove('active');

            } else {
                const mainElem = elem.closest('.accord');

                if (this.collapseSiblings) {
                    const allButtonElem = mainElem.querySelectorAll(this.btnSel),
                        allContentElem = mainElem.querySelectorAll('.accord__content');

                    for (let i = 0; i < allButtonElem.length; i++) {
                        if (allButtonElem[i] != elem) {
                            allButtonElem[i].classList.remove('active');
                        }
                    }

                    for (let i = 0; i < allContentElem.length; i++) {
                        if (allContentElem[i] != contentElem) {
                            allContentElem[i].style.height = allContentElem[i].offsetHeight + 'px';

                            setTimeout(function () {
                                allContentElem[i].style.height = '0';
                            }, 21);
                        }
                    }
                }

                contentElem.style.height = contentElem.scrollHeight + 'px';

                setTimeout(() => {
                    contentElem.style.height = 'auto';

                    if (this.autoScroll && window.innerWidth <= this.autoScroll) {
                        this.scroll(elem);
                    }
                }, 300);

                elem.classList.add('active');
            }
        }

        this.scroll = function (elem) {
            setTimeout(function () {
                $('html, body').stop()
                    .animate({ scrollTop: $(elem).offset().top - $('.header').innerHeight() - 5 }, 721);
            }, 21);
        }
    };
})();
/*
Anchor.init(Str anchor selector[, Int duration ms[, Int shift px]]);
*/

var Anchor;

(function () {
    "use strict";

    Anchor = {
        duration: 1000,
        shift: 0,

        scroll: function (anchorId, e) {
            const anchorSectionElem = document.getElementById(anchorId + '-anchor');

            if (!anchorSectionElem) {
                return;
            }

            if (e) {
                e.preventDefault();
            }

            if (this.beforeScroll) {
                this.beforeScroll();
            }

            let scrollTo = anchorSectionElem.getBoundingClientRect().top + window.pageYOffset,
                ownShift = +anchorSectionElem.getAttribute('data-shift') || 0;

            if (window.innerWidth < 1000 && anchorSectionElem.hasAttribute('data-sm-shift')) {
                ownShift = +anchorSectionElem.getAttribute('data-sm-shift');
            }

            scrollTo = scrollTo - this.shift - ownShift;

            animate(function (progress) {
                window.scrollTo(0, ((scrollTo * progress) + ((1 - progress) * window.pageYOffset)));
            }, this.duration, 'easeInOutQuad', () => {
                if (this.afterScroll) {
                    this.afterScroll();
                }
            });
        },

        init: function (elementStr, duration, shift) {
            if (duration) {
                this.duration = duration;
            }

            if (shift) {
                this.shift = shift;
            }

            //click anchor
            document.addEventListener('click', (e) => {
                var elem = e.target.closest(elementStr);

                if (elem) {
                    const anchId = (elem.hasAttribute('href')) ? elem.getAttribute('href').split('#')[1] : elem.getAttribute('data-anchor-id');

                    this.scroll(anchId, e);
                }
            });

            //hash anchor
            if (window.location.hash) {
                window.addEventListener('load', () => {
                    this.scroll(window.location.hash.split('#')[1]);
                });
            }
        }
    };
})();
var Numberspin;

(function() {
	'use strict';

	Numberspin = function(options) {
		const opt = options || {};

		this.elements = document.querySelectorAll(opt.elemSelectors);
		this.values = [];

		for (var i = 0; i < this.elements.length; i++) {
			this.values[i] = +this.elements[i].getAttribute('data-value');
			this.elements[i].innerHTML = 0;
		}

		function draw(elem, num) {
			if (opt.format) {
				const numStr = String(num);

				elem.innerHTML = numStr.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
			} else {
				elem.innerHTML = num;
			}
		}

		this.animate = function(duration) {
			animate((progress) => {
				for (var i = 0; i < this.elements.length; i++) {
					let num = Math.round(this.values[i] * progress);

					if (num < 0) {
						num = 0;
					}

					draw(this.elements[i], num);
				}
			}, duration);
		}
	}
})();


/*
function Numberspin(elem, opt) {
	var def = {
		animation: 1
	},
	opt = opt || {},
	options = $.extend({}, def, opt),
	interval = null,
	animate = false,
	$Elem = $(elem),
	curVal = 0,
	val = $Elem.html().replace(/[\s]/g, ''),
	pattern = val.match(/[\.,]/),
	endVal = +val.replace(/[\D]/g, '');

	$Elem.html(0);

	this.start = function() {
		
		if (!animate) {
			animate = true;
			spin();
		}
	}

	function spin() {

		interval = setTimeout(function run() {

				if (curVal < endVal) {

					if (options.animation == 1) {

						var d = endVal - curVal;

						if (d > 1213214321321) {
							curVal = curVal + 1213214321321;
						} else if (d > 3214321321) {
							curVal = curVal + 3214321321;
						} else if (d > 4321321) {
							curVal = curVal + 4321321;
						} else if (d > 321321) {
							curVal = curVal + 321321;
						} else if (d > 32321) {
							curVal = curVal + 32321;
						} else if (d > 2321) {
							curVal = curVal + 2321;
						} else if (d > 1321) {
							curVal = curVal + 1321;
						} else if (d > 321) {
							curVal = curVal + 321;
						} else if (d > 21) {
							curVal = curVal + 21;
						} else {
							curVal++;
						}


					} else if (options.animation == 2) {

						var endValArr = String(endVal).split(''),
						curValArr = String(curVal).split('');

						for (var i = 0; i < endValArr.length; i++) {
							if (curValArr[i]) {
								if (curValArr[i] < endValArr[i] && curValArr[i-1] == endValArr[i-1]) {
									curValArr[i]++;
								}
							} else if (curValArr[i-1] && curValArr[i-1] == endValArr[i-1]) {
								curValArr[i] = 0;
							}

						}

						curVal = curValArr.join('');

					}

					var output = String(curVal);

					if (pattern) {
						output = output.replace(new RegExp('(\\d{'+ pattern.index +'})'), '$1'+ pattern[0]);
						output = output.replace(new RegExp('(\\d)?(?=(\\d{3})+?\\'+ pattern[0] +')', 'g'), '$1 ');
					} else {
						output = output.replace(/(\d)?(?=(\d{3})+$)/g, '$1 ');
					}
					
					$Elem.html(output);

					setTimeout(run, 85);

				} else {
					stop();
				}

		}, 1);

	}

	function stop() {
		clearTimeout(interval);
	}

}

var numberspinObj = [], i = 0, ind;
function numberspin(elem, opt) {
	if ($(elem)[0].ind == undefined) {
		$(elem)[0].ind = ind = i;
	} else {
		ind = $(elem)[0].ind;
	}

	if (!(numberspinObj[elem+ind] instanceof Numberspin)) {
		numberspinObj[elem+ind] = new Numberspin(elem, opt);
	}
	i++;

	return numberspinObj[elem+ind];
}
*/
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
//# sourceMappingURL=script.defer.js.map
