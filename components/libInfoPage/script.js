(function () {
    const name = 'libInfoPage';

    Vue.component(name, function (resolve, reject) {
        $.get('components/' + name + '/index.html').done(function (tmpl) {
            resolve({
                template: tmpl,
                data: function () {
                    return {
                        name: 'search'
                    }
                },
                methods: {

                },
                created: function () {
                    var t = this;
                }
            });
        });
    });
})();