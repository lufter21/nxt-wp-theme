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