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