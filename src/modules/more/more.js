/*
call to init:
More.init(Str button selector[, transition ms]);
*/
var More;

(function () {
    'use strict';

    More = {
        speed: 500,

        init: function (elementStr, speed) {
            if (speed) {
                this.speed = speed;
            }

            document.addEventListener('click', (e) => {
                var btnEl = e.target.closest(elementStr);

                if (!btnEl) {
                    return;
                }

                e.preventDefault();

                this.toggle(btnEl);
            });
        },

        toggle: function (btnEl) {
            const contentElem = btnEl.closest('.more').querySelector('.more__content');

            contentElem.style.transition = this.speed + 'ms';

            if (btnEl.classList.contains('active')) {
                contentElem.style.height = contentElem.offsetHeight + 'px';

                setTimeout(function () {
                    contentElem.style.overflow = 'hidden';
                    
                    contentElem.style.height = contentElem.getAttribute('data-height') + 'px';

                    btnEl.classList.remove('active');

                    btnEl.closest('.more').classList.remove('more_toggled');

                    if (elem.closest('.more').getAttribute('data-scroll-after-collapse') !== 'false') {
                        $('html,body').stop().animate({ scrollTop: $(btnEl).attr('data-scroll-top') }, 210);
                    }
                    
                }, 21);

            } else {
                btnEl.setAttribute('data-scroll-top', $(window).scrollTop());

                contentElem.setAttribute('data-height', contentElem.offsetHeight);

                contentElem.style.height = contentElem.scrollHeight + 'px';

                btnEl.classList.add('active');

                btnEl.closest('.more').classList.add('more_toggled');

                setTimeout(function () {
                    contentElem.style.height = 'auto';
                    contentElem.style.overflow = 'visible';
                }, this.speed);
            }

            setTimeout(function () {
                const btnTxt = btnEl.innerHTML;

                if (btnEl.hasAttribute('data-btn-text')) {
                    btnEl.innerHTML = btnEl.getAttribute('data-btn-text');

                    btnEl.setAttribute('data-btn-text', btnTxt);
                }
                
            }, this.speed / 2);
        }
    };
})();