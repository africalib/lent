(function () {
  const name = "hiddenPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "hidden",
          };
        },
        methods: {
          initRank: function () {
            if (confirm("초기화를 진행하시겠습니까?")) {
              $.ajax({
                type: "POST",
                url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=initRank",
                success: function (res) {
                  if (res == 1) {
                    alert("초기화되었습니다.");
                  } else {
                    alert("오늘이 매월 마지막 날이 아니군요...");
                  }
                },
              });
            }
          },
          editRent: function () {
            if (confirm("일괄적용하시겠습니까?")) {
              let isEmpty = false;
              let data = {};
              $("#hidden_editMemberInfo")
                .find("input")
                .each(function () {
                  data[$(this).attr("name")] = $(this).val();
                  if (!$(this).val()) {
                    isEmpty = true;
                  }
                });

              if (!isEmpty) {
                $.ajax({
                  type: "POST",
                  data: data,
                  url: "https://jesusvillech.cafe24.com/lib/api/members.php?act=updateRentCntAndReturnDate",
                  success: function (res) {
                    // console.log(res);
                    // return;
                    if (res == 1) {
                      alert("일괄수정을 완료했습니다.");
                    } else {
                      alert("something wrong...");
                    }
                  },
                });
              } else {
                alert("입력이 안된 부분이 있습니다.");
              }
            }
          },
        },
        created: function () {
          var t = this;
        },
      });
    });
  });
})();
