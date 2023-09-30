(function () {
  const name = "takeOutBook";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "takeOutBook",
            memberInfo: { mbrNm: "" },
            bookInfo: { bookCde: "" },
            today: "",
            returnDay: "",
          };
        },
        methods: {
          getMemberListWithPopup: function () {
            let t = this;

            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/members.php?act=getMemberList",
              data: {
                sort: "y",
                srchType: "all",
                srchWrd: $("#takeOutBook_memberKwd").val(),
              },
              success: function (res) {
                // console.log(res);
                // return;
                console.log(JSON.parse(res));

                if (JSON.parse(res).length > 1) {
                  mainPage.popup.name = "memberList";
                  mainPage.popup.title = "회원 리스트";
                  mainPage.popup.width = 700;

                  let children = mainPage.$children;
                  setTimeout(function () {
                    //바꿀것...
                    for (let key in children) {
                      if (children[key].name == "memberListPopup") {
                        children[key].memberList = JSON.parse(res);
                        break;
                      }
                    }
                  }, 50);
                } else if (JSON.parse(res).length == 1) {
                  t.memberInfo = JSON.parse(res)[0];
                  t.$nextTick(function () {
                    $("#takeOutBook_bookCde").focus();
                  });
                } else {
                  t.memberInfo = { mbrNm: "" };
                }
              },
            });
          },

          getMemberInfo: function (mbrCde) {
            let t = this;

            mainPage.popup.name = "memberInfo";
            mainPage.popup.title = "회원정보";
            mainPage.popup.width = 700;

            let children = mainPage.$children;
            // setTimeout(function(){	//바꿀것...
            // for(let key in children){
            // if(children[key].name == 'memberInfoPopup'){
            // children[key].memberInfo = t.memberInfo;
            // break;
            // }
            // }
            // }, 50);

            // return;

            setTimeout(function () {
              //바꿀것...
              for (let key in children) {
                if (children[key].name == "memberInfoPopup") {
                  $.ajax({
                    type: "POST",
                    url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getRentHistoryByMbrCde",
                    data: {
                      mbrCde: mbrCde,
                      test: "test",
                    },
                    success: function (res) {
                      // console.log(res);
                      // return;
                      children[key].memberInfo = t.memberInfo;
                      children[key].memberInfo.rentBookList = JSON.parse(res);
                      children[key].rentBookList = JSON.parse(res);

                      console.log(children[key].memberInfo.rentBookList);

                      let lastMonthList = [];
                      let rentList = [];
                      let overdueList = [];

                      for (let i in JSON.parse(res)) {
                        let el = JSON.parse(res)[i];
                        if (!el.returnDt) rentList.push(el);
                        if (el.today > el.libRentBookReturnDt) overdueList.push(el);
                        if (getAMonthAgo(el.today) <= el.rentDt) lastMonthList.push(el);
                      }

                      children[key].lastMonthList = lastMonthList;
                      children[key].rentList = rentList;
                      children[key].overdueList = overdueList;

                      // console.log('last');
                      // console.log(children[key].lastMonthList);
                      // console.log('rent');
                      // console.log(children[key].rentList);
                      // console.log('over');
                      // console.log(children[key].overdueList);
                    },
                  });
                  // children[key].memberInfo = t.memberList[i];
                  break;
                }
              }
            }, 50);
          },

          creatorCde: function (prefix, code, mx0cnt) {
            //함수이름 바뀔수도, 공통화 자료에 넣을 것
            let result = prefix;
            let strCode = String(code);
            let strCodeLen = strCode.length;
            let cnt0 = mx0cnt - strCodeLen;

            for (let i = 0; i < cnt0; i++) {
              result += "0";
            }

            result += strCode;

            return result;
          },

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
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getBookInfoByBookCde",
              data: {
                bookCde: $(target.currentTarget).val(),
              },
              success: function (res) {
                // console.log(res);
                console.log(JSON.parse(res).length);
                // return;
                if (!JSON.parse(res).length) {
                  alert("존재하지 않는 도서입니다.");
                  return;
                }
                t.bookInfo = JSON.parse(res)[0];
                console.log(t.bookInfo);

                //나중에 함수화 할 것
                let today = new Date();
                let t_year = today.getFullYear();
                let t_month = today.getMonth() + 1;
                let t_date = today.getDate();
                // let t_ymd = t_year + '-' + t_month + '-' + t_date;
                let t_ymd = t_year + "-" + t.creatorCde("", t_month, 2) + "-" + t.creatorCde("", t_date, 2);

                let returnDay = new Date(today);
                returnDay.setDate(returnDay.getDate() + Number(t.memberInfo.mbrMxDate));
                let r_year = returnDay.getFullYear();
                let r_month = returnDay.getMonth() + 1;
                let r_date = returnDay.getDate();
                // let r_ymd = r_year + '-' + r_month + '-' + r_date;
                let r_ymd = r_year + "-" + t.creatorCde("", r_month, 2) + "-" + t.creatorCde("", r_date, 2);

                t.today = t_ymd;
                t.returnDay = r_ymd;

                t.$nextTick(function () {
                  $("#takeOutBook_btn_takeOutBook").focus();
                });
              },
            });
          },

          takeOutBook: function () {
            let t = this;
            if (t.bookInfo.isRent == "1") {
              alert("이미 빌려간 책입니다.");
              return;
            }

            console.log(111);
            console.log(t.memberInfo.mbrMxCnt, t.memberInfo.rentBookCnt);
            console.log(111);

            if (t.memberInfo.mbrMxCnt < t.memberInfo.rentBookCnt) {
              alert("회원의 최대 대여량을 넘을 수 없습니다.");
              return;
            }

            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=takeOutBook",
              data: {
                bookCde: t.bookInfo.bookCde,
                mbrCde: t.memberInfo.mbrCde,
                rentDt: t.today,
                returnDt: t.returnDay,
              },
              success: function (res) {
                if (res == 1) {
                  $.ajax({
                    //도서db에 +1
                    type: "POST",
                    url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=increaseRentCnt",
                    data: { bookCde: t.bookInfo.bookCde },
                    success: function (res) {
                      if (res == 1) {
                        $.ajax({
                          //회원db에 +1
                          type: "POST",
                          url: "https://jesusvillech.cafe24.com/lib/api/members.php?act=increaseRentCnt",
                          data: { mbrCde: t.memberInfo.mbrCde },
                          success: function (res) {
                            if ((res = 1)) {
                              alert("대여처리가 완료되었습니다.");
                              t.bookInfo = { bookCde: "" };
                              $("#takeOutBook_bookCde").val("").focus();
                            }
                          },
                        });
                      }
                    },
                  });
                } else {
                  alert("대여할 수 없습니다.");
                }
              },
            });
          },
        },
        created: function () {
          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          $("#takeOutBook_memberKwd").focus();
          // mainPage.controlHeight($('#takeOutBook_bookInfo'), -44);
        },
      });
    });
  });
})();
