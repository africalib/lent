(function () {
  const name = "chartPage";

  Vue.component(name, function (resolve, reject) {
    $.get("components/" + name + "/index.html").done(function (tmpl) {
      resolve({
        template: tmpl,
        data: function () {
          return {
            name: "chart",
            bookListByClassGroup: [],
            rentBookListByClassGroup: [],
            bookListOrderByMonthlyRentCnt: [],
            memberListOrderByMonthlyRentCnt: [],
            rentBookList: [],
          };
        },
        methods: {
          pieGraph: function (data, target, option) {
            let w = option.pieSize,
              h = option.pieSize;

            let dataKeyArr = [];
            let dataValueArr = [];

            data.forEach(function (el, idx) {
              dataKeyArr.push(el.category);
              dataValueArr.push(el.cnt);
            });

            let dataName = dataKeyArr;
            let graphData = dataValueArr;
            let colorData = option.color;
            let pie = d3.pie();
            let arc = d3
              .arc()
              .innerRadius(option.pieSize / 2)
              .outerRadius(0);

            let svg = d3.select(target).append("svg").attr("width", w).attr("height", h).attr("id", "graphWrap");

            let g = svg
              .selectAll(".pie")
              .data(pie(graphData))
              .enter()
              .append("g")
              .attr("class", "pie")
              .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

            g.append("path")
              .style("fill", function (d, i) {
                return colorData[i];
              })
              .transition()
              .duration(400)
              // .delay(function (d, i) {
              //     return i * 400;
              // })
              .attrTween("d", function (d, i) {
                let interpolate = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, { startAngle: d.startAngle, endAngle: d.endAngle });
                return function (t) {
                  return arc(interpolate(t));
                };
              });

            g.append("text")
              .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
              })
              .attr("dy", ".35em")
              .style("text-anchor", "middle");
            // .text(function(d, i) {
            // return  d.endAngle-d.startAngle > 0.2 ?
            // dataName[i] + " (" + Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10 + "%)" : ""
            // });

            // svg.append("text")
            // .attr("class", "total")
            // .attr("transform", "translate("+(w/2-35)+", "+(h/2+5)+")")
            // .text(" Total:" + d3.sum(graphData));
          },

          dataSettingForPieGraph: function (dataObj) {
            let tmpArr = [];
            let totalCnt = 0;

            for (let i in dataObj) {
              totalCnt += Number(dataObj[i].classNoCnt);
            }

            for (let j in dataObj) {
              let tmpObj = {};
              tmpObj.category = classNoToClassNm(dataObj[j].classNo0 + "00").classNm + ": " + dataObj[j].classNoCnt;
              tmpObj.cnt = dataObj[j].classNoCnt;
              tmpObj.pro = ((100 * Number(dataObj[j].classNoCnt)) / totalCnt).toFixed(2);
              tmpArr.push(tmpObj);
            }

            let sotableData = tmpArr.sort(function (a, b) {
              return Number(a.cnt) < Number(b.cnt) ? 1 : -1;
            });

            return sotableData;
          },

          drawPieGraph: function (data, graphTarget, listTarget, option) {
            let t = this;
            let pieSize = $(graphTarget).width() < $(graphTarget).height() ? $(graphTarget).width() : $(graphTarget).height();
            t.pieGraph(data, graphTarget, {
              pieSize: pieSize,
              color: option.color,
            });

            data.forEach(function (el, idx) {
              let template = "<div>" + '<span class="w10 h10 inline-block mg-r3" style="background:' + option.color[idx] + '; box-shadow:1px 1px 2px #000;"></span>' + '<span class="color-fff" style="text-shadow:1px 1px 2px #000;">' + el.category + "(" + Number(el.pro) + "%)" + "</span>" + "</div>";
              $(listTarget).append(template);
            });
          },

          getBookListByClassGroup: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getBookListByClassGroup",
              success: function (res) {
                // console.log(res);
                // return;

                t.bookListByClassGroup = t.dataSettingForPieGraph(JSON.parse(res));

                let color10 = ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"];

                t.drawPieGraph(t.bookListByClassGroup, "#pieChart_totalBook", "#list_totalBook", { color: color10 });
              },
            });
          },

          getRentBookListByClassGroup: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getRentBookListByClassGroup",
              success: function (res) {
                t.rentBookListByClassGroup = t.dataSettingForPieGraph(JSON.parse(res));

                let color10 = ["#1a535c", "#4ecdc4", "#f7fff7", "#ff6b6b", "#ffe66d", "#f72585", "#7209b7", "#3a0ca3", "#4361ee", "#4cc9f0"];

                t.drawPieGraph(t.rentBookListByClassGroup, "#pieChart_totalRentBook", "#list_totalRentBook", { color: color10 });
              },
            });
          },

          getBookListOrderByMonthlyRentCnt: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getBookListOrderByMonthlyRentCnt",
              success: function (res) {
                // console.log(res);
                // return;

                let resObj = JSON.parse(res);
                t.bookListOrderByMonthlyRentCnt = resObj;

                // console.log(resObj);
              },
            });
          },

          getMemberListOrderByMonthlyRentCnt: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getMemberListOrderByMonthlyRentCnt",
              success: function (res) {
                // console.log(res);
                // return;

                let resObj = JSON.parse(res);
                t.memberListOrderByMonthlyRentCnt = resObj;

                // console.log(resObj);
              },
            });
          },

          addComma: function (num) {
            let strNum = String(num);
            return strNum.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
          },

          getRentBookList: function () {
            let t = this;
            $.ajax({
              type: "POST",
              url: "https://jesusvillech.cafe24.com/lib/api/books.php?act=getRentBookList",
              success: function (res) {
                let resObj = JSON.parse(res);
                t.rentBookList = resObj;
              },
            });
          },
        },
        created: function () {
          let t = this;
        },
        mounted: function () {
          let t = this;
          t.getBookListByClassGroup();
          t.getRentBookListByClassGroup();
          t.getBookListOrderByMonthlyRentCnt();
          t.getMemberListOrderByMonthlyRentCnt();
          t.getRentBookList();
        },
      });
    });
  });
})();
