/*
animate(function(takes 0...1) {}, Int duration in ms[, Str easing[, Fun animation complete]]);
*/

; var animate;

(function () {
    'use strict';

    animate = function (draw, duration, ease, complete) {
        const start = performance.now();

        requestAnimationFrame(function anim(time) {
            let timeFraction = (time - start) / duration;

            if (timeFraction > 1) {
                timeFraction = 1;
            }

            draw((ease) ? easing(timeFraction, ease) : timeFraction);

            if (timeFraction < 1) {
                requestAnimationFrame(anim);
            } else {
                if (complete !== undefined) {
                    complete();
                }
            }
        });
    }

    function easing(timeFraction, ease) {
        switch (ease) {
            case 'easeInQuad':
                return quad(timeFraction);

            case 'easeOutQuad':
                return 1 - quad(1 - timeFraction);

            case 'easeInOutQuad':
                if (timeFraction <= 0.5) {
                    return quad(2 * timeFraction) / 2;
                } else {
                    return (2 - quad(2 * (1 - timeFraction))) / 2;
                }
        }
    }

    function quad(timeFraction) {
        return Math.pow(timeFraction, 2)
    }
})();
; var template;

(function () {
    'use strict';

    template = function (data, template, sign) {
        const s = sign || '%',
            tplEl = document.getElementById(template);

        if (tplEl) {
            template = tplEl.innerHTML;
        }

        let result = template;

        result = result.replace(new RegExp('<' + s + 'for (\\w+) as (\\w+)' + s + '>(.*?)<' + s + 'endfor' + s + '>', 'gs'), function (match, p1, p2, p3, offset, input) {

            if (!data[p1]) return '';

            return data[p1].map(function (item) {
                let res = p3;

                if (typeof item === 'object') {
                    for (const key in item) {
                        if (item.hasOwnProperty(key)) {
                            res = res.replace(new RegExp('<' + s + p2 + '.' + key + s + '>', 'g'), item[key]);
                        }
                    }
                } else {
                    res = res.replace(new RegExp('<' + s + p2 + s + '>', 'g'), item);
                }

                return res;
            }).join('');
        });

        result = result.replace(new RegExp('<' + s + 'if (\\w+)' + s + '>(.*?)<' + s + 'endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            const m = data[p1];

            if (
                m === '' || m === false || m == undefined || m == null ||
                (Array.isArray(m) && !m.length)
            ) {
                return '';
            } else {
                return p2;
            }
        });

        result = result.replace(new RegExp('<' + s + '{2}if (\\w+)' + s + '>(.*?)<' + s + '{2}endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            const m = data[p1];

            if (
                m === '' || m === false || m == undefined || m == null ||
                (Array.isArray(m) && !m.length)
            ) {
                return '';
            } else {
                return p2;
            }
        });

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                result = result.replace(new RegExp('<' + s + key + s + '>', 'g'), data[key]);
            }
        }

        return result;
    }
})();
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
/* 
Screens.init({
	container: '.main',
	duration: 700 // default - 1000,
	menuCurrentClass: 'current' // default - 'menu__item_current'
});

Screens.setHeight(); // call on window resize

Screens.onChange = function (nextScreenElem) {}
*/

; var Screens2;

(function () {
	'use strict';
	
	Screens2 = {
		options: {},
		contElem: null,
		scrolling: false,
		scrollSum: 0,
		onChange: null,
		
		menu: function (currentScreenElem) {
			const menuElements = document.querySelectorAll('.js-change-screen-menu'),
			curMenuItElem = document.querySelector('.js-change-screen-menu[data-screen="#' + currentScreenElem.id + '"]'),
			curClass = this.options.menuCurrentClass || 'current';
			
			for (let i = 0; i < menuElements.length; i++) {
				const mEl = menuElements[i];
				
				mEl.parentElement.classList.remove(curClass);
			}
			
			if (curMenuItElem) {
				curMenuItElem.parentElement.classList.add(curClass);
			}
		},
		
		changeScreen: function (nextScreenElem) {
			const currentScreenElem = this.contElem.querySelector('.screen_visible');
			
			if (nextScreenElem === currentScreenElem) return;
			
			if (nextScreenElem.offsetHeight < window.innerHeight) {
				nextScreenElem.style.height = window.innerHeight + 'px';
			}
			
			this.scrolling = true;
			this.scrollSum = 0;
			
			const duration = this.options.duration || 1000;
			
			currentScreenElem.classList.remove('screen_active');
			
			nextScreenElem.classList.add('screen_visible');
			
			setTimeout(() => {
				this.menu(nextScreenElem);
			}, duration / 2);
			
			animate(function (progress) {
				currentScreenElem.style.opacity = 1 - progress;
				
				nextScreenElem.style.opacity = progress;
			}, duration, false, () => {
				setTimeout(() => {
					currentScreenElem.classList.remove('screen_visible');
					
					nextScreenElem.classList.add('screen_active');
					
					this.scrolling = false;
				}, 21);
			});
			
			window.location.hash = '#' + nextScreenElem.id.split('-')[0];

			if (this.onChange) {
				this.onChange(nextScreenElem);
			}
		},
		
		nextScreen: function (delta) {
			const currentScreenElem = this.contElem.querySelector('.screen_visible');
			
			let nextScreenElem = null;
			
			if (delta > 0) {
				if (currentScreenElem && currentScreenElem.nextElementSibling && currentScreenElem.nextElementSibling.classList.contains('screen')) {
					nextScreenElem = currentScreenElem.nextElementSibling;
				}
			} else if (delta < 0) {
				if (currentScreenElem && currentScreenElem.previousElementSibling && currentScreenElem.previousElementSibling.classList.contains('screen')) {
					nextScreenElem = currentScreenElem.previousElementSibling;
				}
			}
			
			if (nextScreenElem) {
				this.changeScreen(nextScreenElem);
			}
		},

		setHeight: function () {
			if (!this.contElem) return;

			const screenElements = this.contElem.querySelectorAll('.screen'),
			actScreenElem = this.contElem.querySelector('.screen_active');

			for (let i = 0; i < screenElements.length; i++) {
				const scEl = screenElements[i];
				
				scEl.style.height = 'auto';
			}
			
			if (actScreenElem.offsetHeight < window.innerHeight) {
				actScreenElem.style.height = window.innerHeight + 'px';
			}
		},
		
		init: function (options) {
			const contElem = document.querySelector(options.container);
			
			if (!contElem) return;
			
			this.options = options;
			this.contElem = contElem;
			
			this.setHeight();

			// scroll or swipe event
			if ('ontouchstart' in document) {
				const _this = this;

				$(contElem).swipe({
					allowPageScroll: "vertical",
					swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
						if (direction == 'down') {
							if (!_this.scrolling) {
								_this.nextScreen(-1);
							}
						} else if (direction == 'up') {
							if (!_this.scrolling) {
								_this.nextScreen(1);
							}
						}
					}
				});
			} else {
				contElem.addEventListener('wheel', (e) => {
					if (document.documentElement.offsetHeight >= document.documentElement.scrollHeight) {
						e.preventDefault();

						if (!this.scrolling) {
							this.nextScreen(e.deltaY);
						}
					} else {
						const dS = document.documentElement.scrollHeight - document.documentElement.offsetHeight;

						if ((e.deltaY > 0 && window.pageYOffset >= dS) || e.deltaY < 0 && window.pageYOffset == 0) {
							e.preventDefault();

							const absDelta = Math.abs(e.deltaY);

							this.scrollSum += absDelta;

							if (!this.scrolling && this.scrollSum > (absDelta * 3)) {
								this.nextScreen(e.deltaY);
							}
						}
					}
				});
			}
			
			// click event
			document.addEventListener('click', (e) => {
				const chngSecBtn = e.target.closest('.js-change-screen-menu');
				
				if (chngSecBtn) {
					e.preventDefault();

					const curClass = this.options.menuCurrentClass || 'current';
					
					if (!this.scrolling && !chngSecBtn.parentElement.classList.contains(curClass)) {
						this.changeScreen(document.querySelector(chngSecBtn.getAttribute('data-screen')));
					}
				}
			});
			
			// change by hash url
			if (window.location.hash) {
				const screenElem = document.getElementById(window.location.hash.split('#')[1] + '-screen');
				
				if (screenElem) {
					this.changeScreen(screenElem);
				}
			}
		}
	};
})();

// (function () {
// 	'use strict';

// 	Screens = {
// 		options: null,
// 		contElem: null,
// 		scrolling: false,
// 		scrollSum: 0,

// 		menu: function (currentScreenElem) {
// 			const menuElements = document.querySelectorAll('.js-change-screen-menu'),
// 				curMenuItElem = document.querySelector('.js-change-screen-menu[data-screen="#' + currentScreenElem.id + '"]'),
// 				curClass = this.options.menuCurrentClass || 'menu__item_current';

// 			for (let i = 0; i < menuElements.length; i++) {
// 				const mEl = menuElements[i];

// 				mEl.parentElement.classList.remove(curClass);
// 			}

// 			if (curMenuItElem) {
// 				curMenuItElem.parentElement.classList.add(curClass);
// 			}
// 		},

// 		changeScreen: function (nextScreenElem) {
// 			const currentScreenElem = this.contElem.querySelector('.screen_visible');

// 			if (nextScreenElem === currentScreenElem) return;

// 			this.scrolling = true;
// 			this.scrollSum = 0;

// 			const duration = this.options.duration || 1000;

// 			currentScreenElem.classList.remove('screen_active');

// 			nextScreenElem.classList.add('screen_visible');

// 			setTimeout(() => {
// 				this.menu(nextScreenElem);
// 			}, duration / 2);

// 			animate(function (progress) {
// 				currentScreenElem.style.opacity = 1 - progress;

// 				nextScreenElem.style.opacity = progress;
// 			}, duration, false, () => {
// 				setTimeout(() => {
// 					currentScreenElem.classList.remove('screen_visible');

// 					nextScreenElem.classList.add('screen_active');

// 					this.scrolling = false;
// 				}, 21);
// 			});

// 			window.location.hash = '#' + nextScreenElem.id.split('-')[0];

// 			if (window.Video && Video.stop != undefined) {
// 				Video.stop();
// 			}
// 		},

// 		nextScreen: function (delta) {
// 			const currentScreenElem = this.contElem.querySelector('.screen_visible');

// 			let nextScreenElem = null;

// 			if (delta > 0) {
// 				if (currentScreenElem && currentScreenElem.nextElementSibling && currentScreenElem.nextElementSibling.classList.contains('screen')) {
// 					nextScreenElem = currentScreenElem.nextElementSibling;
// 				}
// 			} else if (delta < 0) {
// 				if (currentScreenElem && currentScreenElem.previousElementSibling && currentScreenElem.previousElementSibling.classList.contains('screen')) {
// 					nextScreenElem = currentScreenElem.previousElementSibling;
// 				}
// 			}

// 			if (nextScreenElem) {
// 				this.changeScreen(nextScreenElem);
// 			}
// 		},

// 		init: function (options) {
// 			const contElem = document.querySelector(options.container);

// 			if (!contElem) return;

// 			this.options = options;
// 			this.contElem = contElem;

// 			// const screenElements = contElem.querySelectorAll('.screen');

// 			// for (let i = 0; i < screenElements.length; i++) {
// 			// 	const scrElem = screenElements[i];

// 			// 	scrElem.setAttribute('data-height', scrElem.scrollHeight);

// 			// 	if (!i) {
// 			// 		contElem.style.height = scrElem.scrollHeight + 'px';
// 			// 	}
// 			// }

// 			if ('ontouchstart' in document) {
// 				const _this = this;

// 				$(contElem).swipe({
// 					allowPageScroll: "vertical",
// 					swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
// 						const dS = document.documentElement.scrollHeight - document.documentElement.offsetHeight;

// 						if (direction == 'down' && window.pageYOffset == 0) {
// 							if (!_this.scrolling) {
// 								_this.nextScreen(-1);
// 							}
// 						} else if (direction == 'up') {
// 							if (!_this.scrolling) {
// 								_this.nextScreen(1);
// 							}
// 						}
// 					}
// 				});
// 			} else if ('onwheel' in document) {
// 				contElem.addEventListener('wheel', (e) => {
// 					if (document.documentElement.offsetHeight >= document.documentElement.scrollHeight) {
// 						e.preventDefault();

// 						if (!this.scrolling) {
// 							this.nextScreen(e.deltaY);
// 						}
// 					} else {
// 						const dS = document.documentElement.scrollHeight - document.documentElement.offsetHeight;

// 						if ((e.deltaY > 0 && window.pageYOffset >= dS) || e.deltaY < 0 && window.pageYOffset == 0) {
// 							e.preventDefault();

// 							const absDelta = Math.abs(e.deltaY);

// 							this.scrollSum += absDelta;

// 							if (!this.scrolling && this.scrollSum > (absDelta * 3)) {
// 								this.nextScreen(e.deltaY);
// 							}
// 						}
// 					}

// 				});
// 			}

// 			document.addEventListener('click', (e) => {
// 				const chngSecBtn = e.target.closest('.js-change-screen-menu');

// 				if (chngSecBtn) {
// 					e.preventDefault();

// 					if (!this.scrolling && !chngSecBtn.parentElement.classList.contains('menu__item_current')) {
// 						this.changeScreen(document.querySelector(chngSecBtn.getAttribute('data-screen')));
// 					}
// 				}
// 			});

// 			if (window.location.hash) {
// 				this.changeScreen(document.querySelector(window.location.hash + '-screen'));
// 			}
// 		}
// 	};
// })();
/*
ScrollSmooth.init();
*/

; var ScrollSmooth;

(function() {
	"use strict";
	
	ScrollSmooth = {
		scrolling: false,
		delta: 0,
		scrollTo: 0,
		startPageYOffset: window.pageYOffset,
		
		scroll: function() {
			this.scrolling = true;
			
			var duration = 3500,
			easing = 'easeInOutQuad';
			
			animate((progress) => {
				window.scrollTo(0, ((this.scrollTo * progress) + ((1 - progress) * window.pageYOffset)));
				console.log(this.scrollTo);
			}, duration, easing, () => {
				this.scrolling = false;
				this.delta = 0;
				this.startPageYOffset = window.pageYOffset;
			});
		},
		
		init: function() {
			if ('onwheel' in document) {
				document.addEventListener('wheel', (e) => {
					e.preventDefault();
					
					this.delta += e.deltaY;
					
					this.scrollTo = this.delta + this.startPageYOffset;
					
					if (!this.scrolling) {
						this.scroll();
					}
				});
			}
		}
	};
})();
/*
Toggle.init({
    button: '.js-tgl-btn',
    offButton: '.js-tgl-off',
    toggledClass: 'some-class' // def: toggled,
    targetsToggledClass: 'some-class' // def: toggled
});

Toggle.onChange(function (btnEl, targetElems, state) {
    // code...
});
*/

; var Toggle;

(function () {
    'use strict';

    Toggle = {
        toggledClass: 'toggled',
        targetsToggledClass: 'toggled',
        onChangeSubscribers: [],

        init: function (opt) {
            if (opt.toggledClass) {
                this.toggledClass = opt.toggledClass;
            }

            if (opt.targetsToggledClass) {
                this.targetsToggledClass = opt.targetsToggledClass;
            }

            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(opt.button),
                    offBtnEl = e.target.closest(opt.offButton);

                if (btnEl) {
                    e.preventDefault();

                    if (btnEl.hasAttribute('data-switch')) {
                        this.switchBtns(btnEl);
                    } else {
                        this.toggle(btnEl);
                    }
                } else if (offBtnEl) {
                    e.preventDefault();

                    this.toggleOff(offBtnEl);
                }

                this.onDocClickOff(e, btnEl);
            });
        },

        toggle: function (toggleElem, off) {
            let state;

            if (toggleElem.classList.contains(this.toggledClass)) {
                toggleElem.classList.remove(this.toggledClass);

                state = false;

                if (toggleElem.hasAttribute('data-first-text')) {
                    toggleElem.innerHTML = toggleElem.getAttribute('data-first-text');
                }
            } else if (!off) {
                if (toggleElem.getAttribute('data-type') != 'button') {
                    toggleElem.classList.add(this.toggledClass);
                }

                state = true;

                if (toggleElem.hasAttribute('data-second-text')) {
                    toggleElem.setAttribute('data-first-text', toggleElem.innerHTML);

                    toggleElem.innerHTML = toggleElem.getAttribute('data-second-text');
                }
            }

            //target
            if (toggleElem.hasAttribute('data-target-elements')) {
                this.target(toggleElem, state);
            }

            if (!state) {
                return;
            }

            //dependence elements
            if (toggleElem.hasAttribute('data-dependence-target-elements')) {
                const dependenceTargetElements = document.querySelectorAll(toggleElem.getAttribute('data-dependence-target-elements'));

                for (let i = 0; i < dependenceTargetElements.length; i++) {
                    const el = dependenceTargetElements[i];

                    dependenceTargetElements[i].classList.remove(this.toggledClass);

                    if (el.hasAttribute('data-target-elements')) {
                        this.target(el, false);
                    }
                }
            }
        },

        switchBtns: function (btnEl) {
            if (btnEl.classList.contains(this.toggledClass)) {
                return;
            }

            const btnElems = document.querySelectorAll('[data-switch="' + btnEl.getAttribute('data-switch') + '"]');

            for (let i = 0; i < btnElems.length; i++) {
                const bEl = btnElems[i];

                bEl.classList.remove(this.toggledClass);

                if (bEl.hasAttribute('data-target-elements')) {
                    this.target(bEl, false);
                }
            }

            btnEl.classList.add(this.toggledClass);

            if (btnEl.hasAttribute('data-target-elements')) {
                this.target(btnEl, true);
            }
        },

        target: function (btnEl, state) {
            const target = btnEl.getAttribute('data-target-elements');

            let targetElements;

            if (target.indexOf('->') !== -1) {
                const selArr = target.split('->');

                targetElements = btnEl.closest(selArr[0]).querySelectorAll(selArr[1]);

            } else {
                targetElements = document.querySelectorAll(target);
            }

            if (!targetElements.length) return;

            if (state) {
                for (let i = 0; i < targetElements.length; i++) {
                    targetElements[i].classList.add(this.targetsToggledClass);
                }
            } else {
                for (let i = 0; i < targetElements.length; i++) {
                    targetElements[i].classList.remove(this.targetsToggledClass);
                }
            }

            //call onChange
            if (this.onChangeSubscribers.length) {
                this.onChangeSubscribers.forEach(function (item) {
                    item(btnEl, targetElements, state);
                });
            }
        },

        toggleOff: function (btnEl) {
            const targetEls = btnEl.getAttribute('data-target-elements'),
                toggleBtnEls = document.querySelectorAll('.' + this.toggledClass +
                    '[data-target-elements*="' + targetEls + '"]');

            this.target(btnEl, false);

            for (let i = 0; i < toggleBtnEls.length; i++) {
                toggleBtnEls[i].classList.remove(this.toggledClass);
            }
        },

        onDocClickOff: function (e, targetBtnEl) {
            const toggleElements = document.querySelectorAll('[data-toggle-off="document"].' + this.toggledClass);

            for (let i = 0; i < toggleElements.length; i++) {
                const elem = toggleElements[i];

                if (targetBtnEl === elem) continue;

                if (elem.hasAttribute('data-target-elements')) {
                    const targetSelectors = elem.getAttribute('data-target-elements');

                    if (!e.target.closest(targetSelectors)) {
                        this.toggle(elem, true);
                    }
                } else {
                    this.toggle(elem, true);
                }
            }
        },

        onChange: function (fun) {
            if (typeof fun === 'function') {
                this.onChangeSubscribers.push(fun);
            }
        }
    };
})();
; var FlexImg;

(function() {
    'use strict';
    
    FlexImg = function(elementsStr) {
        
        function load(elem) {
            
            if (!elem.hasAttribute('data-images')) {
                return;
            }
            
            var images = elem.getAttribute('data-images').split(',');
            
            images.forEach(function(image) {
                
                var imageProp = image.split('->');
                
                if (window.innerWidth < (+imageProp[0])) {
                    elem.src = imageProp[1];
                }
                
            });
            
        }
        
        //init
        var elements = document.querySelectorAll(elementsStr);
        
        if (elements.length) {
            
            for (var i = 0; i < elements.length; i++) {
                load(elements[i]);
            }
            
        }
        
    }
})();
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
/* 
new LazyLoad({
   selector: @Str,
   onEvent: 'scrollTo',  // def: false
   flexible: true, // def: false
   onDemand: true // def: false
});
*/

; var LazyLoad;

(function () {
    'use strict';

    LazyLoad = function (opt) {
        opt = opt || {};

        opt.event = opt.event || false;
        opt.flexible = opt.flexible || false;
        opt.onDemand = opt.onDemand || false;

        this.opt = opt;
        this.initialized = false;
        this.suff = '';

        const scrollHandler = () => {
            if (this.scrollHandlerLocked) {
                return;
            }

            for (let i = 0; i < this.elements.length; i++) {
                const el = this.elements[i];

                const elOffset = el.getBoundingClientRect();

                if (elOffset.width !== 0 || elOffset.height !== 0) {
                    if (elOffset.top < window.innerHeight + 100 && elOffset.bottom > -100) {
                        isWebpSupport((result) => {
                            let suff = '';

                            if (result) {
                                suff = '-webp';
                            }

                            this.doLoad(el, suff);
                        });
                    }
                }
            }
        }

        const init = () => {
            this.elements = document.querySelectorAll(opt.selector);
            
            this.scrollHandlerLocked = false;

            if (this.elements) {
                if (opt.onEvent) {
                    if (opt.onEvent == 'scrollTo') {
                        window.removeEventListener('scroll', scrollHandler);
                        window.addEventListener('scroll', scrollHandler);

                        scrollHandler();

                        this.initialized = true;
                    }
                } else if (!opt.onDemand) {
                    window.addEventListener('load', () => {
                        isWebpSupport((result) => {
                            if (result) {
                                this.suff = '-webp';
                            }

                            this.initialized = true;

                            this.doLoad();
                        });
                    });
                }
            }
        }

        init();

        this.reInit = function () {
            if (this.initialized) {
                init();
            }
        }

        this.disable = function () {
            this.scrollHandlerLocked = true;
        }
    }

    LazyLoad.prototype.doLoad = function (el, suff) {
        const elements = el ? [el] : this.elements;

        for (let i = 0; i < elements.length; i++) {
            const elem = elements[i];

            suff = (suff !== undefined) ? suff : this.suff;

            if (!elem.hasAttribute('data-src' + suff) && !elem.hasAttribute('data-bg-url' + suff)) {
                suff = '';
            }

            if (this.opt.flexible) {
                if (elem.hasAttribute('data-src' + suff)) {
                    const arr = elem.getAttribute('data-src' + suff).split(',');

                    let resultImg;

                    arr.forEach(function (arrItem) {
                        const props = arrItem.split('->');

                        if (window.innerWidth < (+props[0])) {
                            resultImg = props[1];
                        }
                    });

                    this.draw(elem, resultImg, true);

                } else if (elem.hasAttribute('data-bg-url' + suff)) {
                    const arr = elem.getAttribute('data-bg-url' + suff).split(',');

                    let resultImg;

                    arr.forEach(function (arrItem) {
                        const props = arrItem.split('->');

                        if (window.innerWidth < (+props[0])) {
                            resultImg = props[1];
                        }
                    });

                    this.draw(elem, resultImg);
                }

            } else {
                if (elem.hasAttribute('data-src' + suff)) {
                    this.draw(elem, elem.getAttribute('data-src' + suff), true);
                } else if (elem.hasAttribute('data-bg-url' + suff)) {
                    this.draw(elem, elem.getAttribute('data-bg-url' + suff));
                }
            }
        }
    }

    LazyLoad.prototype.draw = function (elem, src, isImg) {
        if (isImg) {
            if (src !== elem.getAttribute('src')) {
                elem.src = src;
            }
        } else {
            elem.style.backgroundImage = 'url(' + src + ')';
        }
    }

    LazyLoad.prototype.load = function () {
        if (this.opt.onDemand) {
            this.elements = document.querySelectorAll(this.opt.selector);

            isWebpSupport((result) => {
                if (result) {
                    this.suff = '-webp';
                }

                this.initialized = true;

                this.doLoad();
            });
        }
    }
})();
/*
Video.init(Str button selector);

Video.onPlay = function (videoEl) {}

Video.onStop = function (videoEl) {}
*/
var Video;

