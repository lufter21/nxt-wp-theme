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