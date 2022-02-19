'use strict';

const firstScreenEl = document.getElementById('first-screen');

(function initFun() {
    if (firstScreenEl) {
        firstScreenEl.style.height = '';

        if (firstScreenEl.offsetHeight < window.innerHeight) {
            firstScreenEl.style.height = window.innerHeight + 'px';
        }
    }

    try {
        FlexImg('.flex-img');
    } catch (error) {
        console.log(error);
    }

    try {
        CoverImg.reInit('body');
    } catch (error) {
        console.log(error);
    }

    // resize events
    window.removeEventListener('winResized', initFun);
    window.removeEventListener('winWidthResized', initFun);

    if (window.innerWidth > 1200) {
        window.addEventListener('winResized', initFun);
    } else {
        window.addEventListener('winWidthResized', initFun);
    }
})();

// frames animate
try {
    const frAn = new FramesAnimate('stopmotion-frames', {
        fps: 4
    });

    frAn.onLoad = function () {
        console.log('onLoad');
    }

    // frAn.onStop = function () {
    //     // code
    // }

    const frM = new FramesAnimate('mmg-stopmotion-frames', {
        fps: 10,
    });

    // frM.onLoad = function () {
    //     frM.slideTo(15);
    // }

    const fr = new FramesAnimate('moms-stopmotion-frames', {
        folder: true,
        fps: 5,
        autoplay: false,
        backward: true
    });

    $('body').on('click', '#moms-stopmotion-frames', function () {
        fr.play();
    });
} catch (error) {
    console.log(error);
}

// scrollbox
try {
    new Scrollbox('#vert-scroll', {
        bar: true
    });

    new Scrollbox('#test-scroll', {
        bar: true
    });

    new Scrollbox('#hor-scroll', {
        horizontal: true,
        bar: true
    });

    new Scrollbox('#both-scroll', {
        horizontal: true,
        vertical: true,
        bar: true,
        drag: true
    });

    // nested scrollboxes
    new Scrollbox('#main-nest-scroll', {
        bar: true
    });

    new Scrollbox('#main-scroll', {
        bar: true,
        nestedScrBoxSelector: '#main-nest-scroll'
    });

    // child scrollboxes
    const chSc = new Scrollbox('#main-child-scroll');

    new Scrollbox('#main-scroll-parent', {
        bar: true,
        childScrollboxesObjects: [chSc]
    });

    // action points
    new Scrollbox('#actions-scroll', {
        bar: true,
        windowScrollEvent: true,
        actionPoints: [
            {
                breakpoints: [0, window.innerHeight],
                elements: {
                    s1: {
                        opacity: [1, 0]
                    }
                }
            },
            {
                breakpoints: [0, window.innerHeight + document.querySelector('[data-action-element="t1"]').offsetHeight],
                elements: {
                    t1: {
                        marginTop: [0, -(window.innerHeight + document.querySelector('[data-action-element="t1"]').offsetHeight), '$px']
                    }
                }
            },
            {
                breakpoints: [document.querySelector('[data-action-element="t1"]').offsetHeight, window.innerHeight + document.querySelector('[data-action-element="t1"]').offsetHeight],
                elements: {
                    ms: {
                        opacity: [0, 1]
                    }
                }
            },
            {
                breakpoints: [window.innerHeight + document.querySelector('[data-action-element="t1"]').offsetHeight, window.innerHeight + document.querySelector('[data-action-element="t1"]').offsetHeight + document.querySelector('[data-action-element="ms"]').offsetHeight],
                elements: {
                    ms: {
                        transform: [0, -document.querySelector('[data-action-element="ms"]').offsetHeight, 'translateY($px)']
                    }
                }
            }
        ]
    });

    document.getElementById('actions-scroll').style.height = window.innerHeight + document.querySelector('[data-action-element="t1"]').offsetHeight + document.querySelector('[data-action-element="ms"]').offsetHeight + 'px';

} catch (error) {
    console.log(error);
}


// cover images
try {
    CoverImg.init();
} catch (error) {
    console.log(error);
}


