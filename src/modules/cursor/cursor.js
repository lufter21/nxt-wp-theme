var Cursor;

(function () {
    'use strict';

    Cursor = {
        elObj: null,
        cursorEl: null,
        mOver: null,
        mMove: null,
        mOut: null,
        opt: null,

        init: function (options) {
            this.opt = options;

            this.mOver = this.start.bind(this);

            document.addEventListener('mouseover', this.mOver);

            const cursWrap = document.createElement('div');
            cursWrap.className = 'cursor-wrap';

            document.body.appendChild(cursWrap);

            this.cursorEl = document.createElement('div');
            this.cursorEl.className = 'cursor';

            cursWrap.appendChild(this.cursorEl);
        },

        start: function (e) {
            let el;

            for (const it of this.opt) {
                el = e.target.closest(it.selector);

                if (el) {
                    this.elObj = { el, cursCl: it.class };
                    break;
                }
            }

            if (!el) return;

            if (this.elObj.cursCl) {
                this.cursorEl.setAttribute('data-class', this.elObj.cursCl);
            } else {
                this.cursorEl.removeAttribute('data-class');
            }

            this.cursorEl.classList.add('cursor_visible');

            this.mMove = this.move.bind(this);
            document.addEventListener('mousemove', this.mMove);

            this.mOut = this.end.bind(this);
            document.addEventListener('mouseout', this.mOut);
        },

        move: function (e) {
            const x = e.clientX - this.cursorEl.offsetWidth / 2,
                y = e.clientY - this.cursorEl.offsetHeight / 2;

            this.cursorEl.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        },

        end: function () {
            this.cursorEl.classList.remove('cursor_visible');

            document.removeEventListener('mousemove', this.mMove);
            document.removeEventListener('mouseout', this.mOut);
        }
    };
})();