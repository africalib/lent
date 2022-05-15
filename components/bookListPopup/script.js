(function () {
  const name = "bookListPopup";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "bookListPopup",
            selectedBookRecKey: "",
            books: [],
            bookInfo: {},
            isbn: "",
          };
        },
        methods: {
          selectBook: function (target, idx, recKey) {
            let t = this;
            let recKeyCde = recKey;
            setTimeout(function () {
              //이거 어떻게 고치지...
              if (Number.isInteger(target)) {
                let $target = $("#popup_bookList").find("> div").eq(target);
                $target.addClass("selectedBook");
                recKeyCde = $target.attr("data-rec-key");
                t.selectedBookRecKey = recKeyCde;
              } else {
                t.selectedBookRecKey = recKeyCde;
                $("#popup_bookList").find("> div").removeClass("selectedBook");
                $("#popup_bookList").find("> div").eq(idx).addClass("selectedBook");
                //target왜 안먹지..? 수정해야함
                // $(target.currentTarget).addClass('selectedBook');
              }

              for (let i in t.books) {
                if (t.books[i].REC_KEY === recKeyCde) {
                  if (!t.books[i].bookOriginDetail) {
                    $.ajax({
                      type: "POST",
                      url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getBookDetailInfo",
                      data: {
                        recKey: recKeyCde,
                      },
                      success: function (res) {
                        t.books[i].bookOriginDetail = res;
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(res, "text/xml");
                        let bookInfo = xmlToObjArr(xmlDoc, "BIBINFO");

                        //텍스트 커스터마이징
                        //isbn
                        let isbn = bookInfo[0].ISBN.split("(")[0].trim(); //1차
                        // isbn = isbn.split(': ')[1];	//2차
                        // isbn = isbn.split('(')[0].trim();	//3차
                        //서명
                        let title = t.books[i].TITLE;
                        //총서명
                        let seriesTitle = "";
                        if (bookInfo[0].SERIES_INFO) {
                          seriesTitle = bookInfo[0].SERIES_INFO.split(";")[0]; //1차
                          seriesTitle = seriesTitle.split(",")[1].trim(); //2차
                        }

                        //서명권차(보류)
                        // let seriesNo = bookInfo[0].TITLE_INFO.split('/')[0].trim();	//1차
                        // if(seriesNo.indexOf('.,') != -1){
                        // seriesNo = seriesNo.split('.,')[1].trim(); //2차
                        // }else{
                        // seriesNo = '';
                        // }

                        //저자
                        let author = "";
                        author = t.books[i].AUTHOR;
                        //출판사
                        let pubInfo = bookInfo[0].PUBLISH_INFO.split(",")[1].trim();
                        pubInfo = t.books[i].PUBLISHER;
                        //출판년도
                        let pubYear = bookInfo[0].PUBLISH_INFO.split(",,")[1].trim();
                        pubYear = t.books[i].PUBYEAR;
                        //분류기호
                        let classNo = bookInfo[0].CLASSFY_INFO.split(",")[0];
                        classNo = classNo.split("->")[1].trim();

                        //청구권차
                        let claimNo = "";
                        let seriesInfoArr = bookInfo[0].SERIES_INFO.split(",");
                        if (seriesInfoArr.length > 3) {
                          claimNo = seriesInfoArr[seriesInfoArr.length - 2].trim();
                        }
                        claimNo = claimNo.replace(/v. /gi, "").trim();

                        //딸림자료
                        let withThings;
                        if (bookInfo[0].FORM_INFO.indexOf("+,") != -1) {
                          withThings = bookInfo[0].FORM_INFO.split("+,")[1].trim(); //2차
                        }

                        //object에 담기
                        let tmpObj = {};

                        tmpObj.isbn2 = isbn;
                        tmpObj.title = title;
                        tmpObj.seriesTitle = seriesTitle;
                        // tmpObj.seriesNo = seriesNo;
                        tmpObj.authorInfo = author;
                        tmpObj.pubInfo = pubInfo;
                        tmpObj.pubYearInfo = pubYear;
                        tmpObj.classNo = classNo;
                        tmpObj.claimNo = claimNo;
                        tmpObj.withThings = withThings;
                        tmpObj.bookSts = "rent"; //도서상태

                        t.books[i].info = tmpObj;
                        t.bookInfo = t.books[i].info;

                        if (t.books.length === 1) {
                          t.setBookInfo();
                        }
                      },
                    });
                  } else {
                    t.bookInfo = t.books[i].info;
                    console.log(t.bookInfo);
                  }

                  break;
                }
              }
            }, 50);
          },
          setBookInfo: function () {
            let t = this;
            let idx = $(".selectedBook").attr("data-idx");
            let children1 = mainPage.$children;
            for (let key in children1) {
              if (children1[key].name == "libMngPage") {
                let children2 = children1[key].$children;
                for (let key2 in children2) {
                  if (children2[key].name == "regBook") {
                    children2[key].bookInfo = t.bookInfo;
                    children2[key].bookInfo.isbn = t.isbn;
                    break;
                  }
                }
                break;
              }
            }

            mainPage.popup.name = null;
          },
        },
        created: function () {
          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          let t = this;
          t.$nextTick(function () {
            t.selectBook(0);
          });
        },
      });
    });
  });
})();
