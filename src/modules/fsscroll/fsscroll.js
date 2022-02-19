/*
FsScroll.init({
	container: Str selector,
	screen: Str selector,
	duration: Int milliseconds
});
*/

; var FsScroll;

(function() {
	'use strict';

	FsScroll = {
		options: null,
		contElem: null,
		scrolling: false,
		delta: 0,

		current: function() {
			var midWinScrollTop = window.pageYOffset + window.innerHeight / 2,
			screenElements = this.contElem.querySelectorAll(this.options.screen);

			for (var i = 0; i < screenElements.length; i++) {
				screenElements[i].classList.remove('fsscroll__screen_current');
			}

			for (var i = 0; i < screenElements.length; i++) {
				var screenOffsetTop = screenElements[i].getBoundingClientRect().top + window.pageYOffset;

				if (screenOffsetTop <= midWinScrollTop && (screenOffsetTop + screenElements[i].offsetHeight) >= midWinScrollTop) {

					screenElements[i].classList.add('fsscroll__screen_current');
				}
			}
		},

		scroll: function(scrollTo, scroll) {
			this.scrolling = true;
			
			var duration = this.options.duration || 1000,
			easing = 'easeInOutQuad';

			if (scroll) {
				duration = 500;
				easing = 'easeInOutQuad';
			}

			animate(function(progress) {
				window.scrollTo(0, ((scrollTo * progress) + ((1 - progress) * window.pageYOffset)));
			}, duration, easing, () => {
				setTimeout(() => {
					this.current();

					this.scrolling = false;
					this.delta = 0;
				}, 321);
			});
		},

		mouseScroll: function(delta) {
			var currentScreenElem = this.contElem.querySelector('.fsscroll__screen_current'),
			winScrollBottom = window.pageYOffset + window.innerHeight;

			if (delta > 0) {
				var nextScreenElem = (currentScreenElem) ? currentScreenElem.nextElementSibling : null;

				if (currentScreenElem && ((currentScreenElem.offsetHeight - 21) < window.innerHeight) && !currentScreenElem.classList.contains('fsscroll__screen_last')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if ((window.pageYOffset + 21) < currentScreenOffsetTop) {
							this.scroll(currentScreenOffsetTop);
						} else {
							this.scroll(nextScreenElem.getBoundingClientRect().top + window.pageYOffset);
						}
					}
				} else {
					var nextScreenOffsetTop = (nextScreenElem) ? nextScreenElem.getBoundingClientRect().top + window.pageYOffset : undefined;

					if (nextScreenElem && (winScrollBottom > nextScreenOffsetTop)) {
						if (!this.scrolling) {
							this.scroll(nextScreenOffsetTop);
						}
					} else {
						this.delta += delta / 3;

						this.scroll(window.pageYOffset + this.delta, true);
					}
				}
			} else if (delta < 0) {
				var nextScreenElem = (currentScreenElem) ? currentScreenElem.previousElementSibling : null;

				if (nextScreenElem && ((currentScreenElem.offsetHeight - 21) < window.innerHeight) && !currentScreenElem.classList.contains('fsscroll__screen_first')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if ((winScrollBottom - 21) > (currentScreenOffsetTop + currentScreenElem.offsetHeight)) {
							this.scroll(currentScreenOffsetTop + currentScreenElem.offsetHeight - window.innerHeight);
						} else {
							this.scroll(nextScreenElem.getBoundingClientRect().top + window.pageYOffset + nextScreenElem.offsetHeight - window.innerHeight);
						}
					}
				} else {
					var nextScreenOffsetTop = (nextScreenElem) ? nextScreenElem.getBoundingClientRect().top + window.pageYOffset : undefined;

					if (nextScreenElem && ((nextScreenOffsetTop + nextScreenElem.offsetHeight) > window.pageYOffset)) {
						if (!this.scrolling) {
							this.scroll(nextScreenOffsetTop);
						}
					} else {
						this.delta += delta / 3;
						this.scroll(window.pageYOffset + this.delta, true);
					}
				}
			}
		},

		init: function(options) {
			var contElem = document.querySelector(options.container);

			if (!contElem) {
				return;
			}

			this.options = options;
			this.contElem = contElem;

			var screenElements = contElem.querySelectorAll(options.screen);

			screenElements[0].classList.add('fsscroll__screen_first');
			screenElements[0].classList.add('fsscroll__screen_current');
			screenElements[screenElements.length - 1].classList.add('fsscroll__screen_last');

			if ('onwheel' in document) {
				document.addEventListener('wheel', (e) => {
					e.preventDefault();

					this.mouseScroll(e.deltaY);
				});
			}
			
			window.addEventListener('scroll', () => {
				if (!this.scrolling) {
					this.current();
				}
			});
		}
	};
})();