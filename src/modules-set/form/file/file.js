; var CustomFile;

(function () {
    'use strict';

    //custom file
    CustomFile = {
        input: null,
        filesObj: {},
        filesArrayObj: {},
        filesIsReady: null,

        init: function () {
            document.addEventListener('change', (e) => {
                const elem = e.target.closest('input[type="file"]');

                if (!elem) return;

                this.input = elem;

                this.changeInput(elem);
            });

            document.addEventListener('click', (e) => {
                const delBtnElem = e.target.closest('.custom-file__del-btn'),
                    clearBtnElem = e.target.closest('.custom-file__clear-btn'),
                    inputElem = e.target.closest('input[type="file"]');

                if (inputElem && inputElem.multiple) inputElem.value = null;

                if (delBtnElem) {
                    this.input = delBtnElem.closest('.custom-file').querySelector('.custom-file__input');

                    this.input.value = null;

                    delBtnElem.closest('.custom-file__items').removeChild(delBtnElem.closest('.custom-file__item'));

                    this.setFilesObj(false, delBtnElem.getAttribute('data-ind'));

                    if (this.filesDeleted) this.filesDeleted(this.input);
                }

                if (clearBtnElem) {
                    const inputElem = clearBtnElem.closest('.custom-file').querySelector('.custom-file__input');

                    inputElem.value = null;

                    this.clear(inputElem);
                }
            });
        },

        clear: function (inpEl, resetVal) {
            if (inpEl.hasAttribute('data-preview-elem')) {
                document.querySelector(inpEl.getAttribute('data-preview-elem')).innerHTML = '';
            }

            const itemsEl = inpEl.closest('.custom-file').querySelector('.custom-file__items');

            if (itemsEl) {
                itemsEl.innerHTML = '';
            }

            if (resetVal !== false) inpEl.value = null;

            this.filesObj[inpEl.id] = {};
            this.filesArrayObj[inpEl.id] = [];

            this.labelText(inpEl);
        },

        fieldClass: function (inputElem) {
            const fieldElem = inputElem.closest('.custom-file');

            if (this.filesArrayObj[inputElem.id].length) {
                fieldElem.classList.add('custom-file_loaded');

                if (this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
                    fieldElem.classList.add('custom-file_max-loaded');
                } else {
                    fieldElem.classList.remove('custom-file_max-loaded');
                }
            } else {
                fieldElem.classList.remove('custom-file_loaded');
                fieldElem.classList.remove('custom-file_max-loaded');
            }
        },

        lockUpload: function (inputElem) {
            if (inputElem.classList.contains('custom-file__input_lock') && inputElem.multiple && inputElem.hasAttribute('data-max-files') && this.filesArrayObj[inputElem.id].length >= (+inputElem.getAttribute('data-max-files'))) {
                inputElem.setAttribute('disabled', 'disable');
            } else {
                inputElem.removeAttribute('disabled');
            }
        },

        labelText: function (inputElem) {
            const labTxtElem = inputElem.closest('.custom-file').querySelector('.custom-file__label-text');

            if (!labTxtElem || !labTxtElem.hasAttribute('data-label-text-2')) {
                return;
            }

            const maxFiles = (inputElem.multiple) ? (+this.input.getAttribute('data-max-files')) : 1;

            if (this.filesArrayObj[inputElem.id].length >= maxFiles) {
                if (!labTxtElem.hasAttribute('data-label-text')) {
                    labTxtElem.setAttribute('data-label-text', labTxtElem.innerHTML);
                }

                if (labTxtElem.getAttribute('data-label-text-2') == '%filename%') {
                    labTxtElem.innerHTML = inputElem.files[0].name;
                } else {
                    labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text-2');
                }

            } else if (labTxtElem.hasAttribute('data-label-text')) {
                labTxtElem.innerHTML = labTxtElem.getAttribute('data-label-text');
            }
        },

        loadPreview: function (file, fileItem) {
            var reader = new FileReader(),
                previewDiv;

            if (this.input.hasAttribute('data-preview-elem')) {
                previewDiv = document.querySelector(this.input.getAttribute('data-preview-elem'));
            } else {
                previewDiv = document.createElement('div');

                previewDiv.className = 'custom-file__preview';

                fileItem.insertBefore(previewDiv, fileItem.firstChild);
            }

            reader.onload = function (e) {
                setTimeout(function () {
                    var imgDiv = document.createElement('div');

                    imgDiv.innerHTML = (file.type.match(/image.*/)) ? '<img src="' + e.target.result + '">' : '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMzAwcHgiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDAgMzAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxyZWN0IGZpbGw9IiNCOEQ4RkYiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIi8+DQo8cG9seWdvbiBmaWxsPSIjN0M3QzdDIiBwb2ludHM9IjUxLDI2Ny42NjY5OTIyIDExMSwxOTcgMTUxLDI0My42NjY5OTIyIDI4OC4zMzMwMDc4LDEyMSAzMDAuMTY2OTkyMiwxMzQuMTY2NTAzOSAzMDAsMzAwIDAsMzAwIA0KCTAsMjA4LjgzMzk4NDQgIi8+DQo8cG9seWdvbiBmaWxsPSIjQUZBRkFGIiBwb2ludHM9IjAuMTI1LDI2Ny4xMjUgNDguODMzNDk2MSwxNzQuNjY2OTkyMiAxMDMuNSwyNjQuNSAyMDMuODc1LDY1LjMzMzAwNzggMzAwLjE2Njk5MjIsMjU0LjUgMzAwLDMwMCANCgkwLDMwMCAiLz4NCjxjaXJjbGUgZmlsbD0iI0VBRUFFQSIgY3g9Ijc3LjAwMDI0NDEiIGN5PSI3MSIgcj0iMzYuNjY2NzQ4Ii8+DQo8L3N2Zz4NCg==">';

                    previewDiv.appendChild(imgDiv);

                    previewDiv.classList.add('custom-file__preview_loaded');
                }, 121);
            }

            reader.readAsDataURL(file);
        },

        changeInput: function (elem) {
            var fileItems = elem.closest('.custom-file').querySelector('.custom-file__items');

            if (elem.getAttribute('data-action') == 'clear' || !elem.multiple) {
                this.clear(elem, false);
            }

            for (var i = 0; i < elem.files.length; i++) {
                var file = elem.files[i];

                if (this.filesObj[elem.id] && this.filesObj[elem.id][file.name] != undefined) continue;

                var fileItem = document.createElement('div');

                fileItem.className = 'custom-file__item';
                fileItem.innerHTML = '<div class="custom-file__name">' + file.name + '</div><button type="button" class="custom-file__del-btn" data-ind="' + file.name + '"></button>';

                if (fileItems) {
                    fileItems.appendChild(fileItem);
                }

                this.loadPreview(file, fileItem);
            }

            this.setFilesObj(elem.files);

            if (this.filesIsReady) {
                this.filesIsReady(elem);
            }
        },

        setFilesObj: function (filesList, objKey) {
            var inputElem = this.input;

            if (!inputElem.id.length) {
                inputElem.id = 'custom-file-input-' + new Date().valueOf();
            }

            if (filesList) {
                this.filesObj[inputElem.id] = this.filesObj[inputElem.id] || {};

                for (var i = 0; i < filesList.length; i++) {
                    this.filesObj[inputElem.id][filesList[i].name] = filesList[i];
                }
            } else {
                delete this.filesObj[inputElem.id][objKey];
            }

            this.filesArrayObj[inputElem.id] = [];

            for (var key in this.filesObj[inputElem.id]) {
                this.filesArrayObj[inputElem.id].push(this.filesObj[inputElem.id][key]);
            }

            this.fieldClass(inputElem);

            this.labelText(inputElem);

            this.lockUpload(inputElem);

            ValidateForm.file(inputElem, this.filesArrayObj[inputElem.id]);
        },

        inputFiles: function (inputElem) {
            return this.filesArrayObj[inputElem.id] || [];
        },

        getFiles: function (formElem) {
            var inputFileElements = formElem.querySelectorAll('.custom-file__input'),
                filesArr = [];

            if (inputFileElements.length == 1) {
                filesArr = this.filesArrayObj[inputFileElements[0].id];
            } else {
                for (var i = 0; i < inputFileElements.length; i++) {
                    if (this.filesArrayObj[inputFileElements[i].id]) {
                        filesArr.push({ name: inputFileElements[i].name, files: this.filesArrayObj[inputFileElements[i].id] });
                    }
                }
            }

            return filesArr;
        }
    };

    //init script
    document.addEventListener('DOMContentLoaded', function () {
        CustomFile.init();
    });
})();