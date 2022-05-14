(function () {
  const name = "memberInfoPopup";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "memberInfoPopup",
            memberInfo: {},
            isEdit: false,
            listType: "all",
            rentBookList: [],
          };
        },
        methods: {
          editInfo: function () {
            let t = this;
            if (confirm("수정하시겠습니까?")) {
              let dataObj = {};
              $("#popup_memberInfo")
                .find("[name]")
                .each(function () {
                  if ($(this).attr("type") === "radio" || $(this).attr("type") === "checkbox") {
                    if ($(this).prop("checked")) {
                      dataObj[$(this).attr("name")] = $(this).val();
                    }
                    return true;
                  }
                  dataObj[$(this).attr("name")] = $(this).val();
                });

              $.ajax({
                type: "POST",
                url: "http://jesusville.or.kr/lib/api/members.php?act=editMemberInfo",
                data: dataObj,
                success: function (res) {
                  // console.log(res);
                  if (res == 1) {
                    alert("수정되었습니다.");
                    t.isEdit = false;
                  }
                },
                error: function (e) {
                  console.log(e);
                },
              });
            }
          },

          getMemberListByListType: function () {
            let t = this;
            console.log(t.listType);
            $.ajax({
              type: "POST",
              url: "http://jesusville.or.kr/lib/api/books.php?act=getRentHistoryByMbrCde",
              data: {
                mbrCde: t.memberInfo.mbrCde,
                listType: t.listType,
                test: "test",
              },
              success: function (res) {
                // console.log(res);
                // return;
                t.rentBookList = JSON.parse(res);
                // t.$nextTick(function(){
                // t.rentBookList = JSON.parse(res);
                // console.log(t.rentBookList)
                // })
                // t.memberInfo.rentBookList = [];
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