(function () {
    'use strict';

    Video = {
        init: function (elementStr) {
            if (!document.querySelectorAll('.video').length) return;

            document.addEventListener('click', (e) => {
                const elem = e.target.closest(elementStr);

                if (elem) {
                    this.play(elem);
                }
            });
        },

        play: function (elem, vSrc, parEl) {
            let vidFrameWrapEl,
                autoplay = true;

            if (elem) {
                vidFrameWrapEl = elem.nextElementSibling;
                vSrc = elem.getAttribute('data-src');
            } else {
                vidFrameWrapEl = parEl.querySelector('.video__frame');
                autoplay = false;
            }

            vidFrameWrapEl.classList.add('video__frame_visible');

            if (vSrc.indexOf('youtube') !== -1 || vSrc.indexOf('youtu.be') !== -1) {
                const iFrame = document.createElement('iframe'),
                    vId = vSrc.match(/(?:youtu\.be\/|youtube\.com\/watch\?v\=|youtube\.com\/embed\/)+?([\w-]+)/i)[1];

                iFrame.src = 'https://www.youtube.com/embed/' + vId + '?' + (autoplay ? 'autoplay=1' : '') + '&rel=0&amp;showinfo=0';
                iFrame.allow = (autoplay ? 'autoplay; ' : '') + 'encrypted-media';
                iFrame.allowFullscreen = true;

                iFrame.addEventListener('load', function () {
                    iFrame.classList.add('visible');

                    vidFrameWrapEl.classList.add('video__frame_played');

                    if (this.onPlay) {
                        this.onPlay(vidFrameWrapEl.closest('.video'));
                    }
                });

                vidFrameWrapEl.appendChild(iFrame);

            } else {
                const videoEl = document.createElement('video');

                videoEl.src = vSrc;
                videoEl.autoplay = autoplay;
                videoEl.controls = true;

                vidFrameWrapEl.appendChild(videoEl);

                videoEl.classList.add('visible');

                vidFrameWrapEl.classList.add('video__frame_played');

                videoEl.addEventListener('ended', () => {
                    this.stop(videoEl);
                });

                if (this.onPlay) {
                    this.onPlay(vidFrameWrapEl.closest('.video'));
                }
            }
        },

        stop: function (videoEl) {
            const frameBlockEls = document.querySelectorAll('.video__frame_played');

            for (let i = 0; i < frameBlockEls.length; i++) {
                const el = frameBlockEls[i];

                el.innerHTML = '';
                el.classList.remove('video__frame_visible');
                el.classList.remove('video__frame_played');
            }

            if (this.onStop) {
                this.onStop(videoEl && videoEl.closest('.video'));
            }
        }
    };
})();
var Popup;

(function () {
    'use strict';

    Popup = {
        winScrollTop: 0,
        onClose: null,
        _onclose: null,
        onOpenSubscribers: [],
        headerSelector: '.header',
        delay: 300,

        init: function (elementStr) {
            document.addEventListener('click', (e) => {
                var btnElem = e.target.closest(elementStr),
                    closeBtnElem = e.target.closest('.js-popup-close');

                if (btnElem) {
                    e.preventDefault();
                    this.open(btnElem.getAttribute('data-popup') || btnElem.getAttribute('href'), false, btnElem);
                } else if (
                    closeBtnElem ||
                    (
                        !e.target.closest('.popup__window') &&
                        e.target.closest('.popup') &&
                        !e.target.closest('.popup[data-btn-close-only="true"]')
                    )
                ) {
                    this.close('closeButton');
                }
            });

            if (window.location.hash) {
                this.open(window.location.hash);
            }
        },

        open: function (elementStr, callback, btnElem) {
            const winEl = document.querySelector(elementStr);

            if (!winEl || !winEl.classList.contains('popup__window')) return;

            this.close('openPopup', winEl);

            const elemParent = winEl.parentElement;

            elemParent.style.display = 'block';

            setTimeout(function () {
                elemParent.style.opacity = '1';
            }, 121);

            elemParent.scrollTop = 0;

            setTimeout(function () {
                winEl.style.display = 'inline-block';

                if (winEl.offsetHeight < window.innerHeight) {
                    winEl.style.top = ((window.innerHeight - winEl.offsetHeight) / 2) + 'px';
                }

                winEl.style.opacity = '1';

                setTimeout(() => {
                    winEl.classList.add('popup__window_visible');
                }, this.delay);
            }, this.delay);


            if (callback) this._onclose = callback;

            this.fixBody(true);

            this.onOpenSubscribers.forEach(function (item) {
                item(elementStr, btnElem);
            });

            return winEl;
        },

        onOpen: function (fun) {
            if (typeof fun === 'function') {
                this.onOpenSubscribers.push(fun);
            }

            if (window.location.hash) {
                this.open(window.location.hash);
            }
        },

        message: function (msg, winSel, callback) {
            const winEl = this.open(winSel || '#message-popup', callback);

            winEl.querySelector('.popup__message').innerHTML = msg.replace(/\[(\/?\w+)\]/gi, '<$1>');
        },

        close: function (evInit, openedWinEl) {
            const visWinElems = document.querySelectorAll('.popup__window_visible');

            if (!visWinElems.length) return;

            for (let i = 0; i < visWinElems.length; i++) {
                const winEl = visWinElems[i];

                if (!winEl.classList.contains('popup__window_visible')) continue;

                winEl.style.opacity = '0';

                const samePop = openedWinEl ? winEl.parentElement === openedWinEl.parentElement : false;

                setTimeout(() => {
                    winEl.classList.remove('popup__window_visible');
                    winEl.style.display = 'none';

                    if (evInit !== 'openPopup' || !samePop) winEl.parentElement.style.opacity = '0';

                    setTimeout(() => {
                        if (evInit !== 'openPopup' || !samePop) winEl.parentElement.style.display = 'none';

                        if (evInit == 'closeButton') this.fixBody(false);
                    }, this.delay);
                }, this.delay);
            }

            if (this._onclose) {
                this._onclose();
                this._onclose = null;
            } else if (this.onClose) {
                this.onClose();
            }
        },

        fixBody: function (st) {
            const headerElem = document.querySelector(this.headerSelector);

            if (st && !document.body.classList.contains('popup-is-opened')) {
                this.winScrollTop = window.pageYOffset;

                const offset = window.innerWidth - document.documentElement.clientWidth;

                document.body.classList.add('popup-is-opened');

                if (headerElem) {
                    headerElem.style.transition = '0s';
                    headerElem.style.right = offset + 'px';
                }

                document.body.style.right = offset + 'px';

                document.body.style.top = (-this.winScrollTop) + 'px';

            } else if (!st) {
                if (headerElem) {
                    headerElem.style.right = '';
                    setTimeout(function () {
                        headerElem.style.transition = '';
                    }, 321);
                }

                document.body.classList.remove('popup-is-opened');

                window.scrollTo(0, this.winScrollTop);
            }
        }
    };
})();
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
var ValidateForm;

