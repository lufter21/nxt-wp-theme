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