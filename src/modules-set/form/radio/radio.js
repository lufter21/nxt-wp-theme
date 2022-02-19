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