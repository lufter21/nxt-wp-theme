// Zoom.init('.js-zoom-container');

var Zoom;

(function () {
    'use strict';

    Zoom = {
        contSel: '',
        contEl: null,
        contPos: { X: 0, Y: 0, X2: 0, Y2: 0 },
        zoomEl: null,
        zoomInnerEl: null,
        mOver: null,
        mMove: null,

        build: function() {
            this.zoomInnerEl = document.createElement('div');

            this.zoomInnerEl.className = 'zoom__inner';

            this.zoomInnerEl.style.width = this.contEl.offsetWidth + 'px';
            this.zoomInnerEl.style.height = this.contEl.offsetHeight + 'px';

            this.zoomInnerEl.innerHTML = this.contEl.innerHTML;

            this.zoomEl.appendChild(this.zoomInnerEl);

            this.zoomEl.style.display = 'block';
        },

        start: function (e) {
            this.contEl = e.target.closest(this.contSel);

            if (!this.contEl) return;

            document.removeEventListener('mouseover', this.mOver);

            this.contPos.X = this.contEl.getBoundingClientRect().left + window.pageXOffset;
            this.contPos.Y = this.contEl.getBoundingClientRect().top + window.pageYOffset;
            this.contPos.X2 = this.contEl.getBoundingClientRect().right + window.pageXOffset;
            this.contPos.Y2 = this.contEl.getBoundingClientRect().bottom + window.pageYOffset;

            this.build();
            
            this.mMove = this.move.bind(this);

            document.addEventListener('mousemove', this.mMove);
        },

        move: function (e) {
            this.zoomEl.style.left = (e.pageX - 131) + 'px';
            this.zoomEl.style.top = (e.pageY - 131) + 'px';

            const sX = (e.pageX - this.contPos.X) * 2 - 131,
            sY = (e.pageY - this.contPos.Y) * 2 - 131;

            this.zoomInnerEl.style.left = -sX + 'px';
            this.zoomInnerEl.style.top = -sY + 'px';

            if (
                e.pageX < this.contPos.X || e.pageY < this.contPos.Y ||
                e.pageX > this.contPos.X2 || e.pageY > this.contPos.Y2
            ) {
                this.end();
            }
        },

        end: function () {
            this.zoomEl.style.display = 'none';
            this.zoomEl.innerHTML = '';

            document.removeEventListener('mousemove', this.mMove);
            document.addEventListener('mouseover', this.mOver);
        },

        init: function (contSel) {
            this.contSel = contSel;
            this.mOver = this.start.bind(this);

            document.addEventListener('mouseover', this.mOver);

            this.zoomEl = document.createElement('div');
            this.zoomEl.className = 'zoom';
            document.body.appendChild(this.zoomEl);
        }
    };
})();
