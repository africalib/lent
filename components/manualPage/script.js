(function () {
    const name = 'manualPage';

    Vue.component(name, function (resolve, reject) {
        $.get('components/' + name + '/index.html').done(function (tmpl) {
            resolve({
                template: tmpl,
                data: function () {
                    return {
                        name: 'manual'
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