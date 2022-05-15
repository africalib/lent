(function () {
  const name = "returnOfBook";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "returnOfBook",
            bookCode: "",
            bookInfo: { bookCde: "" },
            memberInfo: {},
            editReturnDate: false,
          };
        },
        methods: {
          getBookInfo: function (target) {
            let t = this;
            let bookCde = $(target.currentTarget).val();

            if (bookCde.indexOf("뜨") != -1 || bookCde.indexOf("드") != -1) {
              bookCde = bookCde.replace(/드/gi, "EM");
              bookCde = bookCde.replace(/뜨/gi, "EM");
              $(target.currentTarget).val(bookCde);
            }

            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getRentBookInfo",
              data: {
                bookCde: bookCde,
              },
              success: function (res) {
                // console.log(res);
                // return;
                if (JSON.parse(res).length > 0) {
                  t.bookInfo = JSON.parse(res)[0];
                  $.ajax({
                    type: "POST",
                    url: "https://jesusvillech.cafe24.com/lib/api/members.php?act=getMemberInfo",
                    data: {
                      mbrCde: t.bookInfo.mbrCde,
                    },
                    success: function (res2) {
                      // console.log(res2);
                      // return;
                      t.memberInfo = JSON.parse(res2)[0];

                      t.$nextTick(function () {
                        $("#returnBtn").focus();
                      });
                    },
                  });
                } else {
                  alert("검색 결과가 없습니다.");
                }
              },
            });
          },

          returnBook: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=returnBook",
              data: {
                rentSeq: t.bookInfo.rentSeq,
              },
              success: function (res) {
                // console.log(res);
                // return;
                if (res == 1) {
                  if (t.bookInfo.today > t.bookInfo.returnDt) {
                    $.ajax({
                      type: "POST",
                      url: "https://jesusvillech.cafe24.com/lib/api/members.php?act=increaseOverdueCnt",
                      data: { mbrCde: t.memberInfo.mbrCde },
                      success: function (res) {
                        // console.log(res);
                        // return;
                        if (res == 1) {
                          $.ajax({
                            type: "POST",
                            url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=updateOverdue",
                            data: { rentHistorySeq: t.bookInfo.rentSeq },
                            success: function (res) {
                              alert("반납되었습니다.");
                              t.memberInfo = {};
                              t.bookInfo = { bookCde: "" };
                              $("#returnOfBook_bookCde").select();
                            },
                          });
                        }
                      },
                    });
                  } else {
                    alert("반납되었습니다.");
                    t.memberInfo = {};
                    t.bookInfo = { bookCde: "" };
                  }
                }
              },
            });
          },

          adjustReturnDate: function () {
            let t = this;
            if (t.bookInfo.returnDt == $("#returnOfBook_returnDate").val()) {
              alert("바뀐게 없습니다.");
              return;
            }
            // console.log(t.bookInfo);
            // return;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=adjustReturnDate",
              data: {
                rentSeq: t.bookInfo.rentSeq,
                returnDate: $("#returnOfBook_returnDate").val(),
              },
              success: function (res) {
                // console.log(res);
                // return;
                if (Number(res) == 1) {
                  alert("반납기간이 수정되었습니다.");
                  t.bookInfo.returnDt = $("#returnOfBook_returnDate").val();
                  t.editReturnDate = false;
                }
              },
            });
          },
        },
        created: function () {
          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          $("#returnOfBook_bookCde").focus();
        },
      });
    });
  });
})();
