/*
* call Menu.init(Str menu item selector, Str sub menu selector);
*/
var Menu;

(function () {
    'use strict';

    Menu = {
        toggle: function (elem, elementStr, subMenuStr) {
            var subMenuElem = elem.querySelector(subMenuStr);

            if (!subMenuElem) {
                return;
            }

            if (elem.classList.contains('active')) {
                subMenuElem.style.height = 0;

                elem.classList.remove('active');
            } else {
                var mainElem = elem.closest('.menu'),
                    itemElements = mainElem.querySelectorAll(elementStr),
                    subMenuElements = mainElem.querySelectorAll(subMenuStr);

                for (var i = 0; i < itemElements.length; i++) {
                    itemElements[i].classList.remove('accord__button_active');
                    subMenuElements[i].style.height = 0;
                }

                subMenuElem.style.height = subMenuElem.scrollHeight + 'px';

                elem.classList.add('active');
            }
        },

        init: function (elementStr, subMenuStr, viewport) {
            document.addEventListener('click', (e) => {
                var elem = e.target.closest(elementStr);

                if (!elem || window.innerWidth > viewport) return;

                if (e.target.getAttribute('href') == '#') e.preventDefault();

                this.toggle(elem, elementStr, subMenuStr);
            });
        }
    };
})();