(function () {
    'use strict';

    ValidateForm = {
        input: null,
        formSelector: null,

        init: function (formSelector) {
            this.formSelector = formSelector;

            document.removeEventListener('input', this.inpH);
            document.removeEventListener('change', this.chH);

            this.inpH = this.inpH.bind(this);
            this.chH = this.chH.bind(this);

            document.addEventListener('input', this.inpH);
            document.addEventListener('change', this.chH);
        },

        inpH: function (e) {
            const elem = e.target.closest(this.formSelector + ' input[type="text"],' + this.formSelector + ' input[type="password"],' + this.formSelector + ' input[type="number"],' + this.formSelector + ' input[type="tel"],' + this.formSelector + ' textarea, input[type="text"][form]');

            if (elem /* && elem.hasAttribute('data-tested') */) {
                setTimeout(() => {
                    this.validateOnInput(elem);
                }, 121);
            }
        },

        chH: function (e) {
            const elem = e.target.closest(this.formSelector + ' input[type="radio"],' + this.formSelector + ' input[type="checkbox"]');

            if (elem) {
                this[elem.type](elem);
            }
        },

        validateOnInput: function (elem) {
            this.input = elem;

            const dataType = elem.getAttribute('data-type');

            if (elem.hasAttribute('data-tested')) {
                this.formError(elem.closest('form'), false);

                if (
                    elem.getAttribute('data-required') === 'true' &&
                    (!elem.value.length || /^\s+$/.test(elem.value))
                ) {
                    this.successTip(false);
                    this.errorTip(true);
                } else if (elem.value.length) {
                    if (dataType) {
                        try {
                            const tE = this[dataType]();

                            if (tE) {
                                this.successTip(false);
                                this.errorTip(true, tE);
                                err++;
                                errElems.push(elem);
                            } else {
                                this.errorTip(false);
                                this.successTip(true);
                            }
                        } catch (error) {
                            console.log('Error while process', dataType)
                        }
                    } else {
                        this.errorTip(false);
                        this.successTip(true);
                    }
                } else {
                    this.errorTip(false);
                    this.successTip(false);
                }

            } else {
                if ((!elem.value.length || /^\s+$/.test(elem.value))) {
                    this.successTip(false);
                } else if (elem.value.length) {
                    if (dataType) {
                        try {
                            if (this[dataType]() === null) {
                                this.successTip(true);
                            } else {
                                this.successTip(false);
                            }
                        } catch (error) {
                            console.log('Error while process', dataType)
                        }
                    } else {
                        this.successTip(true);
                    }
                }
            }
        },

        validate: function (formElem) {
            const errElems = [];

            let err = 0;

            // text, password, textarea
            const elements = formElem.querySelectorAll('input[type="text"], input[type="password"], input[type="number"], input[type="tel"], textarea');

            const checkElems = (elements) => {
                for (let i = 0; i < elements.length; i++) {
                    const elem = elements[i];

                    if (elemIsHidden(elem)) {
                        continue;
                    }

                    this.input = elem;

                    elem.setAttribute('data-tested', 'true');

                    const dataType = elem.getAttribute('data-type');

                    if (
                        elem.getAttribute('data-required') === 'true' &&
                        (!elem.value.length || /^\s+$/.test(elem.value))
                    ) {
                        this.errorTip(true);
                        err++;
                        errElems.push(elem);
                    } else if (elem.value.length) {
                        if (elem.hasAttribute('data-custom-error')) {
                            err++;
                            errElems.push(elem);
                        } else if (dataType) {
                            try {
                                const tE = this[dataType]();

                                if (tE) {
                                    this.errorTip(true, tE);
                                    err++;
                                    errElems.push(elem);
                                } else {
                                    this.errorTip(false);
                                }
                            } catch (error) {
                                console.log('Error while process', dataType)
                            }
                        } else {
                            this.errorTip(false);
                        }
                    } else {
                        this.errorTip(false);
                    }
                }
            }

            checkElems(elements);

            if (formElem.id) {
                const elements = document.querySelectorAll('input[form="' + formElem.id + '"]');

                checkElems(elements);
            }

            // select
            const selectElements = formElem.querySelectorAll('.select__input');

            for (let i = 0; i < selectElements.length; i++) {
                const selectElem = selectElements[i];

                if (elemIsHidden(selectElem.parentElement)) continue;

                if (this.select(selectElem)) {
                    err++;
                    errElems.push(selectElem.parentElement);
                }
            }

            // checkboxes
            const chboxEls = formElem.querySelectorAll('input[type="checkbox"]');

            for (let i = 0; i < chboxEls.length; i++) {
                const elem = chboxEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                elem.setAttribute('data-tested', 'true');

                if (elem.getAttribute('data-required') === 'true' && !elem.checked) {
                    this.errorTip(true);
                    err++;
                    errElems.push(elem);
                } else {
                    this.errorTip(false);
                }
            }

            // checkbox group
            const chboxGrEls = formElem.querySelectorAll('.form__chbox-group');

            for (let i = 0; i < chboxGrEls.length; i++) {
                var group = chboxGrEls[i],
                    checkedElements = 0;

                if (elemIsHidden(group)) {
                    continue;
                }

                group.setAttribute('data-tested', 'true');

                const chboxInGrEls = group.querySelectorAll('input[type="checkbox"]');

                for (let i = 0; i < chboxInGrEls.length; i++) {
                    if (chboxInGrEls[i].checked) {
                        checkedElements++;
                    }
                }

                if (checkedElements < group.getAttribute('data-min')) {
                    group.classList.add('form__chbox-group_error');
                    err++;
                    errElems.push(group);
                } else {
                    group.classList.remove('form__chbox-group_error');
                }
            }

            // radio group
            const radGrEls = formElem.querySelectorAll('.form__radio-group');

            for (let i = 0; i < radGrEls.length; i++) {
                var group = radGrEls[i],
                    checkedElement = false;

                if (elemIsHidden(group)) {
                    continue;
                }

                group.setAttribute('data-tested', 'true');

                const radInGrEls = group.querySelectorAll('input[type="radio"]');

                for (let i = 0; i < radInGrEls.length; i++) {
                    if (radInGrEls[i].checked) {
                        checkedElement = true;
                    }
                }

                if (!checkedElement) {
                    group.classList.add('form__radio-group_error');
                    err++;
                    errElems.push(group);
                } else {
                    group.classList.remove('form__radio-group_error');
                }
            }

            // file
            const fileEls = formElem.querySelectorAll('input[type="file"]');

            for (var i = 0; i < fileEls.length; i++) {
                var elem = fileEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                if (CustomFile.inputFiles(elem).length) {
                    if (this.file(elem, CustomFile.inputFiles(elem))) {
                        err++;
                        errElems.push(elem);
                    }
                } else if (elem.getAttribute('data-required') === 'true') {
                    this.errorTip(true);
                    err++;
                    errElems.push(elem);
                } else {
                    this.errorTip(false);
                }
            }

            // passwords compare
            const pwdCompEls = formElem.querySelectorAll('input[data-pass-compare-input]');

            for (var i = 0; i < pwdCompEls.length; i++) {
                var elem = pwdCompEls[i];

                if (elemIsHidden(elem)) {
                    continue;
                }

                this.input = elem;

                var val = elem.value;

                if (val.length) {
                    var compElemVal = formElem.querySelector(elem.getAttribute('data-pass-compare-input')).value;

                    if (val !== compElemVal) {
                        this.errorTip(true, 2);
                        err++;
                        errElems.push(elem);
                    } else {
                        this.errorTip(false);
                    }
                }
            }

            this.formError(formElem, err);

            if (err) {
                this.scrollToErrElem(errElems);
            }

            return (err) ? false : true;
        },

        successTip: function (state) {
            const field = this.input.closest('.form__field') || this.input.parentElement;

            if (state) {
                field.classList.add('field-success');
            } else {
                field.classList.remove('field-success');
            }
        },

        errorTip: function (err, errInd, errorTxt) {
            const field = this.input.closest('.form__field') || this.input.parentElement,
                tipEl = field.querySelector('.field-error-tip');

            if (err) {
                this.successTip(false);

                field.classList.add('field-error');

                if (errInd) {
                    if (tipEl) {
                        if (!tipEl.hasAttribute('data-error-text')) {
                            tipEl.setAttribute('data-error-text', tipEl.innerHTML);
                        }
                        tipEl.innerHTML = (errInd != 'custom') ? tipEl.getAttribute('data-error-text-' + errInd) : errorTxt;
                    }

                    field.setAttribute('data-error-index', errInd);

                } else {
                    if (tipEl && tipEl.hasAttribute('data-error-text')) {
                        tipEl.innerHTML = tipEl.getAttribute('data-error-text');
                    }

                    field.removeAttribute('data-error-index');
                }

            } else {
                field.classList.remove('field-error');
                field.removeAttribute('data-error-index');
            }
        },

        customErrorTip: function (input, errorTxt, isLockForm) {
            if (!input) return;

            this.input = input;

            if (errorTxt) {
                this.errorTip(true, 'custom', errorTxt);

                if (isLockForm) {
                    input.setAttribute('data-custom-error', 'true');
                }
            } else {
                this.errorTip(false);
                input.removeAttribute('data-custom-error');

                this.validate(input.closest('form'));
            }
        },

        formError: function (formElem, err, errTxt) {
            const errTipElem = formElem.querySelector('.form-error-tip');

            if (err) {
                formElem.classList.add('form-error');

                if (!errTipElem) return;

                if (errTxt) {
                    if (!errTipElem.hasAttribute('data-error-text')) {
                        errTipElem.setAttribute('data-error-text', errTipElem.innerHTML);
                    }

                    errTipElem.innerHTML = errTxt;
                } else if (errTipElem.hasAttribute('data-error-text')) {
                    errTipElem.innerHTML = errTipElem.getAttribute('data-error-text');
                }
            } else {
                formElem.classList.remove('form-error');
            }
        },

        customFormErrorTip: function (formElem, errorTxt) {
            if (!formElem) return;

            if (errorTxt) {
                this.formError(formElem, true, errorTxt);
            } else {
                this.formError(formElem, false);
            }
        },

        scrollToErrElem: function (elems) {
            let offsetTop = 99999;

            const headerHeight = document.querySelector('.header').offsetHeight;

            for (let i = 0; i < elems.length; i++) {
                const el = elems[i],
                    epOffsetTop = el.getBoundingClientRect().top;

                if (epOffsetTop < headerHeight && epOffsetTop < offsetTop) {
                    offsetTop = epOffsetTop;
                }
            }

            if (offsetTop != 99999) {
                const scrTo = offsetTop + window.scrollY - headerHeight;

                animate(function (progress) {
                    window.scrollTo(0, scrTo * progress + (1 - progress) * window.scrollY);
                }, 1000, 'easeInOutQuad');
            }
        },

        txt: function () {
            if (!/^[0-9a-zа-яё_,.:;@-\s]*$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        num: function () {
            if (!/^[0-9.,-]*$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        int: function () {
            if (!/^[0-9]*$/.test(this.input.value)) {
                return 2;
            }

            if (this.input.hasAttribute('data-min')) {
                if (+this.input.value < +this.input.getAttribute('data-min')) {
                    return 3;
                }
            }

            return null;
        },

        cardNumber: function () {
            if (!/^\d{4}\-\d{4}\-\d{4}\-\d{4}$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        name: function () {
            if (!/^[a-zа-яё'\s-]{2,21}(\s[a-zа-яё'\s-]{2,21})?(\s[a-zа-яё'\s-]{2,21})?$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        date: function () {
            let errDate = false,
                matches = this.input.value.match(/^(\d{2}).(\d{2}).(\d{4})$/);

            if (!matches) {
                errDate = 1;
            } else {
                var compDate = new Date(matches[3], (matches[2] - 1), matches[1]),
                    curDate = new Date();

                if (this.input.hasAttribute('data-min-years-passed')) {
                    var interval = curDate.valueOf() - new Date(curDate.getFullYear() - (+this.input.getAttribute('data-min-years-passed')), curDate.getMonth(), curDate.getDate()).valueOf();

                    if (curDate.valueOf() < compDate.valueOf() || (curDate.getFullYear() - matches[3]) > 100) {
                        errDate = 1;
                    } else if ((curDate.valueOf() - compDate.valueOf()) < interval) {
                        errDate = 2;
                    }
                }

                if (compDate.getFullYear() != matches[3] || compDate.getMonth() != (matches[2] - 1) || compDate.getDate() != matches[1]) {
                    errDate = 1;
                }
            }

            if (errDate == 1) {
                return 2;
            } else if (errDate == 2) {
                return 3;
            }

            return null;
        },

        time: function () {
            const matches = this.input.value.match(/^(\d{1,2}):(\d{1,2})$/);

            if (!matches || Number(matches[1]) > 23 || Number(matches[2]) > 59) {
                return 2;
            }

            return null;
        },

        email: function () {
            if (!/^[a-z0-9]+[\w\-\.]*@([\w\-]{2,}\.)+[a-z]{2,}$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        url: function () {
            if (!/^(https?\:\/\/)?[а-я\w-.]+\.[a-zа-я]{2,11}[/?а-я\w/=-]+$/i.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        tel: function () {
            if (!/^\+?[\d)(\s-]+$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        tel_RU: function () {
            if (!/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(this.input.value)) {
                return 2;
            }

            return null;
        },

        pass: function () {
            let err = false,
                minLng = this.input.getAttribute('data-min-length');

            if (minLng && this.input.value.length < minLng) {
                return 2;
            }

            return null;
        },

        checkbox: function (elem) {
            this.input = elem;

            var group = elem.closest('.form__chbox-group');

            if (group && group.getAttribute('data-tested')) {
                var checkedElements = 0,
                    elements = group.querySelectorAll('input[type="checkbox"]');

                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].checked) {
                        checkedElements++;
                    }
                }

                if (checkedElements < group.getAttribute('data-min')) {
                    group.classList.add('form__chbox-group_error');
                } else {
                    group.classList.remove('form__chbox-group_error');
                }

            } else if (elem.getAttribute('data-tested')) {
                if (elem.getAttribute('data-required') === 'true' && !elem.checked) {
                    this.errorTip(true);
                } else {
                    this.errorTip(false);
                }
            }
        },

        radio: function (elem) {
            this.input = elem;

            var checkedElement = false,
                group = elem.closest('.form__radio-group');

            if (!group) return;

            var elements = group.querySelectorAll('input[type="radio"]');

            for (var i = 0; i < elements.length; i++) {
                if (elements[i].checked) {
                    checkedElement = true;
                }
            }

            if (!checkedElement) {
                group.classList.add('form__radio-group_error');
            } else {
                group.classList.remove('form__radio-group_error');
            }
        },

        select: function (elem) {
            let err = false;

            this.input = elem;

            if (elem.getAttribute('data-required') === 'true' && !elem.value.length) {
                this.errorTip(true);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        },

        file: function (elem, filesArr) {
            this.input = elem;

            let err = false,
                errCount = { ext: 0, size: 0 },
                maxFiles = +this.input.getAttribute('data-max-files'),
                extRegExp = new RegExp('(?:\\.' + this.input.getAttribute('data-ext').replace(/,/g, '|\\.') + ')$', 'i'),
                maxSize = +this.input.getAttribute('data-max-size'),
                fileItemElements = this.input.closest('.custom-file').querySelectorAll('.custom-file__item');;

            for (var i = 0; i < filesArr.length; i++) {
                var file = filesArr[i];

                if (!file.name.match(extRegExp)) {
                    errCount.ext++;

                    if (fileItemElements[i]) {
                        fileItemElements[i].classList.add('file-error');
                    }

                    continue;
                }

                if (file.size > maxSize) {
                    errCount.size++;

                    if (fileItemElements[i]) {
                        fileItemElements[i].classList.add('file-error');
                    }
                }
            }

            if (maxFiles && filesArr.length > maxFiles) {
                this.errorTip(true, 4);
                err = true;
            } else if (errCount.ext) {
                this.errorTip(true, 2);
                err = true;
            } else if (errCount.size) {
                this.errorTip(true, 3);
                err = true;
            } else {
                this.errorTip(false);
            }

            return err;
        }
    };
})();
/* 
*   Checkbox.onChange(function(el, state) {
*       // body
*   }); 
*/

var Checkbox;

(function () {
    'use strict';

    Checkbox = {
        hideCssClass: 'hidden',
        opt: {},
        onChangeSubscribers: [],

        init: function (options) {
            options = options || {};

            this.opt.focusOnTarget = (options.focusOnTarget !== undefined) ? options.focusOnTarget : false;

            const elems = document.querySelectorAll('input[type="checkbox"]');

            for (let i = 0; i < elems.length; i++) {
                this.change(elems[i], true);
            }

            // change event
            document.removeEventListener('change', this.changeHandler);

            this.changeHandler = this.changeHandler.bind(this);
            document.addEventListener('change', this.changeHandler);
        },

        changeHandler: function (e) {
            const elem = e.target.closest('input[type="checkbox"]');

            if (elem) {
                this.change(elem);
            }
        },

        change: function (elem, onInit) {
            if (!onInit) {
                this.onChangeSubscribers.forEach(function (item) {
                    item(elem, elem.checked);
                });
            }

            const targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

            if (!targetElements.length) return;

            for (let i = 0; i < targetElements.length; i++) {
                const targetElem = targetElements[i];

                targetElem.style.display = (elem.checked) ? 'block' : 'none';

                if (elem.checked) {
                    targetElem.classList.remove(this.hideCssClass);

                    const inpEls = targetElem.querySelectorAll('input[type="text"]');

                    for (var j = 0; j < inpEls.length; j++) {
                        var inpEl = inpEls[j];

                        inpEl.focus();
                    }

                } else {
                    targetElem.classList.add(this.hideCssClass);
                }
            }
        },

        onChange: function (fun) {
            if (typeof fun === 'function') {
                this.onChangeSubscribers.push(fun);
            }
        }
    };
})();
(function () {
	'use strict';

	//show element on radio button change
	var ChangeRadio = {
		hideCssClass: 'hidden',

		change: function (checkedElem) {
			var elements = document.querySelectorAll('input[type="radio"][name="' + checkedElem.name + '"]');

			if (!elements.length) {
				return;
			}

			for (let i = 0; i < elements.length; i++) {
				const elem = elements[i],
					targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : [],
					hideElems = (elem.hasAttribute('data-hide-elements')) ? document.querySelectorAll(elem.getAttribute('data-hide-elements')) : [];

				if (!targetElements.length && !hideElems.length) continue;

				for (let i = 0; i < targetElements.length; i++) {
					const targetElem = targetElements[i];

					targetElem.style.display = (elem.checked) ? 'block' : 'none';

					if (elem.checked) {
						targetElem.classList.remove(this.hideCssClass);
					} else {
						targetElem.classList.add(this.hideCssClass);
					}
				}

				for (let i = 0; i < hideElems.length; i++) {
					const hideEl = hideElems[i];

					hideEl.style.display = (elem.checked) ? 'none' : 'block';

					if (elem.checked) {
						hideEl.classList.add(this.hideCssClass);
					} else {
						hideEl.classList.remove(this.hideCssClass);
					}
				}

			}
		},

		init: function () {
			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="radio"]');

				if (elem) {
					this.change(elem);
				}
			});
		}
	};

	//init scripts
	document.addEventListener('DOMContentLoaded', function () {
		ChangeRadio.init();
	});
})();
; var Select;

(function () {
    'use strict';

    // custom select
    Select = {
        field: null,
        hideCssClass: 'hidden',
        onSelectSubscribers: [],
        focusBlurIsDisabled: false,
        st: null,

        reset: function (parentElem) {
            const parElem = parentElem || document,
                fieldElements = parElem.querySelectorAll('.select'),
                buttonElements = parElem.querySelectorAll('.select__button'),
                inputElements = parElem.querySelectorAll('.select__input'),
                valueElements = parElem.querySelectorAll('.select__val');

            for (let i = 0; i < fieldElements.length; i++) {
                fieldElements[i].classList.remove('select_changed');
            }

            for (let i = 0; i < buttonElements.length; i++) {
                buttonElements[i].children[0].innerHTML = buttonElements[i].getAttribute('data-placeholder');
            }

            for (let i = 0; i < inputElements.length; i++) {
                inputElements[i].value = '';
                inputElements[i].blur();
            }

            for (let i = 0; i < valueElements.length; i++) {
                valueElements[i].classList.remove('select__val_checked');
                valueElements[i].disabled = false;
            }
        },

        closeAll: function () {
            const fieldElements = document.querySelectorAll('.select'),
                optionsElements = document.querySelectorAll('.select__options');

            for (let i = 0; i < fieldElements.length; i++) {
                fieldElements[i].classList.remove('select_opened');

                optionsElements[i].classList.remove('ovfauto');
                optionsElements[i].style.height = 0;

                const listItemElements = optionsElements[i].querySelectorAll('li');

                for (let i = 0; i < listItemElements.length; i++) {
                    listItemElements[i].classList.remove('hover');
                }
            }
        },

        close: function (fieldEl) {
            fieldEl = fieldEl || this.field;

            setTimeout(function () {
                fieldEl.classList.remove('select_opened');
            }, 210);

            const optionsElem = fieldEl.querySelector('.select__options'),
                listItemElements = optionsElem.querySelectorAll('li');

            optionsElem.classList.remove('ovfauto');
            optionsElem.style.height = 0;

            for (let i = 0; i < listItemElements.length; i++) {
                listItemElements[i].classList.remove('hover');
            }
        },

        open: function () {
            this.field.classList.add('select_opened');

            const optionsElem = this.field.querySelector('.select__options');

            setTimeout(function () {
                optionsElem.style.height = ((optionsElem.scrollHeight > window.innerHeight - optionsElem.getBoundingClientRect().top) ? window.innerHeight - optionsElem.getBoundingClientRect().top : (optionsElem.scrollHeight + 2)) + 'px';
                optionsElem.scrollTop = 0;

                setTimeout(function () {
                    optionsElem.classList.add('ovfauto');
                }, 621);
            }, 21);
        },

        selectMultipleVal: function (elem, button, input) {
            const toButtonValue = [],
                toInputValue = [],
                inputsBlock = this.field.querySelector('.select__multiple-inputs');

            elem.classList.toggle('select__val_checked');

            const checkedElements = this.field.querySelectorAll('.select__val_checked');

            for (let i = 0; i < checkedElements.length; i++) {
                const elem = checkedElements[i];

                toButtonValue[i] = elem.innerHTML;
                toInputValue[i] = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;
            }

            if (toButtonValue.length) {
                button.children[0].innerHTML = toButtonValue.join(', ');

                input.value = toInputValue[0];

                inputsBlock.innerHTML = '';

                if (toInputValue.length > 1) {
                    for (let i = 1; i < toInputValue.length; i++) {
                        const yetInput = document.createElement('input');

                        yetInput.type = 'hidden';
                        yetInput.name = input.name;
                        yetInput.value = toInputValue[i];

                        inputsBlock.appendChild(yetInput);
                    }
                }
            } else {
                button.children[0].innerHTML = button.getAttribute('data-placeholder');
                input.value = '';
                this.close();
            }
        },

        targetAction: function () {
            const valEls = this.field.querySelectorAll('.select__val');

            for (let i = 0; i < valEls.length; i++) {
                const vEl = valEls[i];

                if (vEl.hasAttribute('data-show-elements')) {
                    const showEls = document.querySelectorAll(vEl.getAttribute('data-show-elements'));

                    for (let i = 0; i < showEls.length; i++) {
                        const sEl = showEls[i];

                        sEl.style.display = 'none';
                        sEl.classList.add(this.hideCssClass);
                    }
                }

                if (vEl.hasAttribute('data-hide-elements')) {
                    const hideEls = document.querySelectorAll(vEl.getAttribute('data-hide-elements'));

                    for (let i = 0; i < hideEls.length; i++) {
                        const hEl = hideEls[i];

                        hEl.style.display = 'block';
                        hEl.classList.remove(this.hideCssClass);
                    }
                }
            }

            for (let i = 0; i < valEls.length; i++) {
                const vEl = valEls[i];

                if (vEl.hasAttribute('data-show-elements')) {
                    const showEls = document.querySelectorAll(vEl.getAttribute('data-show-elements'));

                    for (let i = 0; i < showEls.length; i++) {
                        const sEl = showEls[i];

                        if (vEl.classList.contains('select__val_checked')) {
                            sEl.style.display = 'block';
                            sEl.classList.remove(this.hideCssClass);

                            // focus on input
                            const txtInpEl = sEl.querySelector('input[type="text"]');

                            if (txtInpEl) {
                                txtInpEl.focus();
                            }
                        }
                    }
                }

                if (vEl.hasAttribute('data-hide-elements')) {
                    const hideEls = document.querySelectorAll(vEl.getAttribute('data-hide-elements'));

                    for (let i = 0; i < hideEls.length; i++) {
                        const hEl = hideEls[i];

                        if (vEl.classList.contains('select__val_checked')) {
                            hEl.style.display = 'none';
                            hEl.classList.add(this.hideCssClass);
                        }
                    }
                }
            }
        },

        selectVal: function (elem) {
            const button = this.field.querySelector('.select__button'),
                input = this.field.querySelector('.select__input');

            if (this.field.classList.contains('select_multiple')) {
                this.selectMultipleVal(elem, button, input);
            } else {
                const toButtonValue = elem.innerHTML,
                    toInputValue = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;

                const valueElements = this.field.querySelectorAll('.select__val');

                for (let i = 0; i < valueElements.length; i++) {
                    const valElem = valueElements[i];

                    valElem.classList.remove('select__val_checked');
                    valElem.disabled = false;
                    
                    valElem.parentElement.classList.remove('hidden');
                }

                elem.classList.add('select__val_checked');
                elem.disabled = true;

                if (this.field.classList.contains('select_hide-selected-option')) {
                    elem.parentElement.classList.add('hidden');
                }

                if (button) {
                    button.children[0].innerHTML = toButtonValue;
                }

                input.value = toInputValue;

                this.close();

                if (window.Placeholder) {
                    Placeholder.hide(input, true);
                }

                if (input.getAttribute('data-submit-form-onchange')) {
                    Form.submitForm(input.closest('form'));
                }

                this.onSelectSubscribers.forEach(item => {
                    item(input, toButtonValue, toInputValue, elem.getAttribute('data-second-value'));
                });
            }

            this.targetAction();

            if (input.classList.contains('var-height-textarea__textarea')) {
                varHeightTextarea.setHeight(input);
            }

            this.field.classList.add('select_changed');

            ValidateForm.select(input);
        },

        onSelect: function (fun) {
            if (typeof fun === 'function') {
                this.onSelectSubscribers.push(fun);
            }
        },

        setOptions: function (fieldSelector, optObj, nameKey, valKey, secValKey) {
            const fieldElements = document.querySelectorAll(fieldSelector + ' .select');

            for (let i = 0; i < fieldElements.length; i++) {
                const optionsElem = fieldElements[i].querySelector('.select__options');

                optionsElem.innerHTML = '';

                for (let i = 0; i < optObj.length; i++) {
                    let li = document.createElement('li'),
                        secValAttr = (secValKey != undefined) ? ' data-second-value="' + optObj[i][secValKey] + '"' : '';

                    li.innerHTML = '<button type="button" class="select__val" data-value="' + optObj[i][valKey] + '"' + secValAttr + '>' + optObj[i][nameKey] + '</button>';

                    optionsElem.appendChild(li);
                }
            }
        },

        keyboard: function (key) {
            const options = this.field.querySelector('.select__options'),
                hoverItem = options.querySelector('li.hover');

            switch (key) {
                case 40:
                    if (hoverItem) {
                        const nextItem = function (item) {
                            let elem = item.nextElementSibling;

                            while (elem) {
                                if (!elem) break;

                                if (!elemIsHidden(elem)) {
                                    return elem;
                                } else {
                                    elem = elem.nextElementSibling;
                                }
                            }
                        }(hoverItem);

                        if (nextItem) {
                            hoverItem.classList.remove('hover');
                            nextItem.classList.add('hover');

                            options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
                        }
                    } else {
                        let elem = options.firstElementChild;

                        while (elem) {
                            if (!elem) break;

                            if (!elemIsHidden(elem)) {
                                elem.classList.add('hover');
                                break;
                            } else {
                                elem = elem.nextElementSibling;
                            }
                        }
                    }
                    break;

                case 38:
                    if (hoverItem) {
                        const nextItem = function (item) {
                            let elem = item.previousElementSibling;

                            while (elem) {
                                if (!elem) break;

                                if (!elemIsHidden(elem)) {
                                    return elem;
                                } else {
                                    elem = elem.previousElementSibling;
                                }
                            }
                        }(hoverItem);

                        if (nextItem) {
                            hoverItem.classList.remove('hover');
                            nextItem.classList.add('hover');

                            options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
                        }
                    } else {
                        let elem = options.lastElementChild;

                        while (elem) {
                            if (!elem) break;

                            if (!elemIsHidden(elem)) {
                                elem.classList.add('hover');
                                options.scrollTop = 9999;
                                break;
                            } else {
                                elem = elem.previousElementSibling;
                            }
                        }
                    }
                    break;

                case 13:
                    this.selectVal(hoverItem.querySelector('.select__val'));
            }
        },

        build: function (elementStr) {
            const elements = document.querySelectorAll(elementStr);

            if (!elements.length) return;

            for (let i = 0; i < elements.length; i++) {
                const elem = elements[i],
                    options = elem.querySelectorAll('option'),
                    parent = elem.parentElement;

                let optionsList = '',
                    selectedOption = null;

                // option list
                for (let i = 0; i < options.length; i++) {
                    const opt = options[i];

                    let liClass = '';

                    if (opt.hasAttribute('selected')) {
                        selectedOption = opt;

                        if (elem.getAttribute('data-hide-selected-option') == 'true') {
                            liClass = 'hidden';
                        }
                    }

                    optionsList += '<li' + (liClass ? ' class="' + liClass + '"' : '') + '><button type="button" tabindex="-1" class="select__val' + ((opt.hasAttribute('selected')) ? ' select__val_checked' : '') + '"' + ((opt.hasAttribute('value')) ? ' data-value="' + opt.value + '"' : '') + ((opt.hasAttribute('data-second-value')) ? ' data-second-value="' + opt.getAttribute('data-second-value') + '"' : '') + ((opt.hasAttribute('data-show-elements')) ? ' data-show-elements="' + opt.getAttribute('data-show-elements') + '"' : '') + ((opt.hasAttribute('data-hide-elements')) ? ' data-hide-elements="' + opt.getAttribute('data-hide-elements') + '"' : '') + '>' + opt.innerHTML + '</button></li>';
                }

                const require = (elem.hasAttribute('data-required')) ? ' data-required="' + elem.getAttribute('data-required') + '" ' : '';

                const placeholder = elem.getAttribute('data-placeholder');

                const submitOnChange = (elem.hasAttribute('data-submit-form-onchange')) ? ' data-submit-form-onchange="' + elem.getAttribute('data-submit-form-onchange') + '" ' : '';

                const head = '<button type="button"' + ((placeholder) ? ' data-placeholder="' + placeholder + '"' : '') + ' class="select__button"><span>' + ((selectedOption) ? selectedOption.innerHTML : (placeholder) ? placeholder : '') + '</span></button>';

                const multiple = {
                    class: (elem.multiple) ? ' select_multiple' : '',
                    inpDiv: (elem.multiple) ? '<div class="select__multiple-inputs"></div>' : ''
                };

                const hiddenInp = '<input type="hidden" name="' + elem.name + '"' + require + submitOnChange + 'class="select__input" value="' + ((selectedOption) ? selectedOption.value : '') + '">';

                if (elem.hasAttribute('data-empty-text')) {
                    optionsList = '<li class="select__options-empty">' + elem.getAttribute('data-empty-text') + '</li>';
                }

                // output select
                const customElem = document.createElement('div');

                customElem.className = 'select' + multiple.class + ((selectedOption) ? ' select_changed' : '') + (elem.getAttribute('data-hide-selected-option') == 'true' ? ' select_hide-selected-option' : '');

                customElem.innerHTML = head + '<div class="select__options-wrap"><ul class="select__options">' + optionsList + '</ul></div>' + hiddenInp + multiple.inpDiv;

                parent.replaceChild(customElem, elem);
            }
        },

        init: function (elementStr) {
            if (document.querySelector(elementStr)) this.build(elementStr);

            // click event
            document.removeEventListener('click', this.clickHandler);

            this.clickHandler = this.clickHandler.bind(this);
            document.addEventListener('click', this.clickHandler);

            // focus event
            document.removeEventListener('focus', this.focusHandler, true);

            this.focusHandler = this.focusHandler.bind(this);
            document.addEventListener('focus', this.focusHandler, true);

            // blur event
            document.removeEventListener('blur', this.blurHandler, true);

            this.blurHandler = this.blurHandler.bind(this);
            document.addEventListener('blur', this.blurHandler, true);

            // keydown event
            document.removeEventListener('keydown', this.keydownHandler);

            this.keydownHandler = this.keydownHandler.bind(this);
            document.addEventListener('keydown', this.keydownHandler);

            // close all
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.select')) {
                    this.closeAll();
                }
            });
        },

        clickHandler: function (e) {
            clearTimeout(this.st);

            const btnElem = e.target.closest('.select__button'),
                valElem = e.target.closest('.select__val');

            if (btnElem) {
                this.focusBlurIsDisabled = true;

                this.field = btnElem.closest('.select');

                if (this.field.classList.contains('select_opened')) {
                    this.close();
                } else {
                    this.closeAll();
                    this.open();
                }
            } else if (valElem) {
                this.focusBlurIsDisabled = true;

                this.field = valElem.closest('.select');
                this.selectVal(valElem);
            }

            this.st = setTimeout(function () {
                this.focusBlurIsDisabled = false;
            }, 521);
        },

        focusHandler: function (e) {
            const inpElem = e.target.closest('.select__button');

            if (inpElem) {
                setTimeout(() => {
                    if (this.focusBlurIsDisabled) return;

                    this.field = inpElem.closest('.select');

                    if (!this.field.classList.contains('select_opened')) {
                        this.closeAll();
                        this.open();
                    }
                }, 321);
            }
        },

        blurHandler: function (e) {
            const inpElem = e.target.closest('.select__button');

            if (inpElem) {
                setTimeout(() => {
                    if (this.focusBlurIsDisabled) return;

                    const fieldEl = inpElem.closest('.select');

                    if (fieldEl.classList.contains('select_opened')) {
                        this.close(fieldEl);
                    }
                }, 321);
            }
        },

        keydownHandler: function (e) {
            const elem = e.target.closest('.select_opened');

            if (!elem) return;

            this.field = elem.closest('.select');

            const key = e.which || e.keyCode || 0;

            if (key == 40 || key == 38 || key == 13) {
                e.preventDefault();
                this.keyboard(key);
            }
        }
    };
})();
var FormSlider;

(function () {
    'use strict';

    FormSlider = {
        mM: null,
        mU: null,
        dragElemObj: {},
        formsliderObj: {},
        track: null,
        edge: {},
        input: null,
        valUnit: 0,
        dragElemDistance: 0,
        dragSubscribers: [],
        dragEndSubscribers: [],
        formaters: {},

        init: function () {
            const sliders = document.querySelectorAll('.formslider');

            for (let i = 0; i < sliders.length; i++) {
                const sliderEl = sliders[i],
                    isRange = sliders[i].getAttribute('data-range');

                let dragElem;

                if (isRange == 'true') {
                    dragElem = '<button type="button" class="formslider__drag" data-index="0" data-input="' + sliderEl.getAttribute('data-first-input') + '"></button><button type="button" class="formslider__drag" data-index="1" data-input="' + sliderEl.getAttribute('data-second-input') + '"></button>';
                } else {
                    dragElem = '<button type="button" class="formslider__drag" data-input="' + sliderEl.getAttribute('data-input') + '"></button>';
                }

                sliderEl.innerHTML = '<div class="formslider__bar"><div class="formslider__track"></div>' + dragElem + '</div>';

                this.setInitState(sliderEl);
            }

            document.addEventListener('mousedown', this.mouseDown.bind(this));
            document.addEventListener('touchstart', this.mouseDown.bind(this));
        },

        reInit: function () {
            const sliders = document.querySelectorAll('.formslider');

            for (var i = 0; i < sliders.length; i++) {
                this.setInitState(sliders[i]);
            }
        },

        setInitState: function (slider) {
            const dragElems = slider.querySelectorAll('.formslider__drag'),
                trackEl = slider.querySelector('.formslider__track'),
                dragWidth = dragElems[0].offsetWidth,
                sliderW = slider.offsetWidth,
                min = +slider.getAttribute('data-min'),
                max = +slider.getAttribute('data-max'),
                isRange = slider.getAttribute('data-range'),
                isVertical = slider.getAttribute('data-vertical');

            if (isRange == 'true') {
                for (let i = 0; i < dragElems.length; i++) {
                    const dragEl = dragElems[i],
                        inpEl = document.getElementById(dragEl.getAttribute('data-input'));

                    let inpVal = inpEl.hasAttribute('data-value') ? +inpEl.getAttribute('data-value') : +inpEl.value;

                    if (inpVal > max) {
                        inpVal = max;
                    }

                    const left = ((inpVal - min) / ((max - min) / 100)) * ((sliderW - dragWidth) / 100);

                    dragEl.style.left = left + 'px';

                    if (i == 0) {
                        trackEl.style.left = (left + dragWidth / 2) + 'px';
                    } else {
                        trackEl.style.right = (sliderW - left - dragWidth / 2) + 'px';
                    }
                }

            } else {
                const dragEl = dragElems[0],
                    inpEl = document.getElementById(dragEl.getAttribute('data-input'));

                let inpVal = inpEl.hasAttribute('data-value') ? +inpEl.getAttribute('data-value') : +inpEl.value;

                if (inpVal > max) {
                    inpVal = max;
                }

                if (isVertical) {

                } else {
                    const left = ((inpVal - min) / ((max - min) / 100)) * ((sliderW - dragWidth) / 100);

                    dragEl.style.left = left + 'px';
                }
            }
        },

        // on mouse down
        mouseDown: function (e) {
            if (e.type == 'mousedown' && e.which != 1) {
                return;
            }

            var elem = e.target.closest('.formslider__drag');

            if (!elem) {
                return;
            }

            this.mM = this.mouseMove.bind(this);
            this.mU = this.mouseUp.bind(this);

            document.addEventListener('mousemove', this.mM);
            document.addEventListener('touchmove', this.mM, {passive: false});

            document.addEventListener('mouseup', this.mU);
            document.addEventListener('touchend', this.mU);

            const clientX = (e.type == 'touchstart') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

            // formslider options
            var formslider = elem.closest('.formslider');
            this.formsliderObj.X = formslider.getBoundingClientRect().left;
            this.formsliderObj.Y = formslider.getBoundingClientRect().bottom;
            this.formsliderObj.width = formslider.offsetWidth;
            this.formsliderObj.height = formslider.offsetHeight;
            this.formsliderObj.isRange = formslider.getAttribute('data-range');
            this.formsliderObj.isVertical = formslider.getAttribute('data-vertical') === 'true' || false;
            this.formsliderObj.min = +formslider.getAttribute('data-min');

            // dragable options
            this.dragElemObj.elem = elem;
            this.dragElemObj.X = elem.getBoundingClientRect().left;
            this.dragElemObj.Y = elem.getBoundingClientRect().bottom;
            this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
            this.dragElemObj.shiftY = this.dragElemObj.Y - clientY;
            this.dragElemObj.index = elem.getAttribute('data-index');
            this.dragElemObj.width = elem.offsetWidth;
            this.dragElemObj.height = elem.offsetHeight;
            elem.setAttribute('data-active', 'true');

            // one unit of value
            if (this.formsliderObj.isVertical) {
                this.valUnit = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / (formslider.offsetHeight - elem.offsetHeight);
            } else {
                this.valUnit = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / (formslider.offsetWidth - elem.offsetWidth);
            }


            this.oneValPerc = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / 100;

            // track
            this.track = formslider.querySelector('.formslider__track');

            // get parameters of slider
            if (this.formsliderObj.isRange) {

                if (this.dragElemObj.index == 0) {

                    var siblElem = formslider.querySelector('.formslider__drag[data-index="1"]');

                    this.edge.L = 0;

                    this.edge.R = siblElem.getBoundingClientRect().left - this.formsliderObj.X - siblElem.offsetWidth;

                } else if (this.dragElemObj.index == 1) {

                    var siblElem = formslider.querySelector('.formslider__drag[data-index="0"]');

                    this.edge.L = siblElem.getBoundingClientRect().left - this.formsliderObj.X + siblElem.offsetWidth;

                    this.edge.R = this.formsliderObj.width - elem.offsetWidth;
                }

            } else {
                this.edge.L = 0;

                if (this.formsliderObj.isVertical) {
                    this.edge.R = this.formsliderObj.height - elem.offsetHeight;
                } else {
                    this.edge.R = this.formsliderObj.width - elem.offsetWidth;
                }
            }

            this.input = document.getElementById(elem.getAttribute('data-input'));
        },

        // on mouse move
        mouseMove: function (e) {
            if (!this.dragElemObj.elem) {
                return;
            }

            e.preventDefault();

            const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchmove') ? e.targetTouches[0].clientY : e.clientY;

            let dragElemDistance = 0;

            if (this.formsliderObj.isVertical) {
                dragElemDistance = this.formsliderObj.Y - clientY - this.dragElemObj.shiftY;
            } else {
                dragElemDistance = clientX - this.dragElemObj.shiftX - this.formsliderObj.X;
            }

            if (dragElemDistance < this.edge.L) {
                dragElemDistance = this.edge.L;

            } else if (dragElemDistance > this.edge.R) {
                dragElemDistance = this.edge.R;
            }

            if (this.formsliderObj.isRange) {

                if (this.dragElemObj.index == 0) {
                    this.track.style.left = (dragElemDistance + 5) + 'px';
                } else if (this.dragElemObj.index == 1) {
                    this.track.style.right = (this.formsliderObj.width - dragElemDistance - 5) + 'px';
                }

            } else {
                if (this.formsliderObj.isVertical) {
                    this.track.style.height = (dragElemDistance + 5) + 'px';
                } else {
                    this.track.style.width = (dragElemDistance + 5) + 'px';
                }
            }

            if (this.formsliderObj.isVertical) {
                this.dragElemObj.elem.style.bottom = dragElemDistance + 'px';
            } else {
                this.dragElemObj.elem.style.left = dragElemDistance + 'px';
            }

            this.dragElemDistance = dragElemDistance;

            this.setInputVal();
        },

        // end drag
        mouseUp: function () {
            document.removeEventListener('mousemove', this.mM);
            document.removeEventListener('touchmove', this.mM);

            document.removeEventListener('mouseup', this.mU);
            document.removeEventListener('touchend', this.mU);

            this.setInputVal();

            this.dragElemObj.elem.setAttribute('data-active', 'false');

            this.dragEndSubscribers.forEach(item => {
                item();
            });

            // reset properties
            this.dragElemObj = {};
            this.formsliderObj = {};
            this.track = null;
            this.edge = {};
            this.input = null;
            this.valUnit = 0;
            this.dragElemDistance = 0;
        },

        onDrag: function (fun) {
            if (typeof fun === 'function') {
                this.dragSubscribers.push(fun);
            }
        },

        onDragEnd: function (fun) {
            if (typeof fun === 'function') {
                this.dragEndSubscribers.push(fun);
            }
        },

        // set hidden input value
        setInputVal: function () {
            let val;

            if (this.formsliderObj.isRange) {
                if (this.dragElemObj.index == 0) {
                    val = Math.round((this.dragElemDistance / ((this.formsliderObj.width - this.dragElemObj.width * 2) / 100)) * this.oneValPerc);
                } else {
                    val = Math.round(((this.dragElemDistance - this.dragElemObj.width) / ((this.formsliderObj.width - this.dragElemObj.width * 2) / 100)) * this.oneValPerc);
                }
            } else {
                if (this.formsliderObj.isVertical) {
                    val = Math.round((this.dragElemDistance / ((this.formsliderObj.height - this.dragElemObj.height) / 100)) * this.oneValPerc);
                } else {
                    val = Math.round((this.dragElemDistance / ((this.formsliderObj.width - this.dragElemObj.width) / 100)) * this.oneValPerc);
                }
            }

            let inpVal = val + this.formsliderObj.min,
                labelVal = val + this.formsliderObj.min;

            const formatId = this.input.getAttribute('data-format');

            if (formatId !== null && this.formaters[formatId]) {
                inpVal = this.formaters[formatId](inpVal);
            }

            this.input.value = inpVal;

            if (this.dragSubscribers.length) {
                this.dragSubscribers.forEach(item => {
                    item(this.input, inpVal);
                });
            }

            const labelId = this.input.getAttribute('data-label-id');

            if (labelId) {
                const labelEl = document.getElementById(labelId),
                    formatId = labelEl.getAttribute('data-format');

                if (formatId !== null && this.formaters[formatId]) {
                    labelVal = this.formaters[formatId](labelVal);
                }

                labelEl.innerHTML = labelVal;
            }
        },

        format: function (id, fun) {
            this.formaters[id] = fun;
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        FormSlider.init();

        window.addEventListener('winResized', function () {
            FormSlider.reInit();
        });
    });

})();
; var AutoComplete;

(function () {
    'use strict';

    AutoComplete = {
        fieldElem: null,
        inputElem: null,
        optionsElem: null,
        setValues: null,
        opt: {},
        onSelectSubscribers: [],

        open: function (optH) {
            this.fieldElem.classList.add('autocomplete_opened');

            const optionsHeight = optH || 185;

            this.optionsElem.style.height = (optionsHeight + 2) + 'px';
            this.optionsElem.scrollTop = 0;

            setTimeout(() => {
                this.optionsElem.classList.add('ovfauto');
            }, 550);
        },

        close: function (inputElem) {
            const inpElem = inputElem || this.inputElem,
                fieldElem = inpElem.closest('.autocomplete'),
                optionsElem = fieldElem.querySelector('.autocomplete__options');

            fieldElem.classList.remove('autocomplete_opened');

            optionsElem.classList.remove('ovfauto');
            optionsElem.style.height = 0;
        },

        searchValue: function () {
            if (!this.setValues) return;

            const permOpened = this.inputElem.getAttribute('data-perm-opened') === 'true';

            let values = '';

            if (this.inputElem.value.length) {
                const preReg = new RegExp('(' + this.inputElem.value.replace(/(\(|\))/g,'\\$1') + ')', 'i');

                this.setValues(this.inputElem, (valuesData, nameKey, valKey, secValKey, searchMode = true) => {
                    if (valuesData) {
                        for (let i = 0; i < valuesData.length; i++) {
                            const valData = valuesData[i];

                            if (!permOpened) {
                                if (nameKey !== undefined) {
                                    if (valData[nameKey].match(preReg) || !searchMode) {
                                        values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey].replace(preReg, '<span>$1</span>') + '</button></li>';
                                    } else {
                                        this.optionsElem.innerHTML = '';
                                        this.close();
                                    }
                                } else {
                                    if (valData.match(preReg)) {
                                        values += '<li><button type="button" class="autocomplete__val">' + valData.replace(preReg, '<span>$1</span>') + '</button></li>';
                                    } else {
                                        this.optionsElem.innerHTML = '';
                                        this.close();
                                    }
                                }

                            } else {
                                values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey].replace(preReg, '<span>$1</span>') + '</button></li>';
                            }
                        }
                    }

                    if (values == '') {
                        if (!valuesData || !valuesData.length) {
                            values = '<li class="autocomplete__options-empty">' + this.inputElem.getAttribute('data-empty-text') + '</li>';

                            this.optionsElem.innerHTML = values;

                            this.open(this.optionsElem.querySelector('.autocomplete__options-empty').offsetHeight);

                        } else if (this.inputElem.hasAttribute('data-other-value')) {
                            values = '<li class="autocomplete__options-other"><button type="button" class="autocomplete__val">' + this.inputElem.getAttribute('data-other-value') + '</button></li>';

                            this.optionsElem.innerHTML = values;

                            this.open(this.optionsElem.querySelector('.autocomplete__options-other').offsetHeight);

                        } else if (this.inputElem.hasAttribute('data-nf-text')) {
                            values = '<li class="autocomplete__options-empty">' + this.inputElem.getAttribute('data-nf-text') + '</li>';

                            this.optionsElem.innerHTML = values;

                            this.open(this.optionsElem.querySelector('.autocomplete__options-empty').offsetHeight);
                        }


                    } else {
                        this.optionsElem.innerHTML = values;
                        this.open();
                    }
                });

            } else {
                if (this.opt.getAllValuesIfEmpty) {
                    this.setValues(this.inputElem, (valuesData, nameKey, valKey, secValKey) => {
                        if (valuesData) {
                            for (let i = 0; i < valuesData.length; i++) {
                                const valData = valuesData[i];

                                if (nameKey !== undefined) {
                                    values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey] + '</button></li>';
                                } else {
                                    values += '<li><button type="button" class="autocomplete__val">' + valData + '</button></li>';
                                }
                            }

                            this.optionsElem.innerHTML = values;
                            this.open();
                        }
                    });

                } else {
                    this.optionsElem.innerHTML = '';
                    this.close();
                }
            }
        },

        selectVal: function (itemElem, ev) {
            const valueElem = itemElem.querySelector('.autocomplete__val');

            if (!valueElem) {
                return;
            }

            if (window.Placeholder) {
                Placeholder.hide(this.inputElem, true);
            }

            const inpVal = valueElem.innerHTML.replace(/<\/?span>/g, '');

            this.inputElem.value = inpVal;

            if (ev == 'click' || ev == 'enter') {
                this.onSelectSubscribers.forEach(item => {
                    item(this.inputElem, inpVal, valueElem.getAttribute('data-value'), valueElem.getAttribute('data-second-value'));
                });
            }
        },

        onSelect: function (fun) {
            if (typeof fun === 'function') {
                this.onSelectSubscribers.push(fun);
            }
        },

        keybinding: function (e) {
            const key = e.which || e.keyCode || 0;

            if (key != 40 && key != 38 && key != 13) return;

            e.preventDefault();

            const optionsElem = this.optionsElem,
                hoverItem = optionsElem.querySelector('li.hover');

            switch (key) {
                case 40:
                    if (hoverItem) {
                        var nextItem = hoverItem.nextElementSibling;

                        if (nextItem) {
                            hoverItem.classList.remove('hover');
                            nextItem.classList.add('hover');

                            optionsElem.scrollTop = optionsElem.scrollTop + (nextItem.getBoundingClientRect().top - optionsElem.getBoundingClientRect().top);

                            this.selectVal(nextItem);
                        }
                    } else {
                        var nextItem = optionsElem.firstElementChild;

                        if (nextItem) {
                            nextItem.classList.add('hover');

                            this.selectVal(nextItem);
                        }
                    }
                    break;

                case 38:
                    if (hoverItem) {
                        var nextItem = hoverItem.previousElementSibling;

                        if (nextItem) {
                            hoverItem.classList.remove('hover');
                            nextItem.classList.add('hover');

                            optionsElem.scrollTop = optionsElem.scrollTop + (nextItem.getBoundingClientRect().top - optionsElem.getBoundingClientRect().top);

                            this.selectVal(nextItem);
                        }
                    } else {
                        var nextItem = optionsElem.lastElementChild;

                        if (nextItem) {
                            nextItem.classList.add('hover');

                            optionsElem.scrollTop = 9999;

                            this.selectVal(nextItem);
                        }
                    }
                    break;

                case 13:
                    if (hoverItem) {
                        this.selectVal(hoverItem, 'enter');

                        this.inputElem.blur();
                    }
            }
        },

        init: function (options) {
            options = options || {};

            this.opt.getAllValuesIfEmpty = (options.getAllValuesIfEmpty !== undefined) ? options.getAllValuesIfEmpty : true;

            const acElems = document.querySelectorAll('.autocomplete');

            for (let i = 0; i < acElems.length; i++) {
                const acEl = acElems[i],
                    inputElem = acEl.querySelector('.autocomplete__input');

                this.setValues(inputElem, (valuesData, nameKey, valKey, secValKey, permOpened) => {
                    if (!permOpened) return;

                    inputElem.setAttribute('data-perm-opened', true);

                    const optionsElem = acEl.querySelector('.autocomplete__options');

                    let values = '';

                    for (let i = 0; i < valuesData.length; i++) {
                        const valData = valuesData[i];

                        if (nameKey !== undefined) {
                            values += '<li><button type="button" data-value="' + valData[valKey] + '" data-second-value="' + valData[secValKey] + '" class="autocomplete__val">' + valData[nameKey] + '</button></li>';
                        } else {
                            values += '<li><button type="button" class="autocomplete__val">' + valData + '</button></li>';
                        }
                    }

                    optionsElem.innerHTML = values;
                });
            }

            // focus event
            document.addEventListener('focus', (e) => {
                var elem = e.target.closest('.autocomplete__input');

                if (!elem) return;

                this.fieldElem = elem.closest('.autocomplete');
                this.inputElem = elem;
                this.optionsElem = this.fieldElem.querySelector('.autocomplete__options');

                this.searchValue();
            }, true);

            // blur event
            document.addEventListener('blur', (e) => {
                const inpElem = e.target.closest('.autocomplete__input');

                if (inpElem) {
                    setTimeout(() => {
                        this.close(inpElem);
                    }, 321);
                }
            }, true);

            // input event
            document.addEventListener('input', (e) => {
                if (e.target.closest('.autocomplete__input')) {
                    this.searchValue();
                }
            });

            // click event
            document.addEventListener('click', (e) => {
                const valElem = e.target.closest('.autocomplete__val'),
                    arrElem = e.target.closest('.autocomplete__arr');


                if (valElem) {
                    this.inputElem = valElem.closest('.autocomplete').querySelector('.autocomplete__input');

                    this.selectVal(valElem.parentElement, 'click');
                } else if (arrElem) {
                    if (!arrElem.closest('.autocomplete_opened')) {
                        arrElem.closest('.autocomplete').querySelector('.autocomplete__input').focus();
                    } else {
                        this.close();
                    }
                }
            });

            // keyboard events
            document.addEventListener('keydown', (e) => {
                if (e.target.closest('.autocomplete_opened')) {
                    this.keybinding(e);
                }
            });
        }
    };
})();
; var CustomFile;

(function () {
    'use strict';

    //custom file
    CustomFile = {
        input: null,
        filesObj: {},
        filesArrayObj: {},
        filesIsReady: null,

        init: function () {
            document.addEventListener('change', (e) => {
                const elem = e.target.closest('input[type="file"]');

                if (!elem) return;

                this.input = elem;

                this.changeInput(elem);
            });

            document.addEventListener('click', (e) => {
                const delBtnElem = e.target.closest('.custom-file__del-btn'),
                    clearBtnElem = e.target.closest('.custom-file__clear-btn'),
                    inputElem = e.target.closest('input[type="file"]');

                if (inputElem && inputElem.multiple) inputElem.value = null;

                if (delBtnElem) {
                    this.input = delBtnElem.closest('.custom-file').querySelector('.custom-file__input');

                    this.input.value = null;

                    delBtnElem.closest('.custom-file__items').removeChild(delBtnElem.closest('.custom-file__item'));

                    this.setFilesObj(false, delBtnElem.getAttribute('data-ind'));

                    if (this.filesDeleted) this.filesDeleted(this.input);
                }

                if (clearBtnElem) {
                    const inputElem = clearBtnElem.closest('.custom-file').querySelector('.custom-file__input');

                    inputElem.value = null;

                    this.clear(inputElem);
                }
            });
        },

        clear: function (inpEl, resetVal) {
            if (inpEl.hasAttribute('data-preview-elem')) {
                document.querySelector(inpEl.getAttribute('data-preview-elem')).innerHTML = '';
            }

            const itemsEl = inpEl.closest('.custom-file').querySelector('.custom-file__items');

            if (itemsEl) {
                itemsEl.innerHTML = '';
            }

            if (resetVal !== false) inpEl.value = null;

            this.filesObj[inpEl.id] = {};
            this.filesArrayObj[inpEl.id] = [];

            this.labelText(inpEl);
        },

        fieldClass: function (inputElem) {
            const fieldElem = inputElem.closest('.custom-file');

            if (this.filesArrayObj[inputElem.id].length) {
                fieldElem.classList.add('custom-file_loaded');

                if (this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
                    fieldElem.classList.add('custom-file_max-loaded');
                } else {
                    fieldElem.classList.remove('custom-file_max-loaded');
                }
            } else {
                fieldElem.classList.remove('custom-file_loaded');
                fieldElem.classList.remove('custom-file_max-loaded');
            }
        },

        lockUpload: function (inputElem) {
            if (inputElem.classList.contains('custom-file__input_lock') && inputElem.multiple && inputElem.hasAttribute('data-max-files') && this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
                inputElem.setAttribute('disabled', 'disable');
            } else {
                inputElem.removeAttribute('disabled');
            }
        },

        labelText: function (inputElem) {
            const labTxtElem = inputElem.closest('.custom-file').querySelector('.custom-file__label-text');

            if (!labTxtElem || !labTxtElem.hasAttribute('data-label-text-2')) {
                return;
            }

            const maxFiles = (inputElem.multiple) ? (+this.input.getAttribute('data-max-files')) : 1;

            if (this.filesArrayObj[inputElem.id].length >= maxFiles) {
                if (!labTxtElem.hasAttribute('data-label-text')) {
                    labTxtElem.setAttribute('data-label-text', labTxtElem.innerHTML);
                }

                if (labTxtElem.getAttribute('data-label-text-2') == '%filename%') {
                    labTxtElem.innerHTML = inputElem.files[0].name;
                } else {
                    labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text-2');
                }

            } else if (labTxtElem.hasAttribute('data-label-text')) {
                labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text');
            }
        },

        loadPreview: function (file, fileItem) {
            var reader = new FileReader(),
                previewDiv;

            if (this.input.hasAttribute('data-preview-elem')) {
                previewDiv = document.querySelector(this.input.getAttribute('data-preview-elem'));
            } else {
                previewDiv = document.createElement('div');

                previewDiv.className = 'custom-file__preview';

                fileItem.insertBefore(previewDiv, fileItem.firstChild);
            }

            reader.onload = function (e) {
                setTimeout(function () {
                    var imgDiv = document.createElement('div');

                    imgDiv.innerHTML = (file.type.match(/image.*/)) ? '<img src="' + e.target.result + '">' : '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMzAwcHgiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDAgMzAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxyZWN0IGZpbGw9IiNCOEQ4RkYiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIi8+DQo8cG9seWdvbiBmaWxsPSIjN0M3QzdDIiBwb2ludHM9IjUxLDI2Ny42NjY5OTIyIDExMSwxOTcgMTUxLDI0My42NjY5OTIyIDI4OC4zMzMwMDc4LDEyMSAzMDAuMTY2OTkyMiwxMzQuMTY2NTAzOSAzMDAsMzAwIDAsMzAwIA0KCTAsMjA4LjgzMzk4NDQgIi8+DQo8cG9seWdvbiBmaWxsPSIjQUZBRkFGIiBwb2ludHM9IjAuMTI1LDI2Ny4xMjUgNDguODMzNDk2MSwxNzQuNjY2OTkyMiAxMDMuNSwyNjQuNSAyMDMuODc1LDY1LjMzMzAwNzggMzAwLjE2Njk5MjIsMjU0LjUgMzAwLDMwMCANCgkwLDMwMCAiLz4NCjxjaXJjbGUgZmlsbD0iI0VBRUFFQSIgY3g9Ijc3LjAwMDI0NDEiIGN5PSI3MSIgcj0iMzYuNjY2NzQ4Ii8+DQo8L3N2Zz4NCg==">';

                    previewDiv.appendChild(imgDiv);

                    previewDiv.classList.add('custom-file__preview_loaded');
                }, 121);
            }

            reader.readAsDataURL(file);
        },

        changeInput: function (elem) {
            var fileItems = elem.closest('.custom-file').querySelector('.custom-file__items');

            if (elem.getAttribute('data-action') == 'clear' || !elem.multiple) {
                this.clear(elem, false);
            }

            for (var i = 0; i < elem.files.length; i++) {
                var file = elem.files[i];

                if (this.filesObj[elem.id] && this.filesObj[elem.id][file.name] != undefined) continue;

                var fileItem = document.createElement('div');

                fileItem.className = 'custom-file__item';
                fileItem.innerHTML = '<div class="custom-file__name">' + file.name + '</div><button type="button" class="custom-file__del-btn" data-ind="' + file.name + '"></button>';

                if (fileItems) {
                    fileItems.appendChild(fileItem);
                }

                this.loadPreview(file, fileItem);
            }

            this.setFilesObj(elem.files);

            if (this.filesIsReady) {
                this.filesIsReady(elem);
            }
        },

        setFilesObj: function (filesList, objKey) {
            var inputElem = this.input;

            if (!inputElem.id.length) {
                inputElem.id = 'custom-file-input-' + new Date().valueOf();
            }

            if (filesList) {
                this.filesObj[inputElem.id] = this.filesObj[inputElem.id] || {};

                for (var i = 0; i < filesList.length; i++) {
                    this.filesObj[inputElem.id][filesList[i].name] = filesList[i];
                }
            } else {
                delete this.filesObj[inputElem.id][objKey];
            }

            this.filesArrayObj[inputElem.id] = [];

            for (var key in this.filesObj[inputElem.id]) {
                this.filesArrayObj[inputElem.id].push(this.filesObj[inputElem.id][key]);
            }

            this.fieldClass(inputElem);

            this.labelText(inputElem);

            this.lockUpload(inputElem);

            ValidateForm.file(inputElem, this.filesArrayObj[inputElem.id]);
        },

        inputFiles: function (inputElem) {
            return this.filesArrayObj[inputElem.id] || [];
        },

        getFiles: function (formElem) {
            var inputFileElements = formElem.querySelectorAll('.custom-file__input'),
                filesArr = [];

            if (inputFileElements.length == 1) {
                filesArr = this.filesArrayObj[inputFileElements[0].id];
            } else {
                for (var i = 0; i < inputFileElements.length; i++) {
                    if (this.filesArrayObj[inputFileElements[i].id]) {
                        filesArr.push({ name: inputFileElements[i].name, files: this.filesArrayObj[inputFileElements[i].id] });
                    }
                }
            }

            return filesArr;
        }
    };

    //init script
    document.addEventListener('DOMContentLoaded', function () {
        CustomFile.init();
    });
})();
; var Placeholder;

(function () {
    'use strict';

    Placeholder = {
        elementsStr: null,

        init: function (elementsStr) {
            const elements = document.querySelectorAll(elementsStr);

            if (!elements.length) {
                return;
            }

            this.elementsStr = elementsStr;

            for (let i = 0; i < elements.length; i++) {
                const elem = elements[i];

                if (elem.placeholder) {

                    const elemFor = (elem.id) ? elem.id : 'placeholder-index-' + i,
                        label = document.createElement('label');

                    label.htmlFor = elemFor;
                    label.className = 'placeholder';
                    label.innerHTML = elem.placeholder;

                    if (elem.hasAttribute('data-hide-placeholder')) {
                        label.setAttribute('data-hide-placeholder', elem.getAttribute('data-hide-placeholder'));
                    }

                    elem.parentElement.insertBefore(label, elem);

                    elem.removeAttribute('placeholder');
                    elem.removeAttribute('data-hide-placeholder');

                    if (!elem.id) {
                        elem.id = elemFor;
                    }

                }

                if (elem.value.length) {
                    this.hide(elem, true);
                }
            }

            //events
            document.removeEventListener('input', this.iH);
            document.removeEventListener('focus', this.fH, true);
            document.removeEventListener('blur', this.bH, true);

            this.iH = this.iH.bind(this);
            this.fH = this.fH.bind(this);
            this.bH = this.bH.bind(this);

            document.addEventListener('input', this.iH);
            document.addEventListener('focus', this.fH, true);
            document.addEventListener('blur', this.bH, true);
        },

        iH: function (e) {
            const elem = e.target.closest(this.elementsStr);

            if (!elem) return;

            if (elem.value.length > 0) {
                this.hide(elem, true, 'input');
            } else {
                this.hide(elem, false, 'input');
            }
        },

        fH: function (e) {
            const elem = e.target.closest(this.elementsStr);

            if (elem) {
                this.hide(elem, true, 'focus');
            }
        },

        bH: function (e) {
            const elem = e.target.closest(this.elementsStr);

            if (elem) {
                this.hide(elem, false);
            }
        },

        hide: function (elem, hide, ev) {
            const label = document.querySelector('label.placeholder[for="' + elem.id + '"]');

            if (!label) {
                return;
            }

            if (hide) {
                if (ev == 'focus' && label.getAttribute('data-hide-placeholder') == 'input') return;

                label.style.display = 'none';

            } else if (!elem.value.length) {
                label.style.display = '';
            }
        },

        reInit: function () {
            this.init(this.elementsStr);
        }
    };
})();
var Maskinput;

(function () {
    'use strict';

    Maskinput = function (inputSel, type, opt) {
        opt = opt || {};

        let defValue = '';

        this.inputElem = null;

        document.addEventListener('input', (e) => {
            const inpEl = e.target.closest(inputSel);

            if (inpEl) {
                this.inputElem = inpEl;

                try {
                    this[type]();
                } catch (error) {
                    console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
                }
            }
        });

        document.addEventListener('focus', (e) => {
            const inpEl = e.target.closest(inputSel);

            if (inpEl) {
                this.inputElem = inpEl;

                defValue = inpEl.value;

                try {
                    this[type]('focus');
                } catch (error) {
                    console.log(error, 'Add valid type in {new Maskinput(this, Str type);}');
                }
            }
        }, true);

        this.tel = function (ev) {
            if (ev == 'focus' && !this.inputElem.value.length) {
                this.inputElem.value = '+';
            } else if (ev == 'focus') {
                const val = this.inputElem.value.replace(/\D/ig, '');
                this.inputElem.value = val.replace(/(\d*)/, '+$1');
                defValue = this.inputElem.value;
            }

            if (!/[\+\d]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                const reg = /^\+\d*$/;
                console.log('else', this.inputElem.value, reg.test(this.inputElem.value));

                if (!reg.test(this.inputElem.value) && this.inputElem.value.length) {
                    const val = this.inputElem.value.replace(/\D/ig, '');
                    this.inputElem.value = val.replace(/(\d*)/, '+$1');
                }

                if (!reg.test(this.inputElem.value) && this.inputElem.value.length) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.tel_RU = function (ev) {
            if (ev == 'focus' && !this.inputElem.value.length) {
                this.inputElem.value = '+7(';
            }

            if (!/[\+\d\(\)\-]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                var reg = /^(\+7?)?(\(\d{0,3})?(\)\d{0,3})?(\-\d{0,2}){0,2}$/,
                    cursPos = this.inputElem.selectionStart;

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = this.inputElem.value.replace(/^(?:\+7?)?\(?(\d{0,3})\)?(\d{0,3})\-?(\d{0,2})\-?(\d{0,2})$/, function (str, p1, p2, p3, p4) {
                        var res = '';

                        if (p4 != '') {
                            res = '+7(' + p1 + ')' + p2 + '-' + p3 + '-' + p4;
                        } else if (p3 != '') {
                            res = '+7(' + p1 + ')' + p2 + '-' + p3;
                        } else if (p2 != '') {
                            res = '+7(' + p1 + ')' + p2;
                        } else if (p1 != '') {
                            res = '+7(' + p1;
                        }

                        return res;
                    });
                }

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.date = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[\d\.]*$/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                if (this.inputElem.value.length > defValue.length) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,2})\.?(\d{0,2})\.?(\d{0,4})$/, function (str, p1, p2, p3) {
                        let res;

                        if (+p1[0] > 3 || Number(p1) > 31) return defValue;

                        if (p3 != '') {
                            res = p1 + '.' + p2 + '.' + p3;
                        } else if (p2 != '') {
                            if (+p2[0] > 1 || Number(p2) > 12) return defValue;

                            if (p2.length == 2) {
                                res = p1 + '.' + p2 + '.';
                            } else {
                                res = p1 + '.' + p2;
                            }
                        } else if (p1.length == 2) {
                            res = p1 + '.';
                        } else {
                            res = p1;
                        }

                        return res;
                    });
                }

                if (!/^\d{0,2}(\.\d{0,2}(\.\d{0,4})?)?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.time = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[\d\:]*$/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                const reg = /^\d{0,2}(\:\d{0,2})?$/;

                if (this.inputElem.value.length > defValue.length) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,2})\:?(\d{0,2})$/, function (str, p1, p2) {
                        let res;

                        if (p2 != '') {
                            if (+p2[0] > 5 || Number(p2) > 59) return defValue;

                            res = p1 + ':' + p2;

                        } else {
                            if (+p1[0] > 2 || Number(p1) > 23) return defValue;

                            res = p1;

                            if (p1.length == 2) res += ':';
                        }

                        return res;
                    });
                }

                if (!/^\d{0,2}(\:\d{0,2})?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.gmail = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/[@\w.-]*/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                const reg = /^[\w.-]*(@gmail\.com)?$/;

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = this.inputElem.value.replace(/^([\w.-]*)@(?:gmail\.com)?$/, '$1@gmail.com');
                }

                if (!reg.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.int = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (opt.maxLength && this.inputElem.value.length > opt.maxLength) {
                this.inputElem.value = defValue;
            } else if (opt.maxValue && Number(this.inputElem.value) > Number(opt.maxValue)) {
                this.inputElem.value = defValue;
            } else {
                if (!/^\d*$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.float = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (opt.maxLength && this.inputElem.value.length > opt.maxLength) {
                this.inputElem.value = defValue;
            } else {
                if (!/^\d?[\d.,]*?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }

        this.cyr = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[а-я\s]*$/i.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                defValue = this.inputElem.value;
            }
        }

        this.cardNumber = function (ev) {
            if (ev == 'focus') {
                return;
            }

            if (!/^[\d\-]*$/.test(this.inputElem.value)) {
                this.inputElem.value = defValue;
            } else {
                if (this.inputElem.value.length > defValue.length) {
                    this.inputElem.value = this.inputElem.value.replace(/^(\d{0,4})\-?(\d{0,4})\-?(\d{0,4})\-?(\d{0,4})$/, function (str, p1, p2, p3, p4) {
                        let res;

                        if (p4 != '') {
                            res = p1 + '-' + p2 + '-' + p3 + '-' + p4;

                        } else if (p3 != '') {
                            res = p1 + '-' + p2 + '-' + p3;

                            if (p3.length == 4) res += '-';

                        } else if (p2 != '') {
                            res = p1 + '-' + p2;

                            if (p2.length == 4) res += '-';

                        } else {
                            res = p1;

                            if (p1.length == 4) res += '-'
                        }

                        return res;
                    });
                }

                if (!/^\d{0,4}(\-\d{0,4}(\-\d{0,4}(\-\d{0,4})?)?)?$/.test(this.inputElem.value)) {
                    this.inputElem.value = defValue;
                } else {
                    defValue = this.inputElem.value;
                }
            }
        }
    }
})();
// NextFieldset.init(...params);

var NextFieldset;

(function () {
    'use strict';

    NextFieldset = {
        onChange: null,
        opt: {},

        next: function (btnElem, fwd) {
            const currentFieldset = btnElem.closest('.fieldset__item');

            let nextFieldset = null;

            if (fwd) {
                if (this.opt.nextPending) {
                    let nextEl = currentFieldset.nextElementSibling;

                    if (!nextEl.classList.contains('pending')) {
                        while (nextEl && !nextEl.classList.contains('pending')) {
                            if (nextEl.nextElementSibling.classList.contains('pending')) {
                                nextFieldset = nextEl.nextElementSibling;
                            }

                            nextEl = nextEl.nextElementSibling;
                        }

                    } else {
                        nextFieldset = nextEl;
                    }

                } else {
                    nextFieldset = currentFieldset.nextElementSibling;
                }

            } else {
                nextFieldset = currentFieldset.previousElementSibling;
            }

            if (!nextFieldset) return;

            const goTo = (fwd) ? ValidateForm.validate(currentFieldset) : true;

            if (goTo) {
                currentFieldset.classList.add('fieldset__item_hidden');
                currentFieldset.classList.remove('pending');
                currentFieldset.classList.add('success');
                nextFieldset.classList.remove('fieldset__item_hidden');

                if (this.opt.focusInput) {
					const inpEl = nextFieldset.querySelector('input[type="text"]');

					if (inpEl) inpEl.focus();
				}

                $('html,body').stop().animate({
                    scrollTop: $(currentFieldset).closest('.fieldset').offset().top - $('.header').innerHeight() - 35
                }, 210);

                if (this.onChange) {
                    this.onChange(currentFieldset, nextFieldset);
                }
            }
        },

        /**
         * @param {string} nextBtnSelector
         * @param {string} prevBtnSelector
         * @param {object} options
         */
        init: function (nextBtnSelector, prevBtnSelector, options) {
            const fsEls = document.querySelectorAll('.fieldset'),
                fsItemEls = document.querySelectorAll('.fieldset__item');

            for (let i = 0; i < fsItemEls.length; i++) {
                const itEl = fsItemEls[i];
                itEl.classList.add('pending');

                if (i > 0) {
                    itEl.classList.add('fieldset__item_hidden');
                }
            }

            for (let i = 0; i < fsEls.length; i++) {
                const fEl = fsEls[i];
                fEl.classList.add('initialized');
            }

            options = options || {};

            this.opt.nextPending = (options.nextPending !== undefined) ? options.nextPending : false;
            this.opt.focusInput = (options.focusInput !== undefined) ? options.focusInput : false;

            document.addEventListener('click', (e) => {
                var nextBtnElem = e.target.closest(nextBtnSelector),
                    prevBtnElem = e.target.closest(prevBtnSelector);

                if (nextBtnElem) {
                    this.next(nextBtnElem, true);
                } else if (prevBtnElem) {
                    this.next(prevBtnElem, false);
                }
            });
        }
    };
})();
(function () {
    'use strict';

    const Number = {
        contEl: null,
        inputEl: null,
        defValue: 0,

        init: function () {
            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest('.number__btn');

                if (btnEl) this.clickHandler(btnEl);
            });

            document.addEventListener('input', (e) => {
                const inpEl = e.target.closest('.number__input');

                if (inpEl) this.inputHandler(inpEl);
            });

            document.addEventListener('blur', (e) => {
                const inpEl = e.target.closest('.number__input');

                if (inpEl) this.blurHandler(inpEl);
            }, true);
        },

        clickHandler: function (btnEl) {
            this.contEl = btnEl.closest('.number');
            this.inputEl = this.contEl.querySelector('.number__input');

            const action = +btnEl.getAttribute('data-action');

            let val;

            if (action > 0) {
                val = +this.inputEl.value + 1;
            } else {
                val = +this.inputEl.value - 1;

                if (val < 0) {
                    val = 0;
                }
            }

            this.inputEl.value = val;
            this.defValue = val;
        },

        inputHandler: function (inpEl) {
            this.inputEl = inpEl;

            if (!/^\d*$/.test(this.inputEl.value)) {
                this.inputEl.value = this.defValue;
            } else {
                if (/^0+$/.test(this.inputEl.value)) {
                    this.inputEl.value = 0;
                }

                this.defValue = this.inputEl.value;
            }
        },

        blurHandler: function(inpEl) {
            this.inputEl = inpEl;

            if (!this.inputEl.value.length) {
                this.inputEl.value = 0;
                this.defValue = 0;
            }
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        Number.init();
    });

})();
var Form, DuplicateForm;

