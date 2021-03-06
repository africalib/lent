(function () {
  const name = "talentSharingPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "talentSharingList",
            mode: "view",
            editable: false,
            boardInfo: {
              seq: "",
              title: "",
              content: "",
              coments: [],
            },
          };
        },
        methods: {
          delete_board: function () {
            let t = this;
            if (confirm("정말로 삭제하시겠습니까?")) {
              $.ajax({
                type: "POST",
                url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=deleteBoard",
                data: {
                  boardCde: "150",
                  seq: t.boardInfo.seq,
                },
                success: function (res) {
                  console.log(res);
                  if (res == 1) {
                    alert("삭제되었습니다.");
                    mainPage.viewPage = "notice-list-page";
                  }
                },
              });
            }
          },
          reg_board: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=regBoard",
              data: {
                id: mainPage.userInfo.mbrId,
                boardCde: "150",
                title: $("#" + name + "_title").val(),
                content: $("#summernote").summernote("code"),
              },
              success: function (res) {
                t.mode = "view";
                if (t.mode == "view") $("#summernote").summernote("disable");
              },
            });
          },
          edit_board: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=editBoard",
              data: {
                boardCde: "150",
                seq: t.boardInfo.seq,
                title: $("#" + name + "_title").val(),
                content: $("#summernote").summernote("code"),
              },
              success: function (res) {
                if (res == 1) {
                  alert("수정되었습니다.");
                  t.mode = "edit";
                  t.editable = false;
                  t.summerNoteOnOff(false);
                }
              },
            });
          },
          summerNoteOnOff: function (onOff) {
            //true: on, false: off
            if (onOff) {
              $("#summernote").summernote("enable");
            } else {
              $("#summernote").summernote("disable");
            }
          },

          getComentList: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=getComentList",
              data: {
                seq: t.boardInfo.seq,
                boardCde: "150",
              },
              success: function (res) {
                let coments = [];
                let tmpObj = {};
                for (let i in JSON.parse(res)) {
                  let itm = JSON.parse(res)[i];
                  if (itm.refSeq == 0) {
                    coments.push(itm);
                    tmpObj[itm.comentSeq] = 1;
                  } else {
                    let thisIdx = coments.findIndex((obj) => obj.comentSeq == itm.refSeq);
                    coments.splice(thisIdx + tmpObj[itm.refSeq]++, 0, itm);
                    tmpObj[itm.comentSeq] = 1;
                  }
                }

                t.boardInfo.coments = coments;
              },
            });
          },
          regComent: function () {
            if (!mainPage.userInfo.mbrId) {
              alert("로그인이 필요합니다.");
              return;
            }

            let t = this;

            let coment = $("#" + name + "_coment").val();
            if (!coment) {
              alert("댓글을 입력해주세요");
              $("#" + name + "_coment").focus();
              return;
            }

            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=regComent",
              data: {
                id: mainPage.userInfo.mbrId,
                boardCde: "150",
                seq: t.boardInfo.seq,
                content: coment,
              },
              success: function (res) {
                if (res == 1) {
                  alert("댓글이 등록되었습니다.");
                  t.getComentList();
                }
              },
            });
          },
          deleteComent: function (seq) {
            console.log(seq);
          },
          test: function () {
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/sms.php?act=overdueChk",
              success: function (res) {
                console.log(res);
              },
            });
          },
        },
        created: function () {
          var t = this;
          t.mode = mainPage.requestMode;
        },
        mounted: function () {
          let t = this;
          $("#summernote").summernote({
            resize: false,
            disableResize: true,
            disableResizeEditor: true,
          });

          if (t.mode == "view" || t.mode == "edit") t.summerNoteOnOff(false);
          t.$nextTick(function () {
            setTimeout(function () {
              if (t.boardInfo.seq) {
                if (t.boardInfo.content) $(".note-editable").html(t.boardInfo.content);
                t.getComentList();
              }
            }, 50);
          });
        },
      });
    });
  });
})();
