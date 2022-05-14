(function () {
  const name = "searchBookPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "searchBookPage",
            bookList: [],
          };
        },
        methods: {
          getBookList: function () {
            let t = this;
            let srchType = $("#searchBookPage_srchType").val();
            let bookKwd = $("#searchBookPage_bookKwd").val();
            bookKwd = bookKwd.replace(/ /gi, "");

            if (!bookKwd) {
              t.bookList = [];
              return;
            }

            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/books.php?act=getBookListFromCstm",
              data: {
                srchType: srchType,
                bookKwd: bookKwd,
              },
              success: function (res) {
                // console.log(res);
                // return;

                objArr = JSON.parse(res);
                for (let i in objArr) {
                  let classNo = objArr[i].classNo;
                  objArr[i]["classNm"] = classNoToClassNm(classNo).classNm;
                  let originTxt;
                  let newTxt;
                  let regex = new RegExp(bookKwd, "gi");
                  switch (srchType) {
                    case "title":
                      originTxt = objArr[i].title;
                      newTxt = originTxt.replace(regex, "<span class='mark-pattern1'>" + bookKwd + "</span>");
                      objArr[i].title = newTxt;
                      originTxt = objArr[i].seriesTitle;
                      newTxt = originTxt.replace(regex, "<span class='mark-pattern1'>" + bookKwd + "</span>");
                      objArr[i].seriesTitle = newTxt;
                      break;
                    case "author_info":
                      originTxt = objArr[i].authorInfo;
                      newTxt = originTxt.replace(regex, "<span class='mark-pattern1'>" + bookKwd + "</span>");
                      objArr[i].authorInfo = newTxt;
                      break;
                    case "pub_info":
                      originTxt = objArr[i].pubInfo;
                      newTxt = originTxt.replace(regex, "<span class='mark-pattern1'>" + bookKwd + "</span>");
                      objArr[i].pubInfo = newTxt;
                      break;
                    default: //all
                      originTxt = objArr[i].title;
                      newTxt = originTxt.replace(regex, "<span class='mark-pattern1'>" + bookKwd + "</span>");
                      objArr[i].title = newTxt;
                      originTxt = objArr[i].seriesTitle;
                      newTxt = originTxt.replace(regex, "<span class='mark-pattern1'>" + bookKwd + "</span>");
                      objArr[i].seriesTitle = newTxt;
                      originTxt = objArr[i].authorInfo;
                      newTxt = originTxt.replace(regex, "<span class='mark-pattern1'>" + bookKwd + "</span>");
                      objArr[i].authorInfo = newTxt;
                      originTxt = objArr[i].pubInfo;
                      newTxt = originTxt.replace(regex, "<span class='mark-pattern1'>" + bookKwd + "</span>");
                      objArr[i].pubInfo = newTxt;
                      break;
                  }
                }
                t.bookList = objArr;
                // console.log(t.bookList);
              },
            });
          },
        },
        created: function () {
          let t = this;
        },
        mounted: function () {
          let t = this;
          mainPage.controlHeight($("#searchBookPage_bookList"), -35);
        },
      });
    });
  });
})();
