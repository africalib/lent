(function () {
  const name = "mngBook";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            listType: "all",
            books: {},
            paging: {},
          };
        },
        methods: {
          getBookList: function (dataMxCnt, pageOffsetIdx) {
            let t = this;
            let srchType = $("#mngBook_srchType").val();
            let bookKwd = $("#mngBook_bookKwd").val();
            $("#mngBook_pagingBox").find(".page-idx").removeClass("bg-5ecf5e");

            if (srchType == "book_cde" && (bookKwd.indexOf("뜨") != -1 || bookKwd.indexOf("드") != -1)) {
              bookKwd = bookKwd.replace(/뜨/gi, "EM");
              bookKwd = bookKwd.replace(/드/gi, "EM");
              $("#mngBook_bookKwd").val(bookKwd);
            }

            bookKwd = bookKwd.replace(/ /gi, "");

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/books.php?act=getBookListFromMngBook",
              data: {
                srchType: srchType,
                bookKwd: bookKwd,
                dataMxCnt: dataMxCnt,
                pageOffsetIdx: pageOffsetIdx,
                filter: t.listType,
              },
              success: function (res) {
                // console.log(res);
                // console.log(JSON.parse(res));
                // return;

                t.books = JSON.parse(res);

                let pageGroupOffset = Math.ceil((pageOffsetIdx + 1) / 10) - 1;
                t.paging = vue_paging(t.books.totalBookCnt, 5, 10, pageGroupOffset);

                t.$nextTick(function () {
                  if (t.paging.pageCnt > 0) {
                    $("#mngBook_pagingBox")
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
              $("#mngBook_pagingBox").find(".page-idx").eq(0).click();
            });
          },

          getBookInfo: function (idx) {
            let t = this;
            let children = mainPage.$children;
            setTimeout(function () {
              //바꿀것...
              for (let key in children) {
                if (children[key].name == "editBookPopup") {
                  $.ajax({
                    type: "POST",
                    url: "http://jesusville.or.kr/lib/api/books.php?act=getRentHistoryByBookCde",
                    data: {
                      bookCde: t.books.bookList[idx].bookCde,
                      listType: "all",
                    },
                    success: function (res) {
                      // console.log(res);
                      // return;
                      // console.log(JSON.parse(res));
                      children[key].bookInfo = t.books.bookList[idx];
                      children[key].bookCde = t.books.bookList[idx].bookCde;
                      children[key].memberList = JSON.parse(res);

                      // console.log(children[key].bookInfo);
                    },
                  });
                  break;
                }
              }
            }, 50);

            mainPage.popup.name = "editBook";
            mainPage.popup.title = "도서정보수정";
            mainPage.popup.width = 700;
          },
        },
        created: function () {
          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          $("#mngBook_bookKwd").focus();
        },
      });
    });
  });
})();
