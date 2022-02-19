; var Screens;

(function () {
	'use strict';

	Screens = {
		wrapHeight: 0,
		wrapEl: 0,
		screenElems: null,
		screenProps: null,
		curScreenInd: 0,
		screenChanging: false,
		lastEvenSrc: 'win',
		onChange: null,
		opt: {},

		screenHadChanged: function () {
			if (this.lastEvenSrc == 'fun') return;

			this.lastEvenSrc = 'fun';

			this.scrollHandler(window.pageYOffset);

			if (this.onChange) {
				this.onChange();
			}
		},

		goToScreen: function (ind) {
			if (ind == this.curScreenInd) return;

			this.screenChanging = true;

			this.screenElems[this.curScreenInd].classList.remove('screen_current');

			if (ind < this.curScreenInd) {
				this.screenElems[this.curScreenInd].classList.remove('screen_top');
			}

			this.screenElems[ind].classList.add('screen_top');
			this.screenElems[ind].classList.add('screen_current');

			this.curScreenInd = ind;

			setTimeout(() => {
				this.screenChanging = false;
				this.screenHadChanged();
			}, 1000);
		},

		scrollInner: function (scrTop) {
			for (let i = 0; i < this.screenElems.length; i++) {
				const scrEl = this.screenElems[i];

				if (!scrEl.classList.contains('screen_inner-scroll')) continue;

				const inScrollEl = scrEl.querySelector('.screen_inner-scroll__in'),
					sP = this.screenProps[i];

				// let top = sP.topEdge - scrTop;
				let top = ((inScrollEl.offsetHeight - window.innerHeight) / 100) * (scrTop / ((sP.bottomEdge - sP.topEdge - window.innerHeight) / 100)) * -1;

				if (top > 0) {
					top = 0;
				} else if (top < scrEl.offsetHeight - inScrollEl.offsetHeight) {
					top = scrEl.offsetHeight - inScrollEl.offsetHeight;
				}

				inScrollEl.style.top = top.toFixed(0) + 'px';
			}
		},

		scrollHandler: function (scrTop) {
			const scrBot = scrTop + window.innerHeight;

			this.scrollInner(scrTop);

			if (this.screenChanging) return;

			this.screenProps.forEach((sP, i) => {
				if (scrTop >= sP.topEdge && scrTop < sP.bottomEdge) {
					this.goToScreen(i);
				}

				if (scrBot + (window.innerHeight / 3) >= sP.bottomEdge) {
					this.screenElems[i].classList.add('screen_bottom-edge');
				} else {
					this.screenElems[i].classList.remove('screen_bottom-edge');
				}
			});

		},

		setProps: function () {
			if (!this.screenElems) return;

			let heightSum = 0;

			this.screenProps = [];

			this.screenElems[0].classList.add('screen_top');
			this.screenElems[0].classList.add('screen_first');

			for (let i = 0; i < this.screenElems.length; i++) {
				const sEl = this.screenElems[i];

				let screenVirtHeight;

				sEl.style.height = window.innerHeight + 'px';

				if (sEl.scrollHeight > sEl.offsetHeight) {
					screenVirtHeight = sEl.scrollHeight + sEl.scrollTop;

					sEl.classList.add('screen_inner-scroll');

					sEl.innerHTML = '<div class="screen_inner-scroll__in">' + sEl.innerHTML + '</div>';
				} else {
					screenVirtHeight = (window.innerWidth > 1200) ? 121 : sEl.scrollHeight + sEl.scrollTop;
				}

				if (i == 1) {
					screenVirtHeight = screenVirtHeight * 2;
				}

				heightSum += screenVirtHeight;

				this.screenProps[i] = {
					topEdge: (!i) ? 0 : this.screenProps[i - 1].bottomEdge + 1,
					bottomEdge: heightSum,
					divider: (i == 1) ? 2 : 1
				};
			}

			if (this.opt.horizontal != true) {
				this.wrapHeight = heightSum;
				this.wrapEl.style.height = heightSum + 'px';
			} else {
				this.wrapEl.classList.add('screen-horisontal');
			}
		},

		init: function (opt) {
			const wrapEl = document.querySelector('.screen-wrap');

			this.opt = opt || {};

			if (!wrapEl) return;

			const contEl = document.querySelector('.screen-container'),
				screenElems = contEl.querySelectorAll('.screen');

			this.wrapEl = wrapEl;
			this.screenElems = screenElems;

			this.setProps();

			window.addEventListener('scroll', () => {
				this.lastEvenSrc = 'win';
				this.scrollHandler(window.pageYOffset);
			});
		}
	};

})();