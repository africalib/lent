let mainPage = new Vue({
  el: "#mainWrapper",
  data: {
    version: "pc",
    viewPage: "home",
    popup: {
      name: null,
      title: "팝업1",
      width: 700,
    },
    menuView: true,
    popupByAd: [
      // {imgUrl: 'assets/img/popup1.jpg', visible: true}
      // {id: 1, imgUrl: "1.jpg", visible: true},
      // {id: 2, imgUrl: "2.jpg", visible: true},
      // {id: 3, imgUrl: "3.jpg", visible: true}
    ],
    userInfo: {},
    requestMode: "new", //게시판에서 쓰임
    hiddenCnt: 0, //보류
    shortNoticeList: [],
    shortNewBookList: [],
  },
  methods: {
    menuControl: function (boolean) {
      let t = this;
      console.log(t.version);
      if (t.version === "pc") return;

      if (boolean !== undefined && !boolean) {
        $("#mainMenu").removeClass("RIGHT0");
      } else {
        $("#mainMenu").toggleClass("RIGHT0");
      }
      if ($("#mainMenu").hasClass("RIGHT0")) {
        t.popup.name = "menu"; //dimLayer때문에 임시로 지정
        // $('#dimLayer').stop().fadeIn(500);
      } else {
        t.popup.name = null; //dimLayer때문에 임시로 지정
        // $('#dimLayer').stop().fadeOut(500);
      }
    },
    resizeWindow: function () {
      let t = this;
      $(window).resize(function () {
        let window_w = $(window).width();
        if (window_w > 766) {
          $("#dimLayer").removeClass("BLOCK");
          t.version = "pc";
          $("#mainMenu").find("ul ul").addClass("none");
        } else {
          if (t.version === "pc") {
            $("#mainMenu").removeClass("RIGHT0");
            t.popup.name = null;
          }
          t.version = "mobile";
        }
      });
    },
    controlByVersion: function () {
      let t = this;
      let window_w = $(window).width();
      if (window_w > 766) {
        t.version = "pc";
      } else {
        t.version = "mobile";
      }
    },
    openSubMenu: function (target) {
      let t = this;
      console.log(t.version);
      if (t.version === "pc") return;

      let $targetUl = $(target.currentTarget).find("ul");
      $targetUl.toggleClass("none");
    },

    menuHover: function () {
      const t = this;
      $("nav > ul > li").mouseover(function () {
        if (t.version === "mobile") return;
        if ($(this).is("#menu_libMng")) return;
        $(this).closest("ul").find("ul").removeClass("none");
        $("#menuBg").removeClass("none");
      });

      $("#menuBg, nav").mouseleave(function () {
        if (t.version === "mobile") return;
        if ($("nav").is(":hover") || $("#menuBg").is(":hover")) return;
        $("nav").find("ul ul").addClass("none");
        $("#menuBg").addClass("none");
      });
    },

    controlHeight: function ($target, adjustMargin) {
      let t = this;
      let window_h = window.innerHeight;
      console.log(window_h);
      let targetOffset_top = $target.offset().top;
      let calcedHeight = window_h - targetOffset_top + (adjustMargin === undefined ? 0 : adjustMargin);
      $target.height(calcedHeight);
    },

    openPopup: function (name, title, width) {
      let t = this;
      t.popup.name = name;
      t.popup.title = title;
      t.popup.width = !width ? 700 : width;
    },

    controlLogInBtn: function () {
      let t = this;
      if ((t.viewPage = "signIn")) {
        if (t.hiddenCnt++ > 4) {
          t.viewPage = "hidden";
          t.menuControl(false);
          t.hiddenCnt = 0;
          return;
        }
      }
      t.viewPage = "signIn";
    },
    closePopup: function () {
      let t = this;
      t.popup.name = null;

      // mngViewPage
      // t.$nextTick(function(){
      // let regBook = vue_findChildren(mainPage.$children, 'libMngPage');
      // let regBook = vue_findChildren(mainPage.$children, 'regBook');
      // console.log(regBook);
      // })
    },

    headToPage: function (pageName) {
      const t = this;
      window.location.hash = pageName;
      $("html").scrollTop(0);
      if (t.version === "pc") {
        $("nav").find("ul ul").addClass("none");
        $("#menuBg").addClass("none");
      }
    },
    mngLibControl: function () {
      let t = this;
      if (t.userInfo.mbrGrade != "999") {
        alert("접근할 수 없습니다.");
        return;
      }
      t.headToPage("lib-mng-page");
      t.menuControl(false);
    },

    watch: function () {
      let t = this;

      if (location.hash && location.hash.length > 1) {
        t.viewPage = location.hash.substring(1).split("/")[0];
      } else {
        t.viewPage = "";
      }

      window.scrollTo(0, 0);
    },

    popup_add: function () {
      const t = this;
      var cookieOneDayPopupIds = cookie.get("oneDayPopupIds");

      if (cookieOneDayPopupIds) {
        var popupIds = JSON.parse(cookieOneDayPopupIds);

        for (let i in t.popupByAd) {
          if (popupByAd.indexOf(t.popupByAd[i].id) > -1) {
            t.popupByAd[i].visible = false;
          }
        }
      }
    },

    closePopupByAd: function (url, oneDay) {
      const t = this;
      if (oneDay) {
        cookie.set(url, true, 1);
      }

      let idx = this.popupByAd.findIndex((i) => i.imgUrl == url);

      this.popupByAd[idx].visible = false;
    },
  },
  created: function () {
    let t = this;

    window.onhashchange = function () {
      t.watch();
    };

    t.watch();
  },
  mounted: function () {
    const t = this;
    t.controlByVersion();
    t.resizeWindow();
    t.userInfo = {};
    t.menuHover();

    window.addEventListener(
      "keyup",
      function (e) {
        //팝업 esc로 닫기
        if ([27].indexOf(e.keyCode) > -1) {
          //esc는 27
          t.popup.name && t.popup.name.length && t.popup.name !== "menu" ? t.closePopup() : "";
        }
      },
      false
    );

    // t.closePopupByAd('assets/img/popup1.jpg', true);
  },
});
