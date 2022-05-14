(function () {
  const name = "signUpPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            idToReg: "",
          };
        },
        methods: {
          signUp: function () {
            let t = this;
            let id = $("#signUpId").val();

            if (id !== t.idToReg) {
              alert("아이디 중복체크를 실시해주세요.");
              return;
            }

            if ($("#signUpPw").val().length < 4) {
              alert("비밀번호는 4자 이상입니다.");
              return;
            }

            if ($("#signUpPw").val() !== $("#signUpPw2").val()) {
              alert("비밀번호를 확인해주세요.");
              return;
            }
            let isNull = false;
            let paramData = {};
            $("#inputField [name]").each(function (idx, itm) {
              if ($(itm).attr("name") === "gender") {
                if ($(itm).prop("checked")) {
                  paramData[$(itm).attr("name")] = $(itm).val();
                }
              } else {
                paramData[$(itm).attr("name")] = $(itm).val();
              }
              if (!$(itm).val()) {
                isNull = true;
                return false;
              }
            });

            if (isNull) {
              alert("입력이 안된 부분이 있습니다.");
              return;
            }

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/members.php?act=chkDuplId",
              data: { id: id },
              success: function (res) {
                let objRes = JSON.parse(res);
                if (objRes.length) {
                  alert("간발의 차이로 누군가가 아이디를 먼저 등록했네요...\n 다른 아이디를 입력해주세요.");
                  t.idToReg = "";
                } else {
                  $.ajax({
                    type: "POST",
                    url: "http://jesusville.or.kr/lib/api/members.php?act=signUp",
                    data: paramData,
                    success: function (res) {
                      if (res) {
                        alert("가입이 완료되었습니다.");
                        t.idToReg = "";
                        mainPage.viewPage = "main";
                      }
                    },
                    error: function (e) {
                      alert(e);
                    },
                  });
                }
              },
              error: function (e) {
                alert(e);
              },
            });

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/members.php?act=signUp",
              data: paramData,
              success: function (res) {
                if (res) {
                  alert("가입이 완료되었습니다.");
                  mainPage.viewPage = "main";
                }
              },
              error: function (e) {
                alert(e);
              },
            });
          },

          chkDupl: function () {
            let t = this;
            let id = $("#signUpId").val();
            let validChk = chkValid(id, {
              ko: false,
              spc: false,
              mnLen: 4,
              mxLen: 12,
            });

            console.log(validChk);

            if (!validChk.boolean) {
              switch (validChk.invalidName) {
                case "ko":
                  alert("한글은 입력할 수 없습니다.");
                  break;
                case "spc":
                  alert("특수문자는 입력할 수 없습니다.");
                  break;
                case "mxLen":
                  alert("12자를 초과할 수 없습니다.");
                  break;
                case "mnLen":
                  alert("4자 이상을 입력해주세요.");
                  break;
              }

              return;
            }

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/members.php?act=chkDuplId",
              data: { id: id },
              success: function (res) {
                let objRes = JSON.parse(res);
                if (objRes.length) {
                  alert("이미 사용중인 아이디입니다.");
                  t.idToReg = "";
                } else {
                  alert("사용할 수 있는 아이디입니다.");
                  t.idToReg = id;
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
