(function () {
  const name = "suggestListPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "suggestList",
            boardList: {},
            paging: {},
          };
        },
        methods: {
          writtenManager: function (mode, seq, title, content, regId) {
            if (mode === "new" && !mainPage.userInfo.mbrId) {
              alert("로그인이 필요합니다.");
              return;
            }
            let t = this;
            mainPage.headToPage("suggest-page");
            mainPage.requestMode = regId == mainPage.userInfo.mbrId ? "edit" : mode;

            t.$nextTick(function () {
              if (mode != "new") {
                findChildren();
                function findChildren() {
                  let children = vue_findChildren(mainPage.$children, "suggestPage", false);
                  if (!children) {
                    setTimeout(function () {
                      findChildren();
                    }, 100);
                  } else {
                    children.boardInfo.title = title;
                    children.boardInfo.content = content;
                    children.boardInfo.seq = seq;
                  }
                }

                // let children = vue_findChildren(mainPage.$children, 'suggestPage');
                // children.boardInfo.title = title;
                // children.boardInfo.content = content;
                // children.boardInfo.seq = seq;
              }
            });
          },
          getBoardList: function (dataMxCnt, pageOffsetIdx) {
            let t = this;
            $("#" + name + "_pagingBox")
              .find(".page-idx")
              .removeClass("bg-5ecf5e");
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=getBoardList",
              data: {
                boardCde: "130",
                keyword: $("#" + name + "_kwd").val(),
                dataMxCnt: dataMxCnt,
                pageOffsetIdx: pageOffsetIdx,
                // dataMxCnt: 5,
                // pageOffsetIdx: 0
              },
              success: function (res) {
                // console.log(res);
                // return;
                // console.log(JSON.parse(res));
                t.boardList = JSON.parse(res);
                t.boardList.offset = pageOffsetIdx;

                let pageGroupOffset = Math.ceil((pageOffsetIdx + 1) / 10) - 1;
                t.paging = vue_paging(JSON.parse(res).totalBoardCnt, 10, 10, pageGroupOffset);

                t.$nextTick(function () {
                  if (t.paging.pageCnt > 0) {
                    $("#" + name + "_pagingBox")
                      .find(".page-idx")
                      .each(function (idx) {
                        if ($(this).html() == pageOffsetIdx + 1) {
                          $(this).addClass("bg-5ecf5e");
                        }
                      });
                  }
                });
              },
            });
          },
          changePageGroup: function (adjustNum) {
            let t = this;

            if (t.paging.pageGroupOffset + adjustNum == t.paging.pageGroupCnt || t.paging.pageGroupOffset + adjustNum < 0) {
              return;
            }

            t.paging.pageGroupOffset += adjustNum;

            t.$nextTick(function () {
              $("#" + name + "_pagingBox")
                .find(".page-idx")
                .eq(0)
                .click();
            });
          },
        },
        created: function () {
          let t = this;
        },
        mounted: function () {
          let t = this;
          t.getBoardList(10, 0);
        },
      });
    });
  });
})();
