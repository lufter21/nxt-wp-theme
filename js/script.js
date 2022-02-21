let tplScripts = [
    'js/slick.min.js',
    'js/script.defer.js?v=@version@',
    'js/common.defer.js?v=@version@',
    'js/interface.js?v=@version@'
].map(src => sJS.assetsDirPath + src);

if (sJS.deferScriptsBefore) {
    tplScripts = sJS.deferScriptsBefore.concat(tplScripts);
}

if (sJS.deferScriptsAfter) {
    tplScripts = tplScripts.concat(sJS.deferScriptsAfter);
}

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    [
        sJS.assetsDirPath + 'js/jquery-3.1.1.min.js',
        sJS.assetsDirPath + 'js/script.head.js?v=@version@',
        sJS.assetsDirPath + 'js/common.head.js?v=@version@'
    ].forEach(function (src) {
        const scrEl = document.createElement('script');
        scrEl.async = false;
        scrEl.defer = true;
        scrEl.src = src;
        document.body.appendChild(scrEl);
    });

    // defer scripts
    let loading = false;

    function initLoad() {
        if (loading) {
            document.removeEventListener('mousemove', initLoad);
            document.removeEventListener('touchstart', initLoad);
            window.removeEventListener('scroll', initLoad);
            return;
        }

        if (sJS.deferScriptsStartLoading) {
            sJS.deferScriptsStartLoading();
        }

        loading = true;

        let i = 0;

        tplScripts.forEach(function (src) {
            const scrEl = document.createElement('script');
            scrEl.async = false;
            scrEl.defer = true;

            scrEl.addEventListener('load', function () {
                i++;

                if (i === tplScripts.length && sJS.deferScriptsHaveBeenLoaded) {
                    sJS.deferScriptsHaveBeenLoaded();
                }
            });

            scrEl.src = src;
            document.body.appendChild(scrEl);
        });
    }

    document.addEventListener('mousemove', initLoad);
    document.addEventListener('touchstart', initLoad);
    window.addEventListener('scroll', initLoad);
});