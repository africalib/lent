(function () {
  const name = "home";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "home",
            shortNoticeList: [],
            shortNewBookList: [],
            // popups: [
            // {id: 1, imgUrl: "1.jpg", visible: true},
            // {id: 2, imgUrl: "2.jpg", visible: true},
            // {id: 3, imgUrl: "3.jpg", visible: true}
            // ]
            popups: [],
          };
        },
        methods: {
          // closePopup: function(idx, oneDay) {
          // if (oneDay) {
          // var cookieOneDayPopupIds = cookie.get("oneDayPopupIds");
          // var popups = [];

          // if(cookieOneDayPopupIds) {
          // popups = JSON.parse(cookieOneDayPopupIds);
          // }

          // popups.push(this.popups[idx].id);
          // cookie.set("oneDayPopupIds", JSON.stringify(popups));
          // }

          // this.popups[idx].visible = false;
          // },
          getShortNotice() {
            const t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/etc.php?act=getBoardList",
              data: {
                boardCde: "100",
                dataMxCnt: 5,
                pageOffsetIdx: 0,
              },
              success: function (res) {
                t.shortNoticeList = JSON.parse(res).boardList;
              },
            });
          },
          getNewBooklist: function () {
            const t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getNewBookList",
              data: {
                boardCde: "110",
                dataMxCnt: 5,
                pageOffsetIdx: 0,
              },
              success: function (res) {
                t.shortNewBookList = JSON.parse(res).bookList;
              },
            });
          },

          quickSearchBook: function () {
            let keyword = document.querySelector("#home_quickBookSearch").value;
            mainPage.headToPage("search-book-page");
            findChildren();
            function findChildren() {
              let children = vue_findChildren(mainPage.$children, "searchBookPage", false);
              if (!children) {
                setTimeout(function () {
                  findChildren();
                }, 100);
              } else {
                document.querySelector("#searchBookPage_bookKwd").value = keyword;
                children.getBookList();
              }
            }
          },
        },
        created: function () {
          // var cookieOneDayPopupIds = cookie.get("oneDayPopupIds");

          // if(cookieOneDayPopupIds){
          // var popupIds = JSON.parse(cookieOneDayPopupIds);

          // for(var i in this.popups) {
          // if(popupIds.indexOf(this.popups[i].id) > -1) {
          // this.popups[i].visible = false;
          // }
          // }
          // }

          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          const t = this;

          var swiper = new Swiper(".swiper-container", {
            touchRatio: 0,
            effect: "fade",
            speed: 3000,
            autoplay: {
              delay: 5000,
              disableOnInteraction: false,
            },
          });

          t.getShortNotice();
          t.getNewBooklist();

          //t.popup_adImg();
        },
      });
    });
  });
})();
