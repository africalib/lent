(function () {
    const name = 'memberListPopup';

    Vue.component(name, function (resolve, reject) {
        $.get('components/' + name + '/index.html').done(function (tmpl) {
            resolve({
                template: tmpl,
                data: function () {
                    return {
						name: 'memberListPopup',
						memberList: []

                    }
                },
                methods: {
                    pickMember: function(seq){
						let t = this;
						let children = mainPage.$children;
						for(let key in children){
							if(children[key].name == 'libMngPage'){
								let children2 = children[key].$children;
								for(let key2 in children2){
									if(children2[key2].name == 'takeOutBook'){
										for(let i = 0; i < t.memberList.length; i++){
											if(t.memberList[i].mbrSeq == seq){
												children2[key2].memberInfo = t.memberList[i];
												break;
											}
										}
										break;
									}
								}
								break;
							}
						}
						t.$nextTick(function() {
							$('#takeOutBook_bookCde').focus();
						});
						mainPage.popup.name = null;
                    }
                },
                created: function () {
                    $(document.head).append('<link href="components/' + name + '/style.css' + '" rel="stylesheet" />')
                },
				mounted: function(){
					let t = this;
				}
            });
        });
    });
})();