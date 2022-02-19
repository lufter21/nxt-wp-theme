/* 
const frAn = new FramesAnimate('stopmotion-frames', {
    fps: 30,
    autoplay: true,
    infinite: true,
    backward: false,
    folder: true
});

frAn.onLoad = function () {
    // code
}

frAn.onStop = function () {
    // code
}

frAn.play(); // direction?: 'back'
*/

var FramesAnimate;

(function () {
    'use strict';

    FramesAnimate = function (elemId, options) {
        const canvasElem = document.getElementById(elemId);

        if (!canvasElem) {
            return;
        }

        const opt = options || {},
            count = +canvasElem.getAttribute('data-frames-count'),
            scheme = canvasElem.hasAttribute('data-frames-scheme') ? canvasElem.getAttribute('data-frames-scheme').split(':') : [count, 1],
            path = window.innerWidth < 1000 && canvasElem.hasAttribute('data-path-mob') ? canvasElem.getAttribute('data-path-mob') : canvasElem.getAttribute('data-path'),
            pathWebP = window.innerWidth < 1000 && canvasElem.hasAttribute('data-path-webp-mob') ? canvasElem.getAttribute('data-path-webp-mob') : canvasElem.getAttribute('data-path-webp'),
            srcDims = window.innerWidth < 1000 && canvasElem.hasAttribute('data-src-dims-mob') ? canvasElem.getAttribute('data-src-dims-mob') : canvasElem.getAttribute('data-src-dims'),
            ext = canvasElem.getAttribute('data-frames-ext'),
            _this = this;

        opt.fps = (opt.fps !== undefined) ? opt.fps : 30;
        opt.autoplay = (opt.autoplay !== undefined) ? opt.autoplay : true;
        opt.backward = (opt.backward !== undefined) ? opt.backward : false;
        opt.infinite = (opt.infinite !== undefined) ? opt.infinite : true;
        opt.folder = (opt.folder !== undefined) ? opt.folder : false;
        opt.minWidth = (opt.minWidth !== undefined) ? opt.minWidth : null;

        this.opt = opt;
        this.canvasElem = canvasElem;
        this.fps = opt.fps;
        this.autoplay = opt.autoplay;
        this.infinite = opt.infinite;
        this.animated = false;
        this.onStop = null;
        this.onLoad = null;
        this.loaded = false;
        this.loadedImages = [];
        this.loadedImagesCount = 0;
        this.count = count;
        this.scheme = scheme;
        this.folder = opt.folder;
        this.amend = [1, 1];

        try {
            this.ctx = canvasElem.getContext('2d');
        } catch (error) {
            console.log(error, 'Elem Id: ' + elemId);
        }

        this.img = { W: 0, H: 0 };
        this.imgDims = { W: 0, H: 0 };

        this.gap = 2;
        this.iX = 0;
        this.iY = 0;
        this.grid = [];

        const init = () => {
            if (opt.folder) {
                this.imgDims.W = this.img.W;
                this.imgDims.H = this.img.H;

            } else {
                const srcDimsArr = srcDims.split('x');

                this.amend = [+srcDimsArr[0] / this.img.W, +srcDimsArr[1] / this.img.H];

                this.imgDims.W = (this.img.W / scheme[0] - this.gap / this.amend[0]) / this.amend[0];
                this.imgDims.H = (this.img.H / scheme[1] - this.gap / this.amend[1]) / this.amend[1];

                for (let i = 0; i < this.count; i++) {
                    this.grid.push([this.iX, this.iY]);

                    if (this.iX == this.scheme[0] - 1) {
                        this.iX = 0;
                        this.iY++;
                    } else {
                        this.iX++;
                    }
                }
            }

            this.canvasElWidth = canvasElem.offsetWidth * window.devicePixelRatio;
            this.canvasElHeight = canvasElem.offsetHeight * window.devicePixelRatio;

            if (opt.minWidth !== null && this.canvasElWidth < opt.minWidth) {
                const proportion = this.canvasElWidth / this.canvasElHeight;

                this.canvasElWidth = opt.minWidth;
                this.canvasElHeight = opt.minWidth / proportion;
            }

            canvasElem.width = this.canvasElWidth;
            canvasElem.height = this.canvasElHeight;
        }

        if (opt.folder) {
            for (let i = 0; i < count; i++) {
                const img = new Image();

                img.onload = function () {
                    _this.loadedImagesCount++;

                    _this.loadedImages[i] = this;

                    if (_this.loadedImagesCount == count) {
                        _this.img.W = this.width;
                        _this.img.H = this.height;

                        init();

                        _this.loaded = true;

                        _this.slideTo(opt.backward ? count - 1 : 0);

                        if (_this.onLoad) {
                            _this.onLoad();
                        }

                        if (_this.autoplay) {
                            _this.play();
                        }
                    }
                }

                img.src = path + '/' + (i + 1) + '.' + ext;
            }

        } else {
            const imgEl = new Image();

            imgEl.onload = function () {
                _this.loadedImg = this;

                _this.img.W = this.width;
                _this.img.H = this.height;

                init();

                _this.loaded = true;

                _this.slideTo(opt.backward ? count - 1 : 0);

                if (_this.onLoad) {
                    _this.onLoad();
                }

                if (_this.autoplay) {
                    _this.play();
                }
            }

            if (pathWebP) {
                isWebpSupport(function (res) {
                    if (res) {
                        imgEl.src = pathWebP;
                    } else {
                        imgEl.src = path;
                    }
                });
            } else {
                imgEl.src = path;
            }
        }

        this.reInit = function () {
            if (this.loaded) init();
        }
    }

    FramesAnimate.prototype.animate = function (dir) {
        this.animated = true;

        const _this = this,
            fps = 1000 / this.fps;

        let i = 0,
            back = false;

        if (dir == 'back' || _this.opt.backward) {
            back = true;
            i = this.count - 1;
        }

        let start = performance.now();

        requestAnimationFrame(function anim(time) {
            if (time - start > fps) {

                if (back) {
                    i--;
                } else {
                    i++;
                }

                _this.slideTo(i);

                if (!_this.infinite) {
                    if ((back && !i) || (!back && i == _this.count - 1)) {
                        _this.stop();
                        return;
                    }
                }

                if (_this.opt.backward) {
                    if (_this.opt.infinite && i == 0) {
                        i = _this.count;
                    }
                } else {
                    if (_this.opt.infinite && !back && i == _this.count - 1) {
                        i = -1;
                    }
                }

                start = time;
            }

            if (_this.animated) {
                requestAnimationFrame(anim);
            }
        });
    }

    FramesAnimate.prototype.play = function (dir) {
        if (!this.animated) {
            if (this.loaded) {
                this.animate(dir);
            } else {
                setTimeout(this.play.bind(this), 121);
            }
        }
    }

    FramesAnimate.prototype.stop = function () {
        this.autoplay = false;
        this.animated = false;

        if (this.onStop) {
            this.onStop();
        }
    }

    FramesAnimate.prototype.slideTo = function (i) {
        this.ctx.clearRect(0, 0, this.canvasElWidth, this.canvasElHeight);

        if (this.folder) {
            this.ctx.drawImage(this.loadedImages[i], 0, 0, this.canvasElWidth, this.canvasElHeight);

        } else {
            const gap = [this.gap / this.amend[0], this.gap / this.amend[1]],
                sx = this.imgDims.W * this.grid[i][0] + gap[0] * this.grid[i][0] + gap[0] / 2,
                sy = this.imgDims.H * this.grid[i][1] + gap[1] * this.grid[i][1] + gap[1] / 2;

            this.ctx.drawImage(this.loadedImg, sx, sy, this.imgDims.W, this.imgDims.H, 0, 0, this.canvasElWidth, this.canvasElHeight);
        }
    }

})();