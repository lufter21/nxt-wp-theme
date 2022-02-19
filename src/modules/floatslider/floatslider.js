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