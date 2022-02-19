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