// toggle button
try {
    Toggle.init({
        button: '.js-toggle',
        offButton: '.js-tgl-off',
        toggledClass: 'toggled' // def: toggled
    });

    Toggle.onChange = function (toggleElem, targetElements, state) {
        // code...
    }
} catch (error) {
    console.log(error);
}


// ajax button
try {
    Ajax.init('.js-ajax');

    Ajax.success = function (response) {
        //  code...
    }
} catch (error) {
    console.log(error);
}




// popup
try {
    Popup.init('.js-open-popup');

    MediaPopup.init('.js-open-media-popup');

    let popupScrollImage;

    Popup.onOpen(function (elSel, btnEl) {
        console.log(elSel, btnEl);

        if (elSel == '#media-popup') {
            if (!popupScrollImage) {
                popupScrollImage = new Scrollbox('#popup-scroll-image', {
                    horizontal: true,
                    vertical: true,
                    bar: true,
                    drag: true
                });
            } else {
                popupScrollImage.reInit();
            }
        }
    });

    let scale = 1;

    $('body').on('click', '.popup-media__zoom', function () {
        let dir = $(this).attr('data-dir');

        if (dir == 'plus') {
            scale++;
        } else if (scale > 1) {
            scale--;
        }

        $('.popup-media__image').css('transform', 'scale(' + scale + ')');

        popupScrollImage.reInit();

    }).on('click', '.popup-media__arr, .popup-media__dots-btn:not(.active)', function () {
        $('.popup-media__image').css('transform', 'scale(1)');

        popupScrollImage.reInit();
    });

} catch (error) {
    console.log(error);
}

// menu
try {
    Menu.init('.menu__item_has-children', '.menu__sub-menu', 1000);
} catch (error) {
    console.log(error);
}

// mobile nav
try {
    MobNav.init({
        openBtn: '.js-open-menu',
        closeBtn: '.js-close-menu',
        headerId: 'header',
        closeLink: '.menu a.js-anchor'
    });
} catch (error) {
    console.log(error);
}

// tooltip
try {
    const tt = new ToolTip({
        btnSelector: '.js-tooltip',
        notHide: false, // def: false
        clickEvent: true, // def: false
        tipElClass: 'some-class', // def: null
    });

    new ToolTip({
        btnSelector: '.js-tooltip-hov'
    });

    new ToolTip({
        btnSelector: '.js-tooltip-bot',
        positionY: 'bottom'
    });

    new ToolTip({
        btnSelector: '.js-tooltip-right',
        positionX: 'right',
        fadeSpeed: 3500
    });
} catch (error) {
    console.log(error);
}

// alert
try {
    new Alert({
        content: 'This content in top alert.',
        position: 'top',
        addClass: 'top-alert-block'
    });

    new Alert({
        content: '<div class="row alert__row row_col-middle row_sm-x-nw"><div class="col">На нашем веб-сайте используются файлы cookies, которые позволяют улучшить Ваше взаимодействие с сайтом. Когда вы посещаете данный веб-сайт, Вы даете согласие на использование файлов cookies.</div><div class="col"><button class="js-alert-close btn btn_be">Хорошо</button></div></div>',
        showOnce: true
    });
} catch (error) {
    console.log(error);
}

// accord
try {
    new Accord({
        btnSelector: '.accord__button',
        autoScrollOnViewport: 700, // def: false
        maxViewport: 1000, // def: false
        collapseSiblings: false // def: true
    });
} catch (error) {
    console.log(error);
}

// more
try {
    More.init('.more__btn');
} catch (error) {
    console.log(error);
}


// tab
try {
    Tab.init({
        container: '.tab',
        button: '.tab__button',
        item: '.tab__item',
        hash: true
    });
} catch (error) {
    console.log(error);
}

// video
try {
    Video.init('.video__btn-play');
} catch (error) {
    console.log(error);
}

// fullscreen scroll
try {
    FsScroll.init({
        container: '.fsscroll',
        screen: '.fsscroll__screen',
        duration: 700
    });
} catch (error) {
    console.log(error);
}

