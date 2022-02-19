var MediaPopup;

(function () {
    'use strict';

    MediaPopup = {
        groupBtnElems: null,
        curGroupBtnIndex: null,
        popupEl: null,

        init: function (btnSel) {
            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(btnSel),
                    arrBtnEl = e.target.closest('.popup-media__arr'),
                    dotBtnEl = e.target.closest('.popup-media__dots-btn');

                if (btnEl) {
                    e.preventDefault();

                    this.popupEl = Popup.open(btnEl.getAttribute('data-popup') || '#media-popup', null, btnEl);

                    this.show(btnEl);
                    this.group(btnEl);

                } else if (arrBtnEl) {
                    this.next(arrBtnEl.getAttribute('data-dir'));
                } else if (dotBtnEl) {
                    if (!dotBtnEl.classList.contains('active')) {
                        const dotBtnElems = document.querySelectorAll('.popup-media__dots-btn');

                        for (let i = 0; i < dotBtnElems.length; i++) {
                            dotBtnElems[i].classList.remove('active');
                        }

                        dotBtnEl.classList.add('active');

                        this.goTo(+dotBtnEl.getAttribute('data-ind'));
                    }
                }
            });
        },

        show: function (btnEl) {
            const type = btnEl.getAttribute('data-type'),
                caption = btnEl.getAttribute('data-caption'),
                args = {
                    href: btnEl.href,
                    preview: btnEl.getAttribute('data-preview')
                },
                captEl = this.popupEl.querySelector('.popup-media__caption');

            if (caption) {
                captEl.innerHTML = caption.replace(/\[(\/?\w+)\]/gi, '<$1>');
                captEl.style.display = '';

            } else {
                captEl.style.display = 'none';
            }

            if (type == 'image') {
                this.image(args);
            } else if (type == 'video') {
                this.video(args);
            }
        },

        image: function (args) {
            const elemImg = this.popupEl.querySelector('.popup-media__image');

            Popup.onClose = function () {
                elemImg.src = '#';
                elemImg.classList.remove('popup-media__image_visible');
            }

            elemImg.src = args.href;
            elemImg.classList.add('popup-media__image_visible');

        },

        video: function (args) {
            const videoEl = this.popupEl.querySelector('.popup-media__video'),
                previewEl = videoEl.querySelector('.popup-media__preview'),
                btnPlayEl = videoEl.querySelector('.popup-media__btn-play');

            Popup.onClose = function () {
                Video.stop();
                previewEl.src = '#';
                videoEl.classList.remove('popup-media__video_visible');
            }

            previewEl.src = args.preview;
            btnPlayEl.setAttribute('data-src', args.href);
            videoEl.classList.add('popup-media__video_visible');
        },

        group: function (elem) {
            const group = elem.getAttribute('data-group'),
                arrBtnElems = document.querySelectorAll('.popup-media__arr'),
                dotsEl = this.popupEl.querySelector('.popup-media__dots');

            if (!group) {
                this.groupBtnElems = null;
                this.curGroupBtnIndex = null;

                for (let i = 0; i < arrBtnElems.length; i++) {
                    arrBtnElems[i].style.display = 'none';
                }

                dotsEl.style.display = 'none';

                return;
            }

            this.groupBtnElems = document.querySelectorAll('[data-group="' + group + '"]');
            this.curGroupBtnIndex = [].slice.call(this.groupBtnElems).indexOf(elem);

            if (this.groupBtnElems.length) {
                for (let i = 0; i < arrBtnElems.length; i++) {
                    arrBtnElems[i].style.display = '';
                }

                dotsEl.style.display = '';
                dotsEl.innerHTML = '';

                for (let i = 0; i < this.groupBtnElems.length; i++) {
                    const dot = document.createElement('li');
                    dot.innerHTML = '<button class="popup-media__dots-btn' + (i == this.curGroupBtnIndex ? ' active' : '') + '" data-ind="' + i + '"></button>';

                    dotsEl.appendChild(dot);
                }

            } else {
                for (let i = 0; i < arrBtnElems.length; i++) {
                    arrBtnElems[i].style.display = 'none';
                }

                dotsEl.style.display = 'none';
            }
        },

        next: function (dir) {
            let btnEl;

            const dotBtnEls = this.popupEl.querySelectorAll('.popup-media__dots-btn');

            for (let i = 0; i < dotBtnEls.length; i++) {
                dotBtnEls[i].classList.remove('active');
            }

            if (dir == 'next') {
                this.curGroupBtnIndex++;

                if (this.groupBtnElems[this.curGroupBtnIndex]) {
                    btnEl = this.groupBtnElems[this.curGroupBtnIndex];

                } else {
                    this.curGroupBtnIndex = 0;
                    btnEl = this.groupBtnElems[0];
                }

            } else {
                this.curGroupBtnIndex--;

                if (this.groupBtnElems[this.curGroupBtnIndex]) {
                    btnEl = this.groupBtnElems[this.curGroupBtnIndex];

                } else {
                    this.curGroupBtnIndex = this.groupBtnElems.length - 1;
                    btnEl = this.groupBtnElems[this.curGroupBtnIndex];
                }
            }

            dotBtnEls[this.curGroupBtnIndex].classList.add('active');

            this.show(btnEl);
        },

        goTo: function (ind) {
            this.curGroupBtnIndex = ind;

            let btnEl = this.groupBtnElems[ind];

            this.show(btnEl);
        }
    };
})();