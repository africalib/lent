(function () {
  const name = "newBookPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "new",
            newBooks: {},
            paging: {},
            thisPage: 0,
          };
        },
        methods: {
          getNewBooklist: function (dataMxCnt, pageOffsetIdx) {
            let t = this;
            $("#newBookPage_pagingBox").find(".page-idx").removeClass("bg-5ecf5e");
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getNewBookList",
              data: {
                keyword: $("#newBookPage_kwd").val(),
                dataMxCnt: dataMxCnt,
                pageOffsetIdx: pageOffsetIdx,
              },
              success: function (res) {
                // console.log(res);
                // return;
                // console.log(JSON.parse(res));

                t.thisPage = pageOffsetIdx;

                objArr = JSON.parse(res);
                for (let i in objArr.bookList) {
                  let classNo = objArr.bookList[i].classNo;
                  objArr.bookList[i]["classNm"] = classNoToClassNm(classNo).classNm;
                }
                t.newBooks = objArr;

                let pageGroupOffset = Math.ceil((pageOffsetIdx + 1) / 10) - 1;
                t.paging = vue_paging(t.newBooks.totalBookCnt, 10, 10, pageGroupOffset);

                t.$nextTick(function () {
                  if (t.paging.pageCnt > 0) {
                    $("#newBookPage_pagingBox")
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
              $("#newBookPage_pagingBox").find(".page-idx").eq(0).click();
            });
          },
        },
        created: function () {
          const t = this;
        },
        mounted: function () {
          const t = this;
          t.getNewBooklist(10, 0);
        },
      });
    });
  });
})();
