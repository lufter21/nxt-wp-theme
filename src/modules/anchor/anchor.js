/*
Anchor.init(Str anchor selector[, Int duration ms[, Int shift px]]);
*/

var Anchor;

(function () {
    "use strict";

    Anchor = {
        duration: 1000,
        shift: 0,

        scroll: function (anchorId, e) {
            const anchorSectionElem = document.getElementById(anchorId + '-anchor');

            if (!anchorSectionElem) {
                return;
            }

            if (e) {
                e.preventDefault();
            }

            if (this.beforeScroll) {
                this.beforeScroll();
            }

            let scrollTo = anchorSectionElem.getBoundingClientRect().top + window.pageYOffset,
                ownShift = +anchorSectionElem.getAttribute('data-shift') || 0;

            if (window.innerWidth < 1000 && anchorSectionElem.hasAttribute('data-sm-shift')) {
                ownShift = +anchorSectionElem.getAttribute('data-sm-shift');
            }

            scrollTo = scrollTo - this.shift - ownShift;

            animate(function (progress) {
                window.scrollTo(0, ((scrollTo * progress) + ((1 - progress) * window.pageYOffset)));
            }, this.duration, 'easeInOutQuad', () => {
                if (this.afterScroll) {
                    this.afterScroll();
                }
            });
        },

        init: function (elementStr, duration, shift) {
            if (duration) {
                this.duration = duration;
            }

            if (shift) {
                this.shift = shift;
            }

            //click anchor
            document.addEventListener('click', (e) => {
                var elem = e.target.closest(elementStr);

                if (elem) {
                    const anchId = (elem.hasAttribute('href')) ? elem.getAttribute('href').split('#')[1] : elem.getAttribute('data-anchor-id');

                    this.scroll(anchId, e);
                }
            });

            //hash anchor
            if (window.location.hash) {
                window.addEventListener('load', () => {
                    this.scroll(window.location.hash.split('#')[1]);
                });
            }
        }
    };
})();