(function () {
    'use strict';

    // variable height textarea
    var varHeightTextarea = {
        setHeight: function (elem) {
            var mirror = elem.parentElement.querySelector('.var-height-textarea__mirror'),
                mirrorOutput = elem.value.replace(/\n/g, '<br>');

            mirror.innerHTML = mirrorOutput + '&nbsp;';
        },

        init: function () {
            document.addEventListener('input', (e) => {
                var elem = e.target.closest('.var-height-textarea__textarea');

                if (!elem) {
                    return;
                }

                this.setHeight(elem);
            });
        }
    };

    // form
    Form = {
        formSelector: null,
        onSubmitSubscribers: [],

        init: function (formSelector) {
            if (!document.querySelector(formSelector)) return;

            this.formSelector = formSelector;

            initFormScripst();

            ValidateForm.init(formSelector);

            // submit event
            document.removeEventListener('submit', this.sH);

            this.sH = this.sH.bind(this);
            document.addEventListener('submit', this.sH);

            // keyboard event
            document.removeEventListener('keydown', this.kH);

            this.kH = this.kH.bind(this);
            document.addEventListener('keydown', this.kH);
        },

        sH: function (e) {
            const formElem = e.target.closest(this.formSelector);

            if (formElem) {
                this.submitForm(formElem, e);
            }
        },

        kH: function (e) {
            const formElem = e.target.closest(this.formSelector);

            if (!formElem) return;

            const key = e.code;

            if (e.target.closest('.fieldset__item') && key == 'Enter') {
                e.preventDefault();
                e.target.closest('.fieldset__item').querySelector('.js-next-fieldset-btn').click();

            } else if (e.ctrlKey && key == 'Enter') {
                e.preventDefault();
                this.submitForm(formElem, e);
            }
        },

        submitForm: function (formElem, e) {
            if (this.beforeSubmit) {
                this.beforeSubmit(formElem);
            }
            
            if (!ValidateForm.validate(formElem)) {
                if (e) e.preventDefault();

                const errFieldEl = formElem.querySelector('.field-error');

                if (errFieldEl.hasAttribute('data-error-index')) {
                    ValidateForm.customFormErrorTip(formElem, errFieldEl.getAttribute('data-form-error-text-' + errFieldEl.getAttribute('data-error-index')));
                } else if (errFieldEl.hasAttribute('data-form-error-text')) {
                    ValidateForm.customFormErrorTip(formElem, errFieldEl.getAttribute('data-form-error-text'));
                }

                return;
            }

            formElem.classList.add('form_sending');

            if (!this.onSubmitSubscribers.length) {
                formElem.submit();
                return;
            }

            let fReturn;

            this.onSubmitSubscribers.forEach(item => {
                fReturn = item(formElem, (obj) => {
                    obj = obj || {};

                    setTimeout(() => {
                        this.actSubmitBtn(obj.unlockSubmitButton, formElem);
                    }, 321);

                    formElem.classList.remove('form_sending');

                    if (obj.clearForm == true) {
                        this.clearForm(formElem);
                    }
                });
            });

            if (fReturn === true) {
                formElem.submit();
            } else {
                if (e) e.preventDefault();
                this.actSubmitBtn(false, formElem);
            }
        },

        onSubmit: function (fun) {
            if (typeof fun === 'function') {
                this.onSubmitSubscribers.push(fun);
            }
        },

        clearForm: function (formElem) {
            const elements = formElem.querySelectorAll('input[type="text"], input[type="number"],input[type="tel"], input[type="password"], textarea');

            for (let i = 0; i < elements.length; i++) {
                const elem = elements[i];
                elem.value = '';

                if (window.Placeholder) {
                    Placeholder.hide(elem, false);
                }
            }

            const checkboxEls = formElem.querySelectorAll('input[type="checkbox"]');

            for (let i = 0; i < checkboxEls.length; i++) {
                checkboxEls[i].checked = false;
            }

            if (window.Select) {
                Select.reset();
            }

            if (window.CustomFile) {
                const inpFileEls = formElem.querySelectorAll('.custom-file__input');

                for (let i = 0; i < inpFileEls.length; i++) {
                    CustomFile.clear(inpFileEls[i]);
                }
            }

            const textareaMirrors = formElem.querySelectorAll('.var-height-textarea__mirror');

            for (var i = 0; i < textareaMirrors.length; i++) {
                textareaMirrors[i].innerHTML = '';
            }
        },

        actSubmitBtn: function (state, formElem) {
            var elements = formElem.querySelectorAll('button[type="submit"], input[type="submit"]');

            for (var i = 0; i < elements.length; i++) {
                var elem = elements[i];

                if (state) {
                    elem.removeAttribute('disabled');
                } else {
                    elem.setAttribute('disabled', 'disable');
                }
            }
        }
    };

    // bind labels
    function BindLabels(elementsStr) {
        var elements = document.querySelectorAll(elementsStr);

        for (var i = 0; i < elements.length; i++) {
            var elem = elements[i],
                label = elem.parentElement.querySelector('label'),
                forID = (elem.hasAttribute('id')) ? elem.id : 'keylabel-' + i;

            if (label && !label.hasAttribute('for')) {
                label.htmlFor = forID;
                elem.id = forID;
            }
        }
    }

    // duplicate form
    DuplicateForm = {
        add: function (btnElem) {
            var modelElem = (btnElem.hasAttribute('data-form-model')) ? document.querySelector(btnElem.getAttribute('data-form-model')) : null,
                destElem = (btnElem.hasAttribute('data-duplicated-dest')) ? document.querySelector(btnElem.getAttribute('data-duplicated-dest')) : null;

            if (!modelElem || !destElem) return;

            var duplicatedDiv = document.createElement('div');

            duplicatedDiv.className = 'duplicated';

            duplicatedDiv.innerHTML = modelElem.innerHTML;

            destElem.appendChild(duplicatedDiv);

            var dupicatedElements = destElem.querySelectorAll('.duplicated');

            for (var i = 0; i < dupicatedElements.length; i++) {
                var dupicatedElem = dupicatedElements[i],
                    labelElements = dupicatedElem.querySelectorAll('label'),
                    inputElements = dupicatedElem.querySelectorAll('input');

                for (var j = 0; j < labelElements.length; j++) {
                    var elem = labelElements[j];

                    if (elem.htmlFor != '') {
                        elem.htmlFor += '-' + i + '-' + j;
                    }
                }

                for (var j = 0; j < inputElements.length; j++) {
                    var elem = inputElements[j];

                    if (elem.id != '') {
                        elem.id += '-' + i + '-' + j;
                    }
                }
            }

            if (window.Select) Select.init('.custom-select');

            if (this.onChange) this.onChange();
        },

        remove: function (btnElem) {
            var duplElem = btnElem.closest('.duplicated');

            if (duplElem) {
                duplElem.innerHTML = '';
            }

            if (this.onChange) this.onChange();
        },

        init: function (addBtnSelector, removeBtnSelector) {
            this.addBtnSelector = addBtnSelector;
            this.removeBtnSelector = removeBtnSelector;

            // click event
            document.removeEventListener('click', this.clickHandler);

            this.clickHandler = this.clickHandler.bind(this);
            document.addEventListener('click', this.clickHandler);
        },

        clickHandler: function (e) {
            const addBtnElem = e.target.closest(this.addBtnSelector),
                removeBtnElem = e.target.closest(this.removeBtnSelector);

            if (addBtnElem) {
                this.add(addBtnElem);
            } else if (removeBtnElem) {
                this.remove(removeBtnElem);
            }
        }
    };

    // set tabindex
    /*function SetTabindex(elementsStr) {
        var elements = document.querySelectorAll(elementsStr);
    	
        for (let i = 0; i < elements.length; i++) {
            var elem = elements[i];
        	
            if (!elemIsHidden(elem)) {
                elem.setAttribute('tabindex', i + 1);
            }
        }
    }*/

    // init scripts
    function initFormScripst() {
        BindLabels('input[type="text"], input[type="number"], input[type="tel"], input[type="checkbox"], input[type="radio"]');
        if (window.Placeholder) Placeholder.init('input[type="text"], input[type="number"], input[type="tel"], input[type="password"], textarea');
        // SetTabindex('input[type="text"], input[type="password"], textarea');
        varHeightTextarea.init();
        DuplicateForm.init('.js-dupicate-form-btn', '.js-remove-dupicated-form-btn');
        if (window.Select) Select.init('.custom-select');
        if (window.Checkbox) Checkbox.init({ focusOnTarget: true });
    }
})();
/*
new Accord({
    btnSelector: '.accord__button',
    autoScrollOnViewport: 700, // def: false
    maxViewport: 1000, // def: false
    collapseSiblings: false // def: true
});
*/
var Accord;

