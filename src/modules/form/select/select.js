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