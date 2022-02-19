/*
const tt = new ToolTip({
    btnSelector: '.js-tooltip',
    notHide: true, // def: false
    clickEvent: true, // def: false
    tipElClass: 'some-class', // def: null
    positionX: 'left' | 'right', // def: 'center'
    positionY: 'bottom', // def: 'top'
    fadeSpeed: 1500 // def: 1000
});

tt.beforeShow = function(btnEl, tooltipDivEl) {
    # code...
}

tt.onShow = function(btnEl, tooltipDivEl) {
    # code...
}

tt.onHide = function() {
    # code...
}
*/

var ToolTip;

(function () {
    'use strict';

    ToolTip = function (options) {
        this.opt = options || {};

        this.tooltipDiv = null;
        this.tooltipClass = null;
        this.canBeHidden = false;
        this.position = {};
        this.onShow = null;
        this.mO = null;

        this.opt.notHide = (this.opt.notHide !== undefined) ? this.opt.notHide : false;
        this.opt.evClick = (this.opt.clickEvent !== undefined) ? this.opt.clickEvent : false;
        this.opt.tipElClass = (this.opt.tipElClass !== undefined) ? this.opt.tipElClass : null;
        this.opt.fadeSpeed = (this.opt.fadeSpeed !== undefined) ? this.opt.fadeSpeed : 1000;

        this.position.X = (this.opt.positionX !== undefined) ? this.opt.positionX : 'center';
        this.position.Y = (this.opt.positionY !== undefined) ? this.opt.positionY : 'top';

        let mouseOver = (e) => {
            if (this.canBeHidden) {
                if (!e.target.closest(this.opt.btnSelector) && !e.target.closest('.tooltip')) {
                    this.hide();

                    this.canBeHidden = false;
                }
            } else {
                const elem = e.target.closest(this.opt.btnSelector);

                if (elem) {
                    this.show(elem);
                }
            }
        }

        let mouseClick = (e) => {
            const elem = e.target.closest(this.opt.btnSelector);

            if (elem) {
                e.preventDefault();

                this.hide();

                this.canBeHidden = false;

                this.show(elem);
            }
        }

        if (document.ontouchstart !== undefined || this.opt.evClick) {
            document.addEventListener('click', mouseClick);

        } else {
            document.addEventListener('mouseover', mouseOver);

            document.addEventListener('click', (e) => {
                if (e.target.closest(this.opt.btnSelector)) e.preventDefault();
            });
        }

        this.tooltipDiv = document.createElement('div');
        this.tooltipDiv.className = 'tooltip' + (this.opt.tipElClass ? ' ' + this.opt.tipElClass : '');

        document.body.appendChild(this.tooltipDiv);

        document.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.tooltip__close');

            if (closeBtn || (this.canBeHidden && !e.target.closest('.tooltip'))) {
                this.hide();
            }
        });
    }

    ToolTip.prototype.show = function (elem) {
        clearTimeout(this.hideTimeout);

        let html = elem.hasAttribute('data-tooltip') ? elem.getAttribute('data-tooltip').replace(/\[(\/?\w+)\]/gi, '<$1>') : '';

        if (this.opt.evClick) html += '<button type="button" class="tooltip__close"></button>';

        this.tooltipDiv.innerHTML = html;

        if (this.beforeShow) {
            this.beforeShow(elem, this.tooltipDiv);
        }

        this.tooltipClass = elem.getAttribute('data-tooltip-class');

        if (this.tooltipClass) {
            this.tooltipDiv.classList.add(this.tooltipClass);
        }



        const bubleStyle = this.tooltipDiv.style,
            elemRect = elem.getBoundingClientRect();

        let coordX,
            coordY,
            posX = this.position.X,
            posY = this.position.Y;

        if (elem.hasAttribute('data-tip-position-x')) {
            posX = elem.getAttribute('data-tip-position-x');
        }

        if (elem.hasAttribute('data-tip-position-y')) {
            posY = elem.getAttribute('data-tip-position-y');
        }

        if (posX == 'center') {
            coordX = (elemRect.left + ((elemRect.right - elemRect.left) / 2)) - (this.tooltipDiv.offsetWidth / 2);
        } else if (posX == 'left') {
            coordX = elemRect.left - this.tooltipDiv.offsetWidth;
        } else if (posX == 'right') {
            coordX = elemRect.right;
        }

        if (posY == 'top') {
            coordY = elemRect.top + window.pageYOffset - this.tooltipDiv.offsetHeight;

        } else if (posY == 'bottom') {
            coordY = elemRect.bottom + window.pageYOffset;
        }

        bubleStyle.left = coordX + 'px';
        bubleStyle.top = coordY + 'px';

        const tipElRect = this.tooltipDiv.getBoundingClientRect();

        if (tipElRect.top < 0) {
            bubleStyle.top = (coordY - tipElRect.top) + 'px';
        }

        if (this.onShow) {
            this.onShow(elem, this.tooltipDiv);
        }

        this.tooltipDiv.style.transition = 'opacity ' + this.opt.fadeSpeed + 'ms';
        this.tooltipDiv.style.opacity = '1';

        setTimeout(() => {
            this.canBeHidden = true;
        }, 21);

        this.mO = this.mouseOut.bind(this);

        if (document.ontouchstart !== undefined) {
            document.addEventListener('touchstart', this.mO);

        } else if (this.opt.evClick) {
            document.addEventListener('wheel', this.mO);
        }
    }

    ToolTip.prototype.hide = function () {
        if (this.opt.notHide) {
            return;
        }

        this.tooltipDiv.style.opacity = '0';

        this.hideTimeout = setTimeout(() => {
            this.tooltipDiv.removeAttribute('style');
            this.tooltipDiv.innerHTML = '';

            if (this.tooltipClass) {
                this.tooltipDiv.classList.remove(this.tooltipClass);

                this.tooltipClass = null;
            }

            if (this.onHide) {
                this.onHide();
            }
        }, this.opt.fadeSpeed);
    }

    ToolTip.prototype.mouseOut = function (e) {
        if (this.canBeHidden && !e.target.closest(this.opt.btnSelector) && !e.target.closest('.tooltip')) {
            this.hide();

            this.canBeHidden = false;

            document.removeEventListener('touchstart', this.mO);
            document.removeEventListener('wheel', this.mO);
        }
    }
})();