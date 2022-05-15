(function () {
  const name = "printCallNo";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "printCallNo",
            typingIsbn: "",
            isbn: "",
            bookInfo: {
              authorCode: "",
              bookCde: "",
              isbn: "",
              bookSts: "rent",
              // seriesTitle: '',
              // seriesNo: '',
            },
            BooksWithoutAuthorCde: [],
          };
        },
        methods: {
          getBookList: function () {
            let t = this;

            let srchType = $("#printCallNo_srchType").val();
            let booKwd = $("#printCallNo_bookKwd").val();

            if (booKwd === "") {
              alert("검색어를 입력해주세요.");
              return;
            }

            if (srchType == "book_cde" && booKwd.indexOf("뜨") != -1) {
              booKwd = booKwd.replace(/뜨/gi, "EM");
              $("#mngBook_bookKwd").val(booKwd);
            }

            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getBookListFromPrintCallNo",
              data: {
                srchType: srchType,
                bookKwd: booKwd,
              },
              success: function (res) {
                console.log(res);
                // console.log(JSON.parse(res));
                // return;

                t.books = JSON.parse(res);

                setTimeout(function () {}, 50);

                mainPage.popup.name = "bookListFromPrintCallNo";
                mainPage.popup.title = "도서리스트";
                mainPage.popup.width = 700;
              },
            });
          },

          getAuthorCode: function () {
            let t = this;
            let authorCde = "";
            let seriesTitle = $("#regBook_seriesTitle").val().replace(/ /gi, "");
            let author = $("#regBook_author").val().replace(/ /gi, "");
            let title = $("#regBook_title").val();
            if (!title) {
              alert("서명을 확인해주세요.");
              $("#regBook_title").addClass("border-red").focus();
              return;
            }
            if (seriesTitle) {
              switch (langageIs(seriesTitle.substr(0, 2))) {
                case "eng":
                  // alert('준비중입니다.');
                  alert("총서명의 앞의 두글자를 바꿔주세요.\n'한글'로...");
                  $("#regBook_seriesTitle").addClass("border-red").focus();
                  return false;
                  break;
                case "kor":
                  authorCde = getLJC_v5(seriesTitle);
                  break;
                default:
                  if (!seriesTitle.substr(0, 2)) {
                    //없어도 될것 같은데..?
                    alert("총서명을 확인해주세요.");
                    $("#regBook_seriesTitle").addClass("border-red").focus();
                    return;
                  }
                  alert("총서명의 앞의 두글자를 바꿔주세요.\n'한글'로...");
                  // alert('총서명의 앞의 두글자를 바꿔주세요.\n\'한글\' 혹은 \'영어\'로...');
                  $("#regBook_seriesTitle").addClass("border-red").focus();
                  return false;
                  break;
              }
            } else {
              switch (langageIs(author.substr(0, 2))) {
                case "eng":
                  // alert('준비중입니다.');
                  alert("저자의 앞의 두글자를 바꿔주세요.\n'한글'로...");
                  $("#regBook_author").addClass("border-red").focus();
                  return false;
                  break;
                case "kor":
                  authorCde = getLJC_v5(author);
                  break;
                default:
                  if (!author.substr(0, 2)) {
                    alert("저자를 확인해주세요.");
                    $("#regBook_author").addClass("border-red").focus();
                    return;
                  }
                  alert("저자의 앞의 두글자를 바꿔주세요.\n'한글'로...");
                  // alert('저자의 앞의 두글자를 바꿔주세요.\n\'한글\' 혹은 \'영어\'로...');
                  $("#regBook_author").addClass("border-red").focus();
                  return false;
                  break;
              }
            }

            authorCde += getConstantVowel(title).f ? getConstantVowel(title).f : "";
            t.bookInfo.authorCde = authorCde;

            console.log(t.bookInfo);

            $("#regBook_info, #regBook_author").find("input").removeClass("border-red");
            $("#regBook_authorCode").val(authorCde);
          },

          regBook_v1: function () {
            let t = this;
            // console.log(t.bookInfo);
            // return;
            let limitBookCnt = 30;
            if (t.BooksWithoutAuthorCde.length >= limitBookCnt) {
              // if(Number($('#regBook_WithoutAuthorCdeLen').html()) > limitBookCnt){
              alert("오른쪽 저자기호가 없는 책이 " + limitBookCnt + "권이 되어\n등록을 진행할 수가 없습니다.");
              return;
            }

            if (!t.bookInfo.authorCde) {
              alert("저자기호가 없습니다.");
              $("#regBook_authorCode").addClass("border-red").focus();
              return;
            }
            if (!t.bookInfo.bookCde) {
              alert("등록번호가 없습니다.");
              $("#regBook_bookCde").addClass("border-red").focus();
              return;
            }
            if (!t.bookInfo.classNo) {
              alert("분류기호가 없습니다.");
              $("#regBook_classNo").addClass("border-red").focus();
              return;
            }

            // t.bookInfo['bookSts'] = t.bookSts;
            t.bookInfo["isbn"] = t.isbn;
            console.log(t.bookInfo);

            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=regBook_v1",
              data: t.bookInfo,
              success: function (res) {
                // console.log(res);
                // return;
                if (res == 1) {
                  t.getBooksWithoutAuthorCde();
                } else {
                  alert("등록에 실패하였습니다.");
                }
              },
            });
          },
          getBooksWithoutAuthorCde: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getBooksWithoutAuthorCde",
              success: function (res) {
                // console.log(res);
                // return;
                // console.log(JSON.parse(res));
                t.BooksWithoutAuthorCde = JSON.parse(res);
                // console.log(t.BooksWithoutAuthorCde.length);
                t.$nextTick(function () {
                  chkAll($("#bookWithoutAuthorCdeAllChk"), $('input[data-name="bookWithoutAuthorCde"]'));
                });
              },
            });
          },

          deleteBooks: function () {
            let t = this;
            if (!anyChk($('input[data-name="bookWithoutAuthorCde"]'))) {
              alert("선택된 도서가 없습니다.");
              return;
            }

            if (confirm("정말로 삭제하시겠습니까?")) {
              let tmpArr = [];
              $('input[data-name="bookWithoutAuthorCde"]:checked').each(function () {
                tmpArr.push($(this).data("bookCde"));
              });

              $.ajax({
                type: "POST",
                url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=deleteBooks",
                data: {
                  bookCde: tmpArr,
                },
                success: function (res) {
                  // console.log(res);
                  // return;
                  if (res == 1) {
                    t.getBooksWithoutAuthorCde();
                  } else {
                    alert("삭제되었습니다.");
                  }
                },
              });
            }
          },

          openAuthorCodePopup: function () {
            if (!anyChk($('input[data-name="bookWithoutAuthorCde"]'))) {
              alert("선택된 도서가 없습니다.");
              return;
            }
            // let popup = window.open("barCode.html", "_blank", "width=793.7007874, height=500");
            let popup = window.open("authorCode.html", "_blank", "width=810, height=500");
          },

          getBookInfo: function (bookCde) {
            let t = this;
            let children = mainPage.$children;
            setTimeout(function () {
              //바꿀것...
              for (let key in children) {
                if (children[key].name == "editBookPopup") {
                  $.ajax({
                    type: "POST",
                    url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getBookInfoByBookCde",
                    data: {
                      bookCde: bookCde,
                    },
                    success: function (res) {
                      // console.log(res);
                      // return;
                      // console.log(JSON.parse(res));
                      children[key].bookInfo = JSON.parse(res)[0];
                      children[key].bookCde = bookCde;
                      children[key].isOpenFrom = "regBook";
                      // children[key].memberList = JSON.parse(res);

                      console.log(children[key].bookInfo);
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

          changeKoToEn: function (target) {
            let t = this;
            if (t.bookInfo.bookCde.indexOf("뜨") != -1) {
              let bookCde = t.bookInfo.bookCde.replace(/뜨/gi, "EM");
              t.bookInfo.bookCde = bookCde;
              $(target.currentTarget).val(bookCde);
            }
          },
        },
        created: function () {
          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          let t = this;
          $("#barcodeByScaner").focus();
          t.getBooksWithoutAuthorCde();
          controlHeight($("#regBook_BookWithoutAuthorCdeList"), -27);
        },
      });
    });
  });
})();
