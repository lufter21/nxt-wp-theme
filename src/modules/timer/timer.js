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