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