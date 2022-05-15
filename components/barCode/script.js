(function () {
  const name = "barCode";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            barcodeType: "orderBarcode",
            orderedBarcode: "",
          };
        },
        methods: {
          openBarcodePopup: function () {
            // let popup = window.open("barCode.html", "_blank", "width=793.7007874, height=500");
            let popup = window.open("barCode.html", "_blank", "width=810, height=500");
          },
          getNewOrderedCode: function () {
            let t = this;

            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getNewOrderedCode",
              success: function (res) {
                t.orderedBarcode = res.trim();
              },
            });
          },
        },
        created: function () {
          $(document.head).append('<link href="components/' + name + "/style.css" + '" rel="stylesheet" />');
        },
        mounted: function () {
          let t = this;
          $('input[value="orderBarcode"]').prop("checked", true);
          t.getNewOrderedCode();
        },
      });
    });
  });
})();
