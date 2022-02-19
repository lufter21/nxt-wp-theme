/*
Tab.init({
    container: '.tab',
    button: '.tab__button',
    item: '.tab__item',
    hash: true, // default: false
    changeOnHover: true // default: false
});

Tab.onChange(function(btnElem) {
    // body
});
*/

var Tab;

(function () {
    'use strict';

    Tab = {
        options: null,
        onChangeSubscribers: [],
        changing: false,

        init: function (options) {
            const contElements = document.querySelectorAll(options.container);

            if (!contElements.length) return;

            this.options = options;

            //init tabs
            for (let i = 0; i < contElements.length; i++) {
                const contElem = contElements[i],
                    btnElements = contElem.querySelectorAll(options.button),
                    tabItemElements = contElem.querySelectorAll(options.item);

                for (let i = 0; i < btnElements.length; i++) {
                    btnElements[i].setAttribute('data-index', i);
                    tabItemElements[i].setAttribute('data-index', i);
                }

                btnElements[0].classList.add('active');
                tabItemElements[0].classList.add('active');

                const tabItemElemActive = contElem.querySelector(this.options.item + '.active');

                if (options.hash && window.location.hash) {
                    const btnElem = contElem.querySelector(options.button + '[href*="' + window.location.hash + '"]');

                    if (btnElem) {
                        this.change(btnElem, true);
                    } else {
                        tabItemElemActive.style.position = 'relative';
                    }
                } else {
                    tabItemElemActive.style.position = 'relative';
                }
            }

            //btn event
            if (options.changeOnHover) {
                document.addEventListener('mouseover', (e) => {
                    const btnElem = e.target.closest(options.button);

                    if (!btnElem) return;

                    this.change(btnElem);
                });

            } else {
                document.addEventListener('click', (e) => {
                    const btnElem = e.target.closest(options.button);

                    if (!btnElem) return;

                    if (!this.options.hash) {
                        e.preventDefault();
                    }

                    this.change(btnElem);
                });
            }
        },

        onChange: function (fun) {
            if (typeof fun === 'function') {
                this.onChangeSubscribers.push(fun);
            }
        },

        change: function (btnElem, immly) {
            if ((btnElem.classList.contains('active') && !immly) || this.changing) {
                return;
            }

            this.changing = true;

            const contElem = btnElem.closest(this.options.container),
                btnElements = contElem.querySelectorAll(this.options.button),
                tabItemElements = contElem.querySelectorAll(this.options.item);

            //remove active state
            for (let i = 0; i < btnElements.length; i++) {
                btnElements[i].classList.remove('active');
            }

            if (!immly) {
                tabItemElements[0].parentElement.style.height = tabItemElements[0].parentElement.offsetHeight + 'px';
            }

            for (let i = 0; i < tabItemElements.length; i++) {
                tabItemElements[i].classList.remove('active');
                tabItemElements[i].style.position = '';
            }

            //get current tab item
            const tabItemElem = contElem.querySelector(this.options.item + '[data-index="' + btnElem.getAttribute('data-index') + '"]');

            //set active state
            tabItemElem.style.transition = immly ? '0s' : '.21s';
            tabItemElem.classList.add('active');

            btnElem.classList.add('active');

            //set height
            if (immly) {
                tabItemElem.style.position = 'relative';
                this.changing = false;

            } else {
                setTimeout(() => {
                    tabItemElem.parentElement.style.transition = 'height .5s';
                    tabItemElem.parentElement.style.height = tabItemElem.offsetHeight + 'px';

                    setTimeout(() => {
                        tabItemElem.parentElement.style.transition = '';
                        tabItemElem.parentElement.style.height = '';
                        tabItemElem.style.position = 'relative';

                        this.changing = false;
                    }, 500);
                }, 210);
            }

            // on change
            this.onChangeSubscribers.forEach(function (item) {
                item(btnElem);
            });
        }
    };
})();