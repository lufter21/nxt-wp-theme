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