// screens
try {
    Screens.init({
        horizontal: true
    });
} catch (error) {
    console.log(error);
}

// Screens2.init({
// 	container: '.screen-wrap',
// 	duration: 700, // default - 1000
// 	menuCurrentClass: 'current' // default - 'menu__item_current'
// });

// smooth scroll
// ScrollSmooth.init();

// anchor
try {
    Anchor.init('.js-anchor', 700, 100);
    // Anchor.scroll('section-3');
} catch (error) {
    console.log(error);
}

// diagram
try {
    var diagram = new Diagram({
        canvasId: 'diagram',
        charts: [
            {
                value: 37,
                color: 'green',
                width: 20,
                numContId: 'diagram-num-1'
            },
            {
                value: 45,
                color: '#d0295e',
                width: 10,
                offset: 2,
                numContId: 'diagram-num-2'
            }
        ],
        maxValue: 100
    });


    // diagram 2
    var diagram_2 = new Diagram({
        canvasId: 'diagram-2',
        charts: [
            {
                value: 84,
                color: '#fd8d40',
                width: 30,
                numContId: 'diagram-2-num-1'
            },
            {
                value: 39,
                color: '#0000ff',
                width: 30,
                offset: 2,
                numContId: 'diagram-2-num-2'
            }
        ],
        maxValue: 100,
        animate: true
    });

    diagram_2.animate(2700);

    // diagram 2
    var diagram_3 = new Diagram({
        canvasId: 'diagram-3',
        charts: [
            {
                value: 67,
                color: '#fd8d40',
                width: 15,
                numContId: 'diagram-3-num-1'
            },
            {
                value: 75,
                color: '#d0295e',
                width: 15,
                offset: 2,
                numContId: 'diagram-3-num-2'
            },
            {
                value: 83,
                color: 'green',
                width: 15,
                offset: 2,
                numContId: 'diagram-3-num-3'
            },
            {
                value: 91,
                color: '#0000ff',
                width: 15,
                offset: 2,
                numContId: 'diagram-3-num-4'
            }
        ],
        maxValue: 100,
        animate: true
    });

    diagram_3.animate(4200);
} catch (error) {
    console.log(error);
}

// numberspin
try {
    var numberspin = new Numberspin({
        elemSelectors: '.numberspin',
        format: true
    });

    numberspin.animate(4200);
} catch (error) {
    console.log(error);
}

// share
try {
    Share.init('.js-share-btn');
} catch (error) {
    console.log(error);
}

// timer
try {
    if (document.getElementById('timer')) {
        var timer = new Timer({
            elemId: 'timer',
            continue: true
        });

        timer.onStop = function () {
            Popup.message('Timer Stopped');
        }

        timer.start(50);

        // timer 2
        var timer2 = new Timer({
            elemId: 'timer-2',
            format: 'extended'
        });

        timer2.onStop = function () {
            Popup.message('Timer 2 Stopped');
        }

        timer2.start(130);

        // stopwatch
        var stopwatch = new Timer({
            elemId: 'stopwatch',
            stopwatch: true
        });

        stopwatch.onStop = function () {
            Popup.message('Stopwatch Stopped');
        }

        stopwatch.start(0);

        // stopwatch 2
        var stopwatch2 = new Timer({
            elemId: 'stopwatch-1',
            stopwatch: true,
            format: 'extended'
        });

        stopwatch2.onStop = function () {
            Popup.message('Stopwatch Stopped');
        }

        stopwatch2.start(0);
    }

} catch (error) {
    console.log(error);
}

// zoom
try {
    Zoom.init('.js-zoom-container');
} catch (error) {
    console.log(error);
}

// cursor
try {
    if (window.innerWidth > 1100) {
        Cursor.init([
            { selector: '.curs-link', class: 'hover-a' },
            { selector: '.curs-btn', class: 'hover-btn' },
            { selector: '.curs-main' }
        ]);
    }
} catch (error) {
    console.log(error);
}

