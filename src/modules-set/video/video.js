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