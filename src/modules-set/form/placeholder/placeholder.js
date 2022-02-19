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