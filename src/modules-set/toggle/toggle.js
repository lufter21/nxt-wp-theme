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