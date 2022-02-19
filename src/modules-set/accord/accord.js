/*
new Accord({
    btnSelector: '.accord__button',
    autoScrollOnViewport: 700, // def: false
    maxViewport: 1000, // def: false
    collapseSiblings: false // def: true
});
*/
var Accord;

(function () {
    'use strict';

    Accord = function (options) {
        const opt = options || {};

        this.btnSel = opt.btnSelector;
        this.autoScroll = opt.autoScrollOnViewport || false;
        this.collapseSiblings = opt.collapseSiblings !== undefined ? opt.collapseSiblings : true;

        opt.maxViewport = opt.maxViewport || false;

        this.initialized = false;

        if (!this.initialized && document.querySelectorAll('.accord').length) {
            this.initialized = true;

            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(this.btnSel);

                if (
                    !btnEl ||
                    btnEl.closest('.accord_closed') ||
                    (opt.maxViewport && window.innerWidth > opt.maxViewport)
                ) {
                    return;
                }

                e.preventDefault();

                this.toggle(btnEl);
            });
        }

        this.toggle = function (elem) {
            const contentElem = elem.closest('.accord__item').querySelector('.accord__content');

            if (elem.classList.contains('active')) {
                contentElem.style.height = contentElem.offsetHeight + 'px';

                setTimeout(function () {
                    contentElem.style.height = '0';
                }, 21);

                elem.classList.remove('active');

            } else {
                const mainElem = elem.closest('.accord');

                if (this.collapseSiblings) {
                    const allButtonElem = mainElem.querySelectorAll(this.btnSel),
                        allContentElem = mainElem.querySelectorAll('.accord__content');

                    for (let i = 0; i < allButtonElem.length; i++) {
                        if (allButtonElem[i] != elem) {
                            allButtonElem[i].classList.remove('active');
                        }
                    }

                    for (let i = 0; i < allContentElem.length; i++) {
                        if (allContentElem[i] != contentElem) {
                            allContentElem[i].style.height = allContentElem[i].offsetHeight + 'px';

                            setTimeout(function () {
                                allContentElem[i].style.height = '0';
                            }, 21);
                        }
                    }
                }

                contentElem.style.height = contentElem.scrollHeight + 'px';

                setTimeout(() => {
                    contentElem.style.height = 'auto';

                    if (this.autoScroll && window.innerWidth <= this.autoScroll) {
                        this.scroll(elem);
                    }
                }, 300);

                elem.classList.add('active');
            }
        }

        this.scroll = function (elem) {
            setTimeout(function () {
                $('html, body').stop()
                    .animate({ scrollTop: $(elem).offset().top - $('.header').innerHeight() - 5 }, 721);
            }, 21);
        }
    };
})();