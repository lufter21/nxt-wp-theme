/* 
CoverImg.init([Str parent element selector]);

CoverImg.reInit([Str parent element selector]);
*/
; var CoverImg;

(function () {
    'use strict';

    CoverImg = {
        cover: function (e) {
            var img = e.currentTarget,
                imgWrap = img.closest('.cover-img-wrap'),
                imgProportion = img.offsetWidth / img.offsetHeight,
                imgWrapProportion = imgWrap.offsetWidth / imgWrap.offsetHeight;

            if (imgWrapProportion != Infinity && imgWrapProportion < 21) {

                if (imgProportion <= imgWrapProportion) {
                    // var margin = Math.round(-(imgWrap.offsetWidth / imgProportion - imgWrap.offsetHeight) / 2);

                    img.classList.add('cover-img_w');
                    // img.style.marginTop = margin +'px';

                } else {
                    // var margin = Math.round(-(imgWrap.offsetHeight * imgProportion - imgWrap.offsetWidth) / 2);

                    img.classList.add('cover-img_h');
                    // img.style.marginLeft = margin +'px';

                }

            } else {
                img.classList.add('cover-img_w');
            }

        },

        reInit: function (parentElementStr) {

            var elements;

            if (parentElementStr) {
                if (typeof parentElementStr == 'string') {
                    elements = document.querySelectorAll(parentElementStr + ' .cover-img');
                } else {
                    elements = parentElementStr.querySelectorAll('.cover-img');
                }
            } else {
                elements = document.querySelectorAll('.cover-img');
            }

            for (var i = 0; i < elements.length; i++) {
                var img = elements[i];

                img.classList.remove('cover-img_w');
                img.classList.remove('cover-img_h');
                // img.style.marginTop = '';
                // img.style.marginLeft = '';
                img.src = (browser == 'ie') ? (img.src + '?' + new Date().getTime()) : img.src;
            }

        },

        init: function (parentElementStr) {
            var elements = (parentElementStr) ? document.querySelectorAll(parentElementStr + ' .cover-img, ' + parentElementStr + ' .cover-img-wrap') : document.querySelectorAll('.cover-img, .cover-img-wrap');

            for (var i = 0; i < elements.length; i++) {
                var elem = elements[i],
                    img;

                if (elem.classList.contains('cover-img-wrap')) {

                    img = elem.querySelector('img');

                    img.classList.add('cover-img');

                } else if (elem.classList.contains('cover-img')) {

                    img = elem;

                    img.parentElement.classList.add('cover-img-wrap');

                }

                if (!img.hasAttribute('data-event')) {

                    img.addEventListener('load', this.cover);

                    img.setAttribute('data-event', 'true');

                }

                if (browser == 'ie') {
                    img.src = img.src + '?' + new Date().getTime();
                }

            }

        }

    };

})();