; var template;

(function () {
    'use strict';

    template = function (data, template, sign) {
        const s = sign || '%',
            tplEl = document.getElementById(template);

        if (tplEl) {
            template = tplEl.innerHTML;
        }

        let result = template;

        result = result.replace(new RegExp('<' + s + 'for (\\w+) as (\\w+)' + s + '>(.*?)<' + s + 'endfor' + s + '>', 'gs'), function (match, p1, p2, p3, offset, input) {

            if (!data[p1]) return '';

            return data[p1].map(function (item) {
                let res = p3;

                if (typeof item === 'object') {
                    for (const key in item) {
                        if (item.hasOwnProperty(key)) {
                            res = res.replace(new RegExp('<' + s + p2 + '.' + key + s + '>', 'g'), item[key]);
                        }
                    }
                } else {
                    res = res.replace(new RegExp('<' + s + p2 + s + '>', 'g'), item);
                }

                return res;
            }).join('');
        });

        result = result.replace(new RegExp('<' + s + 'if (\\w+)' + s + '>(.*?)<' + s + 'endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            const m = data[p1];

            if (
                m === '' || m === false || m == undefined || m == null ||
                (Array.isArray(m) && !m.length)
            ) {
                return '';
            } else {
                return p2;
            }
        });

        result = result.replace(new RegExp('<' + s + '{2}if (\\w+)' + s + '>(.*?)<' + s + '{2}endif' + s + '>', 'gs'), function (match, p1, p2, offset, input) {
            const m = data[p1];

            if (
                m === '' || m === false || m == undefined || m == null ||
                (Array.isArray(m) && !m.length)
            ) {
                return '';
            } else {
                return p2;
            }
        });

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                result = result.replace(new RegExp('<' + s + key + s + '>', 'g'), data[key]);
            }
        }

        return result;
    }
})();