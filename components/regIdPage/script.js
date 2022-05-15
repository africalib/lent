(function () {
  const name = "regIdPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            dataObj: {},
            view_accountSection: false,
            readOnly: false,
          };
        },
        methods: {
          checkMember() {
            let t = this;
            let param = {};
            $("#regIdPage_checkSection")
              .find("[name]")
              .each(function () {
                if ($(this).val()) {
                  param[$(this).attr("name")] = $(this).val();
                } else {
                  param = {};
                  return false;
                }
              });
            if (!Object.keys(param).length) {
              alert("입력값이 누락되었습니다.");
              return;
            }

            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/members.php?act=checkNullId",
              data: param,
              success: function (res) {
                if (JSON.parse(res).length === 1) {
                  alert("인증되었습니다. 아래 항목을 기입해주세요.");
                  t.readOnly = true;
                  t.dataObj = param;
                  t.view_accountSection = true;
                } else {
                  alert("정상적인 접근이 아닙니다.");
                }
              },
            });
          },

          regId: function () {
            let t = this;
            if (false) {
              alert("아이디 중복체크를 실시해주세요.");
              return;
            }
            if ($("#regIdPage_pw").val() !== $("#regIdPage_pw2").val()) {
              alert("비밀번호를 확인해주세요.");
              return;
            }

            let paramData = {};
            $("#regIdPage_accoutSection [name]").each(function (idx, itm) {
              paramData[$(itm).attr("name")] = $(itm).val();

              if (!$(itm).val()) {
                paramData = {};
                return false;
              }
            });

            if (!Object.keys(paramData).length) {
              alert("입력이 안된 부분이 있습니다.");
              return;
            }

            t.dataObj["mbrId"] = $("#regIdPage_id").val();
            t.dataObj["mbrPw"] = $("#regIdPage_pw").val();

            console.log(t.dataObj);

            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/members.php?act=regId",
              data: t.dataObj,
              success: function (res) {
                console.log(res);
                if (res == 1) {
                  alert("ID가 등록되었습니다.");
                  mainPage.viewPage = "main";
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
      });
    });
  });
})();
