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