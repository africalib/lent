(function () {
  const name = "requestBookPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "request",
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
            const t = this;
            if (confirm("정말로 삭제하시겠습니까?")) {
              $.ajax({
                type: "POST",
                url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=deleteBoard",
                data: {
                  boardCde: "110",
                  seq: t.boardInfo.seq,
                },
                success: function (res) {
                  console.log(res);
                  if (res == 1) {
                    alert("삭제되었습니다.");
                    mainPage.viewPage = "request-book-list-page";
                  }
                },
              });
            }
          },
          edit_board: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=editBoard",
              data: {
                boardCde: "110",
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
          reg_board: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=regBoard",
              data: {
                id: mainPage.userInfo.mbrId,
                boardCde: "110",
                title: $("#" + name + "_title").val(),
                content: $("#summernote").summernote("code"),
              },
              success: function (res) {
                alert("등록되었습니다.");
                t.mode = "view";
                if (t.mode == "view") $("#summernote").summernote("disable");
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
                boardCde: "110",
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

          if (t.mode == "view" || t.mode == "edit") {
            t.summerNoteOnOff(false);
          } else {
            $("#summernote").summernote("code", "아래 양식을 작성해주세요.<hr>도서명:<br>저자: <br>출판사: <br>비고:");
          }
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