// get content via Ajax
try {
    var getCont = new GetContentAjax({
        eventBtn: '.js-get-content-ajax',
        event: 'click',
        outputDiv: '#output-ajax',
        sourceFile: '/get-content-ajax.php'
    });

    getCont.output = function (response) {
        var result = response.match(/\<div id\="source"\>([\s\S]*?)\<\/div\>/);

        return result[1];
    }
} catch (error) {
    console.log(error);
}

// fieldsets
try {
    NextFieldset.init('.js-next-fieldset-btn', '.js-prev-fieldset-btn');

    NextFieldset.onChange = function (prevFsEl, curFsEl) {
        // ...
    }
} catch (error) {
    console.log(error);
}

// autocomplete
try {
    // autocomplete data
    AutoComplete.setValues = function (inpElem, callback) {
        switch (inpElem.name) {
            case 'fruits':
                callback([
                    { val: "mc", value: "Pinapple", id: 1 },
                    { val: "vn", value: "Apple", id: 2 },
                    { val: "eth", value: "Berry", id: 3 },
                    { val: "ms", value: "Cherry", id: 4 },
                    { val: "mn", value: "Mandarin", id: 5 },
                    { val: "mk", value: "Marakuja", id: 6 }
                ], 'value', 'val', 'id');
                break;

            case 'country':
                callback([
                    { val: "mc", value: "Pinapple", id: 1 },
                    { val: "vn", value: "Apple", id: 2 },
                    { val: "eth", value: "Berry", id: 3 },
                    { val: "ms", value: "Cherry", id: 4 },
                    { val: "mn", value: "Mandarin", id: 5 },
                    { val: "mk", value: "Marakuja", id: 6 }
                ], 'value', 'val', 'id');
                break;

            case 'country2':
                callback();
                break;

            default:
                break;
        }
    }

    AutoComplete.onSelect(function (inpElem, val, secVal) {
        if (inpElem.name == 'country') {

        }
    });

    AutoComplete.init({ getAllValuesIfEmpty: true });

} catch (error) {
    console.log(error);
}

// init form
try {
    Form.init('.form');
} catch (error) {
    console.log(error);
}

// slick slider
try {
    $('#slider').on('init', function () {
        CoverImg.reInit('#slider');
    });

    $('#slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
    });
} catch (error) {
    console.log(error);
}

// masked inputs
try {
    new Maskinput('.maskinp-tel, input[data-type="tel"]', 'tel');
    new Maskinput('.maskinp-tel-ru, input[data-type="tel_RU"]', 'tel_RU');
    new Maskinput('.maskinp-gmail', 'gmail');
    new Maskinput('.maskinp-cyr, input[data-type="name"]', 'cyr');
    new Maskinput('.maskinp-date', 'date');
    new Maskinput('.maskinp-time', 'time');
    new Maskinput('.maskinp-int', 'int');
    new Maskinput('.maskinp-float', 'float');
} catch (error) {
    console.log(error);
}

// mouse parallax
try {
    if ($('.parallax-element').length) {
        new Mouseparallax($('.parallax-element.el2'), {
            listener: $('#sec1')
        });

        new Mouseparallax($('.parallax-element.el3'), {
            listener: $('#sec2')
        });
    }
} catch (error) {
    console.log(error);
}

// drag'n'drop
try {
    DragAndDrop.init();

    DragAndDrop.onDragged(function () {
        console.log('dragged');
    });
} catch (error) {
    console.log(error);
}


// GetCountriesAndCitiesList
function dAirGetInit() {
    try {
        dAirGet.countries(function (c) {
            var contryObjArr = JSON.parse(c);

            Select.setOptions('.countries', contryObjArr, 'name', 'name', 'id');
        });
    } catch (error) {
        console.log(error);
    }

    try {
        Select.onSelect(function (inpElem, val, secVal) {
            if (inpElem.name == 'country') {
                dAirGet.region(secVal, function (c) {
                    var regionObjArr = JSON.parse(c);
                    Select.setOptions('.cities', regionObjArr, 'name', 'name');
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}