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