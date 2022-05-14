(function () {
  const name = "regBook";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "regBook",
            bookInfo: {
              authorCode: "",
              bookCde: "",
              isbn: "",
              bookSts: "rent",
              // seriesTitle: '',
              // seriesNo: '',
            },
            booksWithoutAuthorCde: [],
            chkedCnt: 0,
            chkAll: false,
          };
        },
        methods: {
          getBookList: function () {
            let t = this;
            let isbn = $("#regBook_isbn").val();

            //같은 isbn코드의 경우 복본입력 물어보기

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/books.php?act=getDuplBookByIsbn",
              data: { isbn: isbn },
              success: function (res) {
                if (JSON.parse(res).length) {
                  if (confirm("기존 데이터가 존재합니다.\n기존 데이터를 가져오시겠습니까?")) {
                    t.bookInfo = JSON.parse(res)[0];
                    t.bookInfo.bookSts = JSON.parse(res)[0].bookSts;
                    t.bookInfo.copyNo = JSON.parse(res).length;
                    t.$nextTick(function () {
                      $("#regBook_bookCde").select();
                    });
                  } else {
                    $.ajax({
                      type: "POST",
                      url: "http://jesusville.or.kr/lib/api/books.php?act=getBookInfoByIsbn",
                      data: { isbn: isbn },
                      success: function (res) {
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(res, "text/xml");
                        let books = xmlToObjArr(xmlDoc, "RECORD");

                        if (!books.length) {
                          alert("검색결과가 없습니다.");
                          return;
                        }
                        let children = mainPage.$children;

                        setTimeout(function () {
                          //바꿀것...
                          for (let key in children) {
                            if (children[key].name == "bookListPopup") {
                              children[key].books = books;
                              children[key].isbn = t.bookInfo.isbn;
                              break;
                            }
                          }
                        }, 50);

                        mainPage.popup.name = "bookList";
                        mainPage.popup.title = "도서정보";
                        mainPage.popup.width = 700;
                      },
                    });
                  }
                } else {
                  $.ajax({
                    type: "POST",
                    url: "http://jesusville.or.kr/lib/api/books.php?act=getBookInfoByIsbn",
                    data: { isbn: isbn },
                    success: function (res) {
                      parser = new DOMParser();
                      xmlDoc = parser.parseFromString(res, "text/xml");
                      let books = xmlToObjArr(xmlDoc, "RECORD");

                      if (!books.length) {
                        alert("검색결과가 없습니다.");
                        $("#regBook_isbn").select();
                        return;
                      }

                      let children = mainPage.$children;
                      setTimeout(function () {
                        //바꿀것...
                        for (let key in children) {
                          if (children[key].name == "bookListPopup") {
                            children[key].books = books;
                            children[key].isbn = t.bookInfo.isbn;
                            break;
                          }
                        }
                      }, 50);

                      mainPage.popup.name = "bookList";
                      mainPage.popup.title = "도서정보";
                      mainPage.popup.width = 700;
                    },
                  });
                }
              },
            });

            return;
          },

          getAuthorCode: function () {
            let t = this;
            let authorCde = "";
            let seriesTitle = $("#regBook_seriesTitle").val().replace(/ /gi, "");
            let author = $("#regBook_author").val().replace(/ /gi, "");

            let s_closePrnthIdx = seriesTitle.indexOf(")");
            let a_closePrnthIdx = author.indexOf(")");

            if (s_closePrnthIdx != -1 && s_closePrnthIdx + 2 < seriesTitle.length) {
              seriesTitle = seriesTitle.split(")")[1].trim();
            }
            if (a_closePrnthIdx != -1 && a_closePrnthIdx + 2 < author.length) {
              author = author.split(")")[1].trim();
            }

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
            if (!seriesTitle) authorCde += getConstantVowel(title).f ? getConstantVowel(title).f : "";
            t.bookInfo.authorCde = authorCde;

            // console.log(t.bookInfo);

            $("#regBook_info").find("input").removeClass("border-red");
            $("#regBook_authorCode").val(authorCde);
            $("#regBook_bookCde").select();
          },

          regBook_v1: function () {
            let t = this;
            // console.log(t.bookInfo);
            // return;
            let limitBookCnt = 30;
            if (t.booksWithoutAuthorCde.length >= limitBookCnt) {
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

            let thisBookCde = t.bookInfo["bookCde"];
            // t.bookInfo['bookSts'] = t.bookSts;
            // t.bookInfo['isbn'] = t.isbn;

            if (thisBookCde.indexOf("뜨") != -1 || thisBookCde.indexOf("드") != -1) {
              t.bookInfo["bookCde"] = thisBookCde.replace(/드/gi, "EM");
              t.bookInfo["bookCde"] = thisBookCde.replace(/뜨/gi, "EM");
            }

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/books.php?act=regBook_v1",
              data: t.bookInfo,
              success: function (res) {
                // console.log(res);
                // return;
                if (res == 1) {
                  t.getBooksWithoutAuthorCde();
                  $("#regBook_inputBookInfo").find("input").removeClass("border-red");
                  $("#regBook_isbn").select();
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
              url: "http://jesusville.or.kr/lib/api/books.php?act=getBooksWithoutAuthorCde",
              success: function (res) {
                t.booksWithoutAuthorCde = JSON.parse(res);
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
                url: "http://jesusville.or.kr/lib/api/books.php?act=deleteBooks",
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
                    $("#regBook_chkedCnt").html("");
                  }
                },
                error: function (e) {
                  console.log(e);
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
                    url: "http://jesusville.or.kr/lib/api/books.php?act=getBookInfoByBookCde",
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
            if (t.bookInfo.bookCde.indexOf("뜨") != -1 || t.bookInfo.bookCde.indexOf("드") != -1) {
              let bookCde = t.bookInfo.bookCde.replace(/뜨/gi, "EM");
              bookCde = bookCde.replace(/드/gi, "EM");
              t.bookInfo.bookCde = bookCde;
            }
            $("#regBook_regBtn").focus();
          },

          getChkedCnt: function () {
            let t = this;
            let chkedCnt = 0;
            $('input[data-name="bookWithoutAuthorCde"]').each(function () {
              if ($(this).is(":checked")) {
                chkedCnt++;
              }
            });
            t.chkedCnt = chkedCnt;

            if ($('input[data-name="bookWithoutAuthorCde"]').length == t.chkedCnt) {
              t.chkAll = true;
            } else {
              t.chkAll = false;
            }
          },

          deleteBooks2: function () {
            let t = this;
            if (confirm("아래 저자코드가 없는 책들을 처리합니다.\n정말로 처리하시겠습니까?")) {
              $.ajax({
                type: "POST",
                url: "http://jesusville.or.kr/lib/api/tmpApi.php?act=tmpDelAuthorCde",
                success: function (res) {
                  // console.log(res);
                  // return;
                  //왜 성공을 못하지? 500에러 뭐지? 20220313
                },
                error: function (e) {
                  alert("정상적을 처리되었습니다.");
                  t.getBooksWithoutAuthorCde();
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
          $("#regBook_isbn").focus();
          t.getBooksWithoutAuthorCde();
          controlHeight($("#regBook_BookWithoutAuthorCdeList"), -27);
        },
      });
    });
  });
})();
