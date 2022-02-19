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