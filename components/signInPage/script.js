(function () {
  const name = "signInPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {};
        },
        methods: {
          signIn: function () {
            let t = this;
            let id = $("#signIn_id").val();
            let password = $("#signIn_pw").val();

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/members.php?act=signIn",
              data: {
                id: id,
                password: password,
              },
              success: function (res) {
                // console.log(res);
                // return;
                let objRes = JSON.parse(res);
                if (objRes.length) {
                  mainPage.userInfo = objRes[0];
                  mainPage.viewPage = "home";

                  if (mainPage.userInfo.approvalYn == "y") {
                    alert("로그인되었습니다.");
                  } else {
                    alert("로그인 되었습니다.\n*가입미승인");
                  }
                } else {
                  alert("잘못된 접근입니다.");
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
          $("#signIn_id").focus();
        },
      });
    });
  });
})();
