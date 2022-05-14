(function () {
  const name = "goodsSharingPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "goodsSharing",
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
                url: "http://jesusville.or.kr/lib/api/etc.php?act=deleteBoard",
                data: {
                  boardCde: "140",
                  seq: t.boardInfo.seq,
                },
                success: function (res) {
                  console.log(res);
                  if (res == 1) {
                    alert("삭제되었습니다.");
                    mainPage.viewPage = "goods-sharing-list-page";
                  }
                },
              });
            }
          },
          reg_board: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/etc.php?act=regBoard",
              data: {
                id: mainPage.userInfo.mbrId,
                boardCde: "140",
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
              url: "http://jesusville.or.kr/lib/api/etc.php?act=editBoard",
              data: {
                boardCde: "140",
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
              url: "http://jesusville.or.kr/lib/api/etc.php?act=getComentList",
              data: {
                seq: t.boardInfo.seq,
                boardCde: "140",
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
              url: "http://jesusville.or.kr/lib/api/etc.php?act=regComent",
              data: {
                id: mainPage.userInfo.mbrId,
                boardCde: "140",
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
              url: "http://jesusville.or.kr/lib/api/sms.php?act=overdueChk",
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

          if (t.mode == "view" || t.mode == "edit") {
            t.summerNoteOnOff(false);
          } else {
            $("#summernote").summernote(
              "code",
              `물품나눔터는 그루터기작은도서관을 통해서 여러분들이 갖고 있지만<br/>
						사용하지 않고 있는 물품을 주변의 다음세대 및 이웃과 나누기 위한 공간입니다.<br/>
						물품 나눔 게시판 양식입니다.<hr/>
						
						이름: <br/>
						주소: <br/>
						연락처: <br/>
						물품명: <br/>
						물품 수량: <br/>
						나눔 방법: 
						<label class="way-to-share mg-r10 pointer">
							<input type="radio" name="way">
							<span>직접 가져옴</span>
						</label>
						<label class="way-to-share mg-r10 pointer">
							<input type="radio" name="way">
							<span>택배</span>
						</label>
						<label class="way-to-share pointer">
							<input type="radio" name="way">
							<span>가지러 와야 함</span>
						</label>
						`
            );

            $(".way-to-share").click(function () {
              $(this).find("input").attr("checked", "true");
              console.log(111);
            });
          }

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
