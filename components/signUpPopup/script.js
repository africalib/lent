(function () {
  const name = "signUpPopup";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "signUpPopup",
          };
        },
        methods: {
          signUp: function () {
            let isRequiredCheck = true;
            $('[data-required="true"]').each(function () {
              if (!$(this).val()) {
                isRequiredCheck = false;
                return false;
              }
            });

            if (!isRequiredCheck) {
              alert("필수입력 항목을 확인해주세요.");
              return;
            }

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/members.php?act=signUpWithoutAccount",
              data: {
                name: $('#popup_signUp [name="mbrNm"]').val(),
                birth: $('#popup_signUp [name="mbrBirth"]').val(),
                gender: $('#popup_signUp [name="mbrGender"]:checked').val(),
                tel: $('#popup_signUp [name="mbrTel"]').val(),
                addr: $('#popup_signUp [name="mbrAddress"]').val(),
              },
              success: function (res) {
                res_trim = res.trim();
                if (res_trim) {
                  alert("가입이 완료되었습니다.\n회원번호: " + res_trim);
                } else {
                  alert("오류가 있습니다.");
                }
              },
              error: function (e) {
                alert(e);
              },
            });
          },
        },
        created: function () {
          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          let t = this;
        },
      });
    });
  });
})();