(function () {
    'use strict';

    Accord = function (options) {
        const opt = options || {};

        this.btnSel = opt.btnSelector;
        this.autoScroll = opt.autoScrollOnViewport || false;
        this.collapseSiblings = opt.collapseSiblings !== undefined ? opt.collapseSiblings : true;

        opt.maxViewport = opt.maxViewport || false;

        this.initialized = false;

        if (!this.initialized && document.querySelectorAll('.accord').length) {
            this.initialized = true;

            document.addEventListener('click', (e) => {
                const btnEl = e.target.closest(this.btnSel);

                if (
                    !btnEl ||
                    btnEl.closest('.accord_closed') ||
                    (opt.maxViewport && window.innerWidth > opt.maxViewport)
                ) {
                    return;
                }

                e.preventDefault();

                this.toggle(btnEl);
            });
        }

        this.toggle = function (elem) {
            const contentElem = elem.closest('.accord__item').querySelector('.accord__content');

            if (elem.classList.contains('active')) {
                contentElem.style.height = contentElem.offsetHeight + 'px';

                setTimeout(function () {
                    contentElem.style.height = '0';
                }, 21);

                elem.classList.remove('active');

            } else {
                const mainElem = elem.closest('.accord');

                if (this.collapseSiblings) {
                    const allButtonElem = mainElem.querySelectorAll(this.btnSel),
                        allContentElem = mainElem.querySelectorAll('.accord__content');

                    for (let i = 0; i < allButtonElem.length; i++) {
                        if (allButtonElem[i] != elem) {
                            allButtonElem[i].classList.remove('active');
                        }
                    }

                    for (let i = 0; i < allContentElem.length; i++) {
                        if (allContentElem[i] != contentElem) {
                            allContentElem[i].style.height = allContentElem[i].offsetHeight + 'px';

                            setTimeout(function () {
                                allContentElem[i].style.height = '0';
                            }, 21);
                        }
                    }
                }

                contentElem.style.height = contentElem.scrollHeight + 'px';

                setTimeout(() => {
                    contentElem.style.height = 'auto';

                    if (this.autoScroll && window.innerWidth <= this.autoScroll) {
                        this.scroll(elem);
                    }
                }, 300);

                elem.classList.add('active');
            }
        }

        this.scroll = function (elem) {
            setTimeout(function () {
                $('html, body').stop()
                    .animate({ scrollTop: $(elem).offset().top - $('.header').innerHeight() - 5 }, 721);
            }, 21);
        }
    };
})();
/*
Ajax.init(Str button selector);

Ajax.success = function(response) {
    // code...
}
*/

; var Ajax;

(function () {
    "use strict";

    Ajax = {
        success: null,

        send: function (elem) {
            ajax({
                url: elem.getAttribute('data-action'),
                send: elem.getAttribute('data-send'),
                success: function (response) {
                    if (this.success) {
                        this.success(response);
                    }
                },
                error: function (response) {

                }
            });
        },

        init: function (elementStr) {
            document.addEventListener('click', (e) => {
                var elem = e.target.closest(elementStr);

                if (!elem) {
                    return;
                }

                e.preventDefault();

                this.send(elem);
            });
        }
    };
})();
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
/*
Tab.init({
    container: '.tab',
    button: '.tab__button',
    item: '.tab__item',
    hash: true, // default: false
    changeOnHover: true // default: false
});

Tab.onChange(function(btnElem) {
    // body
});
*/

var Tab;

(function () {
    'use strict';

    Tab = {
        options: null,
        onChangeSubscribers: [],
        changing: false,

        init: function (options) {
            const contElements = document.querySelectorAll(options.container);

            if (!contElements.length) return;

            this.options = options;

            //init tabs
            for (let i = 0; i < contElements.length; i++) {
                const contElem = contElements[i],
                    btnElements = contElem.querySelectorAll(options.button),
                    tabItemElements = contElem.querySelectorAll(options.item);

                for (let i = 0; i < btnElements.length; i++) {
                    btnElements[i].setAttribute('data-index', i);
                    tabItemElements[i].setAttribute('data-index', i);
                }

                btnElements[0].classList.add('active');
                tabItemElements[0].classList.add('active');

                const tabItemElemActive = contElem.querySelector(this.options.item + '.active');

                if (options.hash && window.location.hash) {
                    const btnElem = contElem.querySelector(options.button + '[href*="' + window.location.hash + '"]');

                    if (btnElem) {
                        this.change(btnElem, true);
                    } else {
                        tabItemElemActive.style.position = 'relative';
                    }
                } else {
                    tabItemElemActive.style.position = 'relative';
                }
            }

            //btn event
            if (options.changeOnHover) {
                document.addEventListener('mouseover', (e) => {
                    const btnElem = e.target.closest(options.button);

                    if (!btnElem) return;

                    this.change(btnElem);
                });

            } else {
                document.addEventListener('click', (e) => {
                    const btnElem = e.target.closest(options.button);

                    if (!btnElem) return;

                    if (!this.options.hash) {
                        e.preventDefault();
                    }

                    this.change(btnElem);
                });
            }
        },

        onChange: function (fun) {
            if (typeof fun === 'function') {
                this.onChangeSubscribers.push(fun);
            }
        },

        change: function (btnElem, immly) {
            if ((btnElem.classList.contains('active') && !immly) || this.changing) {
                return;
            }

            this.changing = true;

            const contElem = btnElem.closest(this.options.container),
                btnElements = contElem.querySelectorAll(this.options.button),
                tabItemElements = contElem.querySelectorAll(this.options.item);

            //remove active state
            for (let i = 0; i < btnElements.length; i++) {
                btnElements[i].classList.remove('active');
            }

            if (!immly) {
                tabItemElements[0].parentElement.style.height = tabItemElements[0].parentElement.offsetHeight + 'px';
            }

            for (let i = 0; i < tabItemElements.length; i++) {
                tabItemElements[i].classList.remove('active');
                tabItemElements[i].style.position = '';
            }

            //get current tab item
            const tabItemElem = contElem.querySelector(this.options.item + '[data-index="' + btnElem.getAttribute('data-index') + '"]');

            //set active state
            tabItemElem.style.transition = immly ? '0s' : '.21s';
            tabItemElem.classList.add('active');

            btnElem.classList.add('active');

            //set height
            if (immly) {
                tabItemElem.style.position = 'relative';
                this.changing = false;

            } else {
                setTimeout(() => {
                    tabItemElem.parentElement.style.transition = 'height .5s';
                    tabItemElem.parentElement.style.height = tabItemElem.offsetHeight + 'px';

                    setTimeout(() => {
                        tabItemElem.parentElement.style.transition = '';
                        tabItemElem.parentElement.style.height = '';
                        tabItemElem.style.position = 'relative';

                        this.changing = false;
                    }, 500);
                }, 210);
            }

            // on change
            this.onChangeSubscribers.forEach(function (item) {
                item(btnElem);
            });
        }
    };
})();
/*
new Alert({
    content: 'We use coockie',
    position: 'top', // default - bottom
    showOnce: true, // default - false
    closeBtn: false // default - true
    addClass: 'alert-class'
});
*/

