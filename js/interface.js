// submit form
try {
    Form.onSubmit(function (form, callback) {
        console.log('submit');
        switch (form.id) {
            case 'form-no-ajax':
            case 'search-form':
                return true;

            case 'custom-form-2':
            case 'custom-form-3':
            case 'custom-form-4':
                var files = CustomFile.getFiles(form);

                console.log(files);

            default:
                ajax({
                    url: form.action,
                    send: new FormData(form),
                    success: function (response) {
                        let res = {};

                        try {
                            res = JSON.parse(response);
                        } catch (error) {
                            console.log(error);
                        }

                        if (res.status == 'sent') {

                            Popup.message('Форма отправлена');
                            // ValidateForm.customErrorTip(input, errorTxt, isLockForm);
                            // ValidateForm.customFormErrorTip(formElem, errorTxt);
                            // Popup.message('Форма отправлена');
                            // Popup.message('Форма отправлена', '#message-popup', function() {});

                            callback({ clearForm: true, unlockSubmitButton: true });
                        } else {
                            console.log(response);
                        }
                    },
                    error: function (response) {
                        console.log(response);
                        callback({ clearForm: false, unlockSubmitButton: true });
                    }
                });
        }
    });

    new SPA().route('', function (params, cb) {
        cb({
            page: 'it is Firts page',
            template: 'head-tpl',
            container: 'head'
        });

        cb({
            title: 'First page',
            text: 'This is first page. Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cupiditate saepe nemo aspernatur, voluptates tempore maxime itaque voluptatem in magni incidunt modi tempora esse, aperiam, ipsa harum reprehenderit odio. Laudantium.',
            template: 'home-page-content-tpl',
            container: 'content'
        });

    }).route('#home-page', function (params, cb) {
        cb({
            page: 'it is Home page',
            template: 'head-tpl',
            container: 'head'
        });

        cb({
            title: 'Home page',
            text: 'This is home page. Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cupiditate saepe nemo aspernatur, voluptates tempore maxime itaque voluptatem in magni incidunt modi tempora esse, aperiam, ipsa harum reprehenderit odio. Laudantium.',
            template: 'home-page-content-tpl',
            container: 'content'
        });

    }).route('#about-page$', function (params, cb) {
        cb({
            page: 'it is About page',
            template: 'head-tpl',
            container: 'head'
        });

        cb({
            title: 'About page',
            text: 'This is about page. Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cupiditate saepe nemo aspernatur, voluptates tempore maxime itaque voluptatem in magni incidunt modi tempora esse, aperiam, ipsa harum reprehenderit odio. Laudantium.',
            desc: 'Description',
            list: [
                { id: 21, name: 'priv' },
                { id: 22, name: 'priv2' },
                { id: 23, name: 'priv2 3' },
                'string1',
                'string2',
            ],
            template: 'home-page-content-tpl',
            container: 'content'
        });

    }).route('#about-page/(.+)', function (params, cb) {
        console.log(params[1]);
        cb({
            page: 'it is About page 2',
            template: 'head-tpl',
            container: 'head'
        });

        cb({
            title: 'About page',
            text: 'This is about page. Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cupiditate saepe nemo aspernatur, voluptates tempore maxime itaque voluptatem in magni incidunt modi tempora esse, aperiam, ipsa harum reprehenderit odio. Laudantium.',
            template: 'home-page-content-tpl',
            container: 'content'
        });

    }).route('#about-page/team', function (params, cb) {
        cb({
            page: 'it is About Team page',
            template: 'head-tpl',
            container: 'head'
        });

        cb({
            title: 'About Team page',
            text: 'This is about page. Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cupiditate saepe nemo aspernatur, voluptates tempore maxime itaque voluptatem in magni incidunt modi tempora esse, aperiam, ipsa harum reprehenderit odio. Laudantium.',
            template: 'home-page-content-tpl',
            container: 'content'
        });

    }).route('#form-page', function (params, cb) {
        cb({
            page: 'Form page',
            template: 'head-tpl',
            container: 'head'
        });

        cb({
            title: 'Form page',
            template: 'form-page-content-tpl',
            container: 'content'
        }, function () {
            Form.init('.form');
        });
    });

} catch (error) {
    console.log(error);
}