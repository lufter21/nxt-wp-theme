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