; var Alert;

(function () {
    'use strict';

    var alertIndex = 0;

    Alert = function (opt) {
        opt = opt || {};

        opt.closeBtn = (opt.closeBtn !== undefined) ? opt.closeBtn : true;

        var alertId = 'alert-id-' + (alertIndex++);

        if (opt.showOnce) {
            let hiddenAlert = window.localStorage.getItem('notShowAlert=' + alertId);

            if (hiddenAlert !== null && hiddenAlert === 'true') {
                return false;
            }
        }

        //add alert to DOM
        var alertElem = document.createElement('div');

        alertElem.className = 'alert';

        alertElem.id = alertId;

        alertElem.innerHTML = '<div></div>' + ((opt.closeBtn) ? '<button class="js-alert-close alert__close-btn"></button>' : '');

        document.body.appendChild(alertElem);

        if (opt.position == 'top') {
            alertElem.classList.add('alert_top');
        }

        if (opt.addClass) {
            alertElem.classList.add(opt.addClass);
        }

        // set content
        this.setContent = function (content) {
            alertElem.querySelector('div').innerHTML = content;
        }

        if (opt.content) {
            this.setContent(opt.content);
        }

        // hide permanently
        function hidePermanently() {
            window.localStorage.setItem('notShowAlert=' + alertId, 'true');
        }

        // hide
        function hide() {
            alertElem.classList.add('alert_hidden');

            if (opt.showOnce) {
                hidePermanently();
            }
        }

        alertElem.addEventListener('click', function (e) {
            if (e.target.closest('.js-alert-close')) {
                hide();
            }
        });
    }
})();
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
/*
var diagram = new Diagram({
    canvasEl: node elem,
    canvasId: Str elem id,
    charts: [
        {
            value: Int,
            color: Str,
            width: Int px,
            numContId: Str elem id
        }
    ],
    maxValue: Int,
    animate: true
});

diagram.animate(Int duration ms);
*/

; var Diagram;

(function() {
    'use strict';
    
    Diagram = function(options) {
        const canvasElement = options.canvasEl || document.getElementById(options.canvasId);
        
        this.animate = function(duration) {
            if (!canvasElement) {
                return;
            }
            
            const chartValues = options.charts.map((obj) => obj.value);
            
            animate((progress) => {
                this.ctx.clearRect(0, 0, (this.center.x * 2), (this.center.y * 2));
                this.prevChartsWidth = 0;
                
                options.charts.forEach((chart, i) => {
                    chart.value = chartValues[i] * progress;
                    
                    drawChart(chart, i);
                });
                
            }, duration, 'easeInOutQuad');
        }
        
        if (!canvasElement) {
            return;
        }
        
        canvasElement.width = canvasElement.offsetWidth;
        canvasElement.height = canvasElement.offsetHeight;
        
        this.ctx = canvasElement.getContext('2d');
        this.canvasWidth = canvasElement.width;
        this.center = {x: canvasElement.width / 2, y: canvasElement.height / 2};
        this.prevChartsWidth = 0;
        
        const startAngle = 1.5 * Math.PI;
        
        const drawChart = (chart, i) => {
            var endAngle = 2 * Math.PI * chart.value / options.maxValue + startAngle,
            radius = this.canvasWidth / 2 - chart.width / 2 - (chart.offset || 0) - this.prevChartsWidth;
            
            this.prevChartsWidth += chart.width + (chart.offset || 0);
            
            this.ctx.beginPath();
            this.ctx.arc(this.center.x, this.center.y, radius, startAngle, endAngle);
            this.ctx.lineWidth = chart.width;
            this.ctx.strokeStyle = chart.color;
            this.ctx.stroke();
            
            outputNum(chart);
        }
        
        if (!options.animate) {
            options.charts.forEach((chart, i) => {
                drawChart(chart, i);
            });
        }
        
        function outputNum(chart) {
            var numElem = document.getElementById(chart.numContId);
            
            if (numElem) {
                numElem.innerHTML = chart.value.toFixed(0);
            }
        }
    }
})();
var Numberspin;

(function() {
	'use strict';

	Numberspin = function(options) {
		const opt = options || {};

		this.elements = document.querySelectorAll(opt.elemSelectors);
		this.values = [];

		for (var i = 0; i < this.elements.length; i++) {
			this.values[i] = +this.elements[i].getAttribute('data-value');
			this.elements[i].innerHTML = 0;
		}

		function draw(elem, num) {
			if (opt.format) {
				const numStr = String(num);

				elem.innerHTML = numStr.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
			} else {
				elem.innerHTML = num;
			}
		}

		this.animate = function(duration) {
			animate((progress) => {
				for (var i = 0; i < this.elements.length; i++) {
					let num = Math.round(this.values[i] * progress);

					if (num < 0) {
						num = 0;
					}

					draw(this.elements[i], num);
				}
			}, duration);
		}
	}
})();


/*
function Numberspin(elem, opt) {
	var def = {
		animation: 1
	},
	opt = opt || {},
	options = $.extend({}, def, opt),
	interval = null,
	animate = false,
	$Elem = $(elem),
	curVal = 0,
	val = $Elem.html().replace(/[\s]/g, ''),
	pattern = val.match(/[\.,]/),
	endVal = +val.replace(/[\D]/g, '');

	$Elem.html(0);

	this.start = function() {
		
		if (!animate) {
			animate = true;
			spin();
		}
	}

	function spin() {

		interval = setTimeout(function run() {

				if (curVal < endVal) {

					if (options.animation == 1) {

						var d = endVal - curVal;

						if (d > 1213214321321) {
							curVal = curVal + 1213214321321;
						} else if (d > 3214321321) {
							curVal = curVal + 3214321321;
						} else if (d > 4321321) {
							curVal = curVal + 4321321;
						} else if (d > 321321) {
							curVal = curVal + 321321;
						} else if (d > 32321) {
							curVal = curVal + 32321;
						} else if (d > 2321) {
							curVal = curVal + 2321;
						} else if (d > 1321) {
							curVal = curVal + 1321;
						} else if (d > 321) {
							curVal = curVal + 321;
						} else if (d > 21) {
							curVal = curVal + 21;
						} else {
							curVal++;
						}


					} else if (options.animation == 2) {

						var endValArr = String(endVal).split(''),
						curValArr = String(curVal).split('');

						for (var i = 0; i < endValArr.length; i++) {
							if (curValArr[i]) {
								if (curValArr[i] < endValArr[i] && curValArr[i-1] == endValArr[i-1]) {
									curValArr[i]++;
								}
							} else if (curValArr[i-1] && curValArr[i-1] == endValArr[i-1]) {
								curValArr[i] = 0;
							}

						}

						curVal = curValArr.join('');

					}

					var output = String(curVal);

					if (pattern) {
						output = output.replace(new RegExp('(\\d{'+ pattern.index +'})'), '$1'+ pattern[0]);
						output = output.replace(new RegExp('(\\d)?(?=(\\d{3})+?\\'+ pattern[0] +')', 'g'), '$1 ');
					} else {
						output = output.replace(/(\d)?(?=(\d{3})+$)/g, '$1 ');
					}
					
					$Elem.html(output);

					setTimeout(run, 85);

				} else {
					stop();
				}

		}, 1);

	}

	function stop() {
		clearTimeout(interval);
	}

}

var numberspinObj = [], i = 0, ind;
function numberspin(elem, opt) {
	if ($(elem)[0].ind == undefined) {
		$(elem)[0].ind = ind = i;
	} else {
		ind = $(elem)[0].ind;
	}

	if (!(numberspinObj[elem+ind] instanceof Numberspin)) {
		numberspinObj[elem+ind] = new Numberspin(elem, opt);
	}
	i++;

	return numberspinObj[elem+ind];
}
*/
/*
Share.init(Str button class);
*/

; var Share;

; (function () {
	'use strict';

	Share = {
		network: function (elem) {
			let net = elem.getAttribute('data-network');

			if (!net) {
				return;
			}

			let encodedHref = (elem.hasAttribute('data-share-url')) ? encodeURIComponent(elem.getAttribute('data-share-url')) : encodeURIComponent(window.location.href),
				encodedImageUrl = (elem.hasAttribute('data-share-img')) ? encodeURIComponent(elem.getAttribute('data-share-img')) : null,
				title = (elem.hasAttribute('data-share-tit')) ? encodeURIComponent(elem.getAttribute('data-share-tit')) : null,
				url;

			switch (net) {
				case 'vk':
					url = 'https://vk.com/share.php?url=' + encodedHref + ((encodedImageUrl) ? '&image=' + encodedImageUrl : '') + ((title) ? '&title=' + title : '');
					break;

				case 'fb':
					url = 'https://www.facebook.com/sharer.php?u=' + encodedHref;
					break;

				case 'tw':
					url = 'http://twitter.com/share?url=' + encodedHref + ((title) ? '&text=' + title : '');
					break;

				case 'ok':
					url = 'https://connect.ok.ru/offer?url=' + encodedHref + ((encodedImageUrl) ? '&imageUrl=' + encodedImageUrl : '') + ((title) ? '&title=' + title : '');
					break;

				case 'tg':
					url = 'https://telegram.me/share/url?url=' + encodedHref;
					break;
			}

			this.popup(url);
		},

		popup: function (url) {
			window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
		},

		init: function (elementStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.network(elem);
			});
		}
	};
})();
/* 
var timer = new Timer({
    elemId: 'timer', // Str element id,
    format: 'extended', // default - false
    stopwatch: true, // default - false
    continue: false // default - false
});

timer.onStop = function () {
	
}

timer.start(Int interval in seconds);
*/

; var Timer, numToWord;

(function () {
    'use strict';

    numToWord = function (num, wordsArr) {
        num %= 100;

        if (num > 20) {
            num %= 10;
        }

        switch (num) {
            case 1:
                return wordsArr[0];

            case 2:
            case 3:
            case 4:
                return wordsArr[1];

            default:
                return wordsArr[2];
        }
    }

    Timer = function (options) {
        options = options || {};

        options.continue = (options.continue !== undefined) ? options.continue : false;

        this.opt = options;

        this.elem = document.getElementById(options.elemId);

        this.tickSubscribers = [];

        this.setCookie = function () {
            document.cookie = 'lastTimestampValue-' + options.elemId + '=' + Date.now() + '; expires=' + new Date(Date.now() + 259200000).toUTCString();
        }

        this.onTick = function (fun) {
            if (typeof fun === 'function') {
                this.tickSubscribers.push(fun);
            }
        }

        this.stop = function () {
            clearInterval(this.interval);

            if (this.onStop) {
                setTimeout(this.onStop);
            }
        }

        this.pause = function () {
            clearInterval(this.interval);
        }
    }

    Timer.prototype.output = function (time) {
        let day = time > 86400 ? Math.floor(time / 86400) : 0,
            hour = time > 3600 ? Math.floor(time / 3600) : 0,
            min = time > 60 ? Math.floor(time / 60) : 0,
            sec = time > 60 ? Math.round(time % 60) : time;

        if (hour > 24) {
            hour = hour % 24;
        }

        if (min > 60) {
            min = min % 60;
        }

        let timerOut;

        if (this.opt.format == 'extended') {
            var minTxt = numToWord(min, ['минуту', 'минуты', 'минут']),
                secTxt = numToWord(sec, ['секунду', 'секунды', 'секунд']);

            var minOut = (min != 0) ? min + ' ' + minTxt : '',
                secNum = (sec < 10) ? '0' + sec : sec;

            timerOut = ((min) ? min + ' ' + minTxt + ' ' : '') + '' + sec + ' ' + secTxt;

        } else {
            var minNum = (min < 10) ? '0' + min : min,
                secNum = (sec < 10) ? '0' + sec : sec;

            timerOut = minNum + ':' + secNum;
        }

        if (this.elem) {
            this.elem.innerHTML = timerOut;
        }

        if (this.tickSubscribers.length) {
            this.tickSubscribers.forEach(function (item) {
                item(time, { day, hour, min, sec });
            });
        }
    }

    Timer.prototype.start = function (startTime) {
        this.time = +startTime || 0;

        var lastTimestampValue = ((cookie) => {
            if (this.opt.continue) {
                return false;
            }

            if (cookie) {
                var reg = new RegExp('lastTimestampValue-' + this.opt.elemId + '=(\\d+)', 'i'),
                    matchArr = cookie.match(reg);

                return matchArr ? matchArr[1] : null;
            }
        })(document.cookie);

        if (lastTimestampValue) {
            var delta = Math.round((Date.now() - lastTimestampValue) / 1000);

            if (this.opt.stopwatch) {
                this.time += delta;
            } else {
                if (this.time > delta) {
                    this.time -= delta;
                } else {
                    this.setCookie();
                }
            }

        } else if (this.opt.continue) {
            this.setCookie();
        }

        this.output(this.time);

        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(() => {
            if (this.opt.stopwatch) {
                this.time++;

                this.output(this.time);
            } else {
                this.time--;

                if (this.time <= 0) {
                    this.stop();
                } else {
                    this.output(this.time);
                }
            }
        }, 1000);
    }
})();
; var GetContentAjax;

(function () {
    'use strict';

    GetContentAjax = function (options) {
        if (!document.querySelector(options.eventBtn)) {
            return;
        }

        this.output = null;

        var getContent = (eventBtnElem) => {
            var outputDivElem = document.querySelector(options.outputDiv);

            ajax({
                url: options.sourceFile,
                send: eventBtnElem.getAttribute('data-send'),
                success: (response) => {
                    if (this.output === null) {
                        outputDivElem.innerHTML = response;
                    } else {
                        outputDivElem.innerHTML = this.output(response);
                    }
                },
                error: (response) => {
                    console.log(response);
                }
            });
        }

        if (options.event == 'click') {
            document.addEventListener('click', (e) => {
                var eventBtnElem = e.target.closest(options.eventBtn);

                if (eventBtnElem) {
                    e.preventDefault();

                    getContent(eventBtnElem);
                }
            });
        }
    }
})();


/*var Ajax = {
    take: function(url,data,id,fun) {
        var _ = this;

        $.ajax({
            url: url,
            type:"POST",
            dataType:"html",
            data: data,
            success: function(response){
                if (response) {
                    _.put(response, id);
                    setTimeout(fun, 721);
                }
            },
            error: function() {
                alert('Send Error');
            }
        });
    },
    put: function(resp,id) {
        var Block = $(id);
        if (Block.hasClass('popup__window')) {
            Block.find('.popup__inner').html(resp);
            Popup.show(id);
        } else {
            Block.append(resp);
            coverImg();
        }
    }

};

$(document).ready(function() {

    $('body').on('click', '.js-ajax', function () {
        var _$ = $(this);

        if (!_$.hasClass('lock')) {
            _$.addClass('lock');

            var id = _$.attr('href') || '#'+ _$.attr('data-id'),
            url = _$.attr('data-url'),
            data = _$.attr('data-data');

            if (_$.attr('data-page')) {
                var page = +_$.attr('data-page');

                data += '&page='+ page;

                Ajax.take(url, data, id, function() {
                    page++;
                    _$.attr('data-page', page).removeClass('lock');
                });

            } else {
                Ajax.take(url, data, id, function() {
                    _$.removeClass('lock');
                });
            }
        }

        return false;
    });

    if ($('.js-ajax-scroll').length && $(window).width() > 1000) {
        var i = 0;

        $(window).scroll(function() {
            var winScrTop = $(window).scrollTop(),
            Point = $('.js-ajax-scroll');

            if (Point.offset().top < window.innerHeight && !Point.hasClass('lock')) {
                Point.addClass('lock');

                var id = '#'+ Point.attr('data-id'),
                url = Point.attr('data-url'),
                data = Point.attr('data-data'),
                page = +Point.attr('data-page');

                data += '&page='+ page;

                Ajax.take(url, data, id, function() {
                    page++;
                    Point.attr('data-page', page).removeClass('lock');
                });

            }

        });

    }



});*/
(function() {
   'use strict';
   
   // animate when is visible
   const animationOnVisible = {
      animElements: null,
      
      scroll: function() {
         console.log('scr');
         console.log(this.animElements);
         const winBotEdge = window.pageYOffset + window.innerHeight;
         
         for (let i = 0; i < this.animElements.length; i++) {
            const animElem = this.animElements[i],
            animElemOffsetTop = animElem.getBoundingClientRect().top + window.pageYOffset,
            animElemOffsetBot = animElemOffsetTop + animElem.offsetHeight;
            
            if (animElemOffsetTop < winBotEdge && animElemOffsetBot > window.pageYOffset) {
               animElem.classList.add('animated');
            } else {
               animElem.classList.remove('animated');
            }
         }
      },
      
      init: function() {
         const animElements = document.querySelectorAll('.js-animate');
         
         if (animElements.length) {
            this.animElements = animElements;
            
            this.scroll();
         }
      }
   };
   
   // document ready
   document.addEventListener('DOMContentLoaded', function() {
      animationOnVisible.init();
      
      if (animationOnVisible.animElements) {
         window.addEventListener('scroll', animationOnVisible.scroll.bind(animationOnVisible));
      }
   });

   // onload animate
   window.onload = function () {
      const animElems = document.querySelectorAll('.js-onload-animate');

      for (let i = 0; i < animElems.length; i++) {
         animElems[i].classList.add('animated');
      }
   }
})();
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
; var WEBGL;

(function() {
   WEBGL = {
      VSTxt: null,
		FSTxt: null,
		
      loadTxtRes: function(url, successFun) {
         ajax({
            url: url,
            success: function(response) {
               successFun(response);
            },
            error: function(response) {
               
            }
         });
		},
		
		start: function() {
			
		},
      
      init: function() {
         this.loadTxtRes('/shaders/vertexShader.glsl', (response) => {
				this.VSTxt = response;
				
				this.loadTxtRes('/shaders/fragmentShader.glsl', (response) => {
					this.FSTxt = response;

					this.start();
				});
			});
      }
   };
})();


/**
 * @constructor
 * @this {Mouseparallax}
 * @param {string} elSel
 * @param {object} [options={}]
 * @param {number} [options.deltaX=21]
 * @param {number} [options.deltaY=21]
 * @param {object[]} [options.rangeX=[]]
 * @param {number} options.rangeX[]
 * @param {number} options.rangeX[]
 * @param {object[]} [options.rangeY=[]]
 * @param {number} options.rangeY[0]
 * @param {number} options.rangeY[1]
 */

function Mouseparallax(elSel, options) {
	var _ = this,
		defaultOpt = {
			listener: document,
			deltaX: 21,
			deltaY: 21,
			rangeX: [],
			rangeY: [],
		},
		options = options || {},
		opt = $.extend({}, defaultOpt, options),
		startMousePos = { X: 0, Y: 0 },
		listenerW = $(opt.listener).innerWidth(),
		listenerH = $(opt.listener).innerHeight(),
		cursorPos = { X: 0, Y: 0 },
		direct = {},
		elems = [];

	_.disabled = false;

	$(elSel).each(function () {
		const $el = $(this);

		elems.push({
			$el: $el,
			translateElement: { X: 0, Y: 0 },
			startElementPos: { X: 0, Y: 0 },
			deltaX: ($el.attr('data-delta-x') !== undefined) ? +$el.attr('data-delta-x') : opt.deltaX,
			deltaY: ($el.attr('data-delta-y') !== undefined) ? +$el.attr('data-delta-y') : opt.deltaY,
			rangeX: ($el.attr('data-range-x') !== undefined) ? $el.attr('data-range-x').split(',') : opt.rangeX,
			rangeY: ($el.attr('data-range-y') !== undefined) ? $el.attr('data-range-y').split(',') : opt.rangeY
		});
	});

	$(document).on('mouseenter', opt.listener, function (e) {
		if (_.disabled) return;
		
		startMousePos.X = e.clientX;
		startMousePos.Y = e.clientY;
	});

	$(opt.listener).on('mousemove', opt.listener, function (e) {
		if (_.disabled) return;

		if (e.clientX > cursorPos.X) {
			direct.X = 'right';
		} else {
			direct.X = 'left';
		}
		cursorPos.X = e.clientX;

		if (e.clientY > cursorPos.Y) {
			direct.Y = 'up';
		} else {
			direct.Y = 'down';
		}
		cursorPos.Y = e.clientY;

		var deltaMouse = {
			X: e.clientX - startMousePos.X,
			Y: e.clientY - startMousePos.Y
		};

		elems.forEach(function (el) {
			el.translateElement = {
				X: deltaMouse.X * (el.deltaX / listenerW) + el.startElementPos.X,
				Y: deltaMouse.Y * (el.deltaY / listenerH) + el.startElementPos.Y
			};

			if (el.startMousePosX) {
				el.translateElement.X = (e.clientX - el.startMousePosX) * (el.deltaX / listenerW) + el.startElementPos.X;
			}

			if (el.startMousePosY) {
				el.translateElement.Y = (e.clientY - el.startMousePosY) * (el.deltaY / listenerH) + el.startElementPos.Y;
			}

			var translateX = el.translateElement.X,
				translateY = el.translateElement.Y;

			if (el.rangeX) {
				if (el.translateElement.X <= el.rangeX[0] * -1) {
					if (direct.X == 'left') {
						el.startMousePosX = e.clientX;
						el.startElementPos.X = +el.rangeX[0] * -1;
					}
					translateX = el.rangeX[0] * -1;
				} else if (el.translateElement.X >= el.rangeX[1]) {
					if (direct.X == 'right') {
						el.startMousePosX = e.clientX;
						el.startElementPos.X = +el.rangeX[1];
					}
					translateX = el.rangeX[1];
				}
			}

			if (el.rangeY) {
				if (el.translateElement.Y >= el.rangeY[1]) {
					if (direct.Y == 'down') {
						el.startMousePosY = e.clientY;
						el.startElementPos.Y = +el.rangeY[1];
					}
					translateY = el.rangeY[1];
				} else if (el.translateElement.Y <= +el.rangeY[0] * -1) {
					if (direct.Y == 'up') {
						el.startMousePosY = e.clientY;
						el.startElementPos.Y = +el.rangeY[0] * -1;
					}
					translateY = +el.rangeY[0] * -1;
				}
			}

			el.$el.css('transform', 'translate(' + translateX + 'px, ' + translateY + 'px)');
		});

	});

	$(document).on('mouseleave', opt.listener, function (e) {
		if (_.disabled) return;

		elems.forEach(function (el) {
			el.startElementPos.X = el.translateElement.X;
			el.startElementPos.Y = el.translateElement.Y;
			el.startMousePosX = null;
			el.startMousePosY = null;
		});
	});
}
// new Scrollbox('#hor-scroll');

; var Scrollbox;

