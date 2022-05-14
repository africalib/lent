(function () {
  const name = "mngMember";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            memberRange: "y",
            listType: "all",
            memberList: [],
          };
        },
        methods: {
          searchMember: function () {
            let t = this;

            if (t.memberRange == "n") {
              t.listType = "all";
            }
            //멤버에 따른 리스트 변경
            // t.memberRange = $('#memberRange').val();

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/members.php?act=getMemberList",
              data: {
                sort: $('#mbrSrchSection [name="sort"]').val(),
                srchType: $('#mbrSrchSection [name="srchType"]').val(),
                srchWrd: $('#mbrSrchSection [name="srchWrd"]').val(),
                listType: t.listType,
              },
              success: function (res) {
                // console.log(res);
                // return;
                // console.log(JSON.parse(res));
                t.memberList = JSON.parse(res);
              },
            });
          },

          approveMember: function (seq) {
            let t = this;
            if (confirm("가입을 승인하시겠습니까?")) {
              $.ajax({
                type: "POST",
                url: "http://jesusville.or.kr/lib/api/members.php?act=approveMember",
                data: {
                  mbrSeq: seq,
                },
                success: function (res) {
                  if (res == 1) {
                    alert("정상처리 되었습니다.");
                    t.searchMember();
                  }
                },
              });
            }
          },

          getMemberInfo: function (mbrSeq) {
            let t = this;

            mainPage.popup.name = "memberInfo";
            mainPage.popup.title = "회원정보";
            mainPage.popup.width = 700;

            let children = mainPage.$children;
            setTimeout(function () {
              //바꿀것...
              for (let key in children) {
                if (children[key].name == "memberInfoPopup") {
                  for (let i in t.memberList) {
                    if (t.memberList[i].mbrSeq == mbrSeq) {
                      $.ajax({
                        type: "POST",
                        url: "http://jesusville.or.kr/lib/api/books.php?act=getRentHistoryByMbrCde",
                        data: {
                          mbrCde: t.memberList[i].mbrCde,
                          listType: "all",
                        },
                        success: function (res) {
                          // console.log(res);
                          // return;
                          children[key].memberInfo = t.memberList[i];
                          children[key].rentBookList = JSON.parse(res);
                        },
                      });
                      break;
                    }
                  }
                  break;
                }
              }
            }, 50);
          },

          deleteMember: function (target) {
            let t = this;
            let isAnyChk = false;

            $("#mngMember_memberList")
              .find('[name="chkMbrSeq"]:visible')
              .each(function () {
                if ($(this).is(":checked")) {
                  isAnyChk = true;
                  return false;
                }
              });

            if (!isAnyChk) {
              alert("아무도 선택되지 않았습니다.");
              return;
            }

            let seq = [];

            if (!target) {
              $("#mngMember_memberList")
                .find('[name="chkMbrSeq"]:visible:checked')
                .each(function () {
                  seq.push($(this).val());
                });
            } else {
              seq = target;
            }

            if (confirm("탈퇴처리를 진행하시겠습니까?")) {
              $.ajax({
                type: "POST",
                url: "http://jesusville.or.kr/lib/api/members.php?act=deleteMember",
                data: {
                  mbrSeq: seq,
                },
                success: function (res) {
                  // console.log(res);
                  // return;
                  if (res == 1) {
                    alert("정상처리 되었습니다.");
                    t.searchMember();
                  } else {
                    alert("관리자에게 문의해 주세요.");
                  }
                },
              });
            }
          },
        },
        created: function () {
          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          let t = this;
          // mainPage.controlHeight($('#mngMember_memberList'), -27);
          $("#mngMember_srchWrd").focus();
          controlHeight($("#mngMember_memberList"), -27);
          t.searchMember();
        },
      });
    });
  });
})();
