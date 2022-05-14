(function () {
  const name = "editBookPopup";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "editBookPopup",
            bookInfo: {
              isbn2: "",
              serieseTitle: "",
              title: "",
              authorInfo: "",
              pubInfo: "",
              pubYearInfo: "",
              claimNo: "",
              classNo: "",
              authorCde: "",
              bookCde: "",
              copyNo: "",
              withThings: "",
              bookSts: "",
              today: "",
              libRentBookReturnDt: "",
            },
            bookCde: "",
            isEdit: false,
            memberList: [],
            listType: "all",
            // originalData: {
            // bookInfo: {},
            // bookCde: '',
            // memberList: []
            // },
            isOpenFrom: "everyWhere",
          };
        },
        methods: {
          deleteBook: function () {
            let t = this;
            if (t.bookInfo.returnDt) {
              alert("대여중인 책은 삭제할 수 없습니다.");
              return;
            }

            if (confirm("정말로 삭제하시겠습니까?")) {
              // if(true){
              $.ajax({
                type: "POST",
                url: "http://jesusville.or.kr/lib/api/books.php?act=deleteBook",
                data: { bookCde: t.bookCde },
                success: function (res) {
                  // console.log(res);
                  // return;
                  if (res == 1) {
                    alert("삭제 되었습니다.");
                    mainPage.popup.name = null;
                  }
                },
              });
            }
          },
          editBook: function () {
            let t = this;
            if (t.bookInfo.returnDt) {
              alert("대여중인 책은 수정할 수 없습니다.");
              return;
            }

            data = t.bookInfo;
            data.originalBookCde = t.bookCde;

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/books.php?act=editBookInfo",
              data: data,
              success: function (res) {
                // console.log(res);
                // return;
                if (res == 1) {
                  alert("수정되었습니다.");
                  t.isEdit = false;
                  if (t.isOpenFrom == "regBook") {
                    let children = mainPage.$children;
                    setTimeout(function () {
                      //바꿀것...
                      for (let key in children) {
                        if (children[key].name == "libMngPage") {
                          let children2 = children[key].$children;
                          for (let key2 in children2) {
                            if (children2[key2].name == "regBook") {
                              children2[key2].getBooksWithoutAuthorCde();
                              break;
                            }
                          }
                          break;
                        }
                      }
                    }, 50);
                  }
                }
              },
            });
          },

          getMemberListByType: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/books.php?act=getRentHistoryByBookCde",
              data: {
                bookCde: t.bookCde,
                listType: t.listType,
                test: "test",
              },
              success: function (res) {
                // console.log(res);
                // return;
                // console.log(JSON.parse(res));
                t.memberList = JSON.parse(res);

                // console.log(t.memberList);
              },
            });
          },
        },
        created: function () {
          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          let t = this;
        },
      });
    });
  });
})();