(function () {
    'use strict';

    Scrollbox = function (elem, options) {
        const scrBoxEl = (typeof elem === 'string') ? document.querySelector(elem) : elem;

        if (!scrBoxEl) {
            return;
        }

        // options
        const opt = options || {};

        opt.horizontal = (opt.horizontal !== undefined) ? opt.horizontal : false;

        if (opt.horizontal && !opt.vertical) {
            opt.vertical = false;
        } else {
            opt.vertical = true;
        }

        opt.scrollStep = (opt.scrollStep !== undefined) ? opt.scrollStep : false;
        opt.fullSizeStep = (opt.fullSizeStep !== undefined) ? opt.fullSizeStep : false;
        opt.childScrollboxesObjects = (opt.childScrollboxesObjects !== undefined) ? opt.childScrollboxesObjects : null;
        opt.nestedScrBoxSelector = (opt.nestedScrBoxSelector !== undefined) ? opt.nestedScrBoxSelector : null;
        opt.duration = (opt.duration !== undefined) ? opt.duration : 1000;
        opt.bar = (opt.bar !== undefined) ? opt.bar : false;
        opt.barSize = (opt.barSize !== undefined) ? opt.barSize : null;
        opt.draggable = (opt.draggable !== undefined) ? opt.draggable : false;
        opt.mouseWheel = (opt.mouseWheel !== undefined) ? opt.mouseWheel : true;
        opt.actionPoints = (opt.actionPoints !== undefined) ? opt.actionPoints : [];
        opt.freezePoints = (opt.freezePoints !== undefined) ? opt.freezePoints : [];
        opt.windowScrollEvent = (opt.windowScrollEvent !== undefined) ? opt.windowScrollEvent : false;

        const winEl = scrBoxEl.querySelector('.scrollbox__window');
        let innerEl = scrBoxEl.querySelector('.scrollbox__inner'),
            wheelHandler,
            scrollHandler;

        if (innerEl && innerEl.parentElement !== winEl) {
            innerEl = null;
        }

        scrBoxEl.setAttribute('tabindex', '-1');

        const init = (cb) => {
            this.scrBoxEl = scrBoxEl;
            this.winEl = winEl;
            this.winSize = { X: 0, Y: 0 };
            this.horizontal = opt.horizontal;
            this.vertical = opt.vertical;
            this.bar = opt.bar;
            this.barSize = opt.barSize;
            this.nestedScrBoxSelector = opt.nestedScrBoxSelector;
            this.childScrollboxesObjects = opt.childScrollboxesObjects;
            this.parentEl = null;
            this.verticalBarSlEl = null;
            this.horizontalBarSlEl = null;
            this.verticalBarSlElSize = 0;
            this.horizontalBarSlElSize = 0;
            this.scrolled = { X: 0, Y: 0 };
            this.isScrolling = false;
            // this.breakOnNested = false;
            this.delta = 0;
            this.initialized = false;
            this.ts = Date.now();
            this.params = null;
            this.innerEl = innerEl || null;
            this.innerSize = { X: null, Y: null };
            this.endBreak = { X: null, Y: null };
            this.scrollStep = opt.scrollStep;
            this.actionElems = {};
            this.actionPoints = opt.actionPoints;
            this.freezePoints = opt.freezePoints;
            this.mouseWheel = opt.mouseWheel;
            this.windowScrollEvent = opt.windowScrollEvent;
            this.draggable = opt.draggable;

            if (opt.horizontal) {
                scrBoxEl.classList.add('scrollbox_horizontal');

                setTimeout(() => {
                    if (this.innerEl) {
                        const innerW = winEl.scrollWidth,
                            winW = winEl.offsetWidth;

                        if (innerW > winW) {
                            scrBoxEl.classList.add('srollbox_scrollable-horizontal');
                        }

                        this.winSize.X = winW;
                        this.innerSize.X = innerW;
                        this.endBreak.X = innerW - winW;
                    }

                    this.scrollBar(false, 'horizontal');
                }, 21);

                scrBoxEl.setAttribute('data-position-horizontal', 'atStart');
            }

            if (opt.vertical) {
                scrBoxEl.classList.add('scrollbox_vertical');

                setTimeout(() => {
                    const winH = winEl.offsetHeight;

                    let innerH = 0;

                    if (this.innerEl) {
                        innerH = winEl.scrollHeight;
                    }

                    opt.actionPoints.forEach(function (pointItem) {
                        if (pointItem.breakpoints[1] >= innerH) {
                            innerH = pointItem.breakpoints[1];
                        }
                    });

                    if (innerH > winH) {
                        scrBoxEl.classList.add('srollbox_scrollable-vertical');

                        if (this.mouseWheel && !this.windowScrollEvent) {
                            scrBoxEl.addEventListener('wheel', wheelHandler);
                        }

                        if (this.windowScrollEvent) {
                            window.addEventListener('scroll', scrollHandler);
                        }
                    }

                    this.winSize.Y = winH;
                    this.innerSize.Y = innerH;

                    if (this.innerEl) {
                        this.endBreak.Y = innerH - winH;
                    } else {
                        this.endBreak.Y = innerH;
                    }

                    if (this.windowScrollEvent) {
                        scrBoxEl.style.height = innerH + 'px';
                        scrBoxEl.style.minHeight = innerH + 'px';
                        scrBoxEl.style.maxHeight = innerH + 'px';
                    }

                    this.scrollBar(false, 'vertical');
                }, 21);

                scrBoxEl.setAttribute('data-position-vertical', 'atStart');
            }

            if (this.childScrollboxesObjects) {
                setTimeout(() => {
                    this.childScrollboxesObjects.forEach(obj => {
                        this.endBreak.X += obj.endBreak.X;
                        this.endBreak.Y += obj.endBreak.Y;

                        if (this.windowScrollEvent) {
                            scrBoxEl.style.height = (this.innerSize.Y + obj.endBreak.Y) + 'px';
                            scrBoxEl.style.minHeight = (this.innerSize.Y + obj.endBreak.Y) + 'px';
                            scrBoxEl.style.maxHeight = (this.innerSize.Y + obj.endBreak.Y) + 'px';
                        }

                        obj.offset = {
                            Y: obj.scrBoxEl.getBoundingClientRect().top - winEl.getBoundingClientRect().top
                        };

                        obj.setOptions({ mouseWheel: false });
                    });
                }, 21);
            }

            const actionEls = winEl.querySelectorAll('[data-action-element]');

            for (let i = 0; i < actionEls.length; i++) {
                const actEl = actionEls[i];

                this.actionElems[actEl.getAttribute('data-action-element')] = actEl;
            }

            if (this.draggable) {
                this.drag();
            }

            setTimeout(() => {
                this.initialized = true;

                if (cb) {
                    cb();
                }

                if (this.onInit) {
                    this.onInit();
                }
            }, 121);
        }

        init();

        // scroll animation
        const scrollAnim = (scrTo, ev, duration) => {
            if (this.isScrolling) {
                return;
            }

            this.isScrolling = true;

            const scrolled = this.scrolled;

            duration = (duration !== undefined && duration !== null) ? duration : opt.duration;

            if (duration == 0) {
                this.scroll(scrTo, true, ev);
                this.isScrolling = false;
                return;
            }

            if (this.freezePoints.length && ev !== 'scrollTo') {
                let scr = scrTo.Y;

                this.freezePoints.forEach(point => {
                    const from = point - Math.abs(this.delta / 2),
                        to = point + Math.abs(this.delta / 2);

                    if (from < scrTo.Y && scrTo.Y < to) {
                        scr = point;
                    }
                });

                scrTo.Y = scr;
            }

            animate((progr) => {
                this.scroll({ Y: (scrTo.Y - scrolled.Y) * progr + scrolled.Y }, false, ev);
            }, duration, 'easeInOutQuad', () => {
                this.scroll({ Y: (scrTo.Y - scrolled.Y) * 1 + scrolled.Y }, true, ev);
                this.isScrolling = false;
            });
        }

        // wheel event handler
        let wheelDelta = 0,
            wheelAccumulating = false;

        wheelHandler = (e) => {
            if (this.nestedScrBoxSelector && e.target.closest(this.nestedScrBoxSelector)) {
                return;
            }

            e.preventDefault();

            if (this.isScrolling) {
                return;
            }

            let delta, scrTo;

            if (e.deltaX) {
                delta = e.deltaX;
            } else {
                delta = e.deltaY;
            }

            if (this.scrollStep || opt.fullSizeStep) {
                if (scrBoxEl.hasAttribute('data-scroll-able')) {
                    const atr = scrBoxEl.getAttribute('data-scroll-able');

                    if (
                        (atr == 'toLeft' && delta < 0) ||
                        (atr == 'toRight' && delta > 0) ||
                        atr == 'false'
                    ) return;
                }

                if (this.scrollStep) {
                    if (delta > 0) {
                        scrTo = this.scrolled.Y + this.scrollStep;
                    } else if (delta < 0) {
                        scrTo = this.scrolled.Y - this.scrollStep;
                    }

                } else if (opt.fullSizeStep) {
                    if (delta > 0) {
                        scrTo = this.scrolled.Y + this.winSize.Y;
                    } else if (delta < 0) {
                        scrTo = this.scrolled.Y - this.winSize.Y;
                    }
                }

                this.delta = delta;

                scrollAnim({ Y: scrTo }, e, null);

            } else {
                if (delta > 0) {
                    delta = this.winSize.Y / 7;
                } else if (delta < 0) {
                    delta = -this.winSize.Y / 7;
                }

                wheelDelta += delta;

                if (wheelAccumulating) {
                    return;
                }

                wheelAccumulating = true;

                setTimeout(() => {
                    if (scrBoxEl.hasAttribute('data-scroll-able')) {
                        const atr = scrBoxEl.getAttribute('data-scroll-able');

                        if (
                            (atr == 'toLeft' && wheelDelta < 0) ||
                            (atr == 'toRight' && wheelDelta > 0) ||
                            atr == 'false'
                        ) return;
                    }

                    if (Math.abs(wheelDelta) > this.winSize.Y) {
                        if (wheelDelta > 0) {
                            wheelDelta = this.winSize.Y;
                        } else if (wheelDelta < 0) {
                            wheelDelta = -this.winSize.Y;
                        }
                    }

                    scrTo = this.scrolled.Y + wheelDelta;

                    this.delta = wheelDelta;

                    scrollAnim({ Y: scrTo }, e, null);

                    wheelDelta = 0;
                    wheelAccumulating = false;
                }, 221);
            }
        }

        // window scroll handler
        let winScroll = 0;

        scrollHandler = () => {
            this.delta = window.scrollY - winScroll;
            winScroll = window.scrollY;
            this.scroll({ Y: window.scrollY }, null);
        }

        // keyboard events
        // document.addEventListener('keydown', (e) => {
        //     if (this.isScrolling) return;

        //     let scrTo, delta;

        //     if (opt.horizontal) {
        //         if (e.code == 'ArrowRight') {
        //             delta = 1;
        //         } else if (e.code == 'ArrowLeft') {
        //             delta = -1;
        //         }
        //     } else {
        //         if (e.code == 'ArrowDown') {
        //             delta = 1;
        //         } else if (e.code == 'ArrowUp') {
        //             delta = -1;
        //         }
        //     }

        //     // scroll able
        //     if (scrBoxEl.hasAttribute('data-scroll-able')) {
        //         const atr = scrBoxEl.getAttribute('data-scroll-able');

        //         if (
        //             (atr == 'toLeft' && delta < 0) ||
        //             (atr == 'toRight' && delta > 0) ||
        //             atr == 'false'
        //         ) return;
        //     }

        //     if (opt.fullSizeStep) {
        //         if (delta > 0) {
        //             scrTo = this.scrolled + step;
        //         } else if (delta < 0) {
        //             scrTo = this.scrolled - step;
        //         }
        //     } else {
        //         if (delta > 0) {
        //             delta = 150;
        //         } else if (delta < 0) {
        //             delta = -150;
        //         }

        //         delta *= 2;

        //         scrTo = this.scrolled + delta;
        //     }

        //    this.delta = delta;

        //     if (delta) scrollAnim(scrTo, e, undefined);
        // });

        this.scrollTo = function (scrTo, dur, params) {
            this.params = params;

            this.delta = scrTo.Y - this.scrolled.Y;

            scrollAnim(scrTo, 'scrollTo', dur);

            scrBoxEl.removeAttribute('data-scroll-able');
        }

        this.setOptions = function (options) {
            for (const key in options) {
                if (Object.hasOwnProperty.call(options, key)) {
                    const val = options[key];

                    opt[key] = val;
                }
            }

            this.reInit();
        }

        this.reInit = function () {
            [
                'scrollbox_vertical',
                'scrollbox_horizontal',
                'srollbox_scrollable-vertical',
                'srollbox_scrollable-horizontal',
                'srollbox_dragging'
            ].forEach(function (cl) {
                scrBoxEl.classList.remove(cl);
            });

            if (this.innerEl) {
                this.innerEl.style = '';
            }

            for (const key in this.actionElems) {
                if (Object.hasOwnProperty.call(this.actionElems, key)) {
                    const elSt = this.actionElems[key].style;

                    elSt.transform = '';
                    elSt.opacity = '';
                    elSt.visibility = '';
                }
            }

            if (this.bar) {
                this.scrollBar(true);
            }

            scrBoxEl.removeEventListener('wheel', wheelHandler);
            window.removeEventListener('scroll', scrollHandler);

            const scrolled = Object.assign({}, this.scrolled);

            init(() => {
                this.scrollTo(scrolled, 0);
            });
        }

        this.destroy = function () {
            this.scrolled = { X: 0, Y: 0 };
            this.initialized = false;

            scrBoxEl.removeEventListener('wheel', wheelHandler);

            [
                'scrollbox_vertical',
                'scrollbox_horizontal',
                'srollbox_scrollable-vertical',
                'srollbox_scrollable-horizontal',
                'srollbox_dragging'
            ].forEach(function (cl) {
                scrBoxEl.classList.remove(cl);
            });

            if (this.innerEl) {
                this.innerEl.style = '';
            }

            for (const key in this.actionElems) {
                if (Object.hasOwnProperty.call(this.actionElems, key)) {
                    this.actionElems[key].removeAttribute('style');
                }
            }

            this.scrollBar(true);
            this.drag(true);
        }
    }

    Scrollbox.prototype.scroll = function (scrTo, aftScroll, ev) {
        if (scrTo.X === undefined) {
            scrTo.X = this.scrolled.X;
        }

        if (scrTo.Y === undefined) {
            scrTo.Y = this.scrolled.Y;
        }

        // if (this.nestedSbEls && this.nestedSbEls.length) {
        //     if (!this.breakOnNested && ev !== 'scrollTo') {
        //         for (let i = 0; i < this.nestedSbEls.length; i++) {
        //             const nEl = this.nestedSbEls[i],
        //                 left = +nEl.getAttribute('data-offset'),
        //                 pos = nEl.getAttribute('data-position');

        //             if (
        //                 left + nEl.offsetWidth > this.scrolled &&
        //                 left < this.scrolled + this.winEl.offsetWidth
        //             ) {
        //                 if (
        //                     this.delta > 0 && scrTo >= left &&
        //                     !nEl.classList.contains('disabled')
        //                 ) {
        //                     if (pos != 'atEnd') {
        //                         this.breakOnNested = true;

        //                         scrTo = left;
        //                         this.scrTo = left;

        //                         nEl.setAttribute('data-scroll-able', 'true');

        //                     } else {
        //                         nEl.setAttribute('data-scroll-able', 'false');
        //                     }

        //                 } else if (
        //                     this.delta < 0 && scrTo <= left &&
        //                     !nEl.classList.contains('disabled')
        //                 ) {
        //                     if (pos != 'atStart') {
        //                         this.breakOnNested = true;

        //                         scrTo = left;
        //                         this.scrTo = left;

        //                         nEl.setAttribute('data-scroll-able', 'true');

        //                     } else {
        //                         nEl.setAttribute('data-scroll-able', 'false');
        //                     }

        //                 }
        //             }
        //         }
        //     } else if (this.breakOnNested) {
        //         scrTo = this.scrTo;
        //     }
        // }

        // break path
        let posX, posY;

        if (scrTo.X >= this.endBreak.X) {
            scrTo.X = this.endBreak.X;

            posX = 'atEnd';

        } else if (scrTo.X <= 0) {
            scrTo.X = 0;

            posX = 'atStart';
        }

        if (scrTo.Y >= this.endBreak.Y) {
            scrTo.Y = this.endBreak.Y;

            posY = 'atEnd';

        } else if (scrTo.Y <= 0) {
            scrTo.Y = 0;

            posY = 'atStart';
        }

        if (posX) {
            this.scrBoxEl.setAttribute('data-position-horizontal', posX);
        } else {
            this.scrBoxEl.removeAttribute('data-position-horizontal');
        }

        if (posY) {
            this.scrBoxEl.setAttribute('data-position-vertical', posY);
        } else {
            this.scrBoxEl.removeAttribute('data-position-vertical');
        }

        // if (this.parentEl) {
        //     if (this.delta > 0) {
        //         if (pos == 'atEnd') {
        //             if (aftScroll) this.parentEl.setAttribute('data-scroll-able', 'true');
        //         } else {
        //             this.parentEl.setAttribute('data-scroll-able', 'false');
        //         }

        //     } else if (this.delta < 0) {
        //         if (pos == 'atStart') {
        //             if (aftScroll) this.parentEl.setAttribute('data-scroll-able', 'true');
        //         } else {
        //             this.parentEl.setAttribute('data-scroll-able', 'false');
        //         }
        //     }
        // }

        // move bars
        if ((this.horizontalBarSlEl || this.verticalBarSlEl) && ev != 'bar') {
            if (this.horizontal) {
                const barW = this.horizontalBarSlEl.parentElement.offsetWidth;

                this.horizontalBarSlEl.style.transform = 'translateX(' + ((barW - this.horizontalBarSlElSize) / 100) * (scrTo.X / (this.endBreak.X / 100)) + 'px)';
            }

            if (this.vertical) {
                const barH = this.verticalBarSlEl.parentElement.offsetHeight;

                this.verticalBarSlEl.style.transform = 'translateY(' + ((barH - this.verticalBarSlElSize) / 100) * (scrTo.Y / (this.endBreak.Y / 100)) + 'px)';
            }
        }

        // child scrolboxes
        const scrToInner = { X: scrTo.X, Y: scrTo.Y };

        if (this.childScrollboxesObjects && this.childScrollboxesObjects.length) {
            const shift = { X: 0, Y: 0 };

            this.childScrollboxesObjects.forEach(obj => {
                if (this.horizontal) {
                    if (obj.offset.X < scrTo.X && scrTo.X < obj.offset.X + obj.endBreak.X) {
                        scrToInner.X = obj.offset.X;
                    } else if (scrTo.X > obj.offset.X + obj.endBreak.X) {
                        shift.X += obj.endBreak.X;
                    }
                } else {
                    obj.scrollTo({ Y: scrTo.Y - obj.offset.Y }, 0);

                    if (obj.offset.Y < scrTo.Y && scrTo.Y < obj.offset.Y + obj.endBreak.Y) {
                        scrToInner.Y = obj.offset.Y;
                    } else if (scrTo.Y > obj.offset.Y + obj.endBreak.Y) {
                        shift.Y += obj.endBreak.Y;
                    }
                }
            });

            scrToInner.Y -= shift.X;
            scrToInner.Y -= shift.Y;
        }

        // inner element
        if (this.innerEl) {
            if (this.horizontal && this.vertical) {
                this.innerEl.style.transform = 'translate(' + (-scrToInner.X) + 'px, ' + (-scrToInner.Y) + 'px)';
            } else {
                if (this.horizontal) {
                    this.innerEl.style.transform = 'translateX(' + (-scrToInner.X) + 'px)';
                } else {
                    this.innerEl.style.transform = 'translateY(' + (-scrToInner.Y) + 'px)';
                }
            }
        }

        // action points
        if (this.actionPoints.length) {
            let currentActionPoints = [],
                prevActionPoints = [],
                nextActionPoints = [],
                lastUsedElemsProps = [];

            this.actionPoints.forEach((pointItem) => {
                if (pointItem.breakpoints[0] < scrTo.Y && scrTo.Y < pointItem.breakpoints[1]) {
                    currentActionPoints.push(pointItem);
                } else if (this.delta > 0 && pointItem.breakpoints[1] <= scrTo.Y) {
                    prevActionPoints.push(pointItem);
                } else if (this.delta < 0 && scrTo.Y <= pointItem.breakpoints[0]) {
                    nextActionPoints.push(pointItem);
                }
            });

            currentActionPoints.forEach((pointItem) => {
                const progress = (scrTo.Y - pointItem.breakpoints[0]) / (pointItem.breakpoints[1] - pointItem.breakpoints[0]);

                for (const elKey in pointItem.elements) {
                    const elemProps = pointItem.elements[elKey];

                    for (const property in elemProps) {
                        if (lastUsedElemsProps.includes(elKey + '_' + property)) {
                            continue;
                        }

                        lastUsedElemsProps.push(elKey + '_' + property);

                        const propsRange = elemProps[property],
                            goTo = (propsRange[1] - propsRange[0]) * progress + propsRange[0];

                        if (this.actionElems[elKey]) {
                            if (propsRange[2]) {
                                this.actionElems[elKey].style[property] = propsRange[2].replace('$', goTo);
                            } else {
                                this.actionElems[elKey].style[property] = goTo;

                                if (property == 'opacity') {
                                    if (goTo > 0) {
                                        this.actionElems[elKey].style.visibility = 'visible';
                                    } else {
                                        this.actionElems[elKey].style.visibility = 'hidden';
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (this.delta > 0) {
                prevActionPoints.sort((a, b) => b.breakpoints[1] - a.breakpoints[1]);

                prevActionPoints.forEach((pointItem) => {
                    for (const elKey in pointItem.elements) {
                        const elemProps = pointItem.elements[elKey];

                        for (const property in elemProps) {
                            if (lastUsedElemsProps.includes(elKey + '_' + property)) {
                                continue;
                            }

                            lastUsedElemsProps.push(elKey + '_' + property);

                            const propsRange = elemProps[property],
                                goTo = propsRange[1];

                            if (this.actionElems[elKey]) {
                                if (propsRange[2]) {
                                    this.actionElems[elKey].style[property] = propsRange[2].replace('$', goTo);
                                } else {
                                    this.actionElems[elKey].style[property] = goTo;

                                    if (property == 'opacity') {
                                        if (goTo > 0) {
                                            this.actionElems[elKey].style.visibility = 'visible';
                                        } else {
                                            this.actionElems[elKey].style.visibility = 'hidden';
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }

            if (this.delta < 0) {
                nextActionPoints.sort((a, b) => a.breakpoints[0] - b.breakpoints[0]);

                nextActionPoints.forEach((pointItem) => {
                    for (const elKey in pointItem.elements) {
                        const elemProps = pointItem.elements[elKey];

                        for (const property in elemProps) {
                            if (lastUsedElemsProps.includes(elKey + '_' + property)) {
                                continue;
                            }

                            lastUsedElemsProps.push(elKey + '_' + property);

                            const propsRange = elemProps[property],
                                goTo = propsRange[0];

                            if (this.actionElems[elKey]) {
                                if (propsRange[2]) {
                                    this.actionElems[elKey].style[property] = propsRange[2].replace('$', goTo);
                                } else {
                                    this.actionElems[elKey].style[property] = goTo;

                                    if (property == 'opacity') {
                                        if (goTo > 0) {
                                            this.actionElems[elKey].style.visibility = 'visible';
                                        } else {
                                            this.actionElems[elKey].style.visibility = 'hidden';
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        // scrolled
        this.scrolled = scrTo;

        if (this.onScroll) {
            this.onScroll(this.scrBoxEl, { posX, posY }, ev, scrTo, this.params);
        }

        // after scroll
        if (aftScroll) {
            this.scrolled = scrTo;
            // this.breakOnNested = false;

            if (this.onScroll) {
                this.onScroll(this.scrBoxEl, { posX, posY }, ev, scrTo, this.params);
            }

            if (this.afterScroll) {
                this.afterScroll(this.scrBoxEl, { posX, posY }, ev, scrTo, this.params);
            }

            if (this.windowScrollEvent) {
                window.scroll(0, scrTo.Y);
            }

            this.params = null;
        }
    }

    Scrollbox.prototype.scrollBar = function (destroy, initDirection) {
        if (!this.bar) {
            return;
        }

        if (this.horizontal) {
            const barEl = this.scrBoxEl.querySelector('.scrollbox__horizontal-bar');

            if (barEl) {
                if (destroy) {
                    barEl.innerHTML = '';

                } else {
                    if (!this.initialized && initDirection == 'horizontal') {
                        const el = document.createElement('div');

                        barEl.appendChild(el);

                        this.horizontalBarSlEl = el;
                    }

                    if (this.endBreak.X) {
                        if (this.barSize === null) {
                            this.horizontalBarSlEl.style.width = (this.winSize.X / (this.innerSize.X / 100)) + '%';

                            setTimeout(() => {
                                this.horizontalBarSlElSize = this.horizontalBarSlEl.offsetWidth;
                            }, 21);

                        } else if (this.barSize === true) {
                            this.horizontalBarSlElSize = this.horizontalBarSlEl.offsetWidth;
                        } else {
                            this.horizontalBarSlEl.style.width = this.barSize + 'px';
                            this.horizontalBarSlElSize = this.barSize;
                        }

                        barEl.style.display = '';

                    } else {
                        barEl.style.display = 'none';
                    }
                }
            }
        }

        if (this.vertical) {
            const barEl = this.scrBoxEl.querySelector('.scrollbox__vertical-bar');

            if (barEl) {
                if (destroy) {
                    barEl.innerHTML = '';

                } else {
                    if (!this.initialized && initDirection == 'vertical') {
                        const el = document.createElement('div');

                        barEl.appendChild(el);

                        this.verticalBarSlEl = el;
                    }

                    if (this.endBreak.Y) {
                        if (this.barSize === null) {
                            this.verticalBarSlEl.style.height = (this.winSize.Y / (this.innerSize.Y / 100)) + '%';

                            setTimeout(() => {
                                this.verticalBarSlElSize = this.verticalBarSlEl.offsetHeight;
                            }, 21);

                        } else if (this.barSize === true) {
                            this.verticalBarSlElSize = this.verticalBarSlEl.offsetHeight;
                        } else {
                            this.verticalBarSlEl.style.height = this.barSize + 'px';
                            this.verticalBarSlElSize = this.barSize;
                        }

                        barEl.style.display = '';

                    } else {
                        barEl.style.display = 'none';
                    }
                }
            }
        }

        const mouseStart = { X: 0, Y: 0 },
            mouseDelta = { X: 0, Y: 0 },
            bar = { X: 0, Y: 0, W: 0, H: 0 },
            barSlStart = { X: 0, Y: 0 };

        let barSlEl = null;

        const mouseMove = (e) => {
            e.preventDefault();

            if (barSlEl === this.horizontalBarSlEl) {
                const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX;

                mouseDelta.X = clientX - mouseStart.X;

                this.delta = mouseDelta.X;

                let shift = mouseDelta.X + barSlStart.X - bar.X;

                const limit = bar.W - this.horizontalBarSlElSize;

                if (shift <= 0) {
                    shift = 0;
                } else if (shift >= limit) {
                    shift = limit;
                }

                this.horizontalBarSlEl.style.transform = 'translateX(' + shift + 'px)';

                const X = (shift / (limit / 100)) * (this.endBreak.X / 100);

                this.scroll({ X }, null, 'bar');

            } else if (barSlEl === this.verticalBarSlEl) {
                const clientY = (e.type == 'touchmove') ? e.targetTouches[0].clientY : e.clientY;

                mouseDelta.Y = clientY - mouseStart.Y;

                this.delta = mouseDelta.Y;

                let shift = mouseDelta.Y + barSlStart.Y - bar.Y;

                const limit = bar.H - this.verticalBarSlElSize;

                if (shift <= 0) {
                    shift = 0;
                } else if (shift >= limit) {
                    shift = limit;
                }

                this.verticalBarSlEl.style.transform = 'translateY(' + shift + 'px)';

                const Y = (shift / (limit / 100)) * (this.endBreak.Y / 100);

                this.scroll({ Y }, null, 'bar');
            }
        }

        const mouseUp = () => {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('touchmove', mouseMove);

            this.scrBoxEl.classList.remove('scrollbox_dragging');

            barSlEl = null;
        }

        const mouseDown = (e) => {
            if (e.type == 'mousedown' && e.which != 1) {
                return;
            }

            barSlEl = e.target.closest('div');

            if (barSlEl === this.horizontalBarSlEl) {
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('touchmove', mouseMove, { passive: false });

                mouseStart.X = (e.type == 'touchstart') ? e.targetTouches[0].clientX : e.clientX;

                bar.X = barSlEl.parentElement.getBoundingClientRect().left;
                bar.W = barSlEl.parentElement.offsetWidth;

                barSlStart.X = barSlEl.getBoundingClientRect().left;

                this.scrBoxEl.classList.add('scrollbox_dragging');

            } else if (barSlEl === this.verticalBarSlEl) {
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('touchmove', mouseMove, { passive: false });

                mouseStart.Y = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

                bar.Y = barSlEl.parentElement.getBoundingClientRect().top;
                bar.H = barSlEl.parentElement.offsetHeight;

                barSlStart.Y = barSlEl.getBoundingClientRect().top;

                this.scrBoxEl.classList.add('scrollbox_dragging');
            }
        }

        if (!this.initialized && !destroy) {
            document.addEventListener('mousedown', mouseDown);
            document.addEventListener('touchstart', mouseDown, { passive: false });

            document.addEventListener('mouseup', mouseUp);
            document.addEventListener('touchend', mouseUp);

        } else if (destroy) {
            document.removeEventListener('mousedown', mouseDown);
            document.removeEventListener('touchstart', mouseDown);

            document.removeEventListener('mouseup', mouseUp);
            document.removeEventListener('touchend', mouseUp);
        }
    }

    Scrollbox.prototype.drag = function (destroy) {
        const mouseStart = { X: 0, Y: 0 },
            mouseDelta = { X: 0, Y: 0 },
            lastScroll = { X: 0, Y: 0 };

        let dragTimeout = null;

        const mouseMove = (e) => {
            e.preventDefault();

            const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchmove') ? e.targetTouches[0].clientY : e.clientY;

            mouseDelta.X = clientX - mouseStart.X;
            mouseDelta.Y = clientY - mouseStart.Y;

            const scrTo = {};

            if (this.horizontal) {
                scrTo.X = lastScroll.X - mouseDelta.X;
            }

            if (this.vertical) {
                scrTo.Y = lastScroll.Y - mouseDelta.Y;
            }

            this.scroll(scrTo, null);
        }

        const mouseUp = () => {
            this.scrBoxEl.removeEventListener('mousemove', mouseMove);
            this.scrBoxEl.removeEventListener('touchmove', mouseMove);

            this.scrBoxEl.classList.remove('scrollbox_cursor-drag');

            window.clearTimeout(dragTimeout);
        }

        const mouseDown = (e) => {
            if (e.type == 'mousedown' && e.which != 1) return;

            const winEl = e.target.closest('.scrollbox__window');

            if (winEl) {
                const clientX = (e.type == 'touchstart') ? e.targetTouches[0].clientX : e.clientX,
                    clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

                mouseStart.X = clientX;
                mouseStart.Y = clientY;

                lastScroll.X = this.scrolled.X;
                lastScroll.Y = this.scrolled.Y;

                this.scrBoxEl.addEventListener('mousemove', mouseMove);
                this.scrBoxEl.addEventListener('touchmove', mouseMove, { passive: false });

                dragTimeout = setTimeout(() => {
                    this.scrBoxEl.classList.add('scrollbox_cursor-drag');
                }, 721);
            }
        }

        if (!this.initialized && !destroy) {
            this.scrBoxEl.addEventListener('mousedown', mouseDown);
            this.scrBoxEl.addEventListener('touchstart', mouseDown, { passive: false });

            this.scrBoxEl.addEventListener('mouseup', mouseUp);
            this.scrBoxEl.addEventListener('touchend', mouseUp);

        } else if (destroy) {
            this.scrBoxEl.removeEventListener('mousedown', mouseDown);
            this.scrBoxEl.removeEventListener('touchstart', mouseDown);

            this.scrBoxEl.removeEventListener('mouseup', mouseUp);
            this.scrBoxEl.removeEventListener('touchend', mouseUp);
        }
    }
})();
var FlSlider = {
    
    animation: false,
    count: 0,
    isLine: false,
    t: null,
    
    init: function() {
        var _ = this;
        
        _.count = $('.float-slider__float-item').length;
        
        $('.float-slider__float-item').first().addClass('float-slider__float-item_curr');
        $('.float-slider__fade-item').first().addClass('float-slider__fade-item_curr');
        
        
        if (_.count > 1) {
            
            $('.float-slider__float-item').last().addClass('float-slider__float-item_prev');
            
            $('.float-slider__float-item').first().next('.float-slider__float-item').removeClass('float-slider__float-item_prev').addClass('float-slider__float-item_next');
            
            var dots = '';
            for (var i = 0; i < _.count; i++) {
                dots += '<li'+ ((i == 0) ? ' class="float-slider__dots-active"' : '') +'><button type="button" data-index="'+ i +'"></button></li>';
            }
            
            $('.float-slider__float').append('<ul class="float-slider__dots">'+ dots +'</ul>');
            
            if ($('.float-slider').attr('data-line')) {
                _.isLine = true;
            }
            
        } else {
            $('.float-slider__arrow').remove();
        }
        
    },
    
    dots: function(ind) {
        var _ = this;
        function dotC() {
            if (!$('.float-slider__float-item[data-index="'+ ind +'"]').hasClass('float-slider__float-item_curr')) {
                
                if (_.count == 2 && ind === 0) {
                    _.change('prev');
                } else {
                    _.change('next');
                }
                
                setTimeout(dotC, 1121);
            }
        }
        dotC();
    },
    
    activeDot: function() {
        var _ = this;
        var ind = $('.float-slider__float-item_curr').attr('data-index');
        $('.float-slider__dots li').removeClass('float-slider__dots-active');
        $('.float-slider__dots').find('button[data-index="'+ ind +'"]').parent().addClass('float-slider__dots-active');
        $('.float-slider-control__btn').removeClass('float-slider-control__btn_active');
        $('#float-sl-cont-'+ ind).addClass('float-slider-control__btn_active');
        if (_.isLine) {
            clearTimeout(_.t);
            _.line();
        }
    },
    
    line: function() {
        var _ = this;
        $('.float-slider-control__line span').removeClass('crawl');
        $('.float-slider-control__btn_active .float-slider-control__line span').addClass('crawl');
        _.t = setTimeout(function() {
            _.change('next');
        }, 5000);
    },
    
    change: function(dir) {
        
        var _ = this,
        Curr = $('.float-slider__float-item_curr'),
        Next = $('.float-slider__float-item_next'),
        Prev = $('.float-slider__float-item_prev'),
        ToNext,
        ToPrev;
        
        if (_.count > 3) {
            ToNext = (Next.next('.float-slider__float-item').length) ? Next.next('.float-slider__float-item') : $('.float-slider__float-item').first();
            ToPrev = (Prev.prev('.float-slider__float-item').length) ? Prev.prev('.float-slider__float-item') : $('.float-slider__float-item').last();
        }
        
        if (_.count == 2) {
            if (Next.attr('data-index') === '1') {
                if (dir == 'prev') {
                    return false;
                }
            } else if (Prev.attr('data-index') === '0') {
                if (dir == 'next') {
                    return false;
                }
            }
        } else if (_.count == 1) {
            return false;
        }
        
        if (!_.animation) {
            
            if (dir == 'next') {
                _.animation = true;
                
                Next.addClass('next-to-curr');
                Curr.addClass('curr-to-prev');
                
                if (_.count > 3) {
                    ToNext.addClass('to-next');
                    Prev.addClass('from-prev');
                } else {
                    Prev.addClass('prev-to-next');
                }
                
                $('.float-slider__fade-item').removeClass('float-slider__fade-item_curr');
                
                setTimeout(function() {
                    
                    $('.float-slider__fade-item[data-index="'+ Next.attr('data-index') +'"]').addClass('float-slider__fade-item_curr');
                    
                    if (_.count > 3) {
                        ToNext.addClass('float-slider__float-item_next').removeClass('to-next');
                        Prev.removeClass('float-slider__float-item_prev from-prev');
                    } else {
                        Prev.addClass('float-slider__float-item_next').removeClass('float-slider__float-item_prev prev-to-next');
                    }
                    
                    Curr.addClass('float-slider__float-item_prev').removeClass('float-slider__float-item_curr curr-to-prev');
                    
                    Next.addClass('float-slider__float-item_curr').removeClass('float-slider__float-item_next next-to-curr');
                    
                    _.animation = false;
                    _.activeDot();
                    
                }, 1021);
                
            } else if (dir == 'prev') {
                _.animation = true;
                
                Prev.addClass('prev-to-curr');
                Curr.addClass('curr-to-next');
                
                
                if (_.count > 3) {
                    ToPrev.addClass('to-prev');
                    Next.addClass('from-next');
                } else {
                    Next.addClass('next-to-prev');
                }
                
                $('.float-slider__fade-item').removeClass('float-slider__fade-item_curr');
                
                setTimeout(function() {
                    
                    $('.float-slider__fade-item[data-index="'+ Prev.attr('data-index') +'"]').addClass('float-slider__fade-item_curr');
                    
                    Prev.addClass('float-slider__float-item_curr').removeClass('float-slider__float-item_prev prev-to-curr');
                    
                    Curr.addClass('float-slider__float-item_next').removeClass('float-slider__float-item_curr curr-to-next');
                    
                    if (_.count > 3) {
                        ToPrev.addClass('float-slider__float-item_prev').removeClass('to-prev');
                        Next.removeClass('float-slider__float-item_next from-next');
                    } else {
                        Next.addClass('float-slider__float-item_prev').removeClass('float-slider__float-item_next next-to-prev');
                    }
                    
                    _.animation = false;
                    _.activeDot();
                    
                }, 1021);
                
            }
            
        }
        
    }
    
};


$('document').ready(function() {
    
    FlSlider.init();
    
    if ($('.float-slider-control').length) {
        var s = true;
        $(window).scroll(function() {
            if ( $('.float-slider-control').offset().top < (($(window).height()/2)+$(window).scrollTop()) ) {
                if (s) {
                    s = false;
                    FlSlider.line();
                }
            }
        });
    }
    
    $('body').on('click', '.float-slider-control__btn-btn', function() {
        if (!$(this).parent().hasClass('float-slider-control__btn_active')) {
            var ind = +$(this).attr('data-index');
            FlSlider.dots(ind);
        }
    });
    
    $('body').on('click', '.float-slider__dots button', function() {
        if (!$(this).parent().hasClass('float-slider__dots-active')) {
            var ind = +$(this).attr('data-index');
            FlSlider.dots(ind);
        }
    });
    
    $('body').on('click', '.float-slider__arrow', function() {
        var dir = $(this).attr('data-direct');
        FlSlider.change(dir);
    });
    
    if (window.innerWidth < 1200) {
        // $('.float-slider').swipe({
        //     swipe: function(event, direction) {
        //         if (direction == 'right') {
        //             FlSlider.change('prev');
        //         } else if(direction == 'left') {
        //             FlSlider.change('next');
        //         }
        //     },
        //     triggerOnTouchEnd: false,
        //     excludedElements: '',
        //     threshold: 21,
        // });
    }
    
});
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
var SPA;

(function () {
    'use strict';

    SPA = function (opt) {
        this.opt = opt || {};
        this.routeSubscribers = [];

        this.route = function (path, fun) {
            if (typeof fun === 'function') {
                this.routeSubscribers.push({ path, fun });
            }

            return this;
        }

        this.changeTemplate = function () {
            const hash = window.location.hash;

            let fun, matches;

            for (const item of this.routeSubscribers) {
                if (!hash && !item.path) {
                    fun = item.fun;
                    break;

                } else if (hash && item.path) {
                    matches = hash.match(new RegExp(item.path));

                    if (matches) {
                        fun = item.fun;

                        break;
                    }
                }
            }

            if (!fun) return;

            fun(matches, (data, cb) => {
                const contEl = document.getElementById(data.container),
                    tplEl = document.getElementById(data.template);

                if (!contEl || !tplEl) return;

                contEl.innerHTML = template(data, tplEl.innerHTML, this.opt.tplSign);

                if (cb) cb();
            });
        }

        window.addEventListener('popstate', () => {
            // if (link) return;

            setTimeout(() => {
                this.changeTemplate();
            }, 121);
        });

        this.changeTemplate();
    }

    // SPA = {
    //     opt: null,
    //     routeSubscribers: [],

    //     init: function (opt) {
    //         this.opt = opt || {};

    //         // let link;

    //         // document.addEventListener('click', (e) => {
    //         //     link = e.target.closest(this.opt.link);

    //         //     if (link) {
    //         //         setTimeout(() => {
    //         //             this.changeTemplate();
    //         //             link = null;
    //         //         }, 121);
    //         //     }
    //         // });

    //         window.addEventListener('popstate', () => {
    //             // if (link) return;

    //             setTimeout(() => {
    //                 this.changeTemplate();
    //             }, 121);
    //         });

    //         this.changeTemplate();
    //     },

    //     route: function (path, fun) {
    //         if (typeof fun === 'function') {
    //             this.routeSubscribers.push({ path, fun });
    //         }

    //         return this;
    //     },

    //     changeTemplate: function () {
    //         const hash = window.location.hash;

    //         let fun, matches;

    //         for (const item of this.routeSubscribers) {
    //             if (!hash && !item.path) {
    //                 fun = item.fun;
    //                 break;

    //             } else if (hash && item.path) {
    //                 matches = hash.match(new RegExp(item.path));

    //                 if (matches) {
    //                     fun = item.fun;

    //                     break;
    //                 }
    //             }
    //         }

    //         if (!fun) return;

    //         fun(matches, (data, cb) => {
    //             const contEl = document.getElementById(data.container),
    //                 tplEl = document.getElementById(data.template);

    //             if (!contEl || !tplEl) return;

    //             contEl.innerHTML = template(data, tplEl.innerHTML, this.opt.tplSign);

    //             if (cb) cb();
    //         });
    //     }
    // };

})();
var DragAndDrop;
/* 
DragAndDrop.onDragged(function () {
    // code
});
*/

(function () {
    'use strict';

    DragAndDrop = {
        opt: null,
        dragElemObj: {},
        parentDropElem: null,
        curentDropElem: null,
        maskDiv: null,
        lastInsertPos: '',
        onDragSubscribers: [],

        init: function (opt) {
            this.opt = opt || {};

            document.removeEventListener('mousedown', this.mD);

            this.mD = this.mD.bind(this);

            document.addEventListener('mousedown', this.mD);

            this.setInd();
        },

        setInd: function () {
            const dropEls = document.querySelectorAll('.dropable');

            for (let i = 0; i < dropEls.length; i++) {
                const dropEl = dropEls[i];

                const dragEls = dropEl.querySelectorAll('.dragable');

                for (let i = 0; i < dragEls.length; i++) {
                    const dragEl = dragEls[i];

                    dragEl.setAttribute('data-index', i);
                }
            }
        },

        mD: function (e) {
            if (e.type == 'mousedown' && e.which != 1) return;

            const dragEl = e.target.closest('.dragable');

            if (!dragEl) return;

            this.mM = this.mM.bind(this);
            this.mU = this.mU.bind(this);

            document.addEventListener('mousemove', this.mM);
            document.addEventListener('mouseup', this.mU);

            const clientX = (e.type == 'touchstart') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

            // dragable options 
            this.dragElemObj.elem = dragEl;
            this.dragElemObj.X = dragEl.getBoundingClientRect().left;
            this.dragElemObj.Y = dragEl.getBoundingClientRect().top;
            this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
            this.dragElemObj.shiftY = clientY - this.dragElemObj.Y;
            this.dragElemObj.width = dragEl.offsetWidth;
            this.dragElemObj.height = dragEl.offsetHeight;

            dragEl.style.width = this.dragElemObj.width + 'px';
            dragEl.style.height = this.dragElemObj.height + 'px';
            dragEl.style.left = this.dragElemObj.X + 'px';
            dragEl.style.top = this.dragElemObj.Y + 'px';

            dragEl.classList.add('dragable_active');

            this.parentDropElem = dragEl.closest('.dropable');

            this.maskDiv = document.createElement('div');

            this.maskDiv.className = 'dropable__mask';
            this.maskDiv.style.height = this.dragElemObj.height + 'px';

            this.dragElemObj.elem.after(this.maskDiv);
        },

        mM: function (e) {
            const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

            const moveX = clientX - this.dragElemObj.shiftX,
                moveY = clientY - this.dragElemObj.shiftY;

            this.dragElemObj.elem.style.left = moveX + 'px';
            this.dragElemObj.elem.style.top = moveY + 'px';

            const dropEl = e.target.closest('.dropable');

            if (dropEl && dropEl !== this.curentDropElem) {
                this.curentDropElem = dropEl;

                dropEl.querySelector('.dropable__inner').prepend(this.maskDiv);

                this.lastInsertPos = '';
            }

            const siblingDragEl = e.target.closest('.dragable');

            if (siblingDragEl) {
                const siblingDragElCenter = siblingDragEl.getBoundingClientRect().top + (siblingDragEl.offsetHeight / 2);

                if (clientY >= siblingDragElCenter) {
                    if (this.maskDiv && this.lastInsertPos != 'after') {
                        this.lastInsertPos = 'after'
                        siblingDragEl.after(this.maskDiv);
                    }

                } else {
                    if (this.maskDiv && this.lastInsertPos != 'before') {
                        this.lastInsertPos = 'before';
                        siblingDragEl.before(this.maskDiv);
                    }
                }

            }
        },

        mU: function () {
            document.removeEventListener('mousemove', this.mM);

            if (this.dragElemObj.elem && this.maskDiv) {
                this.dragElemObj.elem.classList.remove('dragable_active');

                this.dragElemObj.elem.style = '';

                this.maskDiv.replaceWith(this.dragElemObj.elem);

                this.setInd();

                this.onDragSubscribers.forEach(function (fun) {
                    fun();
                });
            }

            this.dragElemObj = {};
            this.maskDiv = null;
            this.curentDropElem = null;
        },

        onDragged: function (fun) {
            if (typeof fun === 'function') {
                this.onDragSubscribers.push(fun);
            }
        }
    };
})();
var FixOnScroll;

(function () {
    'use strict';

    FixOnScroll = function (elSel, options) {
        this.opt = options || {};

        this.opt.bottomPosition = this.opt.bottomPosition !== undefined ? this.opt.bottomPosition : null;

        this.opt.hideOnTop = window.innerHeight;

        const elem = document.querySelector(elSel);

        if (!elem) {
            return;
        }

        this.init = () => {
            if (typeof this.opt.bottomPosition === 'function') {
                this.opt.botPos = this.opt.bottomPosition();
            } else {
                this.opt.botPos = this.opt.bottomPosition;
            }

            const initElBound = elem.getBoundingClientRect();

            elem.parentElement.style.width = elem.offsetWidth + 'px';
            elem.parentElement.style.height = elem.offsetHeight + 'px';

            this.hide(elem);

            if (initElBound.top > window.innerHeight) {
                elem.style.position = 'fixed';
                elem.style.left = initElBound.left + 'px';
                elem.style.bottom = this.opt.botPos + 'px';
            }
        }

        this.init();

        window.addEventListener('scroll', () => {
            const parentElBound = elem.parentElement.getBoundingClientRect();

            this.hide(elem);

            if (window.innerHeight - parentElBound.bottom <= this.opt.botPos) {
                elem.style.position = 'fixed';
                elem.style.left = parentElBound.left + 'px';
                elem.style.bottom = this.opt.botPos + 'px';
            } else {
                elem.style.position = '';
                elem.style.left = '';
                elem.style.bottom = '';
            }
        });
    }

    FixOnScroll.prototype.hide = function (elem) {
        if (this.opt.hideOnTop && this.opt.hideOnTop > window.scrollY) {
            elem.style.visibility = 'hidden';
            elem.style.opacity = '0';
        } else {
            elem.style.visibility = 'visible';
            elem.style.opacity = '1';
        }
    }

    FixOnScroll.prototype.reInit = function () {
        if (this.init) {
            this.init();
        }
    }
})();
//# sourceMappingURL=script.defer.js.map
