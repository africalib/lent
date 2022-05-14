(function () {
    const name = 'libMngPage';

    Vue.component(name, function (resolve, reject) {
        $.get('components/' + name + '/index.html').done(function (tmpl) {
            resolve({
                template: tmpl,
                data: function () {
                    return {
						name: 'libMngPage',
                        // mngViewPage: mainPage.version === 'pc' ? 'regBook' : 'memberMng',
                        mngViewPage: 'regBook'
                    }
                },
                methods: {
                    // controlHeight($target, adjustMargin){
                    //     let t = this;
                    //     let window_h = window.innerHeight;
                    //     console.log(window_h);
                    //     let targetOffset_top = $target.offset().top;
                    //     let calcedHeight = window_h - targetOffset_top + (adjustMargin === undefined ? 0 : adjustMargin);
                    //     $target.height(calcedHeight);
                    // }
                },
                created: function () {
                    let t = this;
                    $(document.head).append('<link href="components/' + name + '/style.css' + '" rel="stylesheet" />');
                },
                mounted: function(){
                    let t = this;
                    mainPage.controlHeight($('#mngPageView'), -17);    /* 원래 -20인데... */
                }
            });
        });
